import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, AlertTriangle, BookOpen, TrendingUp } from 'lucide-react';

interface SummaryStatsProps {
  totalStudents: number;
  atRiskStudents: number;
  subjects: number;
  attendanceRate: number;
}

export const SummaryStats: React.FC<SummaryStatsProps> = ({
  totalStudents,
  atRiskStudents,
  subjects,
  attendanceRate
}) => {
  const stats = [
    {
      title: 'Total Students',
      value: totalStudents,
      icon: Users,
      variant: 'default' as const
    },
    {
      title: 'At Risk Students',
      value: atRiskStudents,
      icon: AlertTriangle,
      variant: 'destructive' as const
    },
    {
      title: 'Subjects',
      value: subjects,
      icon: BookOpen,
      variant: 'secondary' as const
    },
    {
      title: 'Attendance Rate',
      value: `${attendanceRate.toFixed(1)}%`,
      icon: TrendingUp,
      variant: attendanceRate >= 80 ? 'success' : 'warning' as const
    }
  ];

  const getCardClass = (variant: string) => {
    switch (variant) {
      case 'destructive':
        return 'border-destructive/20 bg-destructive/5';
      case 'success':
        return 'border-success/20 bg-success/5';
      case 'warning':
        return 'border-warning/20 bg-warning/5';
      default:
        return 'border-border bg-card';
    }
  };

  const getIconClass = (variant: string) => {
    switch (variant) {
      case 'destructive':
        return 'text-destructive';
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      default:
        return 'text-primary';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className={`shadow-card ${getCardClass(stat.variant)}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${getIconClass(stat.variant)}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};