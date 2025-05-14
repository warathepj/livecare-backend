const mqtt = require('mqtt');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Get MQTT broker connection details from environment variables
const brokerUrl = process.env.BROKER_URL;
const username = process.env.USER;
const password = process.env.PASSWORD;

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