
export interface StudentData {
  // Basic Information
  name?: string;
  course?: string;
  studentId?: string;
  firstName?: string;
  lastName?: string;
  campus?: string;
  studentEmail?: string;
  personalEmail?: string;
  phoneNumber?: string;
  locality?: string;
  mode?: string;
  
  // Status and Feedback
  finalStatus?: string;
  
  // Session Data
  week?: number;
  engagement?: string;
  action?: string;
  followUp?: string;
  assessmentCheckpoint?: string;
  
  [key: string]: any;
}

export interface ParsedData {
  students: StudentData[];
  subjects: string[];
  weeks: number[];
  processedSheets: string[];
  skippedSheets: string[];
}
