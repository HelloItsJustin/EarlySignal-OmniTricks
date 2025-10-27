import React, { useState, useRef } from 'react';
import { Upload, X, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import { Button } from './common/Button';
import { Card } from './common/Card';
import { Student } from '../types';
import { calculateRiskScore, getRiskLevel } from '../lib/mlSimulation';
import { useData } from '../contexts/DataContext';

interface CSVUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CSVUploadModal({ isOpen, onClose }: CSVUploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setStudents } = useData();

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setFile(file);
    setError('');
    parseCSV(file);
  };

  const parseCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data.length === 0) {
          setError('CSV file is empty');
          return;
        }

        const mapped = results.data.map((row: any, index: number) => mapRowToStudent(row, index + 1));
        setParsedData(mapped);
        setPreviewData(mapped.slice(0, 10));
      },
      error: (error) => {
        setError(`Error parsing CSV: ${error.message}`);
      }
    });
  };

  const mapRowToStudent = (row: any, id: number): Student => {
    const name = row.name || row.student_name || row.full_name || row.Name || row.STUDENT_NAME || `Student ${id}`;
    const studentId = row.student_id || row.roll_number || row.id || row.enrollment_no || row.Student_ID || `STU${id}`;
    const department = row.department || row.dept || row.branch || row.stream || row.Department || 'Unknown';
    const attendance = parseFloat(row.attendance || row.attendance_percentage || row.att_percent || row.Attendance || '75');
    const gpa = parseFloat(row.gpa || row.cgpa || row.grade || row.Grade_Point || row.GPA || '7.5');
    const assignmentSubmission = parseFloat(row.assignment_submission || row.assignments || row.Assignment_Submission || '80');
    const libraryVisits = parseInt(row.library_visits || row.library || row.Library_Visits || '8');
    const previousSemesterGPA = parseFloat(row.previous_gpa || row.prev_gpa || row.Previous_Semester_GPA || gpa.toString());

    const student: Partial<Student> = {
      id: String(id),
      name,
      studentId,
      department,
      semester: parseInt(row.semester || row.sem || row.Semester || '1'),
      age: parseInt(row.age || row.Age || '20'),
      gender: row.gender || row.Gender || 'Male',
      attendance,
      gpa,
      assignmentSubmission,
      libraryVisits,
      financialAidStatus: row.financial_aid_status || row.Financial_Aid_Status || 'current',
      financialAidDelayDays: parseInt(row.financial_aid_delay_days || row.Financial_Aid_Delay_Days || '0'),
      counselorVisits: parseInt(row.counselor_visits || row.Counselor_Visits || '2'),
      labParticipation: parseFloat(row.lab_participation || row.Lab_Participation || '85'),
      peerEngagement: parseInt(row.peer_engagement || row.Peer_Engagement || '7'),
      hostelOrDayScholar: (row.hostel_or_day_scholar || row.Hostel_Or_Day_Scholar || 'day_scholar').includes('hostel') ? 'hostel' : 'day_scholar',
      previousSemesterGPA,
      lastUpdated: new Date().toISOString()
    };

    const riskScore = calculateRiskScore(student);
    const { level, color } = getRiskLevel(riskScore);

    return {
      ...student,
      riskScore,
      riskLevel: level,
      riskColor: color
    } as Student;
  };

  const handleLoadData = () => {
    setStudents(parsedData);
    setSuccess(true);
    setTimeout(() => {
      onClose();
      window.location.reload();
    }, 1500);
  };

  const handleReset = () => {
    setFile(null);
    setParsedData([]);
    setPreviewData([]);
    setError('');
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Upload Real Dataset</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          {!file && (
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drag and drop CSV file here, or click to browse
              </p>
              <p className="text-sm text-gray-500 mb-4">CSV files only, max 5MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleChange}
                className="hidden"
              />
              <Button onClick={() => fileInputRef.current?.click()}>
                Select File
              </Button>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              <span>Data loaded successfully! Refreshing...</span>
            </div>
          )}

          {file && parsedData.length > 0 && !success && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <FileText className="w-8 h-8 text-blue-500" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {parsedData.length} students found
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={handleReset}>
                  Change File
                </Button>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Preview (First 10 Rows)
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attendance</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">GPA</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Level</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {previewData.map((student, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm text-gray-900">{student.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{student.studentId}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{student.department}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{student.attendance.toFixed(1)}%</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{student.gpa.toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              student.riskColor === 'green' ? 'bg-green-100 text-green-800' :
                              student.riskColor === 'orange' ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {student.riskLevel}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <Button variant="secondary" onClick={handleReset}>
                  Cancel
                </Button>
                <Button onClick={handleLoadData} className="bg-green-500 hover:bg-green-600">
                  Load This Data
                </Button>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">CSV Format Requirements</h3>
            <p className="text-sm text-blue-800 mb-2">Required columns (case-insensitive):</p>
            <ul className="text-sm text-blue-800 space-y-1 ml-4">
              <li>• name (or student_name, full_name)</li>
              <li>• student_id (or roll_number, id, enrollment_no)</li>
              <li>• department (or dept, branch, stream)</li>
              <li>• attendance (percentage)</li>
              <li>• gpa (or cgpa, grade)</li>
              <li>• assignment_submission (percentage)</li>
              <li>• library_visits (per month)</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
