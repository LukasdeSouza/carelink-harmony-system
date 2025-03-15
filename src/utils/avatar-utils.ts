
import { 
  Syringe, Pill, TestTube, Microscope, Stethoscope, 
  Thermometer, Bone, Clipboard, Scissors, AirVent,
  Brain, Heart, Activity, BadgeAlert, Bandage,
  Tablets, Beaker, PlusCircle,
  HeartPulse, Hospital, LucideIcon
} from "lucide-react";

export type MedicalIconType = {
  icon: LucideIcon;
  color: string;
  background: string;
};

const productIcons: MedicalIconType[] = [
  { icon: Syringe, color: "text-blue-600", background: "bg-blue-100" },
  { icon: Pill, color: "text-purple-600", background: "bg-purple-100" },
  { icon: TestTube, color: "text-green-600", background: "bg-green-100" },
  { icon: Microscope, color: "text-indigo-600", background: "bg-indigo-100" },
  { icon: Stethoscope, color: "text-red-600", background: "bg-red-100" },
  { icon: Thermometer, color: "text-orange-600", background: "bg-orange-100" },
  { icon: Bandage, color: "text-pink-600", background: "bg-pink-100" },
  { icon: Beaker, color: "text-cyan-600", background: "bg-cyan-100" },
  { icon: Tablets, color: "text-emerald-600", background: "bg-emerald-100" },
  { icon: Pill, color: "text-violet-600", background: "bg-violet-100" },
];

const procedureIcons: MedicalIconType[] = [
  { icon: Brain, color: "text-purple-600", background: "bg-purple-100" },
  { icon: Heart, color: "text-red-600", background: "bg-red-100" },
  { icon: AirVent, color: "text-blue-600", background: "bg-blue-100" },
  { icon: Bone, color: "text-amber-600", background: "bg-amber-100" },
  { icon: Activity, color: "text-green-600", background: "bg-green-100" },
  { icon: Clipboard, color: "text-indigo-600", background: "bg-indigo-100" },
  { icon: Scissors, color: "text-rose-600", background: "bg-rose-100" },
  { icon: BadgeAlert, color: "text-orange-600", background: "bg-orange-100" },
  { icon: HeartPulse, color: "text-pink-600", background: "bg-pink-100" },
  { icon: Hospital, color: "text-teal-600", background: "bg-teal-100" },
];

/**
 * Get a consistent icon for a product based on its name or ID
 */
export const getProductIcon = (identifier: string): MedicalIconType => {
  // Use a hash of the identifier to select a consistent icon
  const hash = identifier.split("").reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  
  return productIcons[hash % productIcons.length];
};

/**
 * Get a consistent icon for a procedure based on its description or ID
 */
export const getProcedureIcon = (identifier: string): MedicalIconType => {
  const hash = identifier.split("").reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  
  return procedureIcons[hash % procedureIcons.length];
};
