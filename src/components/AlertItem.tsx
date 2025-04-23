
import { Alert } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { Bell, CheckCircle } from 'lucide-react';

interface AlertItemProps {
  alert: Alert;
  onClick: (alert: Alert) => void;
}

const AlertItem = ({ alert, onClick }: AlertItemProps) => {
  const getSeverityStyles = () => {
    switch (alert.severity) {
      case 'high':
        return 'bg-red-50 border-red-200 hover:bg-red-100';
      case 'medium':
        return 'bg-amber-50 border-amber-200 hover:bg-amber-100';
      default:
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
    }
  };
  
  const getSeverityIndicator = () => {
    switch (alert.severity) {
      case 'high':
        return <div className="w-2 h-2 rounded-full bg-equipment-critical"></div>;
      case 'medium':
        return <div className="w-2 h-2 rounded-full bg-equipment-warning"></div>;
      default:
        return <div className="w-2 h-2 rounded-full bg-equipment-normal"></div>;
    }
  };
  
  const getRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else if (diffMins > 0) {
      return `${diffMins}m ago`;
    } else {
      return 'Just now';
    }
  };
  
  return (
    <div 
      className={cn(
        "p-3 border rounded-md mb-2 cursor-pointer transition-all flex gap-3 items-start",
        getSeverityStyles(),
        alert.isRead ? "opacity-75" : ""
      )}
      onClick={() => onClick(alert)}
    >
      <div className="mt-0.5">
        {getSeverityIndicator()}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <p className="text-sm font-medium">{alert.equipmentName}</p>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {getRelativeTime(alert.timestamp)}
          </span>
        </div>
        <p className="text-xs mt-1">{alert.message}</p>
      </div>
      {!alert.isRead && (
        <span className="bg-blue-500 h-2 w-2 rounded-full mt-1.5"></span>
      )}
    </div>
  );
};

export default AlertItem;
