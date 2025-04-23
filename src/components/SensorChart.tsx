
import { useRef, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { SensorReading, Sensor } from '@/lib/mock-data';

interface SensorChartProps {
  data: SensorReading[];
  sensor: Sensor;
  className?: string;
}

const SensorChart = ({ data, sensor, className }: SensorChartProps) => {
  const formatXAxis = (tickItem: string) => {
    try {
      return new Date(tickItem).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return tickItem;
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow text-xs">
          <p className="font-medium">{new Date(label).toLocaleString([], { 
            hour: '2-digit',
            minute: '2-digit',
            month: 'short',
            day: 'numeric'
          })}</p>
          <p className="text-sm">
            {sensor.name}: {payload[0].value} {sensor.unit}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`sensor-chart ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="timestamp" 
            tick={{ fontSize: 10 }} 
            tickFormatter={formatXAxis}
            minTickGap={30}
            tickLine={false}
          />
          <YAxis 
            domain={[
              Math.min(sensor.min, Math.min(...data.map(d => d.value)) * 0.9), 
              Math.max(sensor.max, Math.max(...data.map(d => d.value)) * 1.1)
            ]} 
            tick={{ fontSize: 10 }}
            tickCount={5}
            width={30}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {sensor.warningHigh && (
            <ReferenceLine 
              y={sensor.warningHigh} 
              stroke="#F59E0B" 
              strokeDasharray="3 3" 
              label={{ value: 'Warning', position: 'insideTopRight', fontSize: 10 }} 
            />
          )}
          
          {sensor.criticalHigh && (
            <ReferenceLine 
              y={sensor.criticalHigh} 
              stroke="#EF4444" 
              strokeDasharray="3 3" 
              label={{ value: 'Critical', position: 'insideTopRight', fontSize: 10 }} 
            />
          )}
          
          {sensor.warningLow && (
            <ReferenceLine 
              y={sensor.warningLow} 
              stroke="#F59E0B" 
              strokeDasharray="3 3" 
              label={{ value: 'Warning', position: 'insideBottomRight', fontSize: 10 }} 
            />
          )}
          
          {sensor.criticalLow && (
            <ReferenceLine 
              y={sensor.criticalLow} 
              stroke="#EF4444" 
              strokeDasharray="3 3" 
              label={{ value: 'Critical', position: 'insideBottomRight', fontSize: 10 }} 
            />
          )}
          
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SensorChart;
