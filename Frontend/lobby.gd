extends Control

var socket = WebSocketPeer.new()

var lobbyCode = Global.lobby["code"]

func sendData(gameAction : String, data: Dictionary):
	var dataString = JSON.stringify(data)
	socket.send_text(JSON.stringify({"gameAction": gameAction , "data": dataString}))

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
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
		socket.send_text(JSON.stringify({"gameAction": "Login" , "data": lobbyCode}))


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:
	# Call this in _process or _physics_process. Data transfer and state updates
	# will only happen when calling this function.
	socket.poll()

	# get_ready_state() tells you what state the socket is in.
	var state = socket.get_ready_state()

	# WebSocketPeer.STATE_OPEN means the socket is connected and ready
	# to send and receive data.
	if state == WebSocketPeer.STATE_OPEN:
		while socket.get_available_packet_count():
			print("Got data from server: ", socket.get_packet().get_string_from_utf8())

	# WebSocketPeer.STATE_CLOSING means the socket is closing.
	# It is important to keep polling for a clean close.
	elif state == WebSocketPeer.STATE_CLOSING:
		pass

	# WebSocketPeer.STATE_CLOSED means the connection has fully closed.
	# It is now safe to stop polling.
	elif state == WebSocketPeer.STATE_CLOSED:
		# The code will be -1 if the disconnection was not properly notified by the remote peer.
		var code = socket.get_close_code()
		print("WebSocket closed with code: %d. Clean: %s" % [code, code != -1])
		set_process(false) # Stop processing.


func _on_button_pressed() -> void:
	sendData("yes", {"test":"test"})
	