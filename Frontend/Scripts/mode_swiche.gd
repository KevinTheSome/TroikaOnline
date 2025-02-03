extends Control



func _on_back_pressed() -> void:
	get_tree().change_scene_to_file("res://Scenes/main_manu.tscn")


func _on_join_lobby_pressed() -> void:
	get_tree().change_scene_to_file("res://Scenes/join_lobby.tscn")


func _on_make_lobby_pressed() -> void:
	get_tree().change_scene_to_file("res://Scenes/create_lobby.tscn")
