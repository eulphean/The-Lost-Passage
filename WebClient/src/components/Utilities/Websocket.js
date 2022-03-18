/*
  Name: Websocket.js
  Author: Amay Kataria
  Date: 09/24/2021
  Description: Class responsible for communication with the webserver. We use websockets
  technology for this. Here we have the websocket client, which communicates with backend
  server over websockets.
*/

import io  from 'socket.io-client'

//const localhostURL = "http://localhost:5000";
const herokuURL = "https://befantastic-martha.herokuapp.com";

class Websocket {
  constructor() {
      this.siteURL = herokuURL + '/app'; 

      this.socket = io(this.siteURL, {
          reconnection: true,
          reconnectionDelay: 500,
          reconnectionAttempts: Infinity
      });

      this.socket.once('connect', this.subscribe.bind(this));
      this.handlePresetsCbk = ''; 
  }

  subscribe() {
      console.log('Connected');

      // Subscribe to incoming events from the webserver here. 
      this.socket.on('time', this.logTime.bind(this));
      this.socket.on('receivePresets', this.handlePresets.bind(this));
  }

  handlePresets(data) {
    this.handlePresetsCbk(data); 
  }

  // ----------------------- DATABASE CALLS --------------------- //
  saveGuiPreset(presetName, json) {
      let payload = {
          'name':  presetName, 
          'data': json
      }
      this.socket.emit('savePreset', payload); 
  }

  readAllPresets(readPresetsCallback) {
    console.log('Query Socket Presets.');
    this.socket.emit('getPresets'); 
    this.handlePresetsCbk = readPresetsCallback; // Subscribe to receive data when the call completes. 
  }

  deletePreset(presetName) {
    this.socket.emit('deletePreset', presetName);
  }

  // -------------------- DON'T CHANGE THESE -------------------    
  disconnect() {
      console.log('Socket Server Disconnected.');
  }

  logTime(data) {
      //console.log('Socket Connection Alive: ' + data);
  }
}

export default new Websocket();


