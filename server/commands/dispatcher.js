"use strict";

const registerCommand = require('./registerCmd.js');
const loginCommand = require('./loginCmd.js');

function dispatchCommands(client) {
    return function(command) {
        switch(command.type) {
            case 'register': registerCommand(client, command.data); break;
            case 'login': loginCommand(client, command.data); break;
        }
    }
}

module.exports = dispatchCommands;