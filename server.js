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
webVars.clients 	= []; // used to track the browser client wsio connections
webVars.remoteSites = []; // used to track the remote site connections
webVars.headNode    = false;



//---------------------------------------------------------------------------Setup requirements to run a script
var script 			= function (file) {
    output = "";
    file   = path.normalize(file); // convert Unix notation to windows
    utils.consolePrint("Launching script " + file, file);
    proc = spawn(file, []);
    proc.stdout.on("data", function (data) {
		utils.consolePrint("stdout: " + data);
		output = output + data;
    });
    proc.stderr.on("data", function (data) {
		utils.consolePrint("script stderr: " + data);
    });
    proc.on("exit", function (code) {
		utils.consolePrint("  child process (script) exited with code " + code);
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
	localAddresses.push(thisHostname);

	utils.debugPrint("Detected network devices: " + Object.keys(networkInterfaces).length);
	for (var devices in networkInterfaces) {
		utils.debugPrint(" " + devices + ":");
		for (var interface = 0; interface < networkInterfaces[devices].length; interface++) {
			utils.debugPrint("    " + networkInterfaces[devices][interface].address);
			localAddresses.push(networkInterfaces[devices][interface].address);
		}
	}
	utils.debugPrint("Detected hostname:" + thisHostname);


	for (var i = 0; i < configFile.remoteSites.length; i++) {
		// If the remote site is not among this computer's addresses then try establish connection.
		if (localAddresses.indexOf(configFile.remoteSites[i].address) !== -1) {
			utils.debugPrint("Remote site " + configFile.remoteSites[i].name
				+ "(" + configFile.remoteSites[i].address + ") is this device");
			webVars.headNode = true;
		} else {
			utils.debugPrint("Attempting connection to remote site:" + configFile.remoteSites[i].address);
			var rsite = configFile.remoteSites[i];
			var protocol = (rsite.useSecureProtocol == true) ? "wss" : "ws";
			var wsURL = protocol + "://" + rsite.address + ":" + configFile.port.toString();
			var remote = new WebSocketIO(wsURL, false, function() {
				manageRemoteConnection(remote, rsite, i);
			});
		}
	}
}

function manageRemoteConnection(remote, site, index) {
	remote.updateRemoteAddress(site.address, configFile.port);

	var clientDescription = {
		clientType: "remoteServer",
		host: os.hostname(),
		port: configFile.port
	};

	remote.onclose(function() {
		utils.consolePrint("Remote server went offline");
		utils.removeArrayElement(webVars.remoteSites, remote);
	});
	remote.on("serverAccepted", function(remotesocket, data) {
		utils.consolePrint("Connected to remote server " + data.host);
	});

	remote.on("consolePrint",     wsRsConsolePrint);
	remote.on("command",        wsRsCommand);

	remote.clientType = "remoteServer";
	webVars.remoteSites.push(remote);
	remote.emit("addClient", clientDescription);

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
	utils.removeArrayElement(webVars.remoteSites, wsio);
	if (wsio.clientType === "remoteServer") {
		utils.consolePrint("Remote site " + wsio.id + " disconnected");
	}
}

// This should be called by any client connection from the webserver page.
function wsAddClient(wsio, data) {
	utils.debugPrint("addClient packet received from:" + wsio.id, "wsio");

	if (data.clientType === "remoteServer") {
		webVars.remoteSites.push(wsio);
		wsio.clientType = "remoteServer";
		utils.consolePrint("Remote server connection from " + data.host);

		// setup listeners
		wsio.on("consolePrint",     wsConsolePrint); // Used mainly for console logging from remotes.
		wsio.emit("serverAccepted", { host: os.hostname() } ); 	// Server responds back, giving OK to send data.

		// Does the server need to respond to remote site commands? Probably not?
		// wsio.on("command",        wsCommand);
	} else if (data.clientType === "webControllerClient") {
		webVars.clients.push(wsio); 		// Good to remember who is connected.
		// setup listeners
		wsio.on("consolePrint",     wsConsolePrint);
		wsio.on("command",        wsCommand);
		wsio.emit("serverAccepted", { host: os.hostname() } ); 	// Server responds back, giving OK to send data.
	} else {
		utils.consolePrint("Unknown client type:" + data.clientType + ". Will not setup additional wsio listeners.");
	}
}













function wsRsConsolePrint(wsio, data) {
	utils.debugPrint("Initiating remote server consolePrint packet");
	wsConsolePrint(wsio, data);
}
function wsConsolePrint(wsio, data) {
	utils.consolePrint(data.message); // assumes there is a message property in the packet.
	data.message = "Server confirms:" + data.message;
	wsio.emit("serverConfirm", data);
}

function wsRsCommand(wsio, data) {
	utils.debugPrint("Initiating remote server command packet");
	wsCommand(wsio, data);
}
function wsCommand(wsio, data) {
	// utils.debugPrint("command packet from:" + wsio.id + ". Contents:" + data.command, "wsio");
	if (data.command.indexOf("console:") === 0) {
		utils.consolePrint(data.command);
	} else {
		var result = commandHandler.handleCommandString(data.command);
		if (result === false) {
			wsio.emit("serverConfirm", {message: ("Unknown command:" + data.command)});
			utils.consolePrint("Discarding unknown command packet:" + data.command);
		} else {
			wsio.emit("serverConfirm", {message: ("Command " + result.commandName + " accepted.") })
			utils.consolePrint("Accepted command packet:" + data.command);
			script(result.path);
		}
	}

	// Send out packet again if head node
	if (webVars.headNode) {
		for (var i = 0; i < webVars.remoteSites.length; i++) {
			webVars.remoteSites[i].emit("command", data);
		}
	}
} // End wsCommand
