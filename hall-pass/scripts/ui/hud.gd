extends CanvasLayer
## Class-period HUD: bell timer, objectives, snacks, interaction prompt and the
## end-of-period summary. Built in code to keep the scene file trivial.

var _timer_label := Label.new()
var _snacks_label := Label.new()
var _objectives_label := Label.new()
var _prompt_label := Label.new()
var _summary := PanelContainer.new()
var _summary_label := Label.new()


func _ready() -> void:
	var top_left := VBoxContainer.new()
	top_left.position = Vector2(20, 20)
	for label in [_timer_label, _snacks_label, _objectives_label]:
		label.add_theme_font_size_override("font_size", 22)
		top_left.add_child(label)
	add_child(top_left)

	_prompt_label.set_anchors_and_offsets_preset(Control.PRESET_CENTER_BOTTOM)
	_prompt_label.offset_top = -80
	_prompt_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	_prompt_label.grow_horizontal = Control.GROW_DIRECTION_BOTH
	_prompt_label.add_theme_font_size_override("font_size", 26)
	add_child(_prompt_label)

	var summary_box := VBoxContainer.new()
	_summary_label.add_theme_font_size_override("font_size", 24)
	summary_box.add_child(_summary_label)
	var back := Button.new()
	back.text = "Back to menu"
	back.pressed.connect(_on_back_pressed)
	summary_box.add_child(back)
	_summary.add_child(summary_box)
	_summary.set_anchors_and_offsets_preset(Control.PRESET_CENTER)
	_summary.visible = false
	add_child(_summary)

	GameState.objectives_changed.connect(_refresh_objectives)
	GameState.snacks_changed.connect(func(_total: int) -> void: _refresh_objectives())
	GameState.period_ended.connect(_show_summary)
	_refresh_objectives()


func _process(_delta: float) -> void:
	var seconds := int(ceil(GameState.time_left))
	_timer_label.text = "🔔 %d:%02d" % [seconds / 60, seconds % 60] if GameState.period_running else "Waiting for the bell..."
	var local := get_tree().get_first_node_in_group("local_player")
	_prompt_label.text = local.prompt if local else ""


func _refresh_objectives() -> void:
	_snacks_label.text = "🍫 Snacks: %d" % GameState.snacks
	var lines := PackedStringArray()
	for objective in GameState.objectives:
		var done := GameState.completed.has(objective.id)
		lines.append("%s %s" % ["☑" if done else "☐", objective.title])
	_objectives_label.text = "\n".join(lines)


func _show_summary() -> void:
	var lines := PackedStringArray(["BELL! Class is over.", ""])
	lines.append("Objectives: %d / %d" % [GameState.completed.size(), GameState.objectives.size()])
	lines.append("Snacks: %d" % GameState.snacks)
	for peer_id in Network.players:
		lines.append("%s — caught %d time(s)" % [Network.players[peer_id], GameState.times_caught.get(peer_id, 0)])
	_summary_label.text = "\n".join(lines)
	_summary.visible = true


func _on_back_pressed() -> void:
	Network.leave()
	get_tree().change_scene_to_file("res://scenes/main_menu.tscn")
