import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SimpleChart } from './SimpleChart';

interface SubjectData {
  subject: string;
  total: number;
  atRisk: number;
  percentage: number;
}

interface SubjectBreakdownProps {
  data: SubjectData[];
}

export const SubjectBreakdown: React.FC<SubjectBreakdownProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>At Risk Students by Subject</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleChart data={data} type="bar" />
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Subject Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleChart data={data} type="pie" />
        </CardContent>
      </Card>
    </div>
  );
};