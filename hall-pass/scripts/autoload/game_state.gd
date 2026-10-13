extends Node
## Run-wide state shared by every peer: the school seed, objectives, snacks,
## who is caught / in detention, and the class-period clock. The host owns all
## of it; clients ask via `request_*` RPCs and receive `_sync_*` RPCs back.

signal snacks_changed(total: int)
signal objectives_changed
signal status_changed
signal battle_requested(teacher_type: String, start_suspicion: int)
signal period_started
signal period_ended
signal all_peers_ready

const PERIOD_SECONDS := 600.0
const OBJECTIVES_PER_PERIOD := 3
const OBJECTIVE_DIR := "res://data/objectives"
const CARD_DIR := "res://data/cards"
const START_SUSPICION := {"substitute": 40, "hall_monitor": 55, "coach": 60, "principal": 75}
const STARTER_DECK := {
	"fake_cough": 2, "bathroom_emergency": 2, "new_kid": 2, "big_smile": 1,
	"compliment": 1, "carrying_boxes": 1, "nurses_note": 1,
}

var school_seed := 0
var snacks := 0
var deck: Array[ExcuseCard] = []
var objectives: Array[Objective] = []
var completed := {}
var detained := {}
var in_battle := {}
var times_caught := {}
var time_left := PERIOD_SECONDS
var period_running := false
var detention_spot := Vector3.ZERO
var release_spot := Vector3.ZERO

var _ready_peers := {}


func _ready() -> void:
	_register_inputs()
	deck = build_starter_deck()


func _process(delta: float) -> void:
	if not period_running:
		return
	time_left = maxf(0.0, time_left - delta)
	if time_left <= 0.0 and multiplayer.is_server():
		_end_period.rpc()


# --- Setup -------------------------------------------------------------------

func build_starter_deck() -> Array[ExcuseCard]:
	var cards: Array[ExcuseCard] = []
	for card_id in STARTER_DECK:
		var card := load("%s/%s.tres" % [CARD_DIR, card_id]) as ExcuseCard
		for i in STARTER_DECK[card_id]:
			cards.append(card)
	return cards


func load_objective_pool() -> Array[Objective]:
	var pool: Array[Objective] = []
	for file in DirAccess.get_files_at(OBJECTIVE_DIR):
		# Exported builds list resources as *.tres.remap.
		var path := "%s/%s" % [OBJECTIVE_DIR, file.trim_suffix(".remap")]
		if path.ends_with(".tres"):
			pool.append(load(path) as Objective)
	pool.sort_custom(func(a: Objective, b: Objective) -> bool: return a.id < b.id)
	return pool


## Same seed -> same objectives on every peer, so only the seed is sent.
func pick_objectives(rng_seed: int) -> Array[Objective]:
	var rng := RandomNumberGenerator.new()
	rng.seed = rng_seed
	var pool := load_objective_pool()
	var picked: Array[Objective] = []
	while picked.size() < OBJECTIVES_PER_PERIOD and not pool.is_empty():
		picked.append(pool.pop_at(rng.randi_range(0, pool.size() - 1)))
	return picked


func objective_by_id(id: String) -> Objective:
	for objective in objectives:
		if objective.id == id:
			return objective
	return null


func is_detained(peer_id: int) -> bool:
	return detained.has(peer_id)


func is_in_battle(peer_id: int) -> bool:
	return in_battle.has(peer_id)


# --- Period flow -------------------------------------------------------------

@rpc("authority", "call_local", "reliable")
func start_game(rng_seed: int) -> void:
	school_seed = rng_seed
	objectives = pick_objectives(rng_seed)
	completed.clear()
	detained.clear()
	in_battle.clear()
	times_caught.clear()
	_ready_peers.clear()
	period_running = false
	Network.close_lobby()
	get_tree().change_scene_to_file("res://scenes/school/school.tscn")


## Each peer calls this once its school scene is built; the host starts the
## period when everyone is in, so no spawn arrives before a client can take it.
@rpc("any_peer", "call_local", "reliable")
func report_scene_ready() -> void:
	if not multiplayer.is_server():
		return
	_ready_peers[_sender_id()] = true
	if everyone_ready():
		all_peers_ready.emit()


func everyone_ready() -> bool:
	for peer_id in Network.players:
		if not _ready_peers.has(peer_id):
			return false
	return true


@rpc("authority", "call_local", "reliable")
func start_period() -> void:
	time_left = PERIOD_SECONDS
	period_running = true
	period_started.emit()


@rpc("authority", "call_local", "reliable")
func _end_period() -> void:
	period_running = false
	Input.mouse_mode = Input.MOUSE_MODE_VISIBLE
	period_ended.emit()


# --- Objectives --------------------------------------------------------------

@rpc("any_peer", "call_local", "reliable")
func request_objective(id: String) -> void:
	if not multiplayer.is_server() or not period_running or completed.has(id):
		return
	var objective := objective_by_id(id)
	if objective == null or is_detained(_sender_id()):
		return
	_sync_objective.rpc(id, snacks + objective.snack_reward)


@rpc("authority", "call_local", "reliable")
func _sync_objective(id: String, new_total: int) -> void:
	completed[id] = true
	snacks = new_total
	objectives_changed.emit()
	snacks_changed.emit(snacks)


# --- Catching, battles, detention ---------------------------------------------

## Host only: a teacher reached a player.
func server_catch(peer_id: int, teacher_type: String) -> void:
	if not multiplayer.is_server() or is_in_battle(peer_id) or is_detained(peer_id):
		return
	if teacher_type == "principal":
		_sync_status.rpc(peer_id, false, true, 1)
		return
	_sync_status.rpc(peer_id, true, false, 1)
	_open_battle.rpc_id(peer_id, teacher_type)


@rpc("authority", "call_local", "reliable")
func _open_battle(teacher_type: String) -> void:
	battle_requested.emit(teacher_type, START_SUSPICION.get(teacher_type, 50))


@rpc("any_peer", "call_local", "reliable")
func report_battle_result(released: bool) -> void:
	if not multiplayer.is_server():
		return
	var peer_id := _sender_id()
	if is_in_battle(peer_id):
		_sync_status.rpc(peer_id, false, not released, 0)


## A free player held Interact at the detention door: everyone inside is out.
@rpc("any_peer", "call_local", "reliable")
func request_jailbreak() -> void:
	if not multiplayer.is_server() or is_detained(_sender_id()):
		return
	for peer_id in detained.keys():
		_sync_status.rpc(peer_id, false, false, 0)


@rpc("authority", "call_local", "reliable")
func _sync_status(peer_id: int, battling: bool, in_detention: bool, caught_increment: int) -> void:
	if battling:
		in_battle[peer_id] = true
	else:
		in_battle.erase(peer_id)
	if in_detention:
		detained[peer_id] = true
	else:
		detained.erase(peer_id)
	times_caught[peer_id] = times_caught.get(peer_id, 0) + caught_increment
	status_changed.emit()


func _sender_id() -> int:
	var id := multiplayer.get_remote_sender_id()
	return id if id != 0 else multiplayer.get_unique_id()


# --- Input -------------------------------------------------------------------

## Registered in code so key bindings are readable and diffable.
func _register_inputs() -> void:
	var bindings := {
		"move_forward": [KEY_W, KEY_UP],
		"move_back": [KEY_S, KEY_DOWN],
		"move_left": [KEY_A, KEY_LEFT],
		"move_right": [KEY_D, KEY_RIGHT],
		"sprint": [KEY_SHIFT],
		"crouch": [KEY_C, KEY_CTRL],
		"interact": [KEY_E],
		"card_1": [KEY_1],
		"card_2": [KEY_2],
		"card_3": [KEY_3],
		"card_4": [KEY_4],
		"card_5": [KEY_5],
		"end_turn": [KEY_SPACE],
	}
	for action in bindings:
		if InputMap.has_action(action):
			continue
		InputMap.add_action(action)
		for key in bindings[action]:
			var event := InputEventKey.new()
			event.physical_keycode = key
			InputMap.action_add_event(action, event)
