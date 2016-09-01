

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
			description: "Wake On Lan All",
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
			description: "Update All Nodejs",
			action: "updateNodejsFromRepo"
		},
		
		
		
		
		
		{
			type: "button",
			image: "images/tophat.png",
			description: "PS Test - Print prefix suffix",
			action: "psPreSufAll",
			params: ["prefix", "suffix"]
		},
		{
			type: "button",
			image: "images/tophat.png",
			description: "PS Test - One pre suf",
			action: "psPreSufOne",
			params: ["prefix", "suffix", "1"]
		},
		{
			type: "button",
			image: "images/tophat.png",
			description: "PS Test - On Monitor 1",
			action: "psPreSufOne",
			params: ["ka", "01", "1"]
		},
		{
			type: "button",
			image: "images/tophat.png",
			description: "PS Test - Off Monitor 1",
			action: "psPreSufOne",
			params: ["ka", "00", "1"]
		},
		{
			type: "button",
			image: "images/tophat.png",
			description: "Top button",
			action: "console:top button"
		},
		{
			type: "button",
			image: "images/pv.png",
			description: "ParaView",
			sound: "images/computerbeep_5.mp3", // optional
			action: "para view"
		},
		{
			type: "button",
			description: "Mac terminal open here command",
			action: "macOpenHere"
		},
		{
			type: "button",
			image: "images/button.png",
			description: "I am a button",
			action: "4th"
		},
		{
			type: "group",
			image: "images/buttonGroup.png",
			description: "Windows Specific Demo",
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






