extends Control



func _on_back_pressed() -> void:
	get_tree().change_scene_to_file("res://main_manu.tscn")


func _on_join_lobby_pressed() -> void:
	get_tree().change_scene_to_file("res://join_lobby.tscn")


func _on_make_lobby_pressed() -> void:
	get_tree().change_scene_to_file("res://create_lobby.tscn")
