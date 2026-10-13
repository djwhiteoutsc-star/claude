extends CharacterBody3D
## A student. Each client simulates its own player (co-op, so trust is fine);
## the MultiplayerSynchronizer mirrors position, noise and hiding to everyone
## else, and the host's teachers read those values.

const WALK_SPEED := 3.5
const SPRINT_SPEED := 6.5
const CROUCH_SPEED := 1.8
const GRAVITY := 20.0
const MOUSE_SENSITIVITY := 0.003
## Metres a teacher can hear you from (before their hearing multiplier).
const NOISE := {"idle": 0.0, "crouch": 2.0, "walk": 5.0, "sprint": 10.0}
const JAILBREAK_HOLD := 3.0
const WORLD_MASK := 1

var peer_id := 1
var noise_radius := 0.0
var is_hidden := false
var crouching := false
## Shown by the HUD for the local player ("[E] Hide", etc).
var prompt := ""

var _hold_time := 0.0
var _was_detained := false

@onready var body: MeshInstance3D = $Body
@onready var name_label: Label3D = $NameLabel
@onready var reach: Area3D = $Reach
@onready var camera_pivot: Node3D = $CameraPivot
@onready var camera: Camera3D = $CameraPivot/SpringArm3D/Camera3D


func _enter_tree() -> void:
	peer_id = name.to_int()
	set_multiplayer_authority(peer_id)


func _ready() -> void:
	add_to_group("players")
	name_label.text = Network.players.get(peer_id, "Student")
	var material := StandardMaterial3D.new()
	material.albedo_color = Color.from_hsv(fmod(peer_id * 0.618, 1.0), 0.6, 0.95)
	body.material_override = material
	if is_multiplayer_authority():
		add_to_group("local_player")
		camera.current = true
		name_label.visible = false
		Input.mouse_mode = Input.MOUSE_MODE_CAPTURED


func _unhandled_input(event: InputEvent) -> void:
	if not is_multiplayer_authority():
		return
	if event is InputEventMouseMotion and Input.mouse_mode == Input.MOUSE_MODE_CAPTURED:
		rotate_y(-event.relative.x * MOUSE_SENSITIVITY)
		camera_pivot.rotation.x = clampf(camera_pivot.rotation.x - event.relative.y * MOUSE_SENSITIVITY, -1.2, 0.4)
	elif event.is_action_pressed("ui_cancel"):
		var captured := Input.mouse_mode == Input.MOUSE_MODE_CAPTURED
		Input.mouse_mode = Input.MOUSE_MODE_VISIBLE if captured else Input.MOUSE_MODE_CAPTURED
	elif event.is_action_pressed("interact") and _can_act():
		_interact()


func _physics_process(delta: float) -> void:
	body.scale.y = 0.65 if crouching else 1.0
	if not is_multiplayer_authority():
		return
	_handle_detention()

	if not is_on_floor():
		velocity.y -= GRAVITY * delta
	var input := Vector2.ZERO
	if _can_act() and not is_hidden and Input.mouse_mode == Input.MOUSE_MODE_CAPTURED:
		input = Input.get_vector("move_left", "move_right", "move_forward", "move_back")
	crouching = Input.is_action_pressed("crouch") and not is_hidden
	var sprinting := Input.is_action_pressed("sprint") and not crouching
	var speed := CROUCH_SPEED if crouching else (SPRINT_SPEED if sprinting else WALK_SPEED)
	var direction := (transform.basis * Vector3(input.x, 0, input.y)).normalized()
	velocity.x = direction.x * speed
	velocity.z = direction.z * speed
	move_and_slide()

	if input == Vector2.ZERO or is_hidden:
		noise_radius = NOISE.idle
	elif crouching:
		noise_radius = NOISE.crouch
	else:
		noise_radius = NOISE.sprint if sprinting else NOISE.walk

	_update_jailbreak(delta)
	_update_prompt()


func _can_act() -> bool:
	return GameState.period_running and not GameState.is_in_battle(peer_id)


func _interact() -> void:
	if is_hidden:
		is_hidden = false
		global_position += -global_transform.basis.z * 0.8
		return
	for area in reach.get_overlapping_areas():
		if area is ObjectiveTarget and not area.is_done():
			GameState.request_objective.rpc_id(1, area.objective.id)
			return
	var spot := _nearest_in_group("hide_spots")
	if spot and not GameState.is_detained(peer_id):
		global_position = spot.global_position
		velocity = Vector3.ZERO
		is_hidden = true


func _handle_detention() -> void:
	var detained := GameState.is_detained(peer_id)
	if detained == _was_detained:
		return
	_was_detained = detained
	is_hidden = false
	global_position = GameState.detention_spot if detained else GameState.release_spot
	# Only detained players collide with the detention-door barrier.
	collision_mask = WORLD_MASK | (SchoolGenerator.BARRIER_LAYER if detained else 0)


func _update_jailbreak(delta: float) -> void:
	var at_door := _nearest_in_group("detention_door") != null
	if at_door and not GameState.detained.is_empty() and not GameState.is_detained(peer_id) and Input.is_action_pressed("interact"):
		_hold_time += delta
		if _hold_time >= JAILBREAK_HOLD:
			_hold_time = 0.0
			GameState.request_jailbreak.rpc_id(1)
	else:
		_hold_time = 0.0


func _update_prompt() -> void:
	if GameState.is_detained(peer_id):
		prompt = "DETENTION — wait for a friend to break you out"
	elif is_hidden:
		prompt = "Hiding at a desk — [E] stand up"
	elif _hold_time > 0.0:
		prompt = "Breaking out... %d%%" % int(_hold_time / JAILBREAK_HOLD * 100.0)
	elif _nearest_in_group("detention_door") and not GameState.detained.is_empty():
		prompt = "Hold [E] to break your friends out"
	elif _has_objective_in_reach():
		prompt = "[E] Do objective"
	elif _nearest_in_group("hide_spots"):
		prompt = "[E] Hide at desk"
	else:
		prompt = ""


func _has_objective_in_reach() -> bool:
	for area in reach.get_overlapping_areas():
		if area is ObjectiveTarget and not area.is_done():
			return true
	return false


func _nearest_in_group(group: String) -> Area3D:
	var best: Area3D = null
	var best_dist := INF
	for area in reach.get_overlapping_areas():
		if area.is_in_group(group):
			var dist := global_position.distance_to(area.global_position)
			if dist < best_dist:
				best = area
				best_dist = dist
	return best
