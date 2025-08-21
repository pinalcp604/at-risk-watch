import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { StudentData, ParsedData, WeeklyAttendance } from '@/types/student';

const REQUIRED_COLUMNS = [
  'Course', 'Student ID', 'First Name', 'Last Name', 
  'Campus', 'Student Email', 'Personal Email', 'Phone Number', 
  'Locality', 'Mode', 'Final Status', 
  'Engagement', 'Action', 'Follow Up'
];

export const useExcelParser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findColumnIndex = (headers: any[], searchTerms: string[]): number => {
    if (!headers) return -1;
    return headers.findIndex(header => {
      if (typeof header !== 'string') return false;
      return searchTerms.some(term => 
        header.toLowerCase().trim() === term.toLowerCase().trim()
      );
    });
  };

  const validateHeaders = (headers: any[]): boolean => {
    if (!headers) return false;
    
    const foundColumns = REQUIRED_COLUMNS.filter(requiredCol => 
      headers.some(header => 
        typeof header === 'string' && 
        header.toLowerCase().trim() === requiredCol.toLowerCase().trim()
      )
    );
    
    console.log('Required columns:', REQUIRED_COLUMNS.length);
    console.log('Found columns:', foundColumns.length);
    console.log('Missing columns:', REQUIRED_COLUMNS.filter(col => 
      !foundColumns.some(found => found.toLowerCase() === col.toLowerCase())
    ));
    
    return foundColumns.length >= 8; // At least 8 core columns must be present
  };

  const parseWeeklyAttendance = (headers: string[], row: any[]): WeeklyAttendance[] => {
    const weeklyData: WeeklyAttendance[] = [];
    let currentWeek = 1;
    
    // Look for patterns of Session 1, Session 2, Engagement, Action, Follow Up
    // and Assessment Checkpoints to determine week boundaries
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i];
      if (!header) continue;
      
      if (header.toLowerCase().includes('session 1')) {
        const session1 = row[i] ? String(row[i]).trim() : '';
        const session2Index = i + 1;
        const session2 = session2Index < row.length && row[session2Index] ? String(row[session2Index]).trim() : '';
        
        // Look for engagement, action, follow up in the next few columns
        let engagement = '';
        let action = '';
        let followUp = '';
        let assessmentCheckpoint = '';
        
        for (let j = i + 2; j < Math.min(i + 6, headers.length); j++) {
          const nextHeader = headers[j];
          if (nextHeader?.toLowerCase().includes('engagement')) {
            engagement = row[j] ? String(row[j]).trim() : '';
          } else if (nextHeader?.toLowerCase().includes('action')) {
            action = row[j] ? String(row[j]).trim() : '';
          } else if (nextHeader?.toLowerCase().includes('follow up')) {
            followUp = row[j] ? String(row[j]).trim() : '';
          } else if (nextHeader?.toLowerCase().includes('assessment checkpoint')) {
            assessmentCheckpoint = row[j] ? String(row[j]).trim() : '';
          }
        }
        
        weeklyData.push({
          week: currentWeek,
          session1,
          session2,
          engagement,
          action,
          followUp,
          assessmentCheckpoint
        });
        
        currentWeek++;
      }
    }
    
    return weeklyData;
  };

  const processSheet = (worksheet: XLSX.WorkSheet, sheetName: string): StudentData[] => {
    console.log(`Processing sheet: ${sheetName}`);
    
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
    
    if (jsonData.length < 2) {
      console.log(`Sheet ${sheetName} has insufficient rows`);
      return [];
    }

    // Check row 2 (index 1) for headers as specified
    const headers = jsonData[1] as string[];
    console.log(`Headers in sheet ${sheetName}:`, headers);
    
    if (!validateHeaders(headers)) {
      console.log(`Sheet ${sheetName} doesn't have required headers`);
      return [];
    }

    // Data starts from row 3 (index 2)
    const rows = jsonData.slice(2).filter(row => row && row.length > 0);
    console.log(`Processing ${rows.length} data rows in sheet ${sheetName}`);

    // Get column indices
    const courseIndex = findColumnIndex(headers, ['Course', 'Course ']);
    const studentIdIndex = findColumnIndex(headers, ['Student ID']);
    const firstNameIndex = findColumnIndex(headers, ['First Name']);
    const lastNameIndex = findColumnIndex(headers, ['Last Name']);
    const campusIndex = findColumnIndex(headers, ['Campus']);
    const studentEmailIndex = findColumnIndex(headers, ['Student Email']);
    const personalEmailIndex = findColumnIndex(headers, ['Personal Email']);
    const phoneNumberIndex = findColumnIndex(headers, ['Phone Number']);
    const localityIndex = findColumnIndex(headers, ['Locality']);
    const modeIndex = findColumnIndex(headers, ['Mode']);
    const finalStatusIndex = findColumnIndex(headers, ['Final Status']);
    const engagementIndex = findColumnIndex(headers, ['Engagement']);
    const actionIndex = findColumnIndex(headers, ['Action']);
    const followUpIndex = findColumnIndex(headers, ['Follow Up']);

    console.log('Column mapping:', {
      course: courseIndex,
      studentId: studentIdIndex,
      firstName: firstNameIndex,
      lastName: lastNameIndex,
      campus: campusIndex,
      finalStatus: finalStatusIndex
    });

    const students: StudentData[] = rows.map((row, index) => {
      try {
        const firstName = firstNameIndex >= 0 && row[firstNameIndex] ? String(row[firstNameIndex]).trim() : '';
        const lastName = lastNameIndex >= 0 && row[lastNameIndex] ? String(row[lastNameIndex]).trim() : '';
        const name = `${firstName} ${lastName}`.trim();

        // Parse weekly attendance data
        const weeklyAttendance = parseWeeklyAttendance(headers, row);

        return {
          name: name || undefined,
          course: courseIndex >= 0 && row[courseIndex] ? String(row[courseIndex]).trim() : undefined,
          studentId: studentIdIndex >= 0 && row[studentIdIndex] ? String(row[studentIdIndex]).trim() : undefined,
          firstName,
          lastName,
          campus: campusIndex >= 0 && row[campusIndex] ? String(row[campusIndex]).trim() : undefined,
          studentEmail: studentEmailIndex >= 0 && row[studentEmailIndex] ? String(row[studentEmailIndex]).trim() : undefined,
          personalEmail: personalEmailIndex >= 0 && row[personalEmailIndex] ? String(row[personalEmailIndex]).trim() : undefined,
          phoneNumber: phoneNumberIndex >= 0 && row[phoneNumberIndex] ? String(row[phoneNumberIndex]).trim() : undefined,
          locality: localityIndex >= 0 && row[localityIndex] ? String(row[localityIndex]).trim() : undefined,
          mode: modeIndex >= 0 && row[modeIndex] ? String(row[modeIndex]).trim() : undefined,
          finalStatus: finalStatusIndex >= 0 && row[finalStatusIndex] ? String(row[finalStatusIndex]).trim() : undefined,
          engagement: engagementIndex >= 0 && row[engagementIndex] ? String(row[engagementIndex]).trim() : undefined,
          action: actionIndex >= 0 && row[actionIndex] ? String(row[actionIndex]).trim() : undefined,
          followUp: followUpIndex >= 0 && row[followUpIndex] ? String(row[followUpIndex]).trim() : undefined,
          weeklyAttendance
        };
      } catch (err) {
        console.warn(`Error parsing row ${index} in sheet ${sheetName}:`, err);
        return {} as StudentData;
      }
    }).filter(student => student.name || student.course || student.finalStatus);

    console.log(`Successfully processed ${students.length} students from sheet ${sheetName}`);
    return students;
  };

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

      let allStudents: StudentData[] = [];
      const processedSheets: string[] = [];
      const skippedSheets: string[] = [];

      // Process all sheets
      for (const sheetName of workbook.SheetNames) {
        const worksheet = workbook.Sheets[sheetName];
        
        if (!worksheet) {
          console.warn(`Could not read worksheet: ${sheetName}`);
          skippedSheets.push(sheetName);
          continue;
        }

        const sheetStudents = processSheet(worksheet, sheetName);
        
        if (sheetStudents.length > 0) {
          allStudents = [...allStudents, ...sheetStudents];
          processedSheets.push(sheetName);
          console.log(`Added ${sheetStudents.length} students from sheet ${sheetName}`);
        } else {
          skippedSheets.push(sheetName);
          console.log(`Skipped sheet ${sheetName} - no valid data found`);
        }
      }

      console.log(`Total students processed: ${allStudents.length}`);
      console.log(`Processed sheets: ${processedSheets.join(', ')}`);
      console.log(`Skipped sheets: ${skippedSheets.join(', ')}`);

      if (allStudents.length === 0) {
        throw new Error('No valid student data found in any sheet. Please check that your Excel file has the required columns in row 2.');
      }

      const subjects = [...new Set(
        allStudents
          .map(s => s.course)
          .filter(course => course && course.trim() !== '')
      )] as string[];

      const weeks = [1, 2, 3, 4, 5, 6, 7, 8]; // Default weeks

      const result: ParsedData = {
        students: allStudents,
        subjects,
        weeks,
        processedSheets,
        skippedSheets
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
