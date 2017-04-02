"use strict";

const dbAPI = require('../queries.js');

console.log("Registering user: test:1234...");
dbAPI.registerUser('test', '1234')
    .then((result) => {
        console.log("should return id of created user: ", result);
        console.log("Registering user with the same username...");
        dbAPI.registerUser('test', '1234').then((result) => {
            console.log("should return 'false': ", result);
            console.log("Login on created user...");
            dbAPI.loginUser('test', '1234').then((result) => {
                console.log("should return 'true': ", result);
            });
        });
    });


