import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface Student {
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
}

interface StudentCardProps {
  student: Student;
  showAssessment?: boolean;
}

export const StudentCard: React.FC<StudentCardProps> = ({ 
  student, 
  showAssessment = false 
}) => {
  const isAtRisk = student.finalStatus?.toLowerCase().includes('at risk');
  
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
        <p className="text-sm text-muted-foreground">{student.course || 'Unknown Course'}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="font-medium text-muted-foreground">Session 1:</span>
            <p className="mt-1">{student.session1 || 'N/A'}</p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Session 2:</span>
            <p className="mt-1">{student.session2 || 'N/A'}</p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Engagement:</span>
            <p className="mt-1">{student.engagement || 'N/A'}</p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Action:</span>
            <p className="mt-1">{student.action || 'N/A'}</p>
          </div>
        </div>
        
        <div className="text-sm">
          <span className="font-medium text-muted-foreground">Follow Up:</span>
          <p className="mt-1">{student.followUp || 'N/A'}</p>
        </div>

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