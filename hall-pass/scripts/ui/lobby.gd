extends Control
## Waiting room. The host presses Start; everyone else waits.

var _player_list := Label.new()
var _start := Button.new()


func _ready() -> void:
	Input.mouse_mode = Input.MOUSE_MODE_VISIBLE
	var box := VBoxContainer.new()
	box.custom_minimum_size = Vector2(360, 0)
	box.add_theme_constant_override("separation", 10)
	box.set_anchors_and_offsets_preset(Control.PRESET_CENTER)
	box.grow_horizontal = Control.GROW_DIRECTION_BOTH
	box.grow_vertical = Control.GROW_DIRECTION_BOTH
	add_child(box)

	var title := Label.new()
	title.text = "Homeroom"
	title.add_theme_font_size_override("font_size", 40)
	box.add_child(title)
	_player_list.add_theme_font_size_override("font_size", 22)
	box.add_child(_player_list)

	_start.text = "Start class" if multiplayer.is_server() else "Waiting for host..."
	_start.disabled = not multiplayer.is_server()
	_start.pressed.connect(func() -> void: GameState.start_game.rpc(randi()))
	box.add_child(_start)

	var leave := Button.new()
	leave.text = "Leave"
	leave.pressed.connect(_on_leave)
	box.add_child(leave)

	Network.players_changed.connect(_refresh)
	_refresh()


func _refresh() -> void:
	var lines := PackedStringArray()
	for peer_id in Network.players:
		lines.append("• %s%s" % [Network.players[peer_id], "  (host)" if peer_id == 1 else ""])
	lines.append("\n%d / %d students" % [Network.players.size(), Network.MAX_PLAYERS])
	_player_list.text = "\n".join(lines)


func _on_leave() -> void:
	Network.leave()
	get_tree().change_scene_to_file("res://scenes/main_menu.tscn")
