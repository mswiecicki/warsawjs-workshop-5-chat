"use strict";

const registerCommand = require('./registerCmd.js');
const loginCommand = require('./loginCmd.js');

function publicDispatchCommands(client, command) {
    switch(command.type) {
        case 'register': registerCommand(client, command.data); break;
        case 'login': loginCommand(client, command.data); break;
    }
}

function dispatchCommands(client, command) {
    publicDispatchCommands(client, command);
    switch(command.type) {
        // for commands requiring being logged in
    }
}

module.exports = {
    publicDispatchCommands,
    dispatchCommands
};