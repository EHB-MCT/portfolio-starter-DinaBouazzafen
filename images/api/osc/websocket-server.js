const WebSocket = require('ws');
const osc = require('osc');

const wss = new WebSocket.Server({ port: 8080 });

const udpPort = new osc.UDPPort({
  localAddress: '127.0.0.1',
  localPort: 5335,
});

// Initialize lastValues here, outside of any function
const lastValues = { r: null, g: null, b: null };

console.log('Script started');

// Object to keep track of message counts and logged status
const messageCounts = {};
const loggedColors = {};
const maxCountThreshold = 300; // The count threshold for logging the message

udpPort.on('message', (oscMessage) => {
  const address = oscMessage.address;
  const value = oscMessage.args[0];

  // Check if the message is for r, g, or b
  if (address === '/r' || address === '/g' || address === '/b') {
    const colorComponent = address.substring(1); // 'r', 'g', or 'b'
    
    lastValues[colorComponent] = value; // Update the last value for r, g, or b
    const messageKey = `${colorComponent}_${value}`;
    const hexColor = rgbToHex(lastValues.r, lastValues.g, lastValues.b);
    
    // Check if we've already logged this color
    if (loggedColors[hexColor]) return;

    // Initialize count if new message
    if (!messageCounts[messageKey]) {
      messageCounts[messageKey] = 1;
    } else {
      messageCounts[messageKey]++; // Increment the count for the message
    }

    // Check if the message has been received 300 times
    if (messageCounts[messageKey] === maxCountThreshold) {
      console.log(`Received ${maxCountThreshold} times the same color: #${hexColor}`);
      loggedColors[hexColor] = true; // Mark this color as logged
      Object.keys(messageCounts).forEach(key => {
        if (key.startsWith(colorComponent)) {
          messageCounts[key] = undefined;
        }
      });
    }
  }
});

function rgbToHex(r, g, b) {
  return [r, g, b].map(x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

udpPort.open();

wss.on('connection', (ws) => {
  console.log('WebSocket Client Connected');
  ws.on('close', () => console.log('WebSocket Client Disconnected'));
});

udpPort.on('error', (error) => console.log("An error occurred: ", error.message));
wss.on('error', (error) => console.log("A WebSocket error occurred: ", error.message));
