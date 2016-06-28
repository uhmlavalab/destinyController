"use strict"

//-----------------------------------------------------------------------------------------------------------------Global vars
var debug;
var wsio;
var beepSound;



//-----------------------------------------------------------------------------------------------------------------main()
function main() {
	debug = layout.debug;
	debugPrint("Main");
	setTitleAndPageBackground();
	populatePage();
	loadDefaultSound();
	initializeWS();
}

function setTitleAndPageBackground() {
	controllerTitle.textContent = layout.title;
}



//-----------------------------------------------------------------------------------------------------------------populatePage()
function populatePage() {
	//configuration needs to be loaded before main, otherwise this will not work.
	var parts = layout.viewParts; //its an array
	for (var i = 0; i < parts.length; i++) {
		if (parts[i].type === "button") {
			createButton(parts[i]);
		} else if (parts[i].type === "group") {
			createGroup(parts[i], i);
		} else {
			console.log("Error building page, unknown type:" + parts[i].type);
		}
	}

} //end populatePage

/* buttons are objects {
	image:
	description:
	action:
}
*/
function createButton(buttonInfo) {
	var rowSeparator = document.createElement("div");
	rowSeparator.className = "row";

	var button = document.createElement("button");
	button.type = "button";
	button.className ="btn btn-primary btn-lg";

	var cog = document.createElement("span");
	cog.className = "glyphicon glyphicon-cog";
	cog["aria-hidden"] = "true";
	button.appendChild(cog);

	button.innerHTML += "&nbsp" + buttonInfo.description; // To put the cog on the left of the description.

	// Only if there is an image specified make space for it.
	if (buttonInfo.image !== undefined) {
		var imageLeft = document.createElement("img");
		imageLeft.src = buttonInfo.image;
		imageLeft.alt = buttonInfo.image;
		imageLeft.className = "img-circle col-xs-1";
		rowSeparator.appendChild(imageLeft);

		button.className += " col-xs-11";
		rowSeparator.appendChild(button);
	} else {
		button.className += " btn-block";
		rowSeparator.appendChild(button);
	}

	// load sound
	if (buttonInfo.sound !== undefined) {
		button.loadedSound = new Audio(buttonInfo.sound);
	}
	button.action = buttonInfo.action;

	button.addEventListener("click", function() {
		if (this.loadedSound !== undefined) {
			debugPrint("specified sound");
			this.loadedSound.play();
		} else {
			debugPrint("default sound");
			beepSound.play();
		}
		buttonClickHandler(this.action);
	});

	contentColumn.appendChild(rowSeparator);
	// add one more to add a space
	rowSeparator = document.createElement("div");
	rowSeparator.className = "row";
	rowSeparator.innerHTML = "&nbsp";
	contentColumn.appendChild(rowSeparator);
} // createButton

/* groups are objects {
	type:
	image:
	description:
	buttons: [
		description:
		action:
	]
}
*/
function createGroup(groupInfo, index) {
	var rowSeparator = document.createElement("div");
	rowSeparator.className = "row";
	contentColumn.appendChild(rowSeparator);

	var wellDiv = document.createElement("div");
	wellDiv.className = "well well-sm col-xs-12";
	rowSeparator.appendChild(wellDiv);

	var groupMarker = document.createElement("button");
	groupMarker.className = "btn btn-success btn-block";
	groupMarker.type = "button";
	groupMarker.setAttribute("data-toggle", "collapse");
	groupMarker.setAttribute("data-target", "#collapseGroupId" + index);
	groupMarker.setAttribute("aria-expanded", "true");
	groupMarker.setAttribute("aria-controls", "collapseGroupId" + index);
	groupMarker.textContent = groupInfo.description;
	wellDiv.appendChild(groupMarker);

	var groupSubset = document.createElement("div");
	groupSubset.className = "collapse";
	groupSubset.id = "collapseGroupId" + index;
	wellDiv.appendChild(groupSubset);

	var gsContainer = document.createElement("div");
	gsContainer.className = "well well-sm";
	groupSubset.appendChild(gsContainer);

	var gscRow = document.createElement("div");
	gscRow.className = "row";
	gsContainer.appendChild(gscRow);

	var gscImageCol = document.createElement("div");
	gscImageCol.className = "col-xs-2";
	gscRow.appendChild(gscImageCol);

	// var gscImageRowContainer = document.createElement("div");
	// gscImageRowContainer.className = "row";
	// gscImageCol.appendChild(gscImageRowContainer);

	var groupImage = document.createElement("img");
	groupImage.src = groupInfo.image;
	groupImage.alt = groupInfo.image;
	groupImage.className = "img-circle";
	groupImage.style.width = "100%";
	gscImageCol.appendChild(groupImage);

	var gscButtonCol = document.createElement("div");
	gscButtonCol.className = "col-xs-10";
	gscRow.appendChild(gscButtonCol);

	for (var i = 0; i < groupInfo.buttons.length; i++) {
		var row = document.createElement("div");
		row.className = "row";
		gscButtonCol.appendChild(row);

		var button = document.createElement("button");
		button.className ="btn btn-primary btn-lg btn-block btn-wrapper";
		var cog = document.createElement("span");
		cog.className = "glyphicon glyphicon-cog";
		cog["aria-hidden"] = "true";
		button.appendChild(cog);
		button.innerHTML += "&nbsp" + groupInfo.buttons[i].description; // To put the cog on the left of the description.
		row.appendChild(button);
		if (groupInfo.buttons[i].sound !== undefined) {
			button.loadedSound = new Audio(groupInfo.buttons[i].sound);
		}
		button.action = groupInfo.buttons[i].action;
		button.addEventListener("click", function() {
			if (this.loadedSound !== undefined) {
				debugPrint("specified sound");
				this.loadedSound.play();
			} else {
				debugPrint("default sound");
				beepSound.play();
			}
			buttonClickHandler(this.action);
		});
	} // for each group button
} // createGroup 

//-----------------------------------------------------------------------------------------------------------------buttonClickHandler()

function buttonClickHandler(action) {
	debugPrint(action, "Button Press");
	wsio.emit("command", {command: action});
}


//-----------------------------------------------------------------------------------------------------------------loadDefaultSound()
function loadDefaultSound() {
	// var audio = new Audio('audio_file.mp3');
	// audio.play();
	beepSound = new Audio('images/computerbeep_5.mp3');
}


//-----------------------------------------------------------------------------------------------------------------debugPrint()
function debugPrint(msg, prefix) {
	if (debug) {
		if (prefix !== undefined) {
			msg = prefix + ">\t\t" + msg;
		}
		msg = "debug:" + msg;
		console.log(msg);
	}
}












