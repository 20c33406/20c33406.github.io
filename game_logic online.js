// Import the Socket.io library
const io = require('socket.io')();

// Create a socket server
const server = io.listen(3000);

// Store connected clients
const clients = {};

// Event handler for new connections
server.on('connection', (socket) => {
    // Store the connected client
    clients[socket.id] = socket;

    // Event handler for receiving messages
    socket.on('message', (data) => {
        // Broadcast the message to all connected clients except the sender
        Object.keys(clients).forEach((clientId) => {
            if (clientId !== socket.id) {
                clients[clientId].emit('message', data);
            }
        });
    });

    // Event handler for disconnections
    socket.on('disconnect', () => {
        // Remove the disconnected client from the list
        delete clients[socket.id];
    });
});
