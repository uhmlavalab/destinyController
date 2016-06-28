// Global vars in main.js

//--------------------------------------------------------------------------------------------------------------------------Start wsio communcation

function initializeWS() {
	console.log("Initializing client wsio");

	// Create a connection to server
	wsio = new WebsocketIO();
	console.log("Websocket status:" + wsio);
	wsio.open(function() {
		console.log("Websocket opened, ending addClient");
		wsio.emit('addClient', {clientType: "webControllerClient"});
		setupListeners(); 
	});

	wsio.on('close', function (evt) {
		// alert('Lost connection');
	});


} //end initialize


//--------------------------------------------------------------------------------------------------------------------------Start wsio communcation
function setupListeners() {
	wsio.on('serverAccepted', function(data) {
		debugPrint("Connected to server");
	});

	wsio.on('serverConfirm', function(data) {
		debugPrint("serverConfirm: " + data.message);
	});

}



//--------------------------------------------------------------------------------------------------------------------------Start wsio communcation
function sendInbox() {
	var workingDiv = document.getElementById('inbox');
	data = {};
	data.message = workingDiv.value;
	workingDiv.value = "";
	wsio.emit('consoleLog', data);

}


