// Author: Amay Kataria
// Date: 09/24/2021
// File: Socket.js
// Description: Helper module to relay all socket based communication. 

var socket = require('socket.io');
var database = require('./Database.js');

// Global variables. 
let appSocket; 
let io; 

module.exports = {
    socketConfig: function(server) {
        io = socket(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST", "PUT", "OPTIONS", "DELETE"],
                credentials: true
            }
        }); 

        // /app and /central are two seperate namespaces. 
        appSocket = io.of('/app').on('connection', onWebClient); // Connects all web instance to this. 
    },

    // Send an event to all connected clients to keep the Socket Connection Alive. 
    // This event is sent every 1 second to every client connected. 
    pingAlive: function() {
        setInterval(ping, 1000);
    }
}

// Helper function. 
function ping() {
    var t = new Date().toTimeString(); 
    appSocket.emit('time', t); 
}

// Every web client connects through this code path and subscribes to other events. 
// All socket events are registered here. 
function onWebClient(socket) {
    console.log('New Web Client connection: ' + socket.id); 

    // ------------------- Database communication -------------------- //
    socket.on('savePreset', (data) => {
        database.savePreset(data);
    });

    socket.on('getPresets', () => {
        database.readPresets(socket); 
    });

    socket.on('deletePreset', (name) => {
        database.deletePreset(name); 
    });
    
    socket.on('disconnect', () => console.log('Web client ' + socket.id + ' disconnected')); 
}
