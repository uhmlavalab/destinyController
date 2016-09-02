

var layout = {
	title: "I'm your Density, I mean Destiny... controller",

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
			image: "images/tophat.png",
			description: "Launch Destiny",
			action: "wakeOnLanAll"
		},
		{
			type: "button",
			image: "images/tophat.png",
			description: "Shutdown",
			action: "shutdownNow"
		},
		{
			type: "button",
			image: "images/tophat.png",
			description: "Power ON Monitors",
			action: "psPreSufAll",
			params: ["ka", "01"]
		},
		{
			type: "button",
			image: "images/tophat.png",
			description: "Power OFF Monitors",
			action: "psPreSufAll",
			params: ["ka", "00"]
		},
		
		
		{
			type: "button",
			image: "images/tophat.png",
			description: "Update All Nodejs",
			action: "updateNodejsFromRepo"
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

	] //end of view parts
};






