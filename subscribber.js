const mqtt = require('mqtt');
const dotenv = require('dotenv');
const WebSocket = require('ws');
const http = require('http');

// Load environment variables from .env file
dotenv.config();

// Get MQTT broker connection details from environment variables
const brokerUrl = process.env.BROKER_URL;
const username = process.env.USER;
const password = process.env.PASSWORD;
const wsPort = process.env.WS_PORT || 8085;

// Check if required environment variables are set
if (!brokerUrl) {
  console.error('Error: BROKER_URL environment variable is not set');
  process.exit(1);
}

// Connection options
const options = {
  username,
  password,
  clean: true,
  reconnectPeriod: 5000, // Reconnect every 5 seconds if connection is lost
};

// Create MQTT client
const client = mqtt.connect(brokerUrl, options);

// Topic to subscribe to
const topic = 'livecare/vital-signs';

// Create HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket server for LiveCare vital signs\n');
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Store connected clients
const clients = new Set();

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('New WebSocket client connected');
  clients.add(ws);

  // Handle client disconnection
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
    clients.delete(ws);
  });

  // Handle client errors
  ws.on('error', (error) => {
    console.error('WebSocket client error:', error);
    clients.delete(ws);
  });

  // Send a welcome message
  ws.send(JSON.stringify({
    type: 'info',
    message: 'Connected to LiveCare vital signs service'
  }));
});

// Start the server
server.listen(wsPort, () => {
  console.log(`WebSocket server listening on port ${wsPort}`);
});

// Handle connection events
client.on('connect', () => {
  console.log('Connected to MQTT broker');
  
  // Subscribe to the topic
  client.subscribe(topic, (err) => {
    if (err) {
      console.error(`Error subscribing to ${topic}:`, err);
      return;
    }
    console.log(`Subscribed to ${topic}`);
  });
});

// Handle incoming messages
client.on('message', (topic, message) => {
  console.log(`Received message on ${topic}:`);
  try {
    // Assuming the message is in JSON format
    const data = JSON.parse(message.toString());
    console.log(data);
    
    // Broadcast the message to all connected WebSocket clients
    const messageToSend = JSON.stringify({
      topic: topic,
      data: data,
      timestamp: new Date().toISOString()
    });
    
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageToSend);
      }
    });
  } catch (error) {
    console.log('Raw message:', message.toString());
  }
});

// Handle errors
client.on('error', (err) => {
  console.error('MQTT client error:', err);
});

// Handle disconnection
client.on('close', () => {
  console.log('Disconnected from MQTT broker');
});

console.log('MQTT subscriber started. Waiting for messages...');