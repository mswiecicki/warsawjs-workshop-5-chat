"use strict";

const JWT = require('jsonwebtoken');
const SECRET = require('./settings.js')['SECRET'];

function authenticate(client, successFn, failureFn) {
    return function(event) {
        JWT.verify(event.token, SECRET, {algorithms: ["HS256"]}, function(err, result) {
            if (!err) {
                successFn(client, event);
            } else {
                failureFn(client, event);
            }
        });
    }
}

module.exports = authenticate;