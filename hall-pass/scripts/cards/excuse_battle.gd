class_name ExcuseBattle
extends RefCounted
## Pure rules for an Excuse Card battle — no nodes, no UI, so it can be unit
## tested headless (tests/test_excuse_battle.gd) and reused by any front end.

signal suspicion_changed(value: int)
signal hand_changed
signal ended(released: bool)

const MAX_SUSPICION := 100
const HAND_SIZE := 5
const COMPOSURE_PER_TURN := 3
const BASE_PRESSURE := 10
const PRESSURE_GROWTH := 3

var suspicion: int
var composure := 0
var turn := 0
var hand: Array[ExcuseCard] = []
var draw_pile: Array[ExcuseCard] = []
var discard_pile: Array[ExcuseCard] = []
var is_over := false
var released := false

var _last_tag := ""
var _pressure_mod := 0
var _end_turn_penalty := 0
var _rng := RandomNumberGenerator.new()


func _init(deck: Array[ExcuseCard], start_suspicion: int, rng_seed: int = 0) -> void:
	_rng.seed = rng_seed
	draw_pile = deck.duplicate()
	_shuffle(draw_pile)
	suspicion = clampi(start_suspicion, 0, MAX_SUSPICION)
	_start_turn()


func can_play(index: int) -> bool:
	return not is_over and index >= 0 and index < hand.size() and hand[index].cost <= composure


## Reduction the card would deal right now, including the combo bonus.
func preview_reduction(card: ExcuseCard) -> int:
	var is_combo := card.combo_from != "" and card.combo_from == _last_tag
	return card.reduction * (2 if is_combo else 1)


func current_pressure() -> int:
	return maxi(0, BASE_PRESSURE + PRESSURE_GROWTH * (turn - 1) + _pressure_mod)


## Play a card from your own hand. Returns false if it can't be played.
func play(index: int) -> bool:
	if not can_play(index):
		return false
	var card := hand[index]
	hand.remove_at(index)
	composure -= card.cost
	if not card.exhaust:
		discard_pile.append(card)
	_resolve(card)
	return true


## A friend within range plays a support card from *their* hand. It costs the
## caught player nothing but still counts for combos.
func play_support(card: ExcuseCard) -> bool:
	if is_over or not card.support:
		return false
	_resolve(card)
	return true


func end_turn() -> void:
	if is_over:
		return
	_set_suspicion(suspicion + current_pressure() + _end_turn_penalty)
	_pressure_mod = 0
	_end_turn_penalty = 0
	if not is_over:
		_start_turn()


func _resolve(card: ExcuseCard) -> void:
	var amount := preview_reduction(card)
	_last_tag = card.tag
	composure += card.composure_gain
	_pressure_mod += card.pressure_change
	_end_turn_penalty += card.end_turn_suspicion
	_draw(card.draw)
	_set_suspicion(suspicion - amount)
	if not is_over and card.release_below > 0 and suspicion < card.release_below:
		_finish(true)
	hand_changed.emit()


func _start_turn() -> void:
	turn += 1
	composure = COMPOSURE_PER_TURN
	_last_tag = ""
	_draw(HAND_SIZE - hand.size())
	hand_changed.emit()


func _draw(count: int) -> void:
	for i in count:
		if draw_pile.is_empty():
			draw_pile = discard_pile
			discard_pile = []
			_shuffle(draw_pile)
		if draw_pile.is_empty():
			return
		hand.append(draw_pile.pop_back())


func _set_suspicion(value: int) -> void:
	suspicion = clampi(value, 0, MAX_SUSPICION)
	suspicion_changed.emit(suspicion)
	if suspicion <= 0:
		_finish(true)
	elif suspicion >= MAX_SUSPICION:
		_finish(false)


func _finish(was_released: bool) -> void:
	if is_over:
		return
	is_over = true
	released = was_released
	ended.emit(released)


func _shuffle(cards: Array[ExcuseCard]) -> void:
	# Fisher–Yates with our own RNG so battles are reproducible from a seed.
	for i in range(cards.size() - 1, 0, -1):
		var j := _rng.randi_range(0, i)
		var tmp := cards[i]
		cards[i] = cards[j]
		cards[j] = tmp
