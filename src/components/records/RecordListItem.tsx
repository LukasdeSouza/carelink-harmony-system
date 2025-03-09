
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MedicalRecord } from "@/types/medical-record";
import { format } from "date-fns";
import { Activity, FileEdit, User } from "lucide-react";

interface RecordListItemProps {
  record: MedicalRecord;
  onView: (record: MedicalRecord) => void;
}

export function RecordListItem({ record, onView }: RecordListItemProps) {
  const recordDate = new Date(record.dateTime);
  
  // Calculate if this is a recent record (less than 48 hours)
  const isRecent = Date.now() - recordDate.getTime() < 48 * 60 * 60 * 1000;
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10 bg-blue-100">
              <AvatarFallback className="text-blue-600">
                <User size={18} />
              </AvatarFallback>
            </Avatar>
            
            <div>
              <div className="font-medium">{record.patientName}</div>
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <span>{format(recordDate, "dd/MM/yyyy")}</span>
                <span>•</span>
                <span>{format(recordDate, "HH:mm")}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isRecent && (
              <Badge variant="success" className="px-2 py-1 text-xs flex items-center gap-1">
                <Activity size={12} />
                <span>Recente</span>
              </Badge>
            )}
            
            <Button variant="outline" size="sm" onClick={() => onView(record)}>
              <FileEdit className="h-4 w-4 mr-1" />
              Detalhes
            </Button>
          </div>
        </div>
        
        {record.vitalSigns && (
          <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
            <div className="bg-gray-50 rounded p-2">
              <div className="text-gray-500">Pressão</div>
              <div className="font-medium">{record.vitalSigns.bloodPressure || "N/A"}</div>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <div className="text-gray-500">Temp.</div>
              <div className="font-medium">{record.vitalSigns.temperature || "N/A"}°C</div>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <div className="text-gray-500">FC</div>
              <div className="font-medium">{record.vitalSigns.heartRate || "N/A"} bpm</div>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <div className="text-gray-500">SpO2</div>
              <div className="font-medium">{record.vitalSigns.spO2 || "N/A"}%</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
