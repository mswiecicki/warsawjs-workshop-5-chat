'use strict';

const io = require('socket.io-client')
const socket = io('http://localhost:3000'); // now the client connects to the server

socket.on('message', (msg) => {
    console.log(`==> \"${msg}\"`);
    readline.prompt();
});

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.prompt();

readline.on('line', (line) => {
    if (line !== '/exit') {
        socket.emit('message', line);
        readline.prompt();
    } else {
        readline.close();
        process.exit();
    }
});
