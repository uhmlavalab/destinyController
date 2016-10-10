"use strict"

//-----------------------------------------------------------------------------------------------------------------Global vars
var debug;
var wsio;
var beepSound;
var displayConnectionSound;
var destinyAwaitsSound;

var nodeCount = 8;
var nodeNamePrefix = "Kanaloa";
var sizes = {};
var imageData = {};


//-----------------------------------------------------------------------------------------------------------------main()
function main() {
	debug = config.debug;
	debugPrint("Main");

	detectSizes();
	loadDefaultSound();
	fitBanner();
	fitButtons(); // Button creations happens in a call here AFTER sizing is calculated.
	fitCredits();

	initializeWS();
}

function detectSizes() {
	sizes.width  = document.body.clientWidth;
	sizes.height = window.innerHeight;
	sizes.h20p   = sizes.height * 0.2;
	sizes.h10p   = sizes.height * 0.1;
	sizes.h08p   = sizes.height * 0.08;
	sizes.h90p   = sizes.height * 0.9;
	sizes.w10p   = sizes.width * 0.1;
	sizes.w90p   = sizes.width * 0.9;

	sizes.xCenter = document.body.clientWidth/2;
	sizes.yCenter = window.innerHeight/2;

	debugPrint("sizes.width:"  + sizes.width);
	debugPrint("sizes.height:" + sizes.height);
	debugPrint("sizes.h10p:"   + sizes.h10p);
	debugPrint("sizes.w10p:"   + sizes.w10p);
}

function fitBanner() {
	var h10pWidth  = sizes.h20p / bannerImage.naturalHeight * bannerImage.naturalWidth;
	var w90pHeight = sizes.w90p / bannerImage.naturalWidth * bannerImage.naturalHeight;
	
	var widthExceeded = false, heightExceeded = false;

	if (h10pWidth > sizes.w90p) { widthExceeded = true; }
	if (w90pHeight > sizes.h20p) { heightExceeded = true; }

	bannerImage.style.position = "absolute";

	if (!widthExceeded) {
		bannerImage.height = sizes.h20p;
		bannerImage.style.left = (sizes.xCenter - h10pWidth / 2) + "px";
		bannerDiv.style.height = sizes.h20p + "px";
		debugPrint("Using h10p limiter");
	} else if (!heightExceeded) {
		bannerImage.width = sizes.w90p;
		bannerImage.style.left = (sizes.xCenter - sizes.w90p / 2) + "px";
		bannerDiv.style.height = w90pHeight + "px";
		debugPrint("Using w90p limiter");
	} else {
		console.print("width / height problems");
	}
}


/*
480 left most point to bottom most right point

265 inner portion that doesn't over lap
40 rough estimate of gap

*/
function fitConnectionStatusGlyphs() {
	imageData.onGlyph = new Image();
	imageData.onGlyph.onload = function() {
		var totalNaturalWidth = nodeCount * 480 + ((nodeCount - 1) * 40) + 200;
		var widthRatio = imageData.buttonWidth / totalNaturalWidth;
		imageData.glyphWidth = widthRatio * 689;
		imageData.glyphWidthRatio = widthRatio;

		addGlyphsToMenu(widthRatio);
	}
	imageData.onGlyph.src = "images/cluster-on.png";
}

function addGlyphsToMenu() {
	var offGlyphPath = "images/cluster-off.png";
	var onGlyphPath  = "images/cluster-on.png";

	var xPos = window.innerWidth / 2 - imageData.buttonWidth / 2;

	var onGlyph, offGlyph;

	for (var i = 0; i < nodeCount; i++) {
		onGlyph      = new Image();
		onGlyph.src  = onGlyphPath;
		onGlyph.id   = "nodeOnGlyph" + i; // id
		offGlyph     = new Image();
		offGlyph.src = offGlyphPath;
		offGlyph.id  = "nodeOffGlyph" + i; // id

		setGlyphProperties(onGlyph, xPos);
		setGlyphProperties(offGlyph, xPos);

		onGlyph.style.visibility = "hidden";

		allConnectionStatusGlyphs.appendChild(onGlyph);
		allConnectionStatusGlyphs.appendChild(offGlyph);

		debugPrint("glyph xPos:" + xPos + " will get the following applied: " + (520 * imageData.glyphWidthRatio));
		debugPrint("what is imageData.glyphWidthRatio" + (imageData.glyphWidthRatio));
		xPos += (520 * imageData.glyphWidthRatio);
	}

	allConnectionStatusGlyphs.style.height = sizes.h08p + "px";
	
}

function setGlyphProperties(glyphImage, xPos){
	glyphImage.style.position = "absolute";
	glyphImage.style.left = xPos + "px";
	glyphImage.style.height = imageData.buttonHeight + "px";
	glyphImage.style.width = imageData.glyphWidth + "px";
}

function fitButtons() {
	imageData.greenButton = new Image();
	imageData.greenButton.onload = function() {
		var h10pWidth  = sizes.h08p / imageData.greenButton.naturalHeight * imageData.greenButton.naturalWidth;
		var w90pHeight = sizes.w90p / imageData.greenButton.naturalWidth * imageData.greenButton.naturalHeight;
		
		var widthExceeded = false, heightExceeded = false;

		// if the width is less 
		if (h10pWidth <= sizes.w90p) {
			imageData.buttonHeight = sizes.h08p;
			imageData.buttonWidth = h10pWidth;
		}
		else {
			imageData.buttonHeight = w90pHeight;
			imageData.buttonWidth = sizes.w90p;
		}

		debugPrint("button width and height: " + imageData.buttonWidth + "," + imageData.buttonHeight);


		// now create buttons and glyphs since they are dependent upon button size
		addButtonsToMenu();
		fitConnectionStatusGlyphs();

	}
	imageData.greenButton.src = "images/green.png";

	imageData.orangeButton = new Image();
	imageData.orangeButton.src = "images/orange.png";
}

function addButtonsToMenu() {
	for (var i = 0; i < config.viewParts.length; i++) {
		if (config.viewParts[i].type == "button") {
			makeButton(config.viewParts[i]);
		}
	}
}

function makeButton(configEntry) {
	var textHeightRatio = 0.5;
	var textTopOffset   = (1 - textHeightRatio) / 2;

	var bDiv      = document.createElement("div");
	var bImage    = new Image();
	var bTextDiv  = document.createElement("div");
	var bClickDiv = document.createElement("div");

	bImage.src            = configEntry.buttonImage;
	bImage.width          = imageData.buttonWidth;
	bImage.height         = imageData.buttonHeight;
	bImage.style.position = "relative";
	bImage.style.left     = (document.body.clientWidth / 2 - bImage.width / 2) + "px";
	// bImage.style.top      = "0px";
	bImage.style.zIndex   = 1;
	bDiv.appendChild(bImage);

	bTextDiv.textContent     = configEntry.description;
	bTextDiv.className       += " fontTitillium"
	bTextDiv.style.position  = "relative";
	// bTextDiv.style.fontFamily = "Bank Gothic"; // not part of standard browsers
	bTextDiv.style.fontSize  = imageData.buttonHeight * textHeightRatio + "px";
	bTextDiv.style.color = "white";
	bTextDiv.style.top       = (-1 * imageData.buttonHeight + imageData.buttonHeight * textTopOffset / 3) + "px"; //(-1 * imageData.buttonHeight) + "px"; //(-1 * imageData.buttonHeight - imageData.buttonHeight * textTopOffset) + "px";
	bTextDiv.style.left     = "0px";
	bTextDiv.style.textAlign = "center";
	bTextDiv.style.width     = sizes.width + "px";
	bTextDiv.style.height    = bImage.height + "px";
	bTextDiv.style.zIndex    = 2;
	bDiv.appendChild(bTextDiv);

	// bClickDiv.style.border = "1px solid black";
	bClickDiv.style.position = "relative";
	bClickDiv.style.width    = bImage.width + "px";
	bClickDiv.style.height   = bImage.height + "px";
	bClickDiv.style.left     = (document.body.clientWidth / 2 - bImage.width / 2) + "px";
	bClickDiv.style.top      = (-1 * (imageData.buttonHeight * textTopOffset/2) + -2 * imageData.buttonHeight) + "px";
	//bClickDiv.style.background = "rgba(255, 255, 0, 0.9)";
	bClickDiv.style.zIndex = 3;
	bDiv.appendChild(bClickDiv);

	// load sound
	if (configEntry.sound !== undefined) {
		bClickDiv.loadedSound = new Audio(configEntry.sound);
	}
	bClickDiv.action = configEntry.action;
	bClickDiv.params = configEntry.params;
	bClickDiv.addEventListener("click", function() {
		if (this.loadedSound !== undefined) {
			this.loadedSound.play();
		} else {
			beepSound.play();
		}
		buttonClickHandler(this.action, this.params);
	});

	//bDiv.style.textAlign = "center";
	// bDiv.style.width  = document.body.clientWidth + "px";
	bDiv.style.height = sizes.h08p + "px";
	allButtonsContainer.appendChild(bDiv);

}

function fitCredits() {
	var creditImage = new Image();
	creditImage.onload = function() {
		creditImage.width = sizes.w90p;
	};
	creditHolder.appendChild(creditImage);
	creditImage.src = "images/logos.png";
	creditImage.style.bottom = "0px";
}
























//-----------------------------------------------------------------------------------------------------------------buttonClickHandler()

/*
data is: {
	names 	string with hostnames separated by |
}



*/
function updateNodeStatus(data) {
	// create an array with false entries for each node
	var arrayCheck = [];
	for ( var i = 0; i < nodeCount; i++) {
		arrayCheck.push(false);
	}
	// separate out connected hostnames, if it has the noted prefix with number, then set that array position to true.
	var hostNamesFromServer = data.names.split("|");
	for (var i = 0; i < hostNamesFromServer.length; i++) {
		for (var n = 1; n <= nodeCount; n++) {
			if (hostNamesFromServer[i].indexOf(nodeNamePrefix + n) != -1) {
				arrayCheck[n - 1] = true;
			}
		}
	}

	var nsiButton, nsiIcon, onGlyph, offGlyph;
	var okCount = 0;
	for ( var i = 0; i < arrayCheck.length; i++) {
		onGlyph = document.getElementById("nodeOnGlyph" + i);
		offGlyph = document.getElementById("nodeOffGlyph" + i);
		if (arrayCheck[i]) {
			onGlyph.style.visibility = "visible";
			offGlyph.style.visibility = "hidden";
			okCount++;
		} else {
			onGlyph.style.visibility = "hidden";
			offGlyph.style.visibility = "visible";
		}
	}
	if (okCount == nodeCount) {
		destinyAwaitsSound.play();
	}
	else {
		displayConnectionSound.play();
	}
}



//-----------------------------------------------------------------------------------------------------------------buttonClickHandler()

function buttonClickHandler(action, paramArray) {
	debugPrint(action, "Button Press");
	if (action.indexOf("link:") != -1) {
		var linkLocation = action.substring(5);
		window.location = linkLocation;
	}
	wsio.emit("command", {command: action, paramArray:paramArray});
	alert("Command sent");
}


//-----------------------------------------------------------------------------------------------------------------loadDefaultSound()
function loadDefaultSound() {
	// var audio = new Audio('audio_file.mp3');
	// audio.play();
	beepSound = new Audio('images/beep.mp3');
	destinyAwaitsSound = new Audio('images/awaits.mp3');
	displayConnectionSound = new Audio('images/273sd.mp3');
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












