extends Node

var _failures := 0


func _ready() -> void:
	var is_host := "--host" in OS.get_cmdline_user_args()
	if is_host:
		Network.local_name = "Host"
		check(Network.host() == OK, "host started")
		if not await _wait(func() -> bool: return Network.players.size() == 2, 15.0):
			return _finish("client never joined")
		GameState.start_game.rpc(42)
	else:
		Network.local_name = "Client"
		check(Network.join("127.0.0.1") == OK, "client connecting")
		if not await _wait(func() -> bool: return Network.players.size() == 2, 15.0):
			return _finish("never registered with host")

	if not await _wait(func() -> bool: return GameState.period_running, 15.0):
		return _finish("period never started")
	await _wait(func() -> bool: return get_tree().get_nodes_in_group("players").size() == 2, 5.0)
	check(get_tree().get_nodes_in_group("players").size() == 2, "both students spawned")
	var teachers := get_tree().get_nodes_in_group("teachers")
	check(teachers.size() >= 3, "teachers replicated (%d)" % teachers.size())

	if not is_host:
		var start: Vector3 = teachers[0].global_position
		await get_tree().create_timer(2.0).timeout
		var moved := false
		for teacher in get_tree().get_nodes_in_group("teachers"):
			moved = moved or teacher.global_position.distance_to(start) > 0.5
		check(moved, "teacher movement synced to client")
		var objective_id: String = GameState.objectives[0].id
		GameState.request_objective.rpc_id(1, objective_id)
		check(await _wait(func() -> bool: return GameState.completed.has(objective_id), 5.0), "client objective confirmed by host")
	else:
		var objective_id: String = GameState.objectives[0].id
		check(await _wait(func() -> bool: return GameState.completed.has(objective_id), 10.0), "host saw client's objective")
		await get_tree().create_timer(2.0).timeout
	_finish("")


func _wait(condition: Callable, seconds: float) -> bool:
	var deadline := Time.get_ticks_msec() + int(seconds * 1000)
	while Time.get_ticks_msec() < deadline:
		if condition.call():
			return true
		await get_tree().process_frame
	return false


func check(cond: bool, msg: String) -> void:
	if not cond:
		_failures += 1
		push_error("FAIL: " + msg)


func _finish(fatal: String) -> void:
	if fatal:
		check(false, fatal)
	var role := "host" if multiplayer.is_server() else "client"
	print("[%s] %s" % [role, "FAILED: %d" % _failures if _failures else "network smoke test passed."])
	get_tree().quit(1 if _failures else 0)
