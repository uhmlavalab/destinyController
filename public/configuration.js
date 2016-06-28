

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






