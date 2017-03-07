'use strict';

const io = require('socket.io')();

io.on('connection', (client) => {
    console.log(`connected client: ${client.id}`);
    client.on('message', (msg) => {
        console.log(`incoming message: ${msg}`);
        client.broadcast.emit('message', msg);
    })
});

io.on('disconnect', (client) => {
    console.log(`client: ${client.id} disconnected...`);
})


console.log('Starting listening on port: 3000...');
io.listen(3000);