// Author: Amay Kataria
// Date: 09/24/2021
// File: Backend.js
// Description: Core central web-server, which is responsbile to multiplex calls to the sql database
// and other socket based actions. 

var express = require('express'); 
var cors = require('cors');

var socket = require('./Socket.js');

// ------------------ Express webserver ---------------- //
var app = express(); 
app.use(cors());
//app.use(express.static('./Client')); // Client index.html to be read. 
app.use(express.json());
var server = require('http').createServer(app); 

// ------------------ Websocket Configuration ------------ //
socket.socketConfig(server); 

// ------------------ Express webserver ------------------------ //
server.listen(process.env.PORT || 5000, function() {
    console.log('Central server successfully started'); 
});

// Ping the main server. 
socket.pingAlive();