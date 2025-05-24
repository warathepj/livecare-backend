# ซอร์สโค้ดนี้ ใช้สำหรับเป็นตัวอย่างเท่านั้น ถ้านำไปใช้งานจริง ผู้ใช้ต้องจัดการเรื่องความปลอดภัย และ ประสิทธิภาพด้วยตัวเอง

# LiveCare Vital Signs Monitoring System

A comprehensive health monitoring system that simulates, processes, and visualizes patient vital signs in real-time.

## System Architecture

The LiveCare system consists of three main components:

```
┌─────────────────────┐     ┌─────────────────┐     ┌───────────────────────┐
│                     │     │                 │     │                       │
│  Vital Signs        │───▶│  Backend        │────▶│  Heartbeat Dashboard  │
│  Simulator          │     │  Server         │     │  Visualizer           │
│                     │     │                 │     │                       │
└─────────────────────┘     └─────────────────┘     └───────────────────────┘
        HTTP/MQTT                 MQTT/WS                  WebSocket
```

1. **Vital Signs Simulator**: Generates realistic vital signs data
2. **Backend Server**: Processes data and relays it via MQTT and WebSockets
3. **Dashboard Visualizer**: Displays vital signs in real-time with charts and indicators

## Components

### Backend Server

The backend server acts as a bridge between the simulator and the dashboard, handling data processing and communication.

#### Technologies

- Node.js
- Express
- MQTT

#### Install mqtt broker

https://mosquitto.org/download/

#### Install MQTT Explorer

https://mqttexplorer.com/download/

#### Setup

```bash
git clone https://github.com/warathepj/livecare-backend.git

# Navigate to backend directory
cd livecare-backend

# Install dependencies
npm install

# Start Server
npm run dev

# Subscribe to mqtt broker
npm start
```

#### Configuration

- Configure MQTT broker settings in `.env` file:

```
MQTT_BROKER_URL=mqtt://localhost:1883
MQTT_USERNAME=your_username
MQTT_PASSWORD=your_password
PORT=3000
```

### Vital Signs Simulator

A React-based application that generates realistic vital signs data and sends it to the backend.

#### Simulated Vital Signs

- Heart Rate: 40-130 bpm
- Blood Pressure: 80-190/50-130 mmHg
- Oxygen Saturation (SpO2): 80-100%
- Body Temperature: 34-40°C
- Blood Glucose: 50-350 mg/dL

#### Setup

```bash
git clone https://github.com/warathepj/livecare-simulator.git

# Navigate to simulator directory
cd livecare-simulator

# Install dependencies
npm install

# Start the simulator
npm run dev
```

#### Usage

- The simulator automatically generates new vital signs every 10 seconds
- You can manually generate new values using the interface
- Configure the API endpoint in the settings

### Heartbeat Dashboard Visualizer

A React-based dashboard that visualizes vital signs data in real-time.

#### Features

- Real-time vital signs monitoring
- Historical data visualization with charts
- Status indicators for abnormal readings
- Responsive design for various screen sizes

#### Technologies

- React
- TypeScript
- Recharts for data visualization
- shadcn/ui components
- Tailwind CSS

#### Setup

```bash
git clone https://github.com/warathepj/heartbeat-dashboard-visualizer.git
# Navigate to dashboard directory
cd heartbeat-dashboard-visualizer

# Install dependencies
npm install

# Start the dashboard
npm run dev
```

#### Configuration

- WebSocket connection settings can be configured in `src/lib/realWebsocket.ts`

## System Requirements

- Node.js 16.x or higher
- npm 8.x or higher
- Modern web browser with WebSocket support

## Development

### Project Structure

```
├── backend/                  # Backend server
├── livecare-simulator/    # Vital signs simulator
└── heartbeat-dashboard-visualizer/      # Dashboard visualizer
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
