extends Node

#@onready var node_2d: Node2D = get_node("..")
var card1 = preload("res://2_clubs.tscn")
var card2 = preload("res://r_jocker.tscn")


func _ready():
	$HTTPRequest.request_completed.connect(_on_request_completed)
	$HTTPRequest.request("http://localhost:8000")

func _on_request_completed(result, response_code, headers, body):
	var json = JSON.parse_string(body.get_string_from_utf8())
	if (json["card"] == "2_clubs"):
		card1.instantiate()
		#node_2d.add_child(card1)
	else:
		card2.instantiate()
		#node_2d.add_child(card2)
		
	print(json["card"])
