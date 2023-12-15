const WebSocket = require('ws');
const osc = require('osc');

const wss = new WebSocket.Server({ port: 8080 });

const udpPort = new osc.UDPPort({
  localAddress: '10.2.88.142',
  localPort: 5334,
});

udpPort.on('message', (oscMessage) => {
  console.log('Received OSC Message:', oscMessage);
  // Send the OSC message to all connected WebSocket clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(oscMessage));
    }
  });
});

udpPort.open();

wss.on('connection', (ws) => {
  console.log('WebSocket Client Connected');

  ws.on('close', () => {
    console.log('WebSocket Client Disconnected');
  });
});
