const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mqtt = require('mqtt');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// MQTT Client Setup
const mqttOptions = {
  username: process.env.USER,
  password: process.env.PASSWORD
};

let mqttClient;
try {
  mqttClient = mqtt.connect(process.env.BROKER_URL, mqttOptions);
  
  mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker successfully');
  });
  
  mqttClient.on('error', (error) => {
    console.error('MQTT connection error:', error);
  });
} catch (error) {
  console.error('Failed to connect to MQTT broker:', error);
}

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.post('/api/vital-signs', (req, res) => {
  try {
    const vitalSignsData = req.body;
    
    // Enhanced logging for vital signs data from Redux store
    console.log('\n===== VITAL SIGNS DATA RECEIVED =====');
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log('Source: vital-signs-simulator-buddy/redux');
    console.log('Data:');
    console.log(JSON.stringify(vitalSignsData, null, 2));
    console.log('=====================================\n');
    
    // Publish to MQTT if client is connected
    if (mqttClient && mqttClient.connected) {
      const topic = 'livecare/vital-signs';
      mqttClient.publish(topic, JSON.stringify(vitalSignsData), { qos: 1 }, (err) => {
        if (err) {
          console.error('Error publishing to MQTT:', err);
        } else {
          console.log(`Published data to ${topic}`);
        }
      });
    } else {
      console.warn('MQTT client not connected. Data not published.');
    }
    
    // Here you would typically save the data to a database
    // For now, we'll just acknowledge receipt
    
    res.status(200).json({
      success: true,
      message: 'Vital signs data received successfully',
      timestamp: new Date().toISOString(),
      data: vitalSignsData
    });
  } catch (error) {
    console.error('Error processing vital signs data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process vital signs data',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Graceful shutdown
process.on('SIGINT', () => {
  if (mqttClient) {
    console.log('Closing MQTT connection...');
    mqttClient.end();
  }
  process.exit();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/api/vital-signs`);
});