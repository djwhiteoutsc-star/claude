class_name Objective
extends Resource
## A mission for one class period, e.g. "Swap the cafeteria pudding".

@export var id := ""
@export var title := ""
## Which room type the target spawns in (see Room.COLORS for the list).
@export var room_type := "classroom"
@export var snack_reward := 10
