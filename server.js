'use strict';

const io = require('socket.io')();

io.on('connection', (client) => {
    console.log(`connected client: ${client.id}`);
    client.on('message', (msg) => {
        console.log(`incoming message: ${msg}`);
        io.emit('message', msg);
    })
});


console.log('Starting listening on port: 3000...');
io.listen(3000);