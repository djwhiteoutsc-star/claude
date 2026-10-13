extends Control
## Title screen: pick a name, host a game, or join a friend by IP.

var _name_edit := LineEdit.new()
var _ip_edit := LineEdit.new()
var _status := Label.new()


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
	title.text = "HALL PASS"
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	title.add_theme_font_size_override("font_size", 56)
	box.add_child(title)

	_name_edit.placeholder_text = "Your name"
	_name_edit.text = Network.local_name
	box.add_child(_name_edit)
	box.add_child(_button("Host game", _on_host))
	_ip_edit.placeholder_text = "Friend's IP"
	_ip_edit.text = "127.0.0.1"
	box.add_child(_ip_edit)
	box.add_child(_button("Join game", _on_join))
	box.add_child(_button("Quit", get_tree().quit))
	_status.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	box.add_child(_status)

	Network.joined.connect(_go_to_lobby)
	Network.connection_failed.connect(func() -> void: _status.text = "Couldn't connect.")


func _button(text: String, callback: Callable) -> Button:
	var button := Button.new()
	button.text = text
	button.pressed.connect(callback)
	return button


func _on_host() -> void:
	Network.local_name = _name_edit.text.strip_edges() if _name_edit.text.strip_edges() else "Student"
	var err := Network.host()
	if err != OK:
		_status.text = "Couldn't host (error %d). Is port %d in use?" % [err, Network.PORT]
		return
	_go_to_lobby()


func _on_join() -> void:
	Network.local_name = _name_edit.text.strip_edges() if _name_edit.text.strip_edges() else "Student"
	var err := Network.join(_ip_edit.text.strip_edges())
	_status.text = "Connecting..." if err == OK else "Couldn't start connection (error %d)." % err


func _go_to_lobby() -> void:
	get_tree().change_scene_to_file("res://scenes/lobby.tscn")
