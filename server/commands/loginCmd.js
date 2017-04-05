"use strict";

const JWT = require('jsonwebtoken');
const SECRET = require('../settings.js')['SECRET'];
const dbAPI = require('../../db/queries.js');

function loginCommand(client, data) {
    dbAPI.loginUser(data.username, data.password)
        .then((result) => {
            if (result) {
                console.log(`User: ${data.username} has successfully logged in`);
                let token = JWT.sign({username: data.username}, SECRET);
                client.join('chat');
                client.emit('logged_in', {username: data.username, token});
            } else {
                console.log("Failed login attempt!");
                client.emit('logged_in', "");
            }
        });
}

module.exports = loginCommand;