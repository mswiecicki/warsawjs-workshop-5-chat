'use strict';

const io = require('socket.io')();
const authenticate = require('./authenticate.js');
const {publicDispatchCommands, dispatchCommands} = require('./commands/dispatcher.js');

function handleMessages(client, message) {
    if (client.rooms.hasOwnProperty('chat')) {
        client.to('chat').emit('message', message);
    }
}

function handleUnauth(client, message) {
    console.log(`Unauthorized client sends: \"${message.body}\"`);
}

function handleDisconnect(client) {
    return function() {
        console.log(`Client with ID: ${client.id} disconnected!`);
    }
}

io.on('connection', (client) => {

    console.log(`Client with ID: ${client.id} connected!`);

    client.on('command', authenticate(client, dispatchCommands, publicDispatchCommands));
    client.on('message', authenticate(client, handleMessages, handleUnauth));
    client.on('disconnect', handleDisconnect(client));
});

console.log('Starting listening on port: 3000...');
io.listen(3000);
