
var remoteSites = [];
if (config.remote_sites) {
	remoteSites = new Array(config.remote_sites.length);
	config.remote_sites.forEach(function(element, index, array) {
		var protocol = (element.secure === true) ? "wss" : "ws";
		var wsURL = protocol + "://" + element.host + ":" + element.port.toString();

		var remote = createRemoteConnection(wsURL, element, index);

		var rGeom = {};
		rGeom.w = Math.min((0.5 * config.totalWidth) / remoteSites.length, config.ui.titleBarHeight * 6)
			- (0.16 * config.ui.titleBarHeight);
		rGeom.h = 0.84 * config.ui.titleBarHeight;
		rGeom.x = (0.5 * config.totalWidth) + ((rGeom.w + (0.16 * config.ui.titleBarHeight)) * (index - (remoteSites.length / 2)))
			+ (0.08 * config.ui.titleBarHeight);
		rGeom.y = 0.08 * config.ui.titleBarHeight;

		// Build the object
		remoteSites[index] = {
			name: element.name,
			wsio: remote,
			connected: "off",
			geometry: rGeom
		};
		// Add the gemeotry for the button
		interactMgr.addGeometry("remote_" + index, "staticUI", "rectangle", rGeom,  true, index, remoteSites[index]);

		// attempt to connect every 15 seconds, if connection failed
		setInterval(function() {
			if (remoteSites[index].connected !== "on") {
				var rem = createRemoteConnection(wsURL, element, index);
				remoteSites[index].wsio = rem;
			}
		}, 15000);
	});
}


function createRemoteConnection(wsURL, element, index) {
	var remote = new WebsocketIO(wsURL, false, function() {
		manageRemoteConnection(remote, element, index);
	});

	return remote;
}

var WebsocketIO   = require('websocketio');      // creates WebSocket server and clients


function manageRemoteConnection(remote, site, index) {
	// Fix address
	remote.updateRemoteAddress(site.host, site.port);
	// Hope for the best
	remoteSites[index].connected = "on";
	// Check the password or session hash
	if (site.password) {
		// MD5 hash of the password
		site.session = md5.getHash(site.password);
	}

	var clientDescription = {
		clientType: "remoteServer",
		host: config.host,
		port: config.secure_port,
		session: site.session,
		// port: config.port,
		requests: {
			config: false,
			version: false,
			time: false,
			console: false
		}
	};
	remote.clientType = "remoteServer";

	remote.onclose(function() {
		console.log(sageutils.header("Remote") + "\"" + config.remote_sites[index].name + "\" offline");
		// it was locked, keep the state locked
		if (remoteSites[index].connected !== "locked") {
			remoteSites[index].connected = "off";
			var delete_site = {name: remoteSites[index].name, connected: remoteSites[index].connected};
			broadcast('connectedToRemoteSite', delete_site);
		}
		removeElement(clients, remote);
	});

	remote.on('addClient',                              wsAddClient);
	remote.on('addNewElementFromRemoteServer',          wsAddNewElementFromRemoteServer);
	remote.on('addNewSharedElementFromRemoteServer',    wsAddNewSharedElementFromRemoteServer);
	remote.on('requestNextRemoteFrame',                 wsRequestNextRemoteFrame);
	remote.on('updateRemoteMediaStreamFrame',           wsUpdateRemoteMediaStreamFrame);
	remote.on('stopMediaStream',                        wsStopMediaStream);
	remote.on('requestNextRemoteBlockFrame',            wsRequestNextRemoteBlockFrame);
	remote.on('updateRemoteMediaBlockStreamFrame',      wsUpdateRemoteMediaBlockStreamFrame);
	remote.on('stopMediaBlockStream',                   wsStopMediaBlockStream);
	remote.on('requestDataSharingSession',              wsRequestDataSharingSession);
	remote.on('cancelDataSharingSession',               wsCancelDataSharingSession);
	remote.on('acceptDataSharingSession',               wsAcceptDataSharingSession);
	remote.on('rejectDataSharingSession',               wsRejectDataSharingSession);
	remote.on('createRemoteSagePointer',                wsCreateRemoteSagePointer);
	remote.on('startRemoteSagePointer',                 wsStartRemoteSagePointer);
	remote.on('stopRemoteSagePointer',                  wsStopRemoteSagePointer);
	remote.on('remoteSagePointerPosition',              wsRemoteSagePointerPosition);
	remote.on('remoteSagePointerToggleModes',           wsRemoteSagePointerToggleModes);
	remote.on('remoteSagePointerHoverCorner',           wsRemoteSagePointerHoverCorner);
	remote.on('addNewRemoteElementInDataSharingPortal', wsAddNewRemoteElementInDataSharingPortal);

	remote.on('updateApplicationOrder',                 wsUpdateApplicationOrder);
	remote.on('startApplicationMove',                   wsStartApplicationMove);
	remote.on('startApplicationResize',                 wsStartApplicationResize);
	remote.on('updateApplicationPosition',              wsUpdateApplicationPosition);
	remote.on('updateApplicationPositionAndSize',       wsUpdateApplicationPositionAndSize);
	remote.on('finishApplicationMove',                  wsFinishApplicationMove);
	remote.on('finishApplicationResize',                wsFinishApplicationResize);
	remote.on('deleteApplication',                      wsDeleteApplication);
	remote.on('updateApplicationState',                 wsUpdateApplicationState);
	remote.on('updateApplicationStateOptions',          wsUpdateApplicationStateOptions);

	remote.emit('addClient', clientDescription);
	clients.push(remote);

	remote.on('remoteConnection', function(remotesocket, data) {
		if (data.status === "refused") {
			console.log(sageutils.header('Remote') + "Connection refused to " + site.name + ": " + data.reason);
			remoteSites[index].connected = "locked";
		} else {
			console.log(sageutils.header("Remote") + "Connected to " + site.name);
			remoteSites[index].connected = "on";
		}
		var update_site = {name: remoteSites[index].name, connected: remoteSites[index].connected};
		broadcast('connectedToRemoteSite', update_site);
	});
}





