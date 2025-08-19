import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';

interface StudentData {
  name?: string;
  course?: string;
  finalStatus?: string;
  week?: number;
  session1?: string;
  session2?: string;
  engagement?: string;
  action?: string;
  followUp?: string;
  assessmentCheckpoint?: string;
  [key: string]: any;
}

interface ParsedData {
  students: StudentData[];
  subjects: string[];
  weeks: number[];
}

export const useExcelParser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseExcelFile = useCallback(async (file: File): Promise<ParsedData | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

      if (jsonData.length < 2) {
        throw new Error('File must contain at least a header row and one data row');
      }

      const headers = jsonData[0] as string[];
      const rows = jsonData.slice(1);

      // Map column indices
      const getColumnIndex = (searchTerms: string[]) => {
        return headers.findIndex(header => 
          searchTerms.some(term => 
            header.toLowerCase().includes(term.toLowerCase())
          )
        );
      };

      const nameIndex = getColumnIndex(['name', 'student']);
      const courseIndex = getColumnIndex(['course', 'subject']);
      const statusIndex = getColumnIndex(['final status', 'status']);
      const session1Index = getColumnIndex(['session 1', 'session1']);
      const session2Index = getColumnIndex(['session 2', 'session2']);
      const engagementIndex = getColumnIndex(['engagement']);
      const actionIndex = getColumnIndex(['action']);
      const followUpIndex = getColumnIndex(['follow up', 'followup']);
      const assessmentIndex = getColumnIndex(['assessment checkpoint', 'assessment']);

      const students: StudentData[] = rows.map(row => ({
        name: nameIndex >= 0 ? row[nameIndex] : undefined,
        course: courseIndex >= 0 ? row[courseIndex] : undefined,
        finalStatus: statusIndex >= 0 ? row[statusIndex] : undefined,
        session1: session1Index >= 0 ? row[session1Index] : undefined,
        session2: session2Index >= 0 ? row[session2Index] : undefined,
        engagement: engagementIndex >= 0 ? row[engagementIndex] : undefined,
        action: actionIndex >= 0 ? row[actionIndex] : undefined,
        followUp: followUpIndex >= 0 ? row[followUpIndex] : undefined,
        assessmentCheckpoint: assessmentIndex >= 0 ? row[assessmentIndex] : undefined,
      })).filter(student => student.name || student.course || student.finalStatus);

      const subjects = [...new Set(
        students
          .map(s => s.course)
          .filter(Boolean)
      )] as string[];

      const weeks = [1, 2, 3, 4, 5, 6, 7, 8]; // Default weeks

      return {
        students,
        subjects,
        weeks
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse Excel file');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    parseExcelFile,
    isLoading,
    error
  };
};