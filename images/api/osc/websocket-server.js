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
const maxCountThreshold = 300; // The count threshold for logging the message
const lastValues = { r: null, g: null, b: null }; // Store the last values of r, g, and b

udpPort.on('message', (oscMessage) => {
  const address = oscMessage.address;
  const value = oscMessage.args[0];

  // Check if the message is for r, g, or b
  if (address === '/r' || address === '/g' || address === '/b') {
    const colorComponent = address.substring(1); // 'r', 'g', or 'b'
    lastValues[colorComponent] = value; // Update the last value for r, g, or b

    const messageKey = `${colorComponent}_${value}`;
    
    // Initialize count if new message
    if (messageCounts[messageKey] === undefined) {
      messageCounts[messageKey] = 1;
    } else {
      // Increment the count for the message
      messageCounts[messageKey]++;
    }

    // Check if the message has been received 60 times
    if (messageCounts[messageKey] === maxCountThreshold) {
      // Convert the RGB values to a hex color
      const hexColor = rgbToHex(lastValues.r, lastValues.g, lastValues.b);
      console.log(`Received ${maxCountThreshold} times the same color: #${hexColor}`);
      
      // Reset the counts for all components of this color
      ['r', 'g', 'b'].forEach(comp => {
        messageCounts[`${comp}_${lastValues[comp]}`] = undefined;
      });
    }
  }
});

// Function to convert RGB to Hex
function rgbToHex(r, g, b) {
  return [r, g, b].map(x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

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



