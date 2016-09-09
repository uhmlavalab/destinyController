

var layout = {
	title: "Destiny",

	audioFiles: [
		"images/227sd.mp3",
		"images/228sd.mp3",
		"images/266sd.mp3",
		"images/273sd.mp3",
		"images/computerbeep_5.mp3",
		"images/displayon.mp3"
	],

	/*
	View parts is an array.
	It contains objects with properties:
		type: 			either "button" or "group".
		image: 			optional. If given it needs full path in quotes.
		description: 	text to display.
		(only for buttons)
		action: 		what it does. Buttons will send strings.
		(only for groups)
		buttons: 		[] an array of objects with properties
						description:
						action:

	See below for examples:
	*/
	viewParts: [
		{
			type: "button",
			description: "Launch Destiny",
			action: "wakeOnLanAll",
		},
		{
			type: "button",
			description: "Shutdown",
			action: "shutdownNow"
		},
		{
			type: "button",
			description: "Sound Test 1",
			sound: "images/227sd.mp3",
			action: ""
		},
		{
			type: "button",
			description: "Sound Test 2",
			sound: "images/228sd.mp3",
			action: ""
		},
		{
			type: "button",
			description: "Sound Test 3",
			sound: "images/266sd.mp3",
			action: ""
		},
		{
			type: "button",
			description: "Sound Test 4",
			sound: "images/273sd.mp3",
			action: ""
		},
		{
			type: "button",
			description: "Sound Test 5",
			sound: "images/displayon.mp3",
			action: ""
		},
		{
			type: "group",
			image: "images/buttonGroup.png",
			description: "Windows Demos",
			buttons: [
				{
					description: "Start Calc",
					action: "Start Calc",
					sound: "images/computerbeep_5.mp3" // optional
				},
				{
					description: "Start Notepad",
					action: "Start Notepad"
				}
			]
		},
		{
			type: "group",
			image: "images/buttonGroup.png",
			description: "Temp Button Storage",
			buttons: [
				{
					description: "Power ON Monitors",
					action: "psPreSufAll",
					params: ["ka", "01"]
				},
				{
					description: "Power OFF Monitors",
					action: "psPreSufAll",
					params: ["ka", "00"]
				},
				{
					description: "Update All Nodejs",
					action: "updateNodejsFromRepo"
				},
			]
		},

	] //end of view parts
};






