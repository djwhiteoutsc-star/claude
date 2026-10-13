class_name ObjectiveTarget
extends Area3D
## The thing you walk up to and press Interact on to finish an objective.

var objective: Objective


func _ready() -> void:
	add_to_group("objective_targets")
	collision_layer = Room.INTERACT_LAYER
	collision_mask = 0

	var shape := CollisionShape3D.new()
	shape.shape = SphereShape3D.new()
	(shape.shape as SphereShape3D).radius = 0.8
	shape.position.y = 0.6
	add_child(shape)

	var mesh := MeshInstance3D.new()
	var box := BoxMesh.new()
	box.size = Vector3(0.5, 0.5, 0.5)
	var material := StandardMaterial3D.new()
	material.albedo_color = Color(1.0, 0.85, 0.1)
	material.emission_enabled = true
	material.emission = Color(1.0, 0.7, 0.0)
	box.material = material
	mesh.mesh = box
	mesh.position.y = 0.6
	add_child(mesh)

	var label := Label3D.new()
	label.text = objective.title if objective else "?"
	label.billboard = BaseMaterial3D.BILLBOARD_ENABLED
	label.font_size = 40
	label.position.y = 1.4
	add_child(label)

	GameState.objectives_changed.connect(_refresh)
	_refresh()


func is_done() -> bool:
	return objective == null or GameState.completed.has(objective.id)


func _refresh() -> void:
	if is_done():
		visible = false
		set_deferred("monitorable", false)
