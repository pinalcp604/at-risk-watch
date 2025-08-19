
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
      console.log('Starting to parse file:', file.name);
      
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      console.log('Workbook sheets:', workbook.SheetNames);
      
      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        throw new Error('No sheets found in the Excel file');
      }
      
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      if (!worksheet) {
        throw new Error('Could not read the worksheet');
      }
      
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
      
      console.log('Raw data rows:', jsonData.length);
      console.log('First few rows:', jsonData.slice(0, 3));

      if (jsonData.length < 1) {
        throw new Error('File appears to be empty');
      }

      const headers = jsonData[0] as string[];
      console.log('Headers found:', headers);
      
      if (!headers || headers.length === 0) {
        throw new Error('No headers found in the file');
      }

      const rows = jsonData.slice(1).filter(row => row && row.length > 0);
      console.log('Data rows after filtering:', rows.length);

      // Safely find column indices with better error handling
      const getColumnIndex = (searchTerms: string[]) => {
        if (!headers) return -1;
        return headers.findIndex(header => {
          if (typeof header !== 'string') return false;
          return searchTerms.some(term => 
            header.toLowerCase().includes(term.toLowerCase())
          );
        });
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

      console.log('Column indices found:', {
        name: nameIndex,
        course: courseIndex,
        status: statusIndex,
        session1: session1Index,
        session2: session2Index,
        engagement: engagementIndex,
        action: actionIndex,
        followUp: followUpIndex,
        assessment: assessmentIndex
      });

      const students: StudentData[] = rows.map((row, index) => {
        try {
          return {
            name: nameIndex >= 0 && row[nameIndex] ? String(row[nameIndex]).trim() : undefined,
            course: courseIndex >= 0 && row[courseIndex] ? String(row[courseIndex]).trim() : undefined,
            finalStatus: statusIndex >= 0 && row[statusIndex] ? String(row[statusIndex]).trim() : undefined,
            session1: session1Index >= 0 && row[session1Index] ? String(row[session1Index]).trim() : undefined,
            session2: session2Index >= 0 && row[session2Index] ? String(row[session2Index]).trim() : undefined,
            engagement: engagementIndex >= 0 && row[engagementIndex] ? String(row[engagementIndex]).trim() : undefined,
            action: actionIndex >= 0 && row[actionIndex] ? String(row[actionIndex]).trim() : undefined,
            followUp: followUpIndex >= 0 && row[followUpIndex] ? String(row[followUpIndex]).trim() : undefined,
            assessmentCheckpoint: assessmentIndex >= 0 && row[assessmentIndex] ? String(row[assessmentIndex]).trim() : undefined,
          };
        } catch (err) {
          console.warn(`Error parsing row ${index}:`, err);
          return {};
        }
      }).filter(student => student.name || student.course || student.finalStatus);

      console.log('Parsed students:', students.length);
      console.log('Sample student:', students[0]);

      const subjects = [...new Set(
        students
          .map(s => s.course)
          .filter(course => course && course.trim() !== '')
      )] as string[];

      console.log('Subjects found:', subjects);

      const weeks = [1, 2, 3, 4, 5, 6, 7, 8]; // Default weeks

      const result = {
        students,
        subjects,
        weeks
      };

      console.log('Final parsed result:', result);
      return result;
      
    } catch (err) {
      console.error('Excel parsing error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to parse Excel file';
      setError(errorMessage);
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
