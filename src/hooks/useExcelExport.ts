
import { useCallback } from 'react';
import * as XLSX from 'xlsx';
import { StudentData } from '@/types/student';

export const useExcelExport = () => {
  const exportAtRiskStudents = useCallback((students: StudentData[], filename: string = 'at-risk-students.xlsx') => {
    if (students.length === 0) {
      console.warn('No students to export');
      return;
    }

    // Prepare data for export
    const exportData = students.map(student => ({
      'Student ID': student.studentId || '',
      'First Name': student.firstName || '',
      'Last Name': student.lastName || '',
      'Course': student.course || '',
      'Campus': student.campus || '',
      'Student Email': student.studentEmail || '',
      'Personal Email': student.personalEmail || '',
      'Phone Number': student.phoneNumber || '',
      'Locality': student.locality || '',
      'Mode': student.mode || '',
      'Final Status': student.finalStatus || '',
      'Engagement': student.engagement || '',
      'Action': student.action || '',
      'Follow Up': student.followUp || ''
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Add the worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'At Risk Students');

    // Generate and download the file
    XLSX.writeFile(workbook, filename);
  }, []);

  return { exportAtRiskStudents };
};
