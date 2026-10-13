class_name ExcuseCard
extends Resource
## One Excuse Card. See docs/excuse-cards.md for the full first set.

@export var card_name := ""
@export_range(0, 5) var cost := 1
## How much Suspicion this card removes (doubled on a combo).
@export var reduction := 0
## This card's own tag: sick, bathroom, helpful, lost, smooth, support.
@export var tag := ""
## If the previous card played this turn has this tag, reduction is doubled.
@export var combo_from := ""
@export_multiline var flavour := ""

@export_group("Effects")
@export var draw := 0
@export var composure_gain := 0
## Added to the teacher's Pressure at the end of this turn (negative = calmer).
@export var pressure_change := 0
## Suspicion added at the end of this turn (risky cards like Overcommit).
@export var end_turn_suspicion := 0
## Single-use: removed from the deck for the rest of the battle.
@export var exhaust := false
## If > 0, playing this card ends the battle in your favour when Suspicion is below it.
@export var release_below := 0
## Can be played by a nearby friend (Back Them Up).
@export var support := false
