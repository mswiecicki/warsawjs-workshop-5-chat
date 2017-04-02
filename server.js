'use strict';

const io = require('socket.io')();
const dbAPI = require('./db/queries.js');

const CONNECTED_CLIENTS = {};

function registerCommand(client, data) {
    dbAPI.registerUser(data.username, data.password)
        .then((result) => {
            if (result) {
                console.log(`Registered user: ${data.username}:${data.password}`);
                client.emit('server_message', "SUCESSFULLY REGISTERED");
            } else {
                console.log("Unsuccessful registration attempt...");
                client.emit('server_message', "ERROR DURING REGISTRATION");
            }
        });
}

function loginCommand(client, data) {
    dbAPI.loginUser(data.username, data.password)
        .then((result) => {
            if (result) {
                CONNECTED_CLIENTS[client.id]['username'] = data.username;
                CONNECTED_CLIENTS[client.id]['logged_in'] = true;
                client.join('chat');
                console.log(`User: ${data.username} successfully logged in...`);
                client.emit('logged_in', data.username);
            } else {
                console.log("Failed login attempt...");
                client.emit('logged_in', "");
            }
        });
}

function logoutCommand(client) {
    client.leave('chat');
    CONNECTED_CLIENTS[client.id]['logged_in'] = false;
}

function handleAdministrativeCommands(client) {
    return function(command) {
        switch(command.type) {
            case 'register': registerCommand(client, command.data); break;
            case 'login': loginCommand(client, command.data); break;
            case 'logout': logoutCommand(client, command.data); break;
        }
    }
}

function handleMessages(client) {
    return function(message) {
        if (CONNECTED_CLIENTS[client.id].logged_in === true) {
            if (client.rooms.hasOwnProperty('chat')) {
                client.to('chat').emit('message', message);
            }
        } else {
            console.log(`Unauthorized client sends: \"${message.body}\"`);
        }
    }
}

function handleDisconnect(client) {
    return function() {
        delete CONNECTED_CLIENTS[client.id];
        console.log(`Client with ID: ${client.id} disconnected...`);
    }
}

io.on('connection', (client) => {

    CONNECTED_CLIENTS[client.id] = {'logged_in': false};
    console.log(`Client with ID: ${client.id} connected...`);

    client.on('command', handleAdministrativeCommands(client));
    client.on('message', handleMessages(client));
    client.on('disconnect', handleDisconnect(client));
});

console.log('Starting listening on port: 3000...');
io.listen(3000);
