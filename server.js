// ---------------------------------------------------------------------------Imports and var setup
// node built in
var http = require("http"); // for server
var path = require("path"); // for file location conversions
var spawn = require("child_process").spawn; // Associate the spawn function. For script running.
// var spawnSync       = require("child_process").spawnSync;
var os = require("os");
var fs = require("fs");
// npm required, defined in package.json
var json5 = require("json5");
var xml2js = require('xml2js');
// var WebSocketIO		= require("websocketio");
// required files located in the src folder
var httpServer = require("./src/httpServer");
var utils = require("./src/utils");
var commandHandler = require("./src/commandHandler");
var WebSocketIO = require("./src/node-websocket.io.js");



// Begin setup
var configFile = json5.parse(fs.readFileSync("config.json", "utf8"));
global.debug = configFile.debug ? true : false;
global.commands = configFile.commands;
var webVars = {};
webVars.port = configFile.port;
webVars.httpServer = new httpServer(configFile.contentFolder);
webVars.mainServer = null;
webVars.wsioServer = null;
webVars.clients = []; // used to track the browser client wsio connections
webVars.remoteServers = []; // used to track the remote site connections
webVars.headNode = false;
webVars.reconnectInfo = {};
webVars.lastExecutedFile = null;



global.originalConsoleLog = console.log;

console = {};
console.log = function(entry) {
    fs.appendFile("./log.txt", entry + "\n");
    global.originalConsoleLog(entry);
}
global.logFile = fs.openSync("./log.txt", "w");

process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
});




//---------------------------------------------------------------------------Setup requirements to run a script
var script = function(file, paramArray) {
        // If the file doesn't exist, don't try to execute it. If not head node, report back to put all error messages in one place.
        if (!utils.doesFileExist(file)) {
            utils.consolePrint("Unable to launch script, file doesn't exist" + file);
            if (!webVars.headNode && webVars.remoteServers.length > 0) {
                webVars.remoteServers[0].emit("serverConfirm", {
                    message: ("File doesn't exist:" + file),
                    host: os.hostname(),
                    status: "error"
                });
            }
            return;
        }
        output = "";
        file = path.normalize(file); // convert Unix notation to windows
        utils.consolePrint("  Launching script " + file, file);
        try {
            proc = spawn(file, paramArray);
            proc.stdout.on("data", function(data) {
                utils.consolePrint("  script stdout: " + data);
            });
            proc.stderr.on("data", function(data) {
                utils.consolePrint("  script stderr: " + data);
            });
            proc.on("exit", function(code) {
                utils.consolePrint("  child process (script) exited with code " + code);
            });
        } catch (e) {
            utils.consolePrint("Error with script:" + e);
            if (!webVars.headNode) {
                webVars.remoteServers[0].emit("serverConfirm", {
                    message: ("Error with script execution:" + e),
                    host: os.hostname(),
                    status: "error"
                });
            }
        }
    } //end script function



//----------------------------------------------------------------------------Start webserver
// create http listener
webVars.mainServer = http.createServer(webVars.httpServer.onrequest).listen(webVars.port);
utils.consolePrint("");
utils.consolePrint(""); // make some space
utils.consolePrint("");

utils.consolePrint("Server started, listening on port:" + webVars.port); // only print if http debug is enabled.
// create websocket listener
webVars.wsioServer = new WebSocketIO.Server({ server: webVars.mainServer });
webVars.wsioServer.onconnection(openWebSocketClient);

// At this point the basic web server is online, but need to connect to the other nodes if necessary.
connectToDestinyHeadNode();












//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
function connectToDestinyHeadNode() {
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
    webVars.thisHostname = thisHostname;
    if (thisHostname.indexOf("analoa") > 0) {
        webVars.thisHostnameNumber = thisHostname.substring(thisHostname.indexOf("loa") + 3).trim();
    } else {
        webVars.thisHostnameNumber = "";
    }


    utils.debugPrint("Detected hostname number:" + webVars.thisHostnameNumber);


    // If the remote site is not among this computer's addresses then try establish connection.
    if (localAddresses.indexOf(configFile.remoteSite.address) !== -1) {
        utils.debugPrint("Remote site " + configFile.remoteSite.name +
            "(" + configFile.remoteSite.address + ") is this device");
        utils.consolePrint("This device is headNode");
        webVars.headNode = true;
    } else {
        utils.consolePrint("This device is a slave node");
        var rsite = configFile.remoteSite;
        webVars.reconnectInfo.remoteServer = rsite;
        webVars.reconnectInfo.protocol = (rsite.useSecureProtocol == true) ? "wss" : "ws";
        webVars.reconnectInfo.wsURL = webVars.reconnectInfo.protocol + "://" + rsite.address + ":" + configFile.port.toString();

        attemptConnectionToRemoteServer("First attempt");

    }

}

function attemptConnectionToRemoteServer(otherInfo) {
    utils.consolePrint("Attempting connection to remote site:" + configFile.remoteSite.address);
    var remote = new WebSocketIO(webVars.reconnectInfo.wsURL, false,
        // On connect
        function() {
            manageRemoteConnection(remote, webVars.reconnectInfo.remoteServer);
        },
        // On fail activate this function, which is try again later
        function(err) {
            utils.debugPrint("Connection to headNode(" + webVars.reconnectInfo.wsURL + ") failed...");
            if (otherInfo !== undefined) {
                utils.consolePrint("Initial connection attempt failed, will retry every 5 seconds.");
            }
            setTimeout(attemptConnectionToRemoteServer, 5000);
        }
    );
}

function manageRemoteConnection(remote, site) {
    utils.debugPrint("Connection established with head node, " + webVars.reconnectInfo.wsURL);
    remote.updateRemoteAddress(site.address, configFile.port);

    var clientDescription = {
        clientType: "remoteServer",
        host: os.hostname(),
        port: configFile.port
    };

    remote.onclose(function() {
        utils.consolePrint("Remote server went offline");
        utils.removeArrayElement(webVars.remoteServers, remote);
        setTimeout(attemptConnectionToRemoteServer, 5000);
    });
    remote.on("serverAccepted", function(remotesocket, data) {
        utils.consolePrint("Connected to remote server " + data.host);
    });

    remote.on("consolePrint", wsRsConsolePrint);
    remote.on("command", wsRsCommand);
    remote.on("serverConfirm", function(wsio, data) { /* currently discards */ });
    // remote.on("serverConfirm", function(wsio, data) { /* currently discards */ });

    remote.clientType = "remoteServer";
    webVars.remoteServers.push(remote);

    setTimeout(function() {
        remote.emit("addClient", clientDescription);
    }, 500);
}










//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------WebSocket(ws) related functions
// Websocket

// This gets activated when ws connections are made to this server.
function openWebSocketClient(wsio) {
    utils.debugPrint(">Connection from: " + wsio.id + " (" + wsio.clientType + " " + wsio.clientID + ")", "wsio");
    wsio.onclose(closeWebSocketClient);
    wsio.on("addClient", wsAddClient);
}

// Gets activated when connection is detected as lost. NOTE: detected, not all connection loss is detected.
function closeWebSocketClient(wsio) {
    utils.debugPrint(">Disconnect" + wsio.id + " (" + wsio.clientType + " " + wsio.clientID + ")", "wsio");
    utils.removeArrayElement(webVars.clients, wsio);
    utils.removeArrayElement(webVars.remoteServers, wsio);
    if (wsio.clientType === "remoteServer") {
        utils.consolePrint("Remote site " + wsio.id + " disconnected");

        createAndSendNodeCountUpdate(); // notify webclients if a node disconnects.
    }
}

// This should be called by any client connection from the webserver page.
function wsAddClient(wsio, data) {
    utils.debugPrint("addClient packet received from:" + wsio.id, "wsio");

    if (data.clientType === "remoteServer") {
        wsio.hostNameString = data.host;
        webVars.remoteServers.push(wsio);
        wsio.clientType = "remoteServer";
        utils.consolePrint("Remote server connection from " + data.host);

        // setup listeners
        wsio.on("consolePrint", wsConsolePrint); // Used mainly for console logging from remotes.
        wsio.on("serverConfirm", wsServerConfirm); // Nodes respond back.
        wsio.emit("serverAccepted", { host: os.hostname() }); // Server responds back, giving OK to send data.

        createAndSendNodeCountUpdate("remoteServer");

        // Does the server need to respond to remote site commands? Probably not?
        // wsio.on("command",        wsCommand);
    } else if (data.clientType === "webControllerClient") {
        webVars.clients.push(wsio); // Good to remember who is connected.
        // setup listeners
        wsio.on("consolePrint", wsConsolePrint);
        wsio.on("command", wsCommand);
        wsio.emit("serverAccepted", { host: os.hostname() }); // Server responds back, giving OK to send data.

        var tempWsio = wsio;
        setTimeout(createAndSendNodeCountUpdate, 2000);
        setTimeout(function() {
            createAndSendFileListUpdate(tempWsio);
        }, 2000);

    } else {
        utils.consolePrint("Unknown client type:" + data.clientType + ". Will not setup additional wsio listeners.");
    }
}


function createAndSendNodeCountUpdate(clientType) {
    var allHn = "";
    for (var i = 0; i < webVars.remoteServers.length; i++) {
        allHn += webVars.remoteServers[i].hostNameString + "|";
    }
    for (var i = 0; i < webVars.clients.length; i++) {
        webVars.clients[i].emit("nodeCountUpdate", { names: allHn });
    }

    // if all 8 kanaloas connect?
    if (clientType == "remoteServer" && webVars.remoteServers.length >= 8) {
        for (var i = 0; i < webVars.remoteServers.length; i++) {
            webVars.remoteServers[i].emit("command", { command: "wallpaperChrome", paramArray: ["kanaloaId"] });
        }
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
    utils.debugPrint("Initiating remote server command packet " + data.command);
    wsCommand(wsio, data);
}

function wsCommand(wsio, data) {
    // utils.debugPrint("command packet from:" + wsio.id + ". Contents:" + data.command, "wsio");
    if (data.command.indexOf("console:") === 0) {
        utils.consolePrint(data.command);
    } else if ((data.command.indexOf("destinyTestTracking:") != -1) || (data.command.indexOf("destinyTest:") != -1)) {
        startDestinyNodeFiles(wsio, data);
    } else if ((data.command.indexOf("unrealTest:") != -1)) {
		startUnrealTest(wsio, data);
	} else if (data.command.indexOf("destinyKillApps:") != -1) {
        killLastStartedApp(wsio, data);
    } else if (data.command.indexOf("destinyXMLConfig:") != -1) {
        editXMLFile(wsio, data);
    } else {
        var result = commandHandler.handleCommandString(data.command);
        if (result === false) {
            wsio.emit("serverConfirm", {
                message: ("Unknown command:" + data.command),
                host: os.hostname(),
                status: "error"
            });
            utils.consolePrint("Discarding unknown command packet:" + data.command);
        } else {
            // Send out packet again if head node
            if (webVars.headNode && result.sendAll) {
                for (var i = 0; i < webVars.remoteServers.length; i++) {
                    webVars.remoteServers[i].emit("command", data);
                }
            }

            // a script might self define what the last staretd app is. For example chrome.
            if (result.lastExecutedFile != undefined) {
                webVars.lastExecutedFile = result.lastExecutedFile;
            }

            // Special case for updating
            if (data.command == "updateNodejsFromRepo") {
                var paramArray = [];
                if (data.paramArray) {
                    paramArray = data.paramArray;
                }
                script(result.path, paramArray);
                setTimeout(function() {
                    process.exit();
                }, 500);
            } else if (!webVars.headNode || !result.preventHostActivation) {
                wsio.emit("serverConfirm", {
                    message: ("Command " + result.commandName + " accepted."),
                    host: os.hostname(),
                    status: "ok"
                })
                utils.consolePrint("Accepted command packet:" + data.command);
                var paramArray = [];
                if (data.paramArray) {
                    paramArray = data.paramArray;
                    for (var i = 0; i < paramArray.length; i++) {
                        if (paramArray[i] == "kanaloaId") {
                            paramArray[i] = webVars.thisHostnameNumber;
                        } else if (paramArray[i] == "kanaloaId-1") {
                            paramArray[i] = webVars.thisHostnameNumber - 1;
                        }
                    }
                }
                script(result.path, paramArray);
            }
        }
    }
} // End wsCommand

function startDestinyNodeFiles(wsio, data) {
    // Send out packet again if head node
    if (webVars.headNode) { // head node must pass the packet on
        for (var i = 0; i < webVars.remoteServers.length; i++) {
            webVars.remoteServers[i].emit("command", data);
        }
    } else { // not head node, kanaloas need to first kill active app (if any) then launch
        killLastStartedApp(wsio, { command: "destinyKillApps:" });
        if (data.paramArray != undefined) {
            editXMLFile(wsio, { command: data.paramArray[0] });
        }
        var path = data.command.split(":");
        webVars.lastExecutedFile = path[1];
        try {
            if (data.command.indexOf("destinyTestTracking:") != -1) {
                setTimeout(function() {
                    if (webVars.thisHostnameNumber == 1) {
                        script("./src/exampleScripts/destinyExecTrackingNew.bat", [path[1], "-server", "7", "*:1234", "*:*", "10000"]);
                    } else {
                        script("./src/exampleScripts/destinyExecTrackingNew.bat", [path[1], "-client", webVars.thisHostnameNumber - 1, "128.171.121.36:1234", "*:*", "10000"]);
                    }
                }, 2000);
                //script("\\Share\\" + path[1] + "\\" + path[1] + "-Destiny-Kanaloa" + webVars.thisHostnameNumber + "-NoTracking.bat", data.paramArray);
            } else {
                setTimeout(function() {
                    if (webVars.thisHostnameNumber == 1) {
                        script("./src/exampleScripts/destinyExecTrackingNew.bat", [path[1], "-server", "7", "*:1234", "*:*", "10000"]);
                    } else {
                        script("./src/exampleScripts/destinyExecTrackingNew.bat", [path[1], "-client", webVars.thisHostnameNumber - 1, "128.171.121.36:1234", "*:*", "10000"]);
                    }
                }, 2000);
                //script("\\Share\\" + path[1] + "\\" + path[1] + "-Destiny-Kanaloa" + webVars.thisHostnameNumber + "-NoTracking.bat", data.paramArray);
            }
        } catch (e) {
            console.log("Error with file:" + path[1]);
            console.log(e);
        }
    }
}

function killLastStartedApp(wsio, data) {
    // Send out packet again if head node
    if (webVars.headNode) {
        for (var i = 0; i < webVars.remoteServers.length; i++) {
            webVars.remoteServers[i].emit("command", data);
        }
        // send a delayed wall paper start after killing an app, basically you can't kill the wall paper since it will restart after a couple seconds
        setTimeout(function() {
            for (var i = 0; i < webVars.remoteServers.length; i++) {
                webVars.remoteServers[i].emit("command", { command: "wallpaperChrome", paramArray: ["kanaloaId"] });
            }
        }, 3000); //ms
    }
    // lono doesn't run the apps, if not head node, execute
    if (!webVars.headNode) {
        if (webVars.lastExecutedFile == null) {
            wsio.emit("serverConfirm", {
                message: ("Command " + data.command + " discarded, no previous command known."),
                host: os.hostname(),
                status: "ok"
            });
        } else {
            wsio.emit("serverConfirm", {
                message: ("Command " + data.command + " accepted."),
                host: os.hostname(),
                status: "ok"
            });
            utils.consolePrint("Accepted command packet:" + data.command);
            var paramArray = [webVars.lastExecutedFile];
            script("./src/exampleScripts/killApplication.bat", paramArray);
        }
    }
}



// This should only be activated on the head node.
function wsServerConfirm(wsio, data) {
    if (data.status === "error") {
        utils.consolePrint("Error on " + data.host + ">" + data.message); // Errors from nodes need to be seen
    } else {
        utils.debugPrint(data.message, "Remote server " + data.host); // This only prints if debug is on
    }
}

function createAndSendFileListUpdate(wsio) {
    var fileList = "";
    // fs.readFile("Z:/fileIndex.destiny", 'utf8', function(err, data) {
    //     if (err) {
    //         return console.log(err);
    //     }
    //     fileList = data;
    //     wsio.emit("fileListUpdate", { names: fileList });
    //     // for (var i = 0; i < webVars.clients.length; i++) {
    //     // 	webVars.clients[i].emit("fileListUpdate", {names:fileList});
    //     // }
    // });
}

function editXMLFile(wsio, data) {
    if (webVars.headNode) {
        for (var i = 0; i < webVars.remoteServers.length; i++) {
            webVars.remoteServers[i].emit("command", data);
        }
    }
    // lono doesn't run the apps, if not head node, execute
    if (!webVars.headNode) {
        var parser = new xml2js.Parser();
        var dataDynamic = data;
        fs.readFile("C:/CCUnityConfig/CCUnityConfigMaster.xml", 'utf8', function(err, fileContent) {
            if (err) {
                return console.log(err);
            }
            parser.parseString(fileContent, function(err, result) {
                var parameters = dataDynamic.command.split(":");
                var json = result;
                if (parameters[1].toString() == "true") {
                    json.config.stereo = 1;
                } else {
                    json.config.stereo = 0;
                }
                if (parameters[2].toString() == "true") {
                    json.config.tracking = 1;
                } else {
                    json.config.tracking = 0;
                }
                if (parameters[3].toString() == "true") {
                    json.config.panoptic = 1;
                } else {
                    json.config.panoptic = 0;
                }
                var builder = new xml2js.Builder();
                var xml = builder.buildObject(json);
                fs.writeFile("C:/CCUnityConfig/CCUnityConfig.xml", xml, function(err, fileWriteContent) {
                    if (err) {
                        console.log(err);
                    }
                });
            });
        });
    }
}

function startUnrealTest(wsio, data) {
    // Send out packet again if head node
    if (webVars.headNode) { // head node must pass the packet on
        for (var i = 0; i < webVars.remoteServers.length; i++) {
            webVars.remoteServers[i].emit("command", data);
        }
    } else { // not head node, kanaloas need to first kill active app (if any) then launch
        killLastStartedApp(wsio, { command: "destinyKillApps:" });
        var path = data.command.split(":"); // not actually needed
        webVars.lastExecutedFile = path[1];
        try {
			script("./src/exampleScripts/unrealExecTest.bat", [path[1], "node" + webVars.thisHostnameNumber + ".cmd"]);
        } catch (e) {
            console.log("Error with file:" + path[1]);
            console.log(e);
        }
    }
}