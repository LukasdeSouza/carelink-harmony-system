
export interface VitalSigns {
  bloodPressure: string;
  spO2: number;
  temperature: number;
  respiratoryRate: number;
  heartRate: number;
}

export interface NutritionStatus {
  type: ('oral' | 'tube')[];
  acceptance: ('accepted' | 'rejected')[];
  amount: ('total' | 'partial')[];
  observations: string;
}

export interface EliminationStatus {
  urinary: {
    status: ('present' | 'absent')[];
    condition: ('normal' | 'altered')[];
    symptoms: ('darkColor' | 'foulOdor' | 'painfulUrination')[];
    observations: string;
  };
  intestinal: {
    status: ('present' | 'absent')[];
    condition: ('normal' | 'altered')[];
    consistency: ('hard' | 'soft' | 'liquid' | 'diarrhea')[];
    observations: string;
  };
}

export interface HydrationStatus {
  amount: '0-250' | '250-500' | '500-1000' | '2000+' | 'absent';
  observations: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  dateTime: string;
  caregiverId: string;
  caregiverName: string;
  location: string;
  vitalSigns: VitalSigns;
  orientation: 'oriented' | 'disoriented';
  consciousness: 'conscious' | 'drowsy' | 'alert' | 'lethargic';
  emotionalState: 'calm' | 'agitated' | 'goodMood' | 'badMood' | 'depressed' | 'cheerful';
  nutrition: NutritionStatus;
  elimination: EliminationStatus;
  hydration: HydrationStatus;
  generalNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Anamnesis {
  id: string;
  patientId: string;
  date: string;
  mainComplaint: string;
  currentHistory: string;
  pastHistory: string;
  familyHistory: string;
  socialHistory: string;
  medications: string;
  allergies: string;
  habits: string;
  observations: string;
}

export interface Evolution {
  id: string;
  patientId: string;
  date: string;
  description: string;
  observations: string;
  nextSteps: string;
}

export interface MedicalReport {
  id: string;
  patientId: string;
  date: string;
  title: string;
  content: string;
  doctor: string;
  crm: string;
}

export interface MedicalCertificate {
  id: string;
  patientId: string;
  date: string;
  description: string;
  restDays: number;
  doctor: string;
  crm: string;
}

export interface ExamRequest {
  id: string;
  patientId: string;
  date: string;
  exams: {
    name: string;
    quantity?: string;
    observations?: string;
  }[];
  doctor: string;
  crm: string;
}
