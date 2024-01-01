const WebSocket = require('ws');
const osc = require('osc');

// WebSocket server setup
const wss = new WebSocket.Server({ port: 8080 });

// OSC server setup
const udpPort = new osc.UDPPort({
  localAddress: '127.0.0.1',
  localPort: 5335,
});

// Initialize variables to keep track of the last color values
const lastValues = { r: null, g: null, b: null };

// Object to keep track of message counts and logged status
const messageCounts = {};
const loggedColors = {};
const maxCountThreshold = 300; // Threshold for logging the message

// Handling incoming OSC messages
udpPort.on('message', (oscMessage) => {
  const address = oscMessage.address;
  const value = oscMessage.args[0];

  // Check if the message is for r, g, or b
  if (address === '/r' || address === '/g' || address === '/b') {
    const colorComponent = address.substring(1); // 'r', 'g', or 'b'
    
    // Update the last value for r, g, or b
    lastValues[colorComponent] = value;
    const messageKey = `${colorComponent}_${value}`;
    const hexColor = rgbToHex(lastValues.r, lastValues.g, lastValues.b);
    
    // Skip if we've already logged this color
    if (loggedColors[hexColor]) return;

    // Initialize or increment the count for the message
    messageCounts[messageKey] = (messageCounts[messageKey] || 0) + 1;

    // Check if the message has been received 300 times
    if (messageCounts[messageKey] === maxCountThreshold) {
      console.log(`Received ${maxCountThreshold} times the same color: #${hexColor}`);
      loggedColors[hexColor] = true; // Mark this color as logged

      // Clear counts for this color component
      Object.keys(messageCounts).forEach(key => {
        if (key.startsWith(colorComponent)) {
          messageCounts[key] = 0;
        }
      });

      // Broadcast the color to all connected WebSocket clients
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          console.log("color6")
          client.send(JSON.stringify({ color: `#${hexColor}` }));
        }
      });
    }
  }
});

// Open the OSC port
udpPort.open();

// Handling WebSocket connections
wss.on('connection', (ws) => {
  console.log('WebSocket Client Connected');
  ws.on('close', () => console.log('WebSocket Client Disconnected'));
});

// Error handling
udpPort.on('error', (error) => console.log("An error occurred: ", error.message));
wss.on('error', (error) => console.log("A WebSocket error occurred: ", error.message));

// Function to convert RGB to Hex format
function rgbToHex(r, g, b) {
  return [r, g, b].map(x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}
