'use strict';

const io = require('socket.io-client')
const socket = io('http://localhost:3000'); // now the client connects to the server

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

function clearPrompt() {
    process.stdout.cursorTo(0);
    process.stdout.clearLine();
}

function writeToConsole(str) {
    clearPrompt();
    console.log(str);
    readline.prompt();
}

let USER = {};

// receiving stuff from server
socket.on('server_message', writeToConsole);

socket.on('logged_in', ({username, token}) => {
    if (username && token) {
        USER = {username, token};
        readline.setPrompt(`${username}: `);
    }
    readline.prompt();
})

socket.on('message', (msg) => {
    writeToConsole(`${msg.from}: ${msg.body}`);
});

// sending stuff to server
readline.on('line', (line) => {
    const args = line.split(' ');
    switch(args[0]) {
        case '/exit':
            readline.close();
            process.exit();
            break;
        case '/register':
            socket.emit('command', {type: 'register', data: {username: args[1], password: args[2]}});
            readline.prompt();
            break;
        case '/login':
            socket.emit('command', {type: 'login', data: {username: args[1], password: args[2]}});
            clearPrompt();
            readline.prompt();
            break;
        case '/logout':
            USER = {};
            readline.setPrompt('> ');
            readline.prompt();
            break;
        default:
            if (line.trim()) {
                socket.emit('message', {from: USER.username || '', body: line, token: USER.token || ''});
            }
            readline.prompt();
            break;
    }
});

//on startup
console.log("To start chatting you need to log in: /login <username> <password>");
console.log("If you don't have an account, register via: /register <username> <password>");
readline.prompt();
