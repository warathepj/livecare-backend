# LiveCare System: Comprehensive Technical Documentation

## Table of Contents

1. [System Overview](#system-overview)
2. [Vital Signs Monitoring](#vital-signs-monitoring)
   - [Normal Ranges](#normal-ranges)
   - [Abnormal/Alert Thresholds](#abnormalalert-thresholds)
3. [Sensors and Hardware](#sensors-and-hardware)
   - [Heart Rate & SpO2 Sensors](#heart-rate--spo2-sensors)
   - [Blood Pressure Monitors](#blood-pressure-monitors)
   - [Temperature Sensors](#temperature-sensors)
   - [Blood Glucose Monitors](#blood-glucose-monitors)
4. [MQTT Communication](#mqtt-communication)
   - [Message Formats](#message-formats)
   - [Topics Structure](#topics-structure)
5. [Dashboard Visualization](#dashboard-visualization)

## System Overview

LiveCare is a remote patient monitoring system that uses IoT devices to track vital signs in real-time. The system collects data from various sensors, transmits it via MQTT protocol, and visualizes it on a dashboard for healthcare providers to monitor patients remotely.

The system architecture consists of:

- Sensor devices that collect vital signs data
- MQTT communication for data transmission
- Backend processing system
- Dashboard for visualization and alerts

## Vital Signs Monitoring

The system monitors the following vital signs:

- Heart Rate (HR)
- Blood Pressure (BP) - Systolic and Diastolic
- Oxygen Saturation (SpO2)
- Body Temperature
- Blood Glucose Levels

### Normal Ranges

For healthy individuals, vital signs typically fall within these ranges:

| Vital Sign               | Normal Range                           |
| ------------------------ | -------------------------------------- |
| Heart Rate               | 60-100 bpm (can be lower for athletes) |
| Blood Pressure           | <120/80 mmHg                           |
| Respiratory Rate         | 12-20 breaths per minute               |
| Body Temperature         | 36.5-37.5°C (97.7-99.5°F)              |
| Oxygen Saturation (SpO2) | 95-100%                                |
| Blood Glucose (fasting)  | 70-100 mg/dL                           |

### Abnormal/Alert Thresholds

The system triggers alerts when vital signs fall outside these ranges:

| Vital Sign                 | Alert Threshold                |
| -------------------------- | ------------------------------ |
| Heart Rate                 | <50 bpm or >120 bpm            |
| Blood Pressure (Systolic)  | <90 mmHg or >180 mmHg          |
| Blood Pressure (Diastolic) | <60 mmHg or >110-120 mmHg      |
| Respiratory Rate           | <10 or >24 breaths per minute  |
| Body Temperature           | <35°C (Hypothermia) or >38.5°C |
| Oxygen Saturation (SpO2)   | <92%                           |
| Blood Glucose              | >250-300 mg/dL                 |

## Sensors and Hardware

### Heart Rate & SpO2 Sensors

**MAX30102 Heart Rate Sensor Module**

- Measures heart rate and blood oxygen concentration
- Compatible with Arduino UNO R3, STM32
- Typical readings: Heart rate (60-100 bpm), SpO2 (95-100%)

Implementation notes:

- Uses I2C communication protocol
- Can be integrated with temperature sensors for comprehensive monitoring
- Libraries: Wire.h for I2C communication

### Blood Pressure Monitors

**Recommended Bluetooth-enabled Blood Pressure Monitors:**

1. **Omron Smart Elite+ HEM-7600T**

   - Price: ~6820 THB
   - Features: Bluetooth connectivity, smartphone app integration

2. **Withings BPM Core Monitor**

   - Price: ~8330 THB
   - Features: Includes ECG and Bluetooth connectivity

3. **Qardio QardioArm Wireless Blood Pressure Monitor**

   - Price: ~2230 THB
   - Features: Compact design, Bluetooth connectivity

4. **ROSSMAX X5 Bluetooth**

   - Features: Arrhythmia detection, Bluetooth connectivity

5. **Omron Complete Wireless + EKG**
   - Price: ~3940 THB
   - Features: Includes EKG functionality

Implementation notes:

- Most devices use Bluetooth Low Energy (BLE) protocol
- Can be connected to microcontrollers like ESP32 for data forwarding to MQTT

### Temperature Sensors

For DIY projects:

- **GY-906 MLX90614**: Non-contact infrared temperature sensor
- **DS18B20**: Digital temperature sensor, waterproof versions available

For medical applications:

- **HealthyPi 5**: Comprehensive medical-grade device that measures temperature, ECG, PPG, SpO2 and connects via Wi-Fi or BLE

### Blood Glucose Monitors

Implementation notes:

- Most commercial glucose monitors use proprietary protocols
- Can be integrated with microcontrollers for data transmission
- Typical monitoring range: 50-350 mg/dL

## MQTT Communication

### Message Formats

**Heart Rate & SpO2 Sensor (MAX30102) Message Format:**

```json
{
  "id": "device001",
  "heart_rate": 72,
  "spo2": 98,
  "timestamp": "2025-05-05T15:35:38+07:00"
}
```

**With Temperature Data:**

```json
{
  "id": "device001",
  "heart_rate": 72,
  "spo2": 98,
  "temperature": 36.7,
  "timestamp": "2025-05-05T15:35:38+07:00"
}
```

**Multiple Devices Format:**

```json
{
  "id1": { "heart_rate": 69, "spo2": 100, "temperature": 35.81 },
  "id2": { "heart_rate": 72, "spo2": 99, "temperature": 35.89 },
  "id3": { "heart_rate": 74, "spo2": 97, "temperature": 35.85 }
}
```

**Blood Pressure Monitor Message Format:**

```json
{
  "device_id": "BP_Monitor_001",
  "patient_id": "PAT_12345",
  "timestamp": "2023-10-27T10:35:00Z",
  "blood_pressure": {
    "systolic": 120,
    "diastolic": 80,
    "unit": "mmHg"
  },
  "pulse_rate": {
    "value": 75,
    "unit": "bpm"
  }
}
```

**Comprehensive Vital Signs Message Format:**

```json
{
  "device_id": "LiveCare_001",
  "patient_id": "PAT_12345",
  "timestamp": "2023-10-27T10:35:00Z",
  "heart_rate": {
    "value": 75,
    "unit": "bpm"
  },
  "blood_pressure": {
    "systolic": 120,
    "diastolic": 80,
    "unit": "mmHg"
  },
  "spo2": {
    "value": 98,
    "unit": "%"
  },
  "temperature": {
    "value": 36.7,
    "unit": "C"
  },
  "blood_glucose": {
    "value": 95,
    "unit": "mg/dL"
  }
}
```

### Topics Structure

Recommended MQTT topics structure:

- `health/monitor` - General health monitoring data
- `health/[device_id]/vitals` - Vital signs from specific devices
- `health/[patient_id]/vitals` - Vital signs from specific patients
- `health/alerts` - Critical alerts that require immediate attention

## Dashboard Visualization

The dashboard interface should:

- Display real-time vital signs data
- Show historical trends through charts
- Provide visual alerts for abnormal readings
- Support multiple patient views

**Interface Requirements:**

```typescript
export interface VitalSigns {
  heartRate: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  spO2: number;
  temperature: number;
  bloodGlucose: number;
  timestamp: Date;
}
```

**Simulator Ranges for Testing:**

- Heart Rate: 40-130 bpm
- Blood Pressure: 80-190/50-130 mmHg
- Oxygen Saturation (SpO2): 80-100%
- Body Temperature: 34-40°C
- Blood Glucose: 50-350 mg/dL

The dashboard should use color coding to indicate status:

- Normal values: Green
- Warning values: Yellow
- Critical values: Red

Data should be updated in real-time with timestamps to show the most recent readings.
