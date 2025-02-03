extends Control
var lUsername
var rUsername
var lPassword
var rPassword
var rPasswordConfirme
var pToken
#var json = JSON.stringify()
var headers = ["Content-Type: application/json"]

func debugPrint(veriable) -> void:
	pass

func printToMessage(veriable:String) -> void:
	$MarginContainer/VBoxContainer/Message.text = veriable

func _on_http_request_request_completed(result: int, response_code: int, headers: PackedStringArray, body: PackedByteArray) -> void:
	var json = JSON.parse_string(body.get_string_from_utf8())
	print(body.get_string_from_utf8())
	if (json["message"] == "User created"):
		printToMessage("User was created you can now log in")
	elif (json["message"] == "User found"):
		printToMessage("User logged in")
		pToken = json["token"]
		Global.player["token"] = json["token"]
		Global.player["username"] = json["username"]
		Global.player["wins"] = json["wins"]
		Global.player["losses"] = json["losses"]
		debugPrint("Token: " + pToken)
	else:
		printToMessage("There was a error: " + json["message"])

func _on_back_pressed() -> void:
	get_tree().change_scene_to_file("res://Scenes/main_manu.tscn")


func _on_register_pressed() -> void:
	var response = $HTTPRequest.request("http://127.0.0.1:8000/signup", headers, HTTPClient.METHOD_POST,JSON.stringify({"username": rUsername , "password": rPassword , "passwordConfirme" : rPasswordConfirme}))


func _on_l_username_text_changed() -> void:
	lUsername = $MarginContainer/VBoxContainer/VBoxContainer/lUsername.text
	debugPrint("lUsername: " + lUsername)
	
func _on_l_password_text_changed() -> void:
	lPassword = $MarginContainer/VBoxContainer/VBoxContainer/lPassword.text
	debugPrint("lPassword: " + lPassword)


	

func _on_login_pressed() -> void:
	var response = $HTTPRequest.request("http://127.0.0.1:8000/signin", headers, HTTPClient.METHOD_POST,JSON.stringify({"username": lUsername , "password": lPassword}))
	debugPrint(response)


func _on_r_password_text_changed() -> void:
	rPassword = $MarginContainer/VBoxContainer/VBoxContainer2/HBoxContainer/rPassword.text
	debugPrint("rPassword: " + rPassword)


func _on_r_password_confirm_text_changed() -> void:
	rPasswordConfirme = $MarginContainer/VBoxContainer/VBoxContainer2/HBoxContainer/rPasswordConfirm.text
	debugPrint("rPasswordCon: " + rPasswordConfirme)
	

func _on_r_username_text_changed() -> void:
	rUsername = $MarginContainer/VBoxContainer/VBoxContainer2/rUsername.text
	debugPrint("rUsername: " + rUsername)
