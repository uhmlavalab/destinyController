"use strict";

/*
To deal with voice commands in a simple manner this file will:
1. Read a description file representing available commands and the script they activate
2. Store values in an array of objects.
	Each object contains command pieces to look for and script path to activate.
	{
		commandName: "",  // identifier
		commandWords: [], // array of 1 token strings
		scriptPath: "",   // path to script file to activate under matching conditions. 
	}
3. This can be further edited later.

*/

function handleCommandString(commandString) {
	var anyCommandMatch = false;
	// Go through each command
	for (var i = 0; i < global.commands.length; i++) {
		if (global.commands[i].commandName == commandString) {
			var retInfo = {};
			retInfo.path = global.commands[i].scriptPath;
			retInfo.commandName = global.commands[i].commandName;
			retInfo.sendAll = global.commands[i].sendAll;
			return retInfo; // Only activate one command. Could be modified to activate others.
		}
	}
	// If none of the commands match, notify
	if (anyCommandMatch === false) {
		return false;
	}
}

function handleVoiceCommandString(fullSpokenCommand) {
	var currentCommand;
	var fullWordMatch;
	var anyCommandMatch = false;

	// Go through each command
	for (var i = 0; i < global.commands.length; i++) {
		currentCommand = global.commands[i];
		fullWordMatch = true;
		// Check the current command's word list against spoken words.
		for (var j = 0; j < currentCommand.commandWords.length; j++) {
			if (fullSpokenCommand.indexOf(currentCommand.commandWords[j].toUpperCase()) === -1) {
				fullWordMatch = false;
				break;
			}
		}
		// If this command has a full word match, then activate
		if (fullWordMatch === true) {
			var retInfo = {};
			retInfo.path = currentCommand.scriptPath;
			retInfo.commandName = currentCommand.commandName;
			return retInfo; // Only activate one command. Up to use to make unique checks.
		}
	}
	// If none of the commands match, notify
	if (anyCommandMatch === false) {
		return false;
	}
}

// These lines are necessay to allow access and usage outside of this file.
exports.handleCommandString = handleCommandString;
exports.handleCommandString = handleCommandString;
