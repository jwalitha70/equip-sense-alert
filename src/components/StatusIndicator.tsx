
import { cn } from "@/lib/utils";
import { EquipmentStatus } from "@/lib/mock-data";

interface StatusIndicatorProps {
  status: EquipmentStatus;
  showLabel?: boolean;
  className?: string;
}

const StatusIndicator = ({ status, showLabel = true, className }: StatusIndicatorProps) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'healthy':
        return { color: 'bg-equipment-healthy', text: 'Healthy' };
      case 'warning':
        return { color: 'bg-equipment-warning', text: 'Warning' };
      case 'critical':
        return { color: 'bg-equipment-critical', text: 'Critical' };
      case 'inactive':
        return { color: 'bg-equipment-inactive', text: 'Inactive' };
      default:
        return { color: 'bg-gray-400', text: 'Unknown' };
    }
  };

  const { color, text } = getStatusInfo();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "h-3 w-3 rounded-full animate-pulse-subtle", 
        color
      )}></div>
      {showLabel && <span className="text-sm font-medium">{text}</span>}
    </div>
  );
};

export default StatusIndicator;
