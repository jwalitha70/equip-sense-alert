
import { Equipment } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import StatusIndicator from './StatusIndicator';
import { CalendarDays, MapPin } from 'lucide-react';

interface EquipmentCardProps {
  equipment: Equipment;
  onClick: (equipment: Equipment) => void;
}

const EquipmentCard = ({ equipment, onClick }: EquipmentCardProps) => {
  const getHealthColor = () => {
    if (equipment.status === 'inactive') return 'text-equipment-inactive';
    if (equipment.healthScore >= 80) return 'text-equipment-healthy';
    if (equipment.healthScore >= 50) return 'text-equipment-warning';
    return 'text-equipment-critical';
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow duration-300 h-full" 
      onClick={() => onClick(equipment)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <CardTitle className="text-lg">{equipment.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{equipment.type}</p>
          </div>
          <StatusIndicator status={equipment.status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-3 space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-muted-foreground">Health Score</span>
              <span className={`text-sm font-medium ${getHealthColor()}`}>
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
          </div>
          
          <div className="flex items-center gap-2 text-xs">
            <CalendarDays className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">Next Maintenance:</span>
            <span>{equipment.status === 'inactive' ? 'N/A' : equipment.nextMaintenance}</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">Location:</span>
            <span>{equipment.location}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EquipmentCard;
