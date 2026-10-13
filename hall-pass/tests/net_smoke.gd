extends Node
## Two-process network test: one host, one client, over localhost ENet.
##   godot --headless --path . res://tests/net_smoke.tscn -- --host
##   godot --headless --path . res://tests/net_smoke.tscn -- --client
## Hands off to a runner on the root so it survives the scene change.

func _ready() -> void:
	var runner := Node.new()
	runner.name = "NetSmokeRunner"
	runner.set_script(load("res://tests/net_smoke_runner.gd"))
	get_tree().root.add_child.call_deferred(runner)
