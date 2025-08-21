
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StudentData } from '@/types/student';
import { Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface WeeklyAttendanceProps {
  students: StudentData[];
  selectedSubject: string;
}

export const WeeklyAttendance: React.FC<WeeklyAttendanceProps> = ({ students, selectedSubject }) => {
  // Filter students by subject
  const filteredStudents = selectedSubject === 'all' 
    ? students 
    : students.filter(student => student.course === selectedSubject);

  // Calculate attendance statistics by week
  const weeklyStats = React.useMemo(() => {
    const stats: { [week: number]: { present: number; absent: number; total: number; sessions: { session1: number; session2: number } } } = {};
    
    filteredStudents.forEach(student => {
      if (student.weeklyAttendance) {
        student.weeklyAttendance.forEach(weekData => {
          if (!stats[weekData.week]) {
            stats[weekData.week] = { present: 0, absent: 0, total: 0, sessions: { session1: 0, session2: 0 } };
          }
          
          const session1Present = weekData.session1?.toLowerCase().includes('present') || weekData.session1?.toLowerCase().includes('attended');
          const session2Present = weekData.session2?.toLowerCase().includes('present') || weekData.session2?.toLowerCase().includes('attended');
          
          if (session1Present) stats[weekData.week].sessions.session1++;
          if (session2Present) stats[weekData.week].sessions.session2++;
          
          // Count as present if at least one session attended
          if (session1Present || session2Present) {
            stats[weekData.week].present++;
          } else if (weekData.session1 || weekData.session2) {
            stats[weekData.week].absent++;
          }
          
          stats[weekData.week].total++;
        });
      }
    });
    
    return stats;
  }, [filteredStudents]);

  const getAttendanceIcon = (rate: number) => {
    if (rate >= 80) return <CheckCircle className="h-4 w-4 text-success" />;
    if (rate >= 60) return <AlertCircle className="h-4 w-4 text-warning" />;
    return <XCircle className="h-4 w-4 text-destructive" />;
  };

  const getAttendanceColor = (rate: number) => {
    if (rate >= 80) return 'success';
    if (rate >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Weekly Attendance Overview
          {selectedSubject !== 'all' && (
            <Badge variant="outline" className="ml-2">
              {selectedSubject}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.keys(weeklyStats).length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No attendance data available for the selected criteria
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(weeklyStats)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .map(([week, stats]) => {
                  const attendanceRate = stats.total > 0 ? (stats.present / stats.total) * 100 : 0;
                  const session1Rate = filteredStudents.length > 0 ? (stats.sessions.session1 / filteredStudents.length) * 100 : 0;
                  const session2Rate = filteredStudents.length > 0 ? (stats.sessions.session2 / filteredStudents.length) * 100 : 0;
                  
                  return (
                    <Card key={week} className="border-2">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">Week {week}</h4>
                          {getAttendanceIcon(attendanceRate)}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-3">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Overall</span>
                            <Badge variant={getAttendanceColor(attendanceRate)}>
                              {attendanceRate.toFixed(0)}%
                            </Badge>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Session 1</span>
                              <span className="font-medium">{session1Rate.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1.5">
                              <div 
                                className="bg-primary h-1.5 rounded-full transition-all" 
                                style={{ width: `${session1Rate}%` }}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Session 2</span>
                              <span className="font-medium">{session2Rate.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1.5">
                              <div 
                                className="bg-accent h-1.5 rounded-full transition-all" 
                                style={{ width: `${session2Rate}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
                          {stats.present} present, {stats.absent} absent
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              }
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
