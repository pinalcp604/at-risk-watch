import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  className?: string;
  accept?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  className,
  accept = '.xlsx,.xls,.csv'
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    multiple: false
  });

  const removeFile = () => {
    setUploadedFile(null);
  };

  return (
    <div className={cn('w-full', className)}>
      {!uploadedFile ? (
        <div>
          <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
              isDragActive
                ? 'border-accent bg-accent/5'
                : 'border-border hover:border-accent hover:bg-accent/5',
              'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2'
            )}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {isDragActive
                  ? 'Drop your file here'
                  : 'Drag & drop your Excel file here'}
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse (xlsx, xls, csv)
              </p>
            </div>
          </div>
          
          {/* Format Guide */}
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Expected Format:</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Your Excel file should have column headers in <strong>row 2</strong> with these required columns:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1 text-xs text-muted-foreground">
              <span>• Programme</span>
              <span>• Course</span>
              <span>• Student ID</span>
              <span>• First Name</span>
              <span>• Last Name</span>
              <span>• Campus</span>
              <span>• Student Email</span>
              <span>• Personal Email</span>
              <span>• Phone Number</span>
              <span>• Locality</span>
              <span>• Mode</span>
              <span>• Final Status</span>
              <span>• Observation/Feedback</span>
              <span>• Session 1</span>
              <span>• Session 2</span>
              <span>• Engagement</span>
              <span>• Action</span>
              <span>• Follow Up</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              <strong>Note:</strong> All sheets in your Excel file will be processed automatically.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-card border rounded-lg p-4 shadow-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileSpreadsheet className="h-8 w-8 text-success" />
              <div>
                <p className="font-medium">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeFile}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
