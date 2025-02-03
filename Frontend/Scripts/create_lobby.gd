extends Control

var privat : bool
var headers = ["Content-Type: application/json"]

func _ready() -> void:
	$HTTPRequest.request_completed.connect(_on_http_request_request_completed)


func createLobby():
	$HTTPRequest.request("http://127.0.0.1:8000/lobby/new", headers, HTTPClient.METHOD_POST,JSON.stringify({"pBool": privat}))
	
	
func _on_http_request_request_completed(result: int, response_code: int, headers: PackedStringArray, body: PackedByteArray) -> void:
	var json = JSON.parse_string(body.get_string_from_utf8())
	print(json)
	if(json["message"] == "Lobby created"):
		print("Lobby created")
		print(json["code"])
		Global.lobby["code"] = json["code"]
		get_tree().change_scene_to_file("res://Scenes/lobby.tscn")
		
	else:
		print(json["message"])
		$MarginContainer/VBoxContainer/Label.text = "There was a error creating a lobby"

func _on_back_pressed() -> void:
	get_tree().change_scene_to_file("res://Scenes/mode_swiche.tscn")


func _on_create_lobby_pressed() -> void:
	createLobby()


func _on_real_privat_lobby_check_pressed() -> void:
	privat = $RealPrivatLobbyCheck.is_pressed()
