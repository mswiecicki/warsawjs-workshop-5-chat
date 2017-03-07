'use strict';

const io = require('socket.io-client')('http://localhost:3000');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

io.on('message', (msg) => {
    console.log(`==> \"${msg}\"`);
    readline.prompt();
});

readline.setPrompt('> ');
readline.prompt();

readline.on('line', (line) => {
    if (line !== '/exit') {
        io.emit('message', line);
        readline.prompt();
    } else {
        readline.close();
        process.exit();
    }
});
