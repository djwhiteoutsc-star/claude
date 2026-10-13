class_name SchoolGenerator
extends Node3D
## Builds one school day from a seed. Every peer runs build() with the same
## seed and objectives and gets the same layout, so only the seed is networked.
##
## Layout: a straight hallway along +X, a room either side of each hallway
## segment, and detention at the west end.
##
##          [room][room][room]...      (north, door faces south)
##   [DET]  [hall][hall][hall]...|
##          [room][room][room]...      (south, door faces north)

const ROOM_SCENE := preload("res://scenes/school/rooms/classroom.tscn")
const HALLWAY_SCENE := preload("res://scenes/school/rooms/hallway.tscn")
const TILE := Room.SIZE
const SEGMENTS := 6
const BARRIER_LAYER := 8
## Weighted pool used to fill slots not taken by objective rooms.
const FILLER_TYPES := [
	"classroom", "classroom", "classroom", "office", "cafeteria", "gym",
	"library", "science_lab", "nurse", "lockers", "bathroom",
]

var rooms: Array[Room] = []
var spawn_points: Array[Vector3] = []
var teacher_plans: Array[Dictionary] = []
var detention_spot := Vector3.ZERO
var release_spot := Vector3.ZERO
var nav_region: NavigationRegion3D

var _rng := RandomNumberGenerator.new()


func build(rng_seed: int, objectives: Array[Objective]) -> void:
	_rng.seed = rng_seed
	nav_region = NavigationRegion3D.new()
	add_child(nav_region)

	for i in SEGMENTS:
		var hall := HALLWAY_SCENE.instantiate() as Room
		if i == SEGMENTS - 1:
			hall.walls = Room.Side.EAST
		_place(hall, Vector3(i * TILE, 0, 0))

	var types := _room_types(objectives)
	for i in types.size():
		var north := i % 2 == 0
		var room := ROOM_SCENE.instantiate() as Room
		room.room_type = types[i]
		room.doors = Room.Side.SOUTH if north else Room.Side.NORTH
		_place(room, Vector3(int(i / 2) * TILE, 0, TILE if north else -TILE))
		rooms.append(room)

	var detention := ROOM_SCENE.instantiate() as Room
	detention.room_type = "detention"
	detention.doors = Room.Side.EAST
	_place(detention, Vector3(-TILE, 0, 0))
	detention_spot = Vector3(-TILE - 2.0, 0.5, 0)
	release_spot = Vector3(-TILE / 2.0 + 2.0, 0.5, 0)
	_add_detention_door()

	for objective in objectives:
		_add_objective_target(objective)

	for i in Network.MAX_PLAYERS:
		spawn_points.append(Vector3(1.0 + (i / 2) * 1.5, 0.5, -1.0 if i % 2 == 0 else 1.0))

	_plan_teachers()
	if multiplayer.is_server():
		_bake_navigation()


func rooms_of_type(type: String) -> Array[Room]:
	var found: Array[Room] = []
	for room in rooms:
		if room.room_type == type:
			found.append(room)
	return found


## Every objective's room type is guaranteed; the rest is random filler.
func _room_types(objectives: Array[Objective]) -> Array[String]:
	var types: Array[String] = []
	for objective in objectives:
		if objective.room_type not in types:
			types.append(objective.room_type)
	while types.size() < SEGMENTS * 2:
		types.append(FILLER_TYPES[_rng.randi_range(0, FILLER_TYPES.size() - 1)])
	for i in range(types.size() - 1, 0, -1):
		var j := _rng.randi_range(0, i)
		var tmp := types[i]
		types[i] = types[j]
		types[j] = tmp
	return types


func _place(room: Room, pos: Vector3) -> void:
	room.position = pos
	nav_region.add_child(room)


func _add_objective_target(objective: Objective) -> void:
	var candidates := rooms_of_type(objective.room_type)
	if candidates.is_empty():
		push_warning("No %s room for objective %s" % [objective.room_type, objective.id])
		return
	var room := candidates[_rng.randi_range(0, candidates.size() - 1)]
	var target := ObjectiveTarget.new()
	target.objective = objective
	target.position = room.position + Vector3(_rng.randf_range(-3.5, 3.5), 0, _rng.randf_range(-3.5, 3.5))
	add_child(target)


## An invisible barrier only detained players collide with, plus the area a
## free friend holds Interact in to break everyone out.
func _add_detention_door() -> void:
	var door_x := -TILE / 2.0
	var barrier := StaticBody3D.new()
	barrier.collision_layer = BARRIER_LAYER
	barrier.collision_mask = 0
	barrier.position = Vector3(door_x, 1.5, 0)
	var shape := CollisionShape3D.new()
	var box := BoxShape3D.new()
	box.size = Vector3(0.3, 3.0, Room.DOOR_WIDTH)
	shape.shape = box
	barrier.add_child(shape)
	add_child(barrier)

	var door := Area3D.new()
	door.add_to_group("detention_door")
	door.collision_layer = Room.INTERACT_LAYER
	door.collision_mask = 0
	door.position = Vector3(door_x + 1.0, 1.0, 0)
	var area_shape := CollisionShape3D.new()
	var area_box := BoxShape3D.new()
	area_box.size = Vector3(2.0, 2.0, Room.DOOR_WIDTH)
	area_shape.shape = area_box
	door.add_child(area_shape)
	var label := Label3D.new()
	label.text = "DETENTION\nhold E to break out"
	label.billboard = BaseMaterial3D.BILLBOARD_ENABLED
	label.font_size = 48
	label.position.y = 1.6
	door.add_child(label)
	add_child(door)


## Waypoints only — teachers path between them on the navmesh.
func _plan_teachers() -> void:
	var hall_end := (SEGMENTS - 1) * TILE
	teacher_plans.append({"type": "hall_monitor", "route": [Vector3(hall_end, 0, 0), Vector3(TILE, 0, 0)]})
	teacher_plans.append({"type": "coach", "route": _room_route(["gym", "cafeteria"], 3)})
	teacher_plans.append({"type": "substitute", "route": _room_route(["classroom", "library", "science_lab"], 3)})
	if _rng.randf() < 0.5:
		teacher_plans.append({"type": "principal", "route": _room_route(["office"], 3)})


func _room_route(preferred: Array, length: int) -> Array:
	var route := []
	for room in rooms:
		if room.room_type in preferred and route.size() < length:
			route.append(room.position)
	while route.size() < length:
		route.append(rooms[_rng.randi_range(0, rooms.size() - 1)].position)
	return route


func _bake_navigation() -> void:
	var nav_mesh := NavigationMesh.new()
	nav_mesh.geometry_parsed_geometry_type = NavigationMesh.PARSED_GEOMETRY_STATIC_COLLIDERS
	nav_mesh.geometry_collision_mask = 1
	nav_mesh.agent_radius = 0.5
	nav_mesh.agent_height = 1.75
	nav_mesh.cell_size = 0.25
	nav_mesh.cell_height = 0.25
	nav_region.navigation_mesh = nav_mesh
	nav_region.bake_navigation_mesh(false)
