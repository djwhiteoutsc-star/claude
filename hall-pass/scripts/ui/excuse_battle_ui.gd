extends CanvasLayer
## Front end for ExcuseBattle. Opens when GameState says *this* player was
## caught, and reports the result back to the host when the battle ends.

var _battle: ExcuseBattle
var _teacher_type := ""

var _panel := PanelContainer.new()
var _title := Label.new()
var _meter := ProgressBar.new()
var _status := Label.new()
var _hand_box := HBoxContainer.new()
var _end_turn := Button.new()


func _ready() -> void:
	layer = 2
	var box := VBoxContainer.new()
	box.custom_minimum_size = Vector2(760, 0)
	box.add_theme_constant_override("separation", 12)
	_title.add_theme_font_size_override("font_size", 30)
	_title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	_meter.max_value = ExcuseBattle.MAX_SUSPICION
	_meter.custom_minimum_size = Vector2(0, 28)
	_status.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	_hand_box.alignment = BoxContainer.ALIGNMENT_CENTER
	_hand_box.add_theme_constant_override("separation", 8)
	_end_turn.text = "End turn [Space]"
	_end_turn.pressed.connect(_on_end_turn)
	for node in [_title, _meter, _status, _hand_box, _end_turn]:
		box.add_child(node)
	_panel.add_child(box)
	_panel.set_anchors_and_offsets_preset(Control.PRESET_CENTER)
	_panel.grow_horizontal = Control.GROW_DIRECTION_BOTH
	_panel.grow_vertical = Control.GROW_DIRECTION_BOTH
	add_child(_panel)
	visible = false
	GameState.battle_requested.connect(open)


func open(teacher_type: String, start_suspicion: int) -> void:
	_teacher_type = teacher_type
	_battle = ExcuseBattle.new(GameState.deck, start_suspicion, randi())
	_battle.hand_changed.connect(_refresh)
	_battle.suspicion_changed.connect(func(_value: int) -> void: _refresh())
	_battle.ended.connect(_on_ended)
	_title.text = "CAUGHT by the %s!" % teacher_type.capitalize()
	visible = true
	Input.mouse_mode = Input.MOUSE_MODE_VISIBLE
	_refresh()


func _unhandled_input(event: InputEvent) -> void:
	if not visible or _battle == null or _battle.is_over:
		return
	for i in ExcuseBattle.HAND_SIZE:
		if event.is_action_pressed("card_%d" % (i + 1)):
			_play(i)
			get_viewport().set_input_as_handled()
			return
	if event.is_action_pressed("end_turn"):
		_on_end_turn()
		get_viewport().set_input_as_handled()


func _refresh() -> void:
	if _battle == null:
		return
	_meter.value = _battle.suspicion
	_status.text = "Suspicion %d / %d   ·   Composure %d   ·   Turn %d   ·   Teacher pressure +%d" % [
		_battle.suspicion, ExcuseBattle.MAX_SUSPICION, _battle.composure, _battle.turn, _battle.current_pressure()]
	for child in _hand_box.get_children():
		child.queue_free()
	for i in _battle.hand.size():
		var card := _battle.hand[i]
		var reduction := _battle.preview_reduction(card)
		var button := Button.new()
		button.custom_minimum_size = Vector2(140, 120)
		button.text = "[%d] %s\nCost %d\n-%d%s" % [i + 1, card.card_name, card.cost, reduction, "  COMBO!" if reduction > card.reduction else ""]
		button.tooltip_text = card.flavour
		button.disabled = not _battle.can_play(i)
		button.pressed.connect(_play.bind(i))
		_hand_box.add_child(button)


func _play(index: int) -> void:
	_battle.play(index)


func _on_end_turn() -> void:
	if _battle and not _battle.is_over:
		_battle.end_turn()


func _on_ended(released: bool) -> void:
	_title.text = "...fine. Get back to class." if released else "DETENTION!"
	_end_turn.disabled = true
	await get_tree().create_timer(1.5).timeout
	visible = false
	_end_turn.disabled = false
	if GameState.period_running:
		Input.mouse_mode = Input.MOUSE_MODE_CAPTURED
	GameState.report_battle_result.rpc_id(1, released)
