var fs = require("fs");


let oneMinute = 1000 * 60; // ms
let path = "\\\\MAUI1\\Share\\UnityApps";

// Limited scope function
function sendFileList() {
		console.log(global.lastAppCheckTime);
}
// If multiple requests were made after a time, update just in case.
if ((!global.lastAppCheckTime) || (global.lastAppCheckTime + oneMinute < Date.now())) {
		// TODO maybe declare earlier
		// Only if not created before.
		if (!global.appDirectories) { global.appDirectories = []; }

		// Read from the (network) path to fill out the listing
		fs.readdir(path, function(err, items) {
				console.log(err);
				checksNeeded = items.length;
				checksMade = 0;
				for (var i=0; i<items.length; i++) {
						let fname = items[i];
						fs.stat(path + "/" + fname, (err, stats) => {
								console.log(fname);
								if (stats.isDirectory()) {
										global.appDirectories.push(fname);
								}
								checksMade++;
								if (checksMade >= checksNeeded) {
										// After thinking on this, its OK if sending multiple update lists.
										sendFileList();
								}
						});
				}
		});

		// Update last in case multiple very short timed queries to prevent blank packets
		global.lastAppCheckTime = Date.now();
} else {
		sendFileList();
}