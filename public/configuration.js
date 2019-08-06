

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
			description: "Point Clouds",
			sound: "images/power.mp3",
			action: "destinyTest:PointClouds_Vive",
			params: ["destinyXMLConfig:true:true:true"],
			infoLines: [
				"Developer: Ryan Theriot",
				"BS Computer Science"
				],
			infoPics: ["images/ffs.png"]
		},
		{
			type: "button",
			buttonImage: "images/blue.png",
			description: "International Space Station",
			sound: "images/power.mp3",
			action: "destinyTest:Iss_Vive",
			params: ["destinyXMLConfig:true:true:true"],
			infoLines: [
				"Developer: Noel Kawano",
				"MS Computer Engineer",
				"<br>",
				"International Space Station Model",
				"Provided by NASA"
				],
			infoPics: ["images/iss.png"]
		},
		{
			type: "button",
			buttonImage: "images/blue.png",
			description: "Galaxies",
			sound: "images/power.mp3",
			action: "destinyTest:Tully_Vive",
			params: ["destinyXMLConfig:true:true:true"],
			infoLines: [
				"Developer: Noel Kawano",
				"MS Computer Engineer",
				"<br>",
				"Galaxy Data Provided by Brent Tully",
				"UHM Institute for Astronomy",
				],
			infoPics: ["images/milkyway.png"]
		},
		// {
		// 	type: "button",
		// 	buttonImage: "images/blue.png",
		// 	description: "Molecule Simulation",
		// 	sound: "images/power.mp3",
		// 	action: "destinyTest:molecule",
		// 	params: ["destinyXMLConfig:true:true:true"],
		// 	infoLines: [
		// 		"Data provided by",
		// 		"UIC Department of Chemistry's Petr Kral Research Group,",
		// 		"and University of Massachusetts, Amhersts's Vincent M. Rotello Research Group"
		// 		]
		// },
		{
			type: "button",
			buttonImage: "images/blue.png",
			description: "Strange Attractors",
			sound: "images/power.mp3",
			action: "destinyTest:Attractors_Vive",
			params: ["destinyXMLConfig:true:true:true"],
			infoLines: [
				"Developer: Noel Kawano",
				"MS Computer Engineer",
				"<br>",
				"Consulted with Monique Chyba",
				"UHM Mathematics Department",
				],
			infoPics: ["images/Attractor.png"]
		},
		{
			type: "button",
			buttonImage: "images/blue.png",
			description: "Earthquake",
			sound: "images/power.mp3",
			action: "destinyTest:eq",
			params: ["destinyXMLConfig:true:true:true"],
			infoLines: [
				"Developer: Jason Leigh",
				"Director - LAVA",
				"University of Hawaiʻi at Mānoa",
				"Director Emeritus- Electronic Visualization Lab",
				"University of Illinois at Chicago",
				"<br>",
				"Earthquake Data Provided by NOAA",
				],
			infoPics: ["images/eq.png"]
		},
		{
			type: "button",
			buttonImage: "images/blue.png",
			description: "Star Wars Dog Fight",
			sound: "images/beep.mp3",
			action: "destinyTest:StarWarsDogFight_Vive",
			params: ["destinyXMLConfig:true:true:true"],
			infoLines: [
				"Developer: Noel Kawano",
				"MS Computer Engineer"
				],
			infoPics: [""]
		},
		// {
		// 	type: "button",
		// 	buttonImage: "images/blue.png",
		// 	description: "Tatooine",
		// 	sound: "images/beep.mp3",
		// 	action: "destinyTest:tatooine",
		// 	params: ["destinyXMLConfig:true:true:true"],
		// 	infoLines: [
		// 		"Developer: Ryan Theriot",
		// 		"MS Computer Science"
		// 		],
		// 	infoPics: [""]
		// },
		{
			type: "button",
			buttonImage: "images/blue.png",
			description: "Google Earth",
			sound: "images/beep.mp3",
			action: "googleearth",
			params: [""],
			infoLines: [
				"Developer: Google",
				],
			infoPics: ["images/googleearth.png"]
		},
		{
			type: "button",
			buttonImage: "images/orange.png",
			description: "Close Last Launched App",
			action: "destinyKillApps:",
			params: []
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
