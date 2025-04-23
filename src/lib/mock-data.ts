import { subHours, addHours, format, subDays } from 'date-fns';

// Define types
export type EquipmentStatus = 'healthy' | 'warning' | 'critical' | 'inactive';

export interface Equipment {
  id: string;
  name: string;
  type: string;
  status: EquipmentStatus;
  lastMaintenance: string;
  nextMaintenance: string;
  healthScore: number;
  location: string;
  sensors: Sensor[];
}

export interface Sensor {
  id: string;
  name: string;
  type: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  criticalLow?: number;
  criticalHigh?: number;
  warningLow?: number;
  warningHigh?: number;
}

export interface Alert {
  id: string;
  equipmentId: string;
  equipmentName: string;
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  isRead: boolean;
}

export interface SensorReading {
  timestamp: string;
  value: number;
}

// Generate mock equipment data
export const generateMockEquipment = (): Equipment[] => {
  const equipment: Equipment[] = [
    {
      id: 'pump-001',
      name: 'Centrifugal Pump A1',
      type: 'Pump',
      status: 'healthy',
      lastMaintenance: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
      nextMaintenance: format(addHours(new Date(), 720), 'yyyy-MM-dd'),
      healthScore: 92,
      location: 'Building A, Floor 1',
      sensors: [
        {
          id: 'temp-001',
          name: 'Temperature',
          type: 'temperature',
          value: 65,
          unit: '°C',
          min: 20,
          max: 100,
          criticalLow: 30,
          criticalHigh: 85,
          warningLow: 40,
          warningHigh: 75,
        },
        {
          id: 'vib-001',
          name: 'Vibration',
          type: 'vibration',
          value: 2.3,
          unit: 'mm/s',
          min: 0,
          max: 10,
          criticalHigh: 8,
          warningHigh: 5,
        },
        {
          id: 'press-001',
          name: 'Pressure',
          type: 'pressure',
          value: 4.2,
          unit: 'bar',
          min: 0,
          max: 10,
          criticalLow: 1,
          criticalHigh: 9,
          warningLow: 2,
          warningHigh: 8,
        }
      ]
    },
    {
      id: 'motor-001',
      name: 'Electric Motor B2',
      type: 'Motor',
      status: 'warning',
      lastMaintenance: format(subDays(new Date(), 60), 'yyyy-MM-dd'),
      nextMaintenance: format(addHours(new Date(), 160), 'yyyy-MM-dd'),
      healthScore: 68,
      location: 'Building B, Floor 2',
      sensors: [
        {
          id: 'temp-002',
          name: 'Temperature',
          type: 'temperature',
          value: 78,
          unit: '°C',
          min: 20,
          max: 120,
          criticalLow: 30,
          criticalHigh: 100,
          warningLow: 40,
          warningHigh: 70,
        },
        {
          id: 'current-001',
          name: 'Current',
          type: 'current',
          value: 42,
          unit: 'A',
          min: 0,
          max: 100,
          criticalHigh: 80,
          warningHigh: 60,
        },
        {
          id: 'rpm-001',
          name: 'RPM',
          type: 'rpm',
          value: 1750,
          unit: 'rpm',
          min: 0,
          max: 3000,
          criticalHigh: 2800,
          warningHigh: 2500,
        }
      ]
    },
    {
      id: 'compressor-001',
      name: 'Air Compressor C3',
      type: 'Compressor',
      status: 'critical',
      lastMaintenance: format(subDays(new Date(), 90), 'yyyy-MM-dd'),
      nextMaintenance: format(addHours(new Date(), 24), 'yyyy-MM-dd'),
      healthScore: 32,
      location: 'Building C, Floor 1',
      sensors: [
        {
          id: 'temp-003',
          name: 'Temperature',
          type: 'temperature',
          value: 92,
          unit: '°C',
          min: 20,
          max: 100,
          criticalLow: 30,
          criticalHigh: 85,
          warningLow: 40,
          warningHigh: 75,
        },
        {
          id: 'press-002',
          name: 'Pressure',
          type: 'pressure',
          value: 8.7,
          unit: 'bar',
          min: 0,
          max: 10,
          criticalLow: 1,
          criticalHigh: 9,
          warningLow: 2,
          warningHigh: 8,
        }
      ]
    },
    {
      id: 'hvac-001',
      name: 'HVAC System D4',
      type: 'HVAC',
      status: 'inactive',
      lastMaintenance: format(subDays(new Date(), 15), 'yyyy-MM-dd'),
      nextMaintenance: format(addHours(new Date(), 340), 'yyyy-MM-dd'),
      healthScore: 0,
      location: 'Building D, Floor 4',
      sensors: [
        {
          id: 'temp-004',
          name: 'Temperature',
          type: 'temperature',
          value: 0,
          unit: '°C',
          min: 10,
          max: 35,
          criticalLow: 15,
          criticalHigh: 30,
          warningLow: 18,
          warningHigh: 28,
        },
        {
          id: 'humid-001',
          name: 'Humidity',
          type: 'humidity',
          value: 0,
          unit: '%',
          min: 30,
          max: 70,
          criticalLow: 35,
          criticalHigh: 65,
          warningLow: 40,
          warningHigh: 60,
        }
      ]
    },
    {
      id: 'generator-001',
      name: 'Backup Generator E5',
      type: 'Generator',
      status: 'healthy',
      lastMaintenance: format(subDays(new Date(), 10), 'yyyy-MM-dd'),
      nextMaintenance: format(addHours(new Date(), 500), 'yyyy-MM-dd'),
      healthScore: 95,
      location: 'Building E, Basement',
      sensors: [
        {
          id: 'fuel-001',
          name: 'Fuel Level',
          type: 'level',
          value: 87,
          unit: '%',
          min: 0,
          max: 100,
          criticalLow: 15,
          warningLow: 30,
        },
        {
          id: 'voltage-001',
          name: 'Voltage',
          type: 'voltage',
          value: 240,
          unit: 'V',
          min: 210,
          max: 250,
          criticalLow: 220,
          criticalHigh: 245,
          warningLow: 225,
          warningHigh: 240,
        }
      ]
    },
    {
      id: 'bore-001',
      name: 'Index Bore System X1',
      type: 'Bore',
      status: 'healthy',
      lastMaintenance: format(subDays(new Date(), 15), 'yyyy-MM-dd'),
      nextMaintenance: format(addHours(new Date(), 480), 'yyyy-MM-dd'),
      healthScore: 88,
      location: 'Building X, Floor 1',
      sensors: [
        {
          id: 'depth-001',
          name: 'Bore Depth',
          type: 'bore-depth',
          value: 150.5,
          unit: 'm',
          min: 0,
          max: 300,
          criticalLow: 20,
          criticalHigh: 280,
          warningLow: 50,
          warningHigh: 250,
        },
        {
          id: 'pressure-bore-001',
          name: 'Bore Pressure',
          type: 'pressure',
          value: 5.8,
          unit: 'bar',
          min: 0,
          max: 10,
          criticalLow: 1,
          criticalHigh: 9,
          warningLow: 2,
          warningHigh: 8,
        },
        {
          id: 'flow-001',
          name: 'Flow Rate',
          type: 'flow',
          value: 42.3,
          unit: 'L/min',
          min: 0,
          max: 100,
          criticalLow: 10,
          criticalHigh: 90,
          warningLow: 20,
          warningHigh: 80,
        }
      ]
    }
  ];
  
  return equipment;
};

// Generate mock alerts based on equipment status
export const generateMockAlerts = (equipment: Equipment[]): Alert[] => {
  const alerts: Alert[] = [];
  
  equipment.forEach(equip => {
    if (equip.status === 'warning') {
      alerts.push({
        id: `alert-${equip.id}-1`,
        equipmentId: equip.id,
        equipmentName: equip.name,
        message: `Maintenance required soon for ${equip.name}`,
        timestamp: format(subHours(new Date(), 4), 'yyyy-MM-dd HH:mm:ss'),
        severity: 'medium',
        isRead: false,
      });
    } else if (equip.status === 'critical') {
      alerts.push({
        id: `alert-${equip.id}-2`,
        equipmentId: equip.id,
        equipmentName: equip.name,
        message: `Critical failure risk detected on ${equip.name}`,
        timestamp: format(subHours(new Date(), 2), 'yyyy-MM-dd HH:mm:ss'),
        severity: 'high',
        isRead: false,
      });
      
      alerts.push({
        id: `alert-${equip.id}-3`,
        equipmentId: equip.id,
        equipmentName: equip.name,
        message: `Temperature exceeds safe threshold on ${equip.name}`,
        timestamp: format(subHours(new Date(), 1), 'yyyy-MM-dd HH:mm:ss'),
        severity: 'high',
        isRead: false,
      });
    }
    
    // Add some historical alerts
    if (Math.random() > 0.5) {
      alerts.push({
        id: `alert-${equip.id}-hist-1`,
        equipmentId: equip.id,
        equipmentName: equip.name,
        message: `Scheduled maintenance completed for ${equip.name}`,
        timestamp: format(subDays(new Date(), 30), 'yyyy-MM-dd HH:mm:ss'),
        severity: 'low',
        isRead: true,
      });
    }
  });
  
  return alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Generate historical sensor data
export const generateHistoricalSensorData = (
  sensorType: string, 
  hoursBack: number = 24, 
  pointCount: number = 96
): SensorReading[] => {
  const data: SensorReading[] = [];
  const now = new Date();
  const interval = hoursBack * 60 / pointCount;
  
  let baseValue = 0;
  let amplitude = 0;
  let trend = 0;
  
  switch (sensorType) {
    case 'temperature':
      baseValue = 60;
      amplitude = 10;
      trend = 0.5;
      break;
    case 'vibration':
      baseValue = 2;
      amplitude = 1;
      trend = 0.05;
      break;
    case 'pressure':
      baseValue = 5;
      amplitude = 1;
      trend = -0.02;
      break;
    case 'current':
      baseValue = 40;
      amplitude = 5;
      break;
    case 'rpm':
      baseValue = 1800;
      amplitude = 150;
      break;
    case 'humidity':
      baseValue = 50;
      amplitude = 10;
      break;
    case 'level':
      baseValue = 90;
      amplitude = 3;
      trend = -0.1;
      break;
    case 'voltage':
      baseValue = 230;
      amplitude = 10;
      break;
    case 'bore-depth':
      baseValue = 150;
      amplitude = 5;
      trend = -0.01;
      break;
    case 'flow':
      baseValue = 45;
      amplitude = 8;
      trend = 0.02;
      break;
    default:
      baseValue = 50;
      amplitude = 10;
  }
  
  for (let i = 0; i < pointCount; i++) {
    const minutesBack = i * interval;
    const timestamp = format(
      subHours(now, hoursBack * (i / pointCount)),
      'yyyy-MM-dd HH:mm:ss'
    );
    
    // Generate a value with some randomness, trend, and occasional spikes
    let value = baseValue + (trend * i);
    
    // Add sinusoidal pattern
    value += Math.sin(i / 10) * (amplitude * 0.5);
    
    // Add random noise
    value += (Math.random() - 0.5) * amplitude;
    
    // Add occasional spikes (5% chance)
    if (Math.random() < 0.05) {
      value += (Math.random() * amplitude * 2) * (Math.random() > 0.5 ? 1 : -1);
    }
    
    data.push({
      timestamp,
      value: Number(value.toFixed(2))
    });
  }
  
  return data;
};
