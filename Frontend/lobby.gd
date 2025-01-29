extends Control

var socket = WebSocketPeer.new()
var lobbyInfo : Dictionary
var lobbyCode : String = Global.lobby["code"]
var gameStarted : bool = false
var CardCount : int
var AllCardDict : Dictionary = Global.CARDS



func sendData(gameAction : String, data: Dictionary):
	var dataString = JSON.stringify(data)
	socket.send_text(JSON.stringify({"gameAction": gameAction , "data": dataString}))
	
func setMessage(message:String):
	$Message.text = message
	
func Winner():
	$Game.visible = false
	$Win.visible = true
	get_tree().create_timer(3.0).timeout
	get_tree().change_scene_to_file("res://main_manu.tscn")
	
func Losser():
	$Game.visible = false
	$Loss.visible = true
	get_tree().create_timer(3.0).timeout
	get_tree().change_scene_to_file("res://main_manu.tscn")
	
func Ended():
	$Game.visible = false
	$Ended.visible = true
	get_tree().create_timer(3.0).timeout
	get_tree().change_scene_to_file("res://main_manu.tscn")

func _notification(what):
	if what == NOTIFICATION_WM_CLOSE_REQUEST:
		sendData("Leave",{"token":Global.player["token"] ,"username":Global.player["username"]})
		get_tree().quit()
	
# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	for card in AllCardDict:
		print(card)
		
	if Global.player["token"] == null || Global.player["token"] == "":
		print("You need to log in")
		
	if Global.lobby["code"] == "" || Global.player["token"] == null:
		print("Code is not defined")
	
	var err = socket.connect_to_url("ws://127.0.0.1:8000/ws/" + lobbyCode)
	if err != OK:
		print("Unable to connect")	
		set_process(false)
	else:
		# Wait for the socket to connect.
		await get_tree().create_timer(2).timeout

		# Send data.
		sendData("Login",{"token":Global.player["token"] ,"username":Global.player["username"]})


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:
	# Call this in _process or _physics_process. Data transfer and state updates
	# will only happen when calling this function.
	socket.poll()
	
	if($Game.visible == true):
		if(CardCount <= 0 && CardCount != null):
			$Game/Panel/NewCard.remove_child($Game/Panel/NewCard/Sprite2D)
		$Game/Panel/P1_name.text = Global.player["username"]

	# get_ready_state() tells you what state the socket is in.
	var state = socket.get_ready_state()

	# WebSocketPeer.STATE_OPEN means the socket is connected and ready
	# to send and receive data.
	if state == WebSocketPeer.STATE_OPEN:
		while socket.get_available_packet_count():
			response_handeler(socket.get_packet().get_string_from_utf8())

	# WebSocketPeer.STATE_CLOSING means the socket is closing.
	# It is important to keep polling for a clean close.
	elif state == WebSocketPeer.STATE_CLOSING:
		pass

	# WebSocketPeer.STATE_CLOSED means the connection has fully closed.
	# It is now safe to stop polling.
	elif state == WebSocketPeer.STATE_CLOSED: #add a error message if this is true
		var code = socket.get_close_code()
		print("WebSocket closed with code: %d. Clean: %s" % [code, code != -1])
		set_process(false)

func response_handeler(packet: String):
	var responseObj = JSON.parse_string(packet)
	match responseObj["gameState"]:
		"LobbyUpdate":
			if(responseObj["data"]["type"] == "Login"):
				print(responseObj["data"]["username"] + " Joined the lobby") #run the code when someone joins
				
				print(lobbyInfo)
			else:
				print(responseObj["data"]["username"] + " Left the lobby") #run the code when someone leavs
				lobbyInfo["players"] = responseObj["data"]["username"]
				print(lobbyInfo)
				
				
		"Start":
			$PreGame.visible = false
			$Game.visible = true
			gameStarted = true
			
		"End":
			print("Lobby ended") #Game has ended
			sendData("Leave",{"token":Global.player["token"] ,"username":Global.player["username"]})
			gameStarted = false
			Global.lobby["code"] = ""
			get_tree().change_scene_to_file("res://main_manu.tscn")
			
		"GameTurn":
			print(packet)
			CardCount = responseObj["data"]["deckSize"]
			$Game/Panel/CardCount.text = "Count: " + str(CardCount)
			
		"Error":
			setMessage(responseObj["data"]["message"])
			
			
		"Test":
			print("Test data: " + packet)
			
		_: #Defualt
			print(packet)
	

func _on_button_pressed() -> void:
	sendData("Test", {"test":"test"})
	


func _on_start_pressed() -> void:
	sendData("Start", {"start":"start"})


func _on_end_pressed() -> void:
	sendData("End", {"end":"end"})


func _on_game_turn_test_pressed() -> void:
	sendData("GameTurn", {"username":Global.player["username"],"move":"idk"})


func _on_pause_pressed() -> void:
	if(gameStarted == true):
		$Game.visible = false
		$"Pause manu".visible = true
	else:
		$PreGame.visible = false
		$"Pause manu".visible = true


func _on_back_pressed() -> void:
	if(gameStarted == true):
		$Game.visible = true
		$"Pause manu".visible = false
	else :
		$PreGame.visible = true
		$"Pause manu".visible = false


func _on_leave_pressed() -> void:
	sendData("Leave",{"token":Global.player["token"] ,"username":Global.player["username"]})
	Global.lobby["code"] = ""
	get_tree().change_scene_to_file("res://main_manu.tscn")
