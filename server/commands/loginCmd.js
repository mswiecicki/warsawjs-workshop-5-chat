"use strict";

const dbAPI = require('../../db/queries.js');

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

module.exports = loginCommand;