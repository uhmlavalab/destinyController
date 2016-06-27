// ---------------------------------------------------------------------------Imports and var setup
// node built in
var http            = require("http"); // for server
var path            = require("path"); // for file location conversions
var spawn           = require("child_process").spawn; // Associate the spawn function. For script running.
var os              = require("os");
var fs              = require("fs");
// npm required, defined in package.json
var json5           = require("json5");
// var WebSocketIO		= require("websocketio"); 
// required files located in the src folder
var httpServer   	= require("./src/httpServer");
var utils			= require("./src/utils");
var commandHandler  = require("./src/commandHandler")
var WebSocketIO		= require("./src/node-websocket.io.js"); 

// Begin setup
var configFile  = json5.parse(fs.readFileSync("config.json", "utf8"));
global.debug    = configFile.debug ? true : false;
global.commands = configFile.commands;
var webVars			= {};
webVars.port 		= configFile.port;
webVars.httpServer 	= new httpServer(configFile.contentFolder);
webVars.mainServer 	= null;
webVars.wsioServer 	= null;
webVars.clients 	= []; // used to contain the wsio connections



//---------------------------------------------------------------------------Setup requirements to run a script
var script 			= function (file) {
    output = "";
    file   = path.normalize(file); // convert Unix notation to windows
    console.log("Launching script ", file);
    proc = spawn(file, []);
    proc.stdout.on("data", function (data) {
		console.log("stdout: " + data);
		output = output + data;
    });
    proc.stderr.on("data", function (data) {
		console.log("script stderr: " + data);
    });
    proc.on("exit", function (code) {
		console.log("child process exited with code " + code);
    });
} //end script function


//----------------------------------------------------------------------------Start webserver
// create http listener
webVars.mainServer = http.createServer( webVars.httpServer.onrequest ).listen( webVars.port );
utils.consolePrint("Server started, listening on port:" + webVars.port); // only print if http debug is enabled.
// create websocket listener
webVars.wsioServer = new WebSocketIO.Server( { server: webVars.mainServer } );
webVars.wsioServer.onconnection(openWebSocketClient);

// At this point the basic web server is online, but need to connect to the other nodes if necessary.
connectWithDestinyNodes();



function connectWithDestinyNodes() {
	var networkInterfaces = os.networkInterfaces();
	var thisHostname = os.hostname();
	var localAddresses = [];

	utils.debugPrint("Detected network devices: " + Object.keys(networkInterfaces).length);
	for (var devices in networkInterfaces) {
		utils.debugPrint(" " + devices + ":");
		for (var interface = 0; interface < networkInterfaces[devices].length; interface++) {
			utils.debugPrint("    " + networkInterfaces[devices][interface].address);
			localAddresses.push(networkInterfaces[devices][interface].address);
		}
	}
	utils.debugPrint(thisHostname);
	console.dir(thisHostname);
	localAddresses.push(thisHostname);

	for (var i = 0; i < configFile.remoteSites.length; i++) {
		// If the remote site is not among this computer's addresses then try establish connection.
		if (localAddresses.indexOf(configFile.remoteSites[i].address) === -1) {
			console.log("erase me, finish up remote connections");
		} else {
			utils.debugPrint("Remote site " + configFile.remoteSites[i].address + " is this device");
		}
	}
}














//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------WebSocket(ws) related functions 
// Websocket

// This gets activated when ws connections are made to this server.
function openWebSocketClient(wsio) {
	utils.debugPrint( ">Connection from: " + wsio.id + " (" + wsio.clientType + " " + wsio.clientID+ ")", "wsio");
	wsio.onclose(closeWebSocketClient);
	wsio.on("addClient", wsAddClient);
}

// Gets activated when connection is detected as lost. NOTE: detected, not all connection loss is detected.
function closeWebSocketClient(wsio) {
	utils.debugPrint( ">Disconnect" + wsio.id + " (" + wsio.clientType + " " + wsio.clientID+ ")", "wsio");
	utils.removeArrayElement(webVars.clients, wsio);
}

// This should be called by any client connection from the webserver page.
function wsAddClient(wsio, data) {
	utils.debugPrint("addClient packet received from:" + wsio.id, "wsio");
	webVars.clients.push(wsio); 		// Good to remember who is connected.

	// setup listeners
	wsio.on("consoleLog",     wsConsoleLog);
	wsio.on("command",        wsCommand);

	wsio.emit("serverAccepted", {} ); 	// Server responds back, giving OK to send data.
}














function wsConsoleLog(wsio, data) {
	utils.consolePrint(data.message); // assumes there is a message property in the packet.
	data.message = "Server confirms:" + data.message;
	wsio.emit("serverConfirm", data);
}

function wsCommand(wsio, data) {
	utils.debugPrint("command packet from:" + wsio.id + ". Contents:" + data.command, "wsio");

	var result = commandHandler.handleCommandString(data.command);
	if (result === false) {
		wsio.emit("serverConfirm", {message:("Unknown command:" + data.command)});
	} else {
		wsio.emit("serverConfirm", {message:("Command " + result.commandName + " accepted.") })
		script(result.path);
	}

} // End wsCommand
