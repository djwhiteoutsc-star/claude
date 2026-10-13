extends Node
## End-to-end smoke test: builds a real school offline (host only), lets the
## period run, and walks through catch -> battle -> detention.
## Run: godot --headless --path . res://tests/school_smoke.tscn

const SCHOOL := preload("res://scenes/school/school.tscn")

var _failures := 0


func _ready() -> void:
	GameState.school_seed = 1234
	GameState.objectives = GameState.pick_objectives(1234)
	var school := SCHOOL.instantiate()
	add_child(school)
	await _frames(30)

	check(GameState.period_running, "period started")
	check(get_tree().get_nodes_in_group("players").size() == 1, "host player spawned")
	var teachers := get_tree().get_nodes_in_group("teachers")
	check(teachers.size() >= 3, "at least 3 teachers (got %d)" % teachers.size())
	check(get_tree().get_nodes_in_group("objective_targets").size() == 3, "3 objective targets")
	var generator: SchoolGenerator = school.get_node("SchoolGenerator")
	check(generator.nav_region.navigation_mesh.get_polygon_count() > 0, "navmesh baked")
	check(generator.rooms.size() == SchoolGenerator.SEGMENTS * 2, "12 rooms placed")
	for objective in GameState.objectives:
		check(not generator.rooms_of_type(objective.room_type).is_empty(), "room exists for " + objective.id)

	# Same seed -> same layout.
	var twin := SchoolGenerator.new()
	add_child(twin)
	twin.build(1234, GameState.objectives)
	var a := generator.rooms.map(func(r: Room) -> String: return r.room_type)
	var b := twin.rooms.map(func(r: Room) -> String: return r.room_type)
	check(a == b, "layout is deterministic")
	twin.queue_free()

	# Teachers actually walk their routes.
	var start_positions := teachers.map(func(t: Node3D) -> Vector3: return t.global_position)
	await _frames(120)
	var moved := false
	for i in teachers.size():
		if teachers[i].global_position.distance_to(start_positions[i]) > 1.0:
			moved = true
	check(moved, "teachers patrol")

	# Objective completion awards snacks.
	var objective: Objective = GameState.objectives[0]
	GameState.request_objective.rpc_id(1, objective.id)
	check(GameState.completed.has(objective.id), "objective completed")
	check(GameState.snacks == objective.snack_reward, "snacks awarded")

	# Stand in front of a teacher: they should notice, chase and catch.
	var player: Node3D = get_tree().get_first_node_in_group("players")
	var teacher: Node3D = teachers[0]
	player.global_position = teacher.global_position - teacher.global_transform.basis.z * 3.0
	var caught := false
	for i in 300:
		await get_tree().physics_frame
		if GameState.is_in_battle(1) or GameState.is_detained(1):
			caught = true
			break
	check(caught, "teacher catches a visible player")

	# Lose the battle on purpose -> detention.
	var ui := school.get_node("ExcuseBattle")
	if GameState.is_in_battle(1):
		check(ui.visible, "battle UI opened")
		while not ui._battle.is_over:
			ui._battle.end_turn()
		await get_tree().create_timer(2.0).timeout
	check(GameState.is_detained(1), "lost battle sends you to detention")
	await _frames(5)
	check(player.global_position.distance_to(GameState.detention_spot) < 2.0, "player moved to detention")

	# You can't break yourself out.
	GameState.request_jailbreak.rpc_id(1)
	check(GameState.is_detained(1), "detained player cannot self-jailbreak")

	print("FAILED: %d" % _failures if _failures else "School smoke test passed.")
	get_tree().quit(1 if _failures else 0)


func _frames(count: int) -> void:
	for i in count:
		await get_tree().physics_frame


func check(cond: bool, msg: String) -> void:
	if not cond:
		_failures += 1
		push_error("FAIL: " + msg)
