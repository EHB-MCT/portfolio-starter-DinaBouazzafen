const WebSocket = require('ws');
const osc = require('osc');

const wss = new WebSocket.Server({ port: 8080 });

const udpPort = new osc.UDPPort({
  localAddress: '127.0.0.1',
  localPort: 5335,
});
console.log('Script started');

// Object to keep track of message counts
const messageCounts = {};

udpPort.on('message', (oscMessage) => {
  const messageKey = oscMessage.address + '_' + oscMessage.args.join('_');
  
  // Initialize count if new message
  if (!messageCounts[messageKey]) {
    messageCounts[messageKey] = 0;
  }

  // Increment the count for the message
  messageCounts[messageKey]++;
  
  // Check if the message has been received 60 times
  if (messageCounts[messageKey] === 60) {
    console.log('Received 60 times:', oscMessage);
    
    // Reset the count after logging
    messageCounts[messageKey] = 0;
  }

  // Optionally, you might want to send the OSC message only when it's logged
  if (messageCounts[messageKey] === 0) {
    // Send the OSC message to all connected WebSocket clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(oscMessage));
      }
    });
  }
});

udpPort.open();

wss.on('connection', (ws) => {
  console.log('WebSocket Client Connected');

  ws.on('close', () => {
    console.log('WebSocket Client Disconnected');
  });
});

udpPort.on('error', function (error) {
  console.log("An error occurred: ", error.message);
});

wss.on('error', function (error) {
  console.log("A WebSocket error occurred: ", error.message);
});

