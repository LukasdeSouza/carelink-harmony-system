
export type TimeClockEntryType = 'ENTRADA' | 'ALMOCO' | 'VOLTA_ALMOCO' | 'CAFE' | 'VOLTA_CAFE' |'INTERVALO'|'JANTA' | 'VOLTA_JANTA' | 'SAIDA';

export interface TimeClockEntry {
  id: string;
  userId: string;
  userName: string;
  type: TimeClockEntryType;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface WorkDay {
  id: string;
  userId: string;
  userName: string;
  date: string;
  entries: TimeClockEntry[];
}
