extends Node

var player : Dictionary = {"username": "" , "token": "" , "wins": 0 ,"losses":0}
var lobby : Dictionary = {"code":""}

const CARDS = {
	"":["res://Playing Cards/back.png"], #2
	"2C":["res://Playing Cards/2C.png"], #2
	"2D":["res://Playing Cards/2D.png"],
	"2H":["res://Playing Cards/2H.png"],
	"2S":["res://Playing Cards/2S.png"],
	"3C":["res://Playing Cards/3C.png"], #3
	"3D":["res://Playing Cards/3D.png"],
	"3H":["res://Playing Cards/3H.png"],
	"3S":["res://Playing Cards/3S.png"],
	"4C":["res://Playing Cards/4C.png"], #4
	"4D":["res://Playing Cards/4D.png"],
	"4H":["res://Playing Cards/4H.png"],
	"4S":["res://Playing Cards/4S.png"],
	"5C":["res://Playing Cards/5C.png"], #5
	"5D":["res://Playing Cards/5D.png"],
	"5H":["res://Playing Cards/5H.png"],
	"5S":["res://Playing Cards/5S.png"], 
	"6C":["res://Playing Cards/6C.png"], #6
	"6D":["res://Playing Cards/6D.png"],
	"6H":["res://Playing Cards/6H.png"],
	"6S":["res://Playing Cards/6S.png"],
	"7C":["res://Playing Cards/7C.png"], #7
	"7D":["res://Playing Cards/7D.png"],
	"7H":["res://Playing Cards/7H.png"],
	"7S":["res://Playing Cards/7S.png"],
	"8C":["res://Playing Cards/8C.png"], #8
	"8D":["res://Playing Cards/8D.png"],
	"8H":["res://Playing Cards/8H.png"],
	"8S":["res://Playing Cards/8S.png"],
	"9C":["res://Playing Cards/9C.png"], #9
	"9D":["res://Playing Cards/9D.png"],
	"9H":["res://Playing Cards/9H.png"],
	"9S":["res://Playing Cards/9S.png"],
	"10C":["res://Playing Cards/0C.png"], #10
	"10D":["res://Playing Cards/0D.png"],
	"10H":["res://Playing Cards/0H.png"],
	"10S":["res://Playing Cards/0S.png"],
	"JC":["res://Playing Cards/JC.png"], #J
	"JD":["res://Playing Cards/JD.png"],
	"JH":["res://Playing Cards/JH.png"],
	"JS":["res://Playing Cards/JS.png"],
	"QC":["res://Playing Cards/QC.png"], #Q
	"QD":["res://Playing Cards/QD.png"],
	"QH":["res://Playing Cards/QH.png"],
	"QS":["res://Playing Cards/QS.png"],
	"KC":["res://Playing Cards/KC.png"], #K
	"KD":["res://Playing Cards/KD.png"],
	"KH":["res://Playing Cards/KH.png"],
	"KS":["res://Playing Cards/KS.png"],
	"AC":["res://Playing Cards/AC.png"], #A
	"AD":["res://Playing Cards/AD.png"],
	"AH":["res://Playing Cards/AH.png"],
	"AS":["res://Playing Cards/AS.png"],
	
}
