
export interface StudentData {
  // Basic Information
  name?: string;
  programme?: string;
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
  observationFeedback?: string;
  
  // Session Data
  week?: number;
  session1?: string;
  session2?: string;
  engagement?: string;
  action?: string;
  followUp?: string;
  assessmentCheckpoint?: string;
  
  // Calculated fields
  attendanceRate?: number;
  totalSessions?: number;
  attendedSessions?: number;
  
  [key: string]: any;
}

export interface ParsedData {
  students: StudentData[];
  subjects: string[];
  weeks: number[];
  processedSheets: string[];
  skippedSheets: string[];
}
