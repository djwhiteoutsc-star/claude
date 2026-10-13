extends SceneTree
## Headless tests for the Excuse Card rules.
## Run: godot --headless --path . -s tests/test_excuse_battle.gd

var _failures := 0


func _init() -> void:
	test_combo_doubles_reduction()
	test_combo_resets_each_turn()
	test_composure_limits_plays()
	test_pressure_grows_and_detention()
	test_release_at_zero()
	test_exhaust_and_reshuffle()
	test_bell_rings_release()
	test_support_card()
	test_sample_cards_load()
	print("FAILED: %d" % _failures if _failures else "All excuse battle tests passed.")
	quit(1 if _failures else 0)


func card(name: String, cost: int, reduction: int, tag := "", combo_from := "") -> ExcuseCard:
	var c := ExcuseCard.new()
	c.card_name = name
	c.cost = cost
	c.reduction = reduction
	c.tag = tag
	c.combo_from = combo_from
	return c


func deck_of(cards: Array) -> Array[ExcuseCard]:
	var deck: Array[ExcuseCard] = []
	deck.assign(cards)
	return deck


func hand_index(battle: ExcuseBattle, name: String) -> int:
	for i in battle.hand.size():
		if battle.hand[i].card_name == name:
			return i
	return -1


func check(cond: bool, msg: String) -> void:
	if not cond:
		_failures += 1
		push_error("FAIL: " + msg)


func test_combo_doubles_reduction() -> void:
	var b := ExcuseBattle.new(deck_of([card("Fake Cough", 1, 8, "sick"), card("Nurse's Note", 2, 15, "sick", "sick")]), 60)
	check(b.play(hand_index(b, "Fake Cough")), "fake cough playable")
	check(b.suspicion == 52, "fake cough -8 (got %d)" % b.suspicion)
	check(b.play(hand_index(b, "Nurse's Note")), "nurse's note playable")
	check(b.suspicion == 22, "nurse's note combo -30 (got %d)" % b.suspicion)


func test_combo_resets_each_turn() -> void:
	var b := ExcuseBattle.new(deck_of([card("Fake Cough", 1, 8, "sick"), card("Nurse's Note", 2, 15, "sick", "sick")]), 80)
	b.play(hand_index(b, "Fake Cough"))
	b.end_turn()
	var note := b.hand[hand_index(b, "Nurse's Note")]
	check(b.preview_reduction(note) == 15, "combo should not carry across turns")


func test_composure_limits_plays() -> void:
	var b := ExcuseBattle.new(deck_of([card("A", 2, 1), card("B", 2, 1)]), 50)
	check(b.play(0), "first 2-cost card playable")
	check(not b.can_play(0), "second 2-cost card blocked with 1 composure left")


func test_pressure_grows_and_detention() -> void:
	var b := ExcuseBattle.new(deck_of([card("Shrug", 0, 0)]), 70)
	b.end_turn() # +10 -> 80
	check(b.suspicion == 80, "turn 1 pressure 10 (got %d)" % b.suspicion)
	b.end_turn() # +13 -> 93
	check(b.suspicion == 93, "turn 2 pressure 13 (got %d)" % b.suspicion)
	b.end_turn() # +16 -> 100
	check(b.is_over and not b.released, "should end in detention")


func test_release_at_zero() -> void:
	var b := ExcuseBattle.new(deck_of([card("Hall Pass (Real)", 3, 30)]), 25)
	b.play(0)
	check(b.is_over and b.released, "suspicion 0 releases the player")


func test_exhaust_and_reshuffle() -> void:
	var pass_card := card("Hall Pass (Real)", 0, 1)
	pass_card.exhaust = true
	var b := ExcuseBattle.new(deck_of([pass_card, card("Shrug", 0, 1)]), 90)
	b.play(hand_index(b, "Hall Pass (Real)"))
	b.play(hand_index(b, "Shrug"))
	b.end_turn()
	check(hand_index(b, "Hall Pass (Real)") == -1, "exhausted card should not return")
	check(hand_index(b, "Shrug") != -1, "discarded card reshuffles back")


func test_bell_rings_release() -> void:
	var bell := card("Bell Rings", 2, 0)
	bell.release_below = 40
	var b := ExcuseBattle.new(deck_of([bell]), 35)
	b.play(0)
	check(b.is_over and b.released, "bell rings releases under 40")


func test_support_card() -> void:
	var b := ExcuseBattle.new(deck_of([card("Big Smile", 0, 5, "smooth")]), 50)
	var back_up := card("Back Them Up", 1, 10, "support")
	back_up.support = true
	check(b.play_support(back_up), "support card playable by friend")
	check(b.suspicion == 40 and b.composure == 3, "support costs the caught player nothing")
	check(not b.play_support(card("Not Support", 0, 5)), "non-support card rejected")


func test_sample_cards_load() -> void:
	var dir := DirAccess.open("res://data/cards")
	check(dir != null, "data/cards exists")
	if dir == null:
		return
	var count := 0
	for file in dir.get_files():
		if file.ends_with(".tres"):
			var c := load("res://data/cards/" + file) as ExcuseCard
			check(c != null and c.card_name != "", "card resource loads: " + file)
			count += 1
	check(count > 0, "at least one sample card")
