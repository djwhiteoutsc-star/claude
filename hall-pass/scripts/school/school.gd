extends Node3D
## One class period. Every peer builds the same school from GameState's seed;
## the host waits until all peers report ready, then spawns students and
## teachers through MultiplayerSpawners and rings the bell.

const PLAYER_SCENE := preload("res://scenes/player/player.tscn")
const TEACHER_SCENE := preload("res://scenes/teachers/teacher.tscn")

var _started := false

@onready var generator: SchoolGenerator = $SchoolGenerator
@onready var players: Node3D = $Players
@onready var player_spawner: MultiplayerSpawner = $PlayerSpawner
@onready var teacher_spawner: MultiplayerSpawner = $TeacherSpawner


func _ready() -> void:
	player_spawner.spawn_function = _spawn_player
	teacher_spawner.spawn_function = _spawn_teacher
	generator.build(GameState.school_seed, GameState.objectives)
	GameState.detention_spot = generator.detention_spot
	GameState.release_spot = generator.release_spot

	if multiplayer.is_server():
		multiplayer.peer_disconnected.connect(_on_peer_disconnected)
		GameState.all_peers_ready.connect(_start)
	GameState.report_scene_ready.rpc_id(1)


func _start() -> void:
	if _started:
		return
	_started = true
	var peer_ids: Array = Network.players.keys()
	if peer_ids.is_empty():
		peer_ids = [multiplayer.get_unique_id()]
	peer_ids.sort()
	for i in peer_ids.size():
		player_spawner.spawn({"peer_id": peer_ids[i], "position": generator.spawn_points[i]})
	for i in generator.teacher_plans.size():
		var plan: Dictionary = generator.teacher_plans[i]
		teacher_spawner.spawn({"index": i, "type": plan.type, "route": plan.route})
	GameState.start_period.rpc()


func _spawn_player(data: Dictionary) -> Node:
	var player := PLAYER_SCENE.instantiate()
	player.name = str(data.peer_id)
	player.position = data.position
	return player


func _spawn_teacher(data: Dictionary) -> Node:
	var teacher := TEACHER_SCENE.instantiate()
	teacher.name = "Teacher%d" % data.index
	teacher.teacher_type = data.type
	teacher.route = data.route
	teacher.position = data.route[0]
	return teacher


func _on_peer_disconnected(id: int) -> void:
	var player := players.get_node_or_null(str(id))
	if player:
		player.queue_free()
