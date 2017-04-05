'use strict';

const io = require('socket.io-client')
const socket = io('http://localhost:3000'); // now the client connects to the server

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

let USERNAME = null;
let TOKEN = null;

function clearPrompt() {
    process.stdout.cursorTo(0);
    process.stdout.clearLine();
}

// receiving stuff from server
socket.on('server_message', (srv_msg) => {
    clearPrompt();
    console.log(`## > \"${srv_msg}\"`);
    readline.prompt();
});

socket.on('logged_in', (loginObject) => {
    if (loginObject) {
        USERNAME = loginObject.username;
        TOKEN = loginObject.token;
        readline.setPrompt(`${loginObject.username}: `);
        readline.prompt();
    } else {
        readline.prompt();
    }
})

socket.on('message', (msg) => {
    clearPrompt();
    console.log(`${msg.from}: ${msg.body}`);
    readline.prompt();
});

// sending stuff to server
readline.on('line', (line) => {
    if (line !== '/exit') {
        if (line.startsWith('/register')) {
            let args = line.split(' ');
            socket.emit('command', {type: 'register', data: {username: args[1], password: args[2]}, token: TOKEN });
        } else if (line.startsWith('/login')) {
            let args = line.split(' ');
            socket.emit('command', {type: 'login', data: {username: args[1], password: args[2]}, token: TOKEN });
            clearPrompt();
        } else if (line.startsWith('/logout')) {
            USERNAME = null;
            TOKEN = null;
            readline.setPrompt('> ');
        } else if (line.trim().length) {
            socket.emit('message', {from: USERNAME, body: line, token: TOKEN});
        }
        readline.prompt();
    } else {
        readline.close();
        process.exit();
    }
});

//on startup
console.log("To start chatting you need to log in: /login <username> <password>");
console.log("If you don't have an account, register via: /register <username> <password>");
readline.prompt();
