
import { Equipment, SensorReading, generateHistoricalSensorData } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import StatusIndicator from "./StatusIndicator";
import SensorChart from "./SensorChart";
import { Clock, Settings, Tool, CalendarDays, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

interface EquipmentDetailProps {
  equipment: Equipment;
}

const EquipmentDetail = ({ equipment }: EquipmentDetailProps) => {
  const [sensorData, setSensorData] = useState<Record<string, SensorReading[]>>({});
  
  useEffect(() => {
    const data: Record<string, SensorReading[]> = {};
    
    equipment.sensors.forEach(sensor => {
      data[sensor.id] = generateHistoricalSensorData(sensor.type, 24, 96);
    });
    
    setSensorData(data);
  }, [equipment.id]);
  
  const getHealthColor = () => {
    if (equipment.status === 'inactive') return 'text-equipment-inactive';
    if (equipment.healthScore >= 80) return 'text-equipment-healthy';
    if (equipment.healthScore >= 50) return 'text-equipment-warning';
    return 'text-equipment-critical';
  };

  const getNextMaintenanceDays = () => {
    if (equipment.status === 'inactive') return 'N/A';
    const today = new Date();
    const nextMaintenance = new Date(equipment.nextMaintenance);
    const diffTime = nextMaintenance.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">{equipment.name}</h2>
          <p className="text-muted-foreground">{equipment.type}</p>
        </div>
        <div className="flex items-center gap-2 mt-2 lg:mt-0">
          <StatusIndicator status={equipment.status} className="px-2 py-1 bg-white border rounded-md" />
          <Button variant="outline" size="sm" className="gap-1">
            <Tool className="h-4 w-4 mr-1" />
            Schedule Maintenance
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm text-muted-foreground">Health Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2 flex items-center gap-2">
              <span className={getHealthColor()}>
                {equipment.status === 'inactive' ? 'N/A' : `${equipment.healthScore}%`}
              </span>
            </div>
            <Progress 
              value={equipment.status === 'inactive' ? 0 : equipment.healthScore} 
              className={`h-2 ${
                equipment.status === 'inactive' 
                  ? 'bg-gray-200' 
                  : equipment.healthScore >= 80 
                    ? 'bg-green-100' 
                    : equipment.healthScore >= 50 
                      ? 'bg-amber-100' 
                      : 'bg-red-100'
              }`}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm text-muted-foreground">Next Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2 flex items-center gap-2">
              {getNextMaintenanceDays()}
            </div>
            <div className="text-xs text-muted-foreground flex items-center">
              <CalendarDays className="h-3 w-3 mr-1" />
              {equipment.status === 'inactive' ? 'Not scheduled' : equipment.nextMaintenance}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm text-muted-foreground">Last Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2 flex items-center gap-2">
              {equipment.lastMaintenance}
            </div>
            <div className="text-xs text-muted-foreground flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              30 days ago
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm text-muted-foreground">Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium mb-2 flex items-center gap-2">
              {equipment.location}
            </div>
            <div className="text-xs text-muted-foreground flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              View on map
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="sensors" className="w-full">
        <TabsList>
          <TabsTrigger value="sensors">Sensor Data</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sensors">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            {equipment.sensors.map((sensor) => (
              <Card key={sensor.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-md">{sensor.name}</CardTitle>
                    <div className="text-xl font-bold">
                      {equipment.status === 'inactive' ? 'N/A' : `${sensor.value} ${sensor.unit}`}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {sensorData[sensor.id] && equipment.status !== 'inactive' ? (
                    <SensorChart 
                      data={sensorData[sensor.id]} 
                      sensor={sensor}
                    />
                  ) : (
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                      No data available
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="predictions">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Failure Prediction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8">
                {equipment.status === 'critical' ? (
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center bg-red-50 text-red-700 text-lg font-bold p-4 rounded-full h-24 w-24 border-4 border-red-200">
                      93%
                    </div>
                    <div>
                      <p className="text-lg font-bold text-red-700">Imminent Failure Risk</p>
                      <p className="text-sm text-muted-foreground">Predicted within 24 hours</p>
                      <Button className="mt-4 bg-red-600 hover:bg-red-700">Schedule Emergency Maintenance</Button>
                    </div>
                  </div>
                ) : equipment.status === 'warning' ? (
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center bg-amber-50 text-amber-700 text-lg font-bold p-4 rounded-full h-24 w-24 border-4 border-amber-200">
                      68%
                    </div>
                    <div>
                      <p className="text-lg font-bold text-amber-700">Elevated Failure Risk</p>
                      <p className="text-sm text-muted-foreground">Predicted within 7 days</p>
                      <Button className="mt-4 bg-amber-600 hover:bg-amber-700">Schedule Preventive Maintenance</Button>
                    </div>
                  </div>
                ) : equipment.status === 'healthy' ? (
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center bg-green-50 text-green-700 text-lg font-bold p-4 rounded-full h-24 w-24 border-4 border-green-200">
                      12%
                    </div>
                    <div>
                      <p className="text-lg font-bold text-green-700">Low Failure Risk</p>
                      <p className="text-sm text-muted-foreground">No issues predicted within 30 days</p>
                      <Button className="mt-4" variant="outline">View Detailed Analysis</Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-muted-foreground">Equipment is currently inactive. No prediction available.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="maintenance">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Maintenance History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 border-b pb-4">
                  <div className="bg-blue-50 text-blue-600 rounded-full h-10 w-10 flex items-center justify-center shrink-0">
                    <Tool className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Regular Maintenance</p>
                    <p className="text-sm text-muted-foreground">{equipment.lastMaintenance}</p>
                    <p className="text-sm mt-1">Replaced air filters and lubricated moving parts</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 border-b pb-4">
                  <div className="bg-blue-50 text-blue-600 rounded-full h-10 w-10 flex items-center justify-center shrink-0">
                    <Tool className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Preventive Maintenance</p>
                    <p className="text-sm text-muted-foreground">2025-03-14</p>
                    <p className="text-sm mt-1">Inspected bearings and performed vibration analysis</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 border-b pb-4">
                  <div className="bg-red-50 text-red-600 rounded-full h-10 w-10 flex items-center justify-center shrink-0">
                    <Settings className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Urgent Repair</p>
                    <p className="text-sm text-muted-foreground">2025-01-22</p>
                    <p className="text-sm mt-1">Replaced faulty pressure control valve</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Equipment Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Configure maintenance schedules and alert thresholds</p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Maintenance Interval (days)</label>
                    <input 
                      type="number" 
                      className="w-full rounded-md border border-input bg-background px-3 py-2" 
                      defaultValue="90" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Health Score Threshold (%)</label>
                    <input 
                      type="number" 
                      className="w-full rounded-md border border-input bg-background px-3 py-2" 
                      defaultValue="50" 
                    />
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button type="button">Save Settings</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EquipmentDetail;
