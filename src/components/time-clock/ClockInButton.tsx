
import { Button } from "@/components/ui/button";
import { TimeClockEntryType } from "@/types/time-clock";
import { toast } from "sonner";
import { useState } from "react";

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
        toast.error("Erro ao obter localização. Por favor, permita o acesso à sua localização.");
        setIsLoading(false);
      }
    );
  };

  return (
    <Button 
      onClick={handleClick} 
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? "Obtendo localização..." : label}
    </Button>
  );
}
