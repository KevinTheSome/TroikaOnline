extends Control

func setMessage(message:String)->void:
	$MarginContainer/VBoxContainer/Message.text = message
	
## Called when the node enters the scene tree for the first time.
func _ready() -> void:
	$gameName.pivot_offset.x = $gameName.size.x /2
	$gameName.pivot_offset.y = $gameName.size.y /2
#
#
## Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:
	if(Global.player["token"] == ""):
		setMessage("Log in before playing :)")
	$gameName.rotation = delta + $gameName.rotation

func _on_play_pressed() -> void:
	get_tree().change_scene_to_file("res://mode_swiche.tscn")



func _on_settings_pressed() -> void:
	get_tree().change_scene_to_file("res://settings_manu.tscn")



func _on_quit_pressed() -> void:
	get_tree().quit()


func _on_profile_pressed() -> void:
	get_tree().change_scene_to_file("res://ProfileSettings_manu.tscn")
