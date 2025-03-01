
import { Button } from "@/components/ui/button";
import { TimeClockEntryType } from "@/types/time-clock";
import { toast } from "sonner";
import { useState } from "react";
import { Map } from "lucide-react";

interface ClockInButtonProps {
  onClockIn: (type: TimeClockEntryType, location: GeolocationCoordinates) => void;
  type: TimeClockEntryType;
  label: string;
}

export function ClockInButton({ onClockIn, type, label }: ClockInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    if (!navigator.geolocation) {
      toast.error("Geolocalização não está disponível no seu navegador");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onClockIn(type, position.coords);
        setIsLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("Erro ao obter localização. Por favor, permita o acesso à sua localização.");
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  return (
    <Button 
      onClick={handleClick} 
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2"
    >
      {isLoading ? "Obtendo localização..." : (
        <>
          <Map size={18} />
          {label}
        </>
      )}
    </Button>
  );
}
