extends Node
## Lobby networking over ENet (direct IP). Host-authoritative.
##
## STEAM SWAP-IN POINT: when moving to Steam, replace host()/join() with
## GodotSteam lobby creation + SteamMultiplayerPeer. Everything else in the
## project only talks to `multiplayer` and `players`, so nothing else changes.

signal players_changed
signal joined
signal connection_failed
signal server_disconnected

const PORT := 7777
const MAX_PLAYERS := 6

## peer_id -> display name, kept identical on every peer by the host.
var players := {}
var local_name := "Student"


func _ready() -> void:
	multiplayer.peer_disconnected.connect(_on_peer_disconnected)
	multiplayer.connected_to_server.connect(_on_connected_to_server)
	multiplayer.connection_failed.connect(_on_connection_failed)
	multiplayer.server_disconnected.connect(_on_server_disconnected)


func host() -> Error:
	var peer := ENetMultiplayerPeer.new()
	var err := peer.create_server(PORT, MAX_PLAYERS - 1)
	if err != OK:
		return err
	multiplayer.multiplayer_peer = peer
	players = {1: local_name}
	players_changed.emit()
	return OK


func join(address: String) -> Error:
	var peer := ENetMultiplayerPeer.new()
	var err := peer.create_client(address, PORT)
	if err != OK:
		return err
	multiplayer.multiplayer_peer = peer
	return OK


func leave() -> void:
	multiplayer.multiplayer_peer = null
	players.clear()
	players_changed.emit()


func is_online() -> bool:
	return multiplayer.multiplayer_peer is ENetMultiplayerPeer


## Stop strangers joining once a class period has started.
func close_lobby() -> void:
	if multiplayer.is_server() and multiplayer.multiplayer_peer:
		multiplayer.multiplayer_peer.refuse_new_connections = true


func _on_connected_to_server() -> void:
	_register.rpc_id(1, local_name)
	joined.emit()


func _on_connection_failed() -> void:
	multiplayer.multiplayer_peer = null
	connection_failed.emit()


func _on_server_disconnected() -> void:
	leave()
	server_disconnected.emit()
	get_tree().change_scene_to_file("res://scenes/main_menu.tscn")


func _on_peer_disconnected(id: int) -> void:
	if players.erase(id):
		players_changed.emit()


@rpc("any_peer", "reliable")
func _register(display_name: String) -> void:
	if not multiplayer.is_server():
		return
	players[multiplayer.get_remote_sender_id()] = display_name.left(16)
	_sync_players.rpc(players)


@rpc("authority", "call_local", "reliable")
func _sync_players(all_players: Dictionary) -> void:
	players = all_players
	players_changed.emit()
