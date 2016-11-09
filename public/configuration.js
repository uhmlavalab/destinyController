

var config = {
	title: "Destiny",
	debug: false,

	audioFiles: [
		"images/227sd.mp3",
		"images/228sd.mp3",
		"images/266sd.mp3",
		"images/273sd.mp3",
		"images/beep.mp3",
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
			buttonImage: "images/green.png",
			description: "Launch Destiny",
			sound: "images/power.mp3",
			action: "wakeOnLanAll",
		},
		{
			type: "button",
			buttonImage: "images/blue.png",
			description: "Molecule Simulation",
			action: "destinyTest:molecule",
			params: ["destinyXMLConfig:true:true:true"]
		},
		{
			type: "button",
			buttonImage: "images/blue.png",
			description: "Attractors",
			action: "destinyTest:attractors",
			params: ["destinyXMLConfig:true:true:true"]
		},
		{
			type: "button",
			buttonImage: "images/blue.png",
			description: "Waiopae",
			action: "destinyTest:waipiopools",
			params: ["destinyXMLConfig:true:true:true"]
		},
		{
			type: "button",
			buttonImage: "images/blue.png",
			description: "Autumn Breeze",
			action: "destinyTest:autumnbreeze",
			params: ["destinyXMLConfig:true:true:true"]
		},
		{
			type: "button",
			buttonImage: "images/orange.png",
			description: "Shutdown",
			sound: "images/shutdown.mp3",
			action: "shutdownNow"
		},
		{
			type: "button",
			buttonImage: "images/brown.png",
			description: "Admin",
			action: "link:admin.html"
		},
		{
			type: "group",
			image: "images/buttonGroup.png",
			description: "Windows Demos",
			buttons: [
				{
					description: "Start Calc",
					action: "Start Calc",
					sound: "images/beep.mp3" // optional
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






