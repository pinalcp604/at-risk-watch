
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { StudentData } from '@/types/student';

interface StudentCardProps {
  student: StudentData;
  showAssessment?: boolean;
}

export const StudentCard: React.FC<StudentCardProps> = ({ 
  student, 
  showAssessment = false 
}) => {
  // Only check Final Status column for at-risk determination
  const isAtRisk = student.finalStatus?.toLowerCase().includes('at risk') ||
                   student.finalStatus?.toLowerCase().includes('atrisk');
  
  const getStatusIcon = () => {
    if (isAtRisk) return <AlertTriangle className="h-4 w-4" />;
    if (student.finalStatus?.toLowerCase().includes('good')) return <CheckCircle className="h-4 w-4" />;
    return <Clock className="h-4 w-4" />;
  };

  const getStatusVariant = (): "default" | "destructive" | "outline" | "secondary" | "success" | "warning" => {
    if (isAtRisk) return 'destructive';
    if (student.finalStatus?.toLowerCase().includes('good')) return 'success';
    return 'secondary';
  };

  return (
    <Card className="shadow-card hover:shadow-elevated transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{student.name || 'Unknown Student'}</CardTitle>
          <Badge variant={getStatusVariant()} className="flex items-center gap-1">
            {getStatusIcon()}
            {student.finalStatus || 'Unknown'}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>{student.course || 'Unknown Course'}</p>
          {student.campus && <p>Campus: {student.campus}</p>}
          {student.mode && <p>Mode: {student.mode}</p>}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Engagement and Actions */}
        <div className="grid grid-cols-1 gap-3 text-sm">
          {student.engagement && (
            <div>
              <span className="font-medium text-muted-foreground">Engagement:</span>
              <p className="mt-1">{student.engagement}</p>
            </div>
          )}
          {student.action && (
            <div>
              <span className="font-medium text-muted-foreground">Action:</span>
              <p className="mt-1">{student.action}</p>
            </div>
          )}
          {student.followUp && (
            <div>
              <span className="font-medium text-muted-foreground">Follow Up:</span>
              <p className="mt-1">{student.followUp}</p>
            </div>
          )}
        </div>

        {/* Contact Information */}
        {(student.studentEmail || student.personalEmail || student.phoneNumber) && (
          <div className="pt-2 border-t">
            <h4 className="font-medium text-sm mb-2">Contact</h4>
            <div className="space-y-1 text-sm">
              {student.studentEmail && (
                <p className="text-muted-foreground">Student: {student.studentEmail}</p>
              )}
              {student.personalEmail && (
                <p className="text-muted-foreground">Personal: {student.personalEmail}</p>
              )}
              {student.phoneNumber && (
                <p className="text-muted-foreground">Phone: {student.phoneNumber}</p>
              )}
            </div>
          </div>
        )}

        {/* Assessment Checkpoint */}
        {showAssessment && student.assessmentCheckpoint && (
          <div className="pt-2 border-t">
            <span className="font-medium text-muted-foreground text-sm">Assessment Checkpoint:</span>
            <p className="mt-1 text-sm">{student.assessmentCheckpoint}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
