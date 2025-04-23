
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, Equipment, generateMockAlerts, generateMockEquipment } from "@/lib/mock-data";
import { useToast } from "@/components/ui/use-toast";
import EquipmentCard from "@/components/EquipmentCard";
import DashboardHeader from "@/components/DashboardHeader";
import AlertItem from "@/components/AlertItem";
import EquipmentDetail from "@/components/EquipmentDetail";

const Dashboard = () => {
  const { toast } = useToast();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  useEffect(() => {
    // Generate mock data
    const mockEquipment = generateMockEquipment();
    const mockAlerts = generateMockAlerts(mockEquipment);
    
    setEquipment(mockEquipment);
    setAlerts(mockAlerts);
    
    // Simulate real-time data updates
    const interval = setInterval(() => {
      // Randomly update a sensor value
      if (equipment.length > 0) {
        const updatedEquipment = [...equipment];
        const randomEquipmentIndex = Math.floor(Math.random() * updatedEquipment.length);
        const randomSensorIndex = Math.floor(
          Math.random() * updatedEquipment[randomEquipmentIndex].sensors.length
        );
        
        const currentValue = updatedEquipment[randomEquipmentIndex].sensors[randomSensorIndex].value;
        const randomChange = (Math.random() - 0.5) * 5; // Random value between -2.5 and 2.5
        const newValue = Math.max(0, currentValue + randomChange);
        
        updatedEquipment[randomEquipmentIndex].sensors[randomSensorIndex].value = 
          parseFloat(newValue.toFixed(2));
          
        setEquipment(updatedEquipment);
      }
    }, 5000);
    
    // Simulate new alerts
    const alertInterval = setInterval(() => {
      if (Math.random() > 0.85 && equipment.length > 0) {
        const randomEquipmentIndex = Math.floor(Math.random() * equipment.length);
        const randomEquipment = equipment[randomEquipmentIndex];
        
        if (randomEquipment.status !== 'inactive') {
          const newAlert: Alert = {
            id: `alert-${Date.now()}`,
            equipmentId: randomEquipment.id,
            equipmentName: randomEquipment.name,
            message: `Unusual ${randomEquipment.sensors[0].name.toLowerCase()} detected on ${randomEquipment.name}`,
            timestamp: new Date().toISOString(),
            severity: Math.random() > 0.7 ? 'high' : 'medium',
            isRead: false,
          };
          
          setAlerts(prev => [newAlert, ...prev]);
          
          if (newAlert.severity === 'high') {
            toast({
              title: "Critical Alert",
              description: newAlert.message,
              variant: "destructive",
            });
          } else {
            toast({
              title: "New Alert",
              description: newAlert.message,
            });
          }
        }
      }
    }, 30000);
    
    return () => {
      clearInterval(interval);
      clearInterval(alertInterval);
    };
  }, []);
  
  const handleAlertClick = (alert: Alert) => {
    // Mark alert as read
    setAlerts(
      alerts.map((a) => (a.id === alert.id ? { ...a, isRead: true } : a))
    );
    
    // Find and select corresponding equipment
    const relatedEquipment = equipment.find(e => e.id === alert.equipmentId);
    if (relatedEquipment) {
      setSelectedEquipment(relatedEquipment);
    }
  };
  
  const handleEquipmentClick = (equip: Equipment) => {
    setSelectedEquipment(equip);
  };
  
  const handleMarkAllAlertsRead = () => {
    setAlerts(alerts.map(alert => ({ ...alert, isRead: true })));
    toast({
      title: "All alerts marked as read",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <DashboardHeader 
        alerts={alerts}
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        onMarkAllRead={handleMarkAllAlertsRead}
      />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div 
          className={`${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:relative z-10 w-64 h-[calc(100vh-64px)] bg-white shadow-md transition-transform lg:block border-r`}
        >
          <div className="p-4 border-b">
            <h2 className="font-bold">Equipment Overview</h2>
          </div>
          <div className="p-2 overflow-auto h-[calc(100%-117px)]">
            {equipment.map(equip => (
              <div 
                key={equip.id}
                onClick={() => {
                  handleEquipmentClick(equip);
                  setIsSidebarOpen(false);
                }}
                className={`p-2 rounded-md cursor-pointer mb-1 transition-colors flex items-center gap-2 ${
                  selectedEquipment?.id === equip.id 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <div 
                  className={`w-2 h-2 rounded-full ${
                    equip.status === 'healthy' 
                      ? 'bg-equipment-healthy' 
                      : equip.status === 'warning' 
                        ? 'bg-equipment-warning' 
                        : equip.status === 'critical' 
                          ? 'bg-equipment-critical' 
                          : 'bg-equipment-inactive'
                  }`}
                ></div>
                <span className="text-sm truncate">{equip.name}</span>
              </div>
            ))}
          </div>
          <div className="p-4 border-t">
            <div className="text-xs text-muted-foreground">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-equipment-healthy"></div>
                <span>Healthy: {equipment.filter(e => e.status === 'healthy').length}</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-equipment-warning"></div>
                <span>Warning: {equipment.filter(e => e.status === 'warning').length}</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-equipment-critical"></div>
                <span>Critical: {equipment.filter(e => e.status === 'critical').length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-equipment-inactive"></div>
                <span>Inactive: {equipment.filter(e => e.status === 'inactive').length}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-auto p-4 w-full">
          {selectedEquipment ? (
            <EquipmentDetail equipment={selectedEquipment} />
          ) : (
            <>
              {/* Dashboard overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm text-muted-foreground">Total Equipment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{equipment.length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm text-muted-foreground">Healthy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-equipment-healthy">
                      {equipment.filter(e => e.status === 'healthy').length}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm text-muted-foreground">Warning</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-equipment-warning">
                      {equipment.filter(e => e.status === 'warning').length}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm text-muted-foreground">Critical</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-equipment-critical">
                      {equipment.filter(e => e.status === 'critical').length}
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList>
                      <TabsTrigger value="all">All Equipment</TabsTrigger>
                      <TabsTrigger value="warning">Needs Attention</TabsTrigger>
                    </TabsList>
                    <TabsContent value="all">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
                        {equipment.map(equip => (
                          <EquipmentCard 
                            key={equip.id} 
                            equipment={equip} 
                            onClick={handleEquipmentClick} 
                          />
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="warning">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
                        {equipment
                          .filter(equip => equip.status === 'warning' || equip.status === 'critical')
                          .map(equip => (
                            <EquipmentCard 
                              key={equip.id} 
                              equipment={equip} 
                              onClick={handleEquipmentClick} 
                            />
                          ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                
                <div>
                  <Card className="h-full">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle>Recent Alerts</CardTitle>
                        <span className="text-xs text-muted-foreground">
                          {alerts.filter(a => !a.isRead).length} unread
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {alerts.length > 0 ? (
                        <div className="overflow-auto max-h-[480px] pr-1">
                          {alerts.map(alert => (
                            <AlertItem 
                              key={alert.id} 
                              alert={alert} 
                              onClick={handleAlertClick} 
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                          <p>No alerts to display</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
