extends Control

var headers = ["Content-Type: application/json"]


func _on_back_pressed() -> void:
	get_tree().change_scene_to_file("res://mode_swiche.tscn")
	
	


func _on_refresh_pressed() -> void:
	var response = $HTTPRequest.request("http://127.0.0.1:8000/explor", headers, HTTPClient.METHOD_GET)


func _on_http_request_request_completed(result: int, response_code: int, headers: PackedStringArray, body: PackedByteArray) -> void:
	var json = JSON.parse_string(body.get_string_from_utf8())
	for lobby in json:
		print(lobby)
