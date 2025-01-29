extends Control

var headers = ["Content-Type: application/json"]
var join_string

func _on_lobby_code_text_changed() -> void:
	join_string = $MarginContainer/VBoxContainer/HBoxContainer/Lobby_code.text

func _on_back_pressed() -> void:
	get_tree().change_scene_to_file("res://mode_swiche.tscn")
	
func _on_refresh_pressed() -> void:
	var response = $HTTPRequest.request("http://127.0.0.1:8000/explor", headers, HTTPClient.METHOD_GET)
	
func _on_join_lobby_pressed() -> void:
	join(join_string)
	
func join(code: String):
	print(code)
	Global.lobby["code"] = code
	get_tree().change_scene_to_file("res://lobby.tscn")
	


func _on_http_request_request_completed(result: int, response_code: int, headers: PackedStringArray, body: PackedByteArray) -> void:
	var json = JSON.parse_string(body.get_string_from_utf8())
	for n in $MarginContainer/VBoxContainer/Lobbys/VBoxContainer.get_children():
		$MarginContainer/VBoxContainer/Lobbys/VBoxContainer.remove_child(n)
		n.queue_free()
		
	if (json == null):
		return
		
	for lobby in json:
		
		var HBConteiner = HBoxContainer.new()
		var codeLabel = Label.new()
		var joinButton = Button.new()
		var playerLabel = Label.new()
		
		HBConteiner.custom_minimum_size.x = 900
		HBConteiner.custom_minimum_size.y = 80
		playerLabel.text = str(lobby["players"])
		codeLabel.text = lobby["code"]
		joinButton.text = "Join"
		joinButton.pressed.connect(self._button_pressed.bind(lobby["code"]))
		
		HBConteiner.add_child(codeLabel)
		HBConteiner.add_child(playerLabel)
		HBConteiner.add_child(joinButton)
		$MarginContainer/VBoxContainer/Lobbys/VBoxContainer.add_child(HBConteiner)
		print(lobby)

func _button_pressed(code):
	join(code)
