
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Alert } from "@/lib/mock-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  alerts: Alert[];
  onMenuClick: () => void;
  onMarkAllRead: () => void;
}

const DashboardHeader = ({ alerts, onMenuClick, onMarkAllRead }: DashboardHeaderProps) => {
  const unreadAlerts = alerts.filter(alert => !alert.isRead);

  return (
    <header className="flex justify-between items-center p-4 border-b">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold ml-2">EquipSense Alert</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {unreadAlerts.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <div className="flex justify-between items-center p-2 border-b">
              <span className="font-medium text-sm">Notifications</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-7" 
                onClick={onMarkAllRead}
                disabled={unreadAlerts.length === 0}
              >
                Mark all read
              </Button>
            </div>
            {alerts.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No notifications
              </div>
            ) : (
              <div className="max-h-[300px] overflow-auto py-1">
                {alerts.slice(0, 5).map((alert) => (
                  <DropdownMenuItem key={alert.id} className="cursor-pointer">
                    <div className="flex gap-2 items-start w-full">
                      <div className="mt-1">
                        {alert.severity === 'high' && <div className="w-2 h-2 rounded-full bg-equipment-critical"></div>}
                        {alert.severity === 'medium' && <div className="w-2 h-2 rounded-full bg-equipment-warning"></div>}
                        {alert.severity === 'low' && <div className="w-2 h-2 rounded-full bg-equipment-normal"></div>}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">{new Date(alert.timestamp).toLocaleString()}</p>
                      </div>
                      {!alert.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>}
                    </div>
                  </DropdownMenuItem>
                ))}
                {alerts.length > 5 && (
                  <div className="p-2 text-center text-xs border-t">
                    <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                      View all alerts
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
