class_name Room
extends Node3D
## One 10x10 m grey-box tile: floor, walls with optional door gaps, and desks
## you can hide at. Built from StaticBody3D boxes so the navmesh can bake from
## colliders at runtime. Swap for modelled rooms later — keep the same exports.

enum Side { NORTH = 1, SOUTH = 2, EAST = 4, WEST = 8 }

const SIZE := 10.0
const WALL_HEIGHT := 3.0
const WALL_THICKNESS := 0.3
const DOOR_WIDTH := 2.4
const INTERACT_LAYER := 16
const DESK_ROOMS := ["classroom", "library", "science_lab"]
const COLORS := {
	"hallway": Color(0.78, 0.76, 0.70),
	"detention": Color(0.45, 0.42, 0.42),
	"classroom": Color(0.60, 0.75, 0.90),
	"office": Color(0.85, 0.65, 0.55),
	"cafeteria": Color(0.95, 0.85, 0.50),
	"gym": Color(0.80, 0.60, 0.35),
	"library": Color(0.55, 0.70, 0.55),
	"science_lab": Color(0.65, 0.90, 0.80),
	"nurse": Color(0.95, 0.75, 0.80),
	"lockers": Color(0.55, 0.60, 0.80),
	"bathroom": Color(0.75, 0.90, 0.95),
}

@export var room_type := "classroom"
@export_flags("North", "South", "East", "West") var walls := 15
@export_flags("North", "South", "East", "West") var doors := 0

var hide_spots: Array[Area3D] = []


func _ready() -> void:
	_add_box(Vector3(SIZE, 0.2, SIZE), Vector3(0, -0.1, 0), COLORS.get(room_type, Color.GRAY))
	for side in [Side.NORTH, Side.SOUTH, Side.EAST, Side.WEST]:
		if walls & side:
			_add_wall(side, (doors & side) != 0)
	if room_type in DESK_ROOMS:
		_add_desks()
	if room_type != "hallway":
		var label := Label3D.new()
		label.text = room_type.capitalize()
		label.billboard = BaseMaterial3D.BILLBOARD_ENABLED
		label.font_size = 64
		label.position = Vector3(0, WALL_HEIGHT - 0.2, 0)
		add_child(label)


func _add_wall(side: int, has_door: bool) -> void:
	var offset := SIZE / 2.0 - WALL_THICKNESS / 2.0
	var along_x := side == Side.NORTH or side == Side.SOUTH
	var center: Vector3
	match side:
		Side.NORTH: center = Vector3(0, WALL_HEIGHT / 2.0, offset)
		Side.SOUTH: center = Vector3(0, WALL_HEIGHT / 2.0, -offset)
		Side.EAST: center = Vector3(offset, WALL_HEIGHT / 2.0, 0)
		Side.WEST: center = Vector3(-offset, WALL_HEIGHT / 2.0, 0)
	var color := Color(0.92, 0.90, 0.85)
	if not has_door:
		_add_box(_wall_size(SIZE, along_x), center, color)
		return
	var segment := (SIZE - DOOR_WIDTH) / 2.0
	var shift := DOOR_WIDTH / 2.0 + segment / 2.0
	for sign in [-1.0, 1.0]:
		var step := Vector3(shift * sign, 0, 0) if along_x else Vector3(0, 0, shift * sign)
		_add_box(_wall_size(segment, along_x), center + step, color)


func _wall_size(length: float, along_x: bool) -> Vector3:
	return Vector3(length, WALL_HEIGHT, WALL_THICKNESS) if along_x else Vector3(WALL_THICKNESS, WALL_HEIGHT, length)


func _add_desks() -> void:
	for x in [-3.0, 0.0, 3.0]:
		for z in [-2.5, 1.0]:
			_add_box(Vector3(1.2, 0.75, 0.6), Vector3(x, 0.375, z), Color(0.55, 0.40, 0.25))
			var spot := Area3D.new()
			spot.add_to_group("hide_spots")
			spot.collision_layer = INTERACT_LAYER
			spot.collision_mask = 0
			spot.position = Vector3(x, 0.1, z + 0.75)
			var shape := CollisionShape3D.new()
			shape.shape = SphereShape3D.new()
			(shape.shape as SphereShape3D).radius = 0.6
			spot.add_child(shape)
			add_child(spot)
			hide_spots.append(spot)


func _add_box(size: Vector3, pos: Vector3, color: Color) -> StaticBody3D:
	var body := StaticBody3D.new()
	body.position = pos
	var shape := CollisionShape3D.new()
	var box := BoxShape3D.new()
	box.size = size
	shape.shape = box
	body.add_child(shape)
	var mesh := MeshInstance3D.new()
	var box_mesh := BoxMesh.new()
	box_mesh.size = size
	var material := StandardMaterial3D.new()
	material.albedo_color = color
	box_mesh.material = material
	mesh.mesh = box_mesh
	body.add_child(mesh)
	add_child(body)
	return body
