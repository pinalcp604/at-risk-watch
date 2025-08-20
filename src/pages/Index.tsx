
import React, { useState } from 'react';
import { FileUpload } from '@/components/ui/file-upload';
import { StudentCard } from '@/components/analytics/StudentCard';
import { SummaryStats } from '@/components/analytics/SummaryStats';
import { useExcelParser } from '@/hooks/useExcelParser';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, FileSpreadsheet, Users, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { StudentData, ParsedData } from '@/types/student';

const Index = () => {
  const [data, setData] = useState<ParsedData | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedWeek, setSelectedWeek] = useState<string>('all');
  
  const { parseExcelFile, isLoading, error } = useExcelParser();
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    const parsedData = await parseExcelFile(file);
    if (parsedData) {
      setData(parsedData);
      toast({
        title: "File uploaded successfully",
        description: `Parsed ${parsedData.students.length} student records from ${parsedData.processedSheets.length} sheet(s)`,
      });
      
      if (parsedData.skippedSheets.length > 0) {
        toast({
          title: "Some sheets were skipped",
          description: `Skipped: ${parsedData.skippedSheets.join(', ')}`,
          variant: "default",
        });
      }
    } else if (error) {
      toast({
        title: "Upload failed",
        description: error,
        variant: "destructive",
      });
    }
  };

  const filteredStudents = data ? data.students.filter(student => {
    const subjectMatch = selectedSubject === 'all' || student.course === selectedSubject;
    return subjectMatch;
  }) : [];

  // Only check Final Status column for at-risk determination
  const atRiskStudents = filteredStudents.filter(student => 
    student.finalStatus?.toLowerCase().includes('at risk') ||
    student.finalStatus?.toLowerCase().includes('atrisk')
  );

  const assessmentWeeks = [3, 5, 8];
  const showAssessment = assessmentWeeks.includes(parseInt(selectedWeek));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Student Analytics</h1>
              <p className="text-muted-foreground">
                Upload and analyze student data to identify at-risk students
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {!data ? (
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-elevated">
              <CardHeader className="text-center">
                <FileSpreadsheet className="mx-auto h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-2xl">Upload Student Data</CardTitle>
                <p className="text-muted-foreground">
                  Upload your Excel file containing student data to get started
                </p>
              </CardHeader>
              <CardContent>
                <FileUpload 
                  onFileSelect={handleFileSelect}
                  className="mb-4"
                />
                {isLoading && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Processing file...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            {/* File Processing Summary */}
            {(data.processedSheets.length > 0 || data.skippedSheets.length > 0) && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>File Processing Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-success mb-2">Processed Sheets ({data.processedSheets.length})</h4>
                      <div className="space-y-1">
                        {data.processedSheets.map(sheet => (
                          <Badge key={sheet} variant="success" className="mr-2">
                            {sheet}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {data.skippedSheets.length > 0 && (
                      <div>
                        <h4 className="font-medium text-warning mb-2">Skipped Sheets ({data.skippedSheets.length})</h4>
                        <div className="space-y-1">
                          {data.skippedSheets.map(sheet => (
                            <Badge key={sheet} variant="secondary" className="mr-2">
                              {sheet}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Summary Stats - removed attendance rate */}
            <SummaryStats
              totalStudents={filteredStudents.length}
              atRiskStudents={atRiskStudents.length}
              subjects={data.subjects.length}
            />

            {/* Filters and Student List */}
            <div className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Student Analysis
                  </CardTitle>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-2 block">Filter by Subject</label>
                      <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Subjects</SelectItem>
                          {data.subjects.map(subject => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-2 block">Week</label>
                      <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select week" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Weeks</SelectItem>
                          {data.weeks.map(week => (
                            <SelectItem key={week} value={week.toString()}>
                              Week {week}
                              {assessmentWeeks.includes(week) && (
                                <Badge variant="secondary" className="ml-2">Assessment</Badge>
                              )}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Tabs defaultValue="all" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All Students ({filteredStudents.length})</TabsTrigger>
                  <TabsTrigger value="at-risk" className="text-destructive">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    At Risk ({atRiskStudents.length})
                  </TabsTrigger>
                  <TabsTrigger value="good">Good Standing ({filteredStudents.length - atRiskStudents.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredStudents.map((student, index) => (
                      <StudentCard 
                        key={index} 
                        student={student} 
                        showAssessment={showAssessment}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="at-risk" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {atRiskStudents.map((student, index) => (
                      <StudentCard 
                        key={index} 
                        student={student} 
                        showAssessment={showAssessment}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="good" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredStudents
                      .filter(student => !(
                        student.finalStatus?.toLowerCase().includes('at risk') ||
                        student.finalStatus?.toLowerCase().includes('atrisk')
                      ))
                      .map((student, index) => (
                        <StudentCard 
                          key={index} 
                          student={student} 
                          showAssessment={showAssessment}
                        />
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
