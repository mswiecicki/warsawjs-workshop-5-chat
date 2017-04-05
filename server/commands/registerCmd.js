"use strict";

const dbAPI = require('../../db/queries.js');

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

module.exports = registerCommand;