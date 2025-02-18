
export type TimeClockEntryType = 'in' | 'lunch-start' | 'lunch-end' | 'out';

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
