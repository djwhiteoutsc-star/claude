extends CharacterBody3D
## Teacher AI. Runs on the host only; clients just see the synced position and
## state (shown as "?" / "!" above their head).
##
## PATROL --sees/hears you--> SUSPICIOUS --keeps noticing--> CHASE --reaches--> CATCH
##    ^-------------------------- loses you / battle over -----------------------'

enum State { PATROL, SUSPICIOUS, CHASE, CATCH }

const TYPES := {
	"hall_monitor": {"patrol_speed": 3.2, "chase_speed": 5.0, "sight": 14.0, "fov": 100.0, "hearing": 1.0, "color": Color(0.25, 0.45, 0.95)},
	"coach": {"patrol_speed": 2.4, "chase_speed": 6.8, "sight": 12.0, "fov": 90.0, "hearing": 0.8, "color": Color(0.9, 0.35, 0.2)},
	"substitute": {"patrol_speed": 2.0, "chase_speed": 4.2, "sight": 7.0, "fov": 70.0, "hearing": 1.6, "color": Color(0.6, 0.6, 0.6)},
	"principal": {"patrol_speed": 2.2, "chase_speed": 5.2, "sight": 16.0, "fov": 110.0, "hearing": 1.0, "color": Color(0.2, 0.15, 0.3)},
}
## Seconds of noticing before a chase: quick if seen, slower if only heard.
const NOTICE_TIME_SEEN := 1.0
const NOTICE_TIME_HEARD := 3.0
const LOSE_TIME := 4.0
const CATCH_DISTANCE := 1.3
## Hidden players are only found this close, and only by an alert teacher.
const HIDDEN_DETECT_DISTANCE := 1.5
## After a battle the teacher ignores that student for a bit.
const IGNORE_AFTER_CATCH := 5.0
const GRAVITY := 20.0
const EYE_HEIGHT := 1.6

var teacher_type := "hall_monitor"
var route: Array = []
var state := State.PATROL

var _config: Dictionary
var _route_index := 0
var _route_started := false
var _target: Node3D
var _notice_time := 0.0
var _lost_time := 0.0
var _ignored := {}

@onready var body: MeshInstance3D = $Body
@onready var indicator: Label3D = $Indicator
@onready var type_label: Label3D = $TypeLabel
@onready var agent: NavigationAgent3D = $NavigationAgent3D


func _ready() -> void:
	add_to_group("teachers")
	_config = TYPES.get(teacher_type, TYPES.hall_monitor)
	var material := StandardMaterial3D.new()
	material.albedo_color = _config.color
	body.material_override = material
	type_label.text = teacher_type.capitalize()


func _physics_process(delta: float) -> void:
	indicator.text = ["", "?", "!", "!!"][state]
	if not multiplayer.is_server() or not GameState.period_running:
		return
	# The host bakes the navmesh on load; wait for the map's first sync.
	if NavigationServer3D.map_get_iteration_id(agent.get_navigation_map()) == 0:
		return
	if not is_on_floor():
		velocity.y -= GRAVITY * delta
	for peer_id in _ignored.keys():
		_ignored[peer_id] -= delta
		if _ignored[peer_id] <= 0.0:
			_ignored.erase(peer_id)

	match state:
		State.PATROL: _patrol()
		State.SUSPICIOUS: _suspicious(delta)
		State.CHASE: _chase(delta)
		State.CATCH: _catch()
	move_and_slide()


func _patrol() -> void:
	if not route.is_empty():
		if not _route_started:
			_route_started = true
			agent.target_position = route[_route_index]
		elif agent.is_navigation_finished():
			_route_index = (_route_index + 1) % route.size()
			agent.target_position = route[_route_index]
		_move_along_path(_config.patrol_speed)
	var found := _detect()
	if not found.is_empty():
		_target = found.player
		_notice_time = 0.0
		_lost_time = 0.0
		state = State.SUSPICIOUS


func _suspicious(delta: float) -> void:
	_stop()
	var found := _detect()
	if not found.is_empty() and found.player == _target:
		_face(_target.global_position - global_position)
		_notice_time += delta
		_lost_time = 0.0
		if _notice_time >= (NOTICE_TIME_SEEN if found.seen else NOTICE_TIME_HEARD):
			state = State.CHASE
	else:
		_lost_time += delta
		if _lost_time >= NOTICE_TIME_HEARD:
			_back_to_patrol()


func _chase(delta: float) -> void:
	if not _target_is_valid():
		_back_to_patrol()
		return
	agent.target_position = _target.global_position
	_move_along_path(_config.chase_speed)
	if global_position.distance_to(_target.global_position) <= CATCH_DISTANCE:
		state = State.CATCH
		GameState.server_catch(_target.peer_id, teacher_type)
		return
	var found := _detect()
	if not found.is_empty() and found.player == _target:
		_lost_time = 0.0
	else:
		_lost_time += delta
		if _lost_time >= LOSE_TIME:
			_back_to_patrol()


func _catch() -> void:
	_stop()
	if not is_instance_valid(_target) or not GameState.is_in_battle(_target.peer_id):
		if is_instance_valid(_target):
			_ignored[_target.peer_id] = IGNORE_AFTER_CATCH
		_back_to_patrol()


func _back_to_patrol() -> void:
	state = State.PATROL
	_target = null
	if not route.is_empty():
		agent.target_position = route[_route_index]


func _target_is_valid() -> bool:
	return is_instance_valid(_target) and not GameState.is_detained(_target.peer_id) and not GameState.is_in_battle(_target.peer_id)


## Returns {player, seen} for the first student this teacher notices, or {}.
func _detect() -> Dictionary:
	for player in get_tree().get_nodes_in_group("players"):
		var peer_id: int = player.peer_id
		if GameState.is_detained(peer_id) or GameState.is_in_battle(peer_id) or _ignored.has(peer_id):
			continue
		var to_player: Vector3 = player.global_position - global_position
		var distance := to_player.length()
		if player.is_hidden:
			if state != State.PATROL and distance <= HIDDEN_DETECT_DISTANCE:
				return {"player": player, "seen": true}
			continue
		if distance <= _config.sight and _in_view(to_player) and _has_line_of_sight(player):
			return {"player": player, "seen": true}
		if distance <= player.noise_radius * _config.hearing:
			return {"player": player, "seen": false}
	return {}


func _in_view(to_player: Vector3) -> bool:
	var forward := -global_transform.basis.z
	var flat := Vector3(to_player.x, 0, to_player.z).normalized()
	return rad_to_deg(forward.angle_to(flat)) <= _config.fov / 2.0


func _has_line_of_sight(player: Node3D) -> bool:
	var eye := global_position + Vector3.UP * EYE_HEIGHT
	var query := PhysicsRayQueryParameters3D.create(eye, player.global_position + Vector3.UP * 1.0, 1)
	return get_world_3d().direct_space_state.intersect_ray(query).is_empty()


func _move_along_path(speed: float) -> void:
	var next := agent.get_next_path_position()
	var direction := next - global_position
	direction.y = 0
	if direction.length() < 0.05:
		_stop()
		return
	direction = direction.normalized()
	velocity.x = direction.x * speed
	velocity.z = direction.z * speed
	_face(direction)


func _face(direction: Vector3) -> void:
	if Vector2(direction.x, direction.z).length() > 0.01:
		rotation.y = atan2(-direction.x, -direction.z)


func _stop() -> void:
	velocity.x = 0
	velocity.z = 0
