'use strict';

const io = require('socket.io')();
const commandsDispatcher = require('./commands/dispatcher.js');

const CONNECTED_CLIENTS = {};

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

    client.on('command', commandsDispatcher(client));
    client.on('message', handleMessages(client));
    client.on('disconnect', handleDisconnect(client));
});

console.log('Starting listening on port: 3000...');
io.listen(3000);
