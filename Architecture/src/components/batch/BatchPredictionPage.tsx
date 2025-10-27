import React from 'react';
import { Upload, FileText, Download } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

interface BatchPredictionPageProps {
  onUploadClick: () => void;
}

export function BatchPredictionPage({ onUploadClick }: BatchPredictionPageProps) {
  const handleDownloadTemplate = () => {
    const template = `name,student_id,department,semester,age,gender,attendance,gpa,assignment_submission,library_visits,financial_aid_status,financial_aid_delay_days,counselor_visits,lab_participation,peer_engagement,hostel_or_day_scholar,previous_semester_gpa
Rahul Kumar,CS2021001,Computer Science,5,20,Male,58,6.2,45,2,delayed,30,0,60,4,hostel,6.8
Priya Sharma,ME2022015,Mechanical Engineering,3,19,Female,92,8.5,95,12,current,0,2,90,8,day_scholar,8.2
Amit Patel,EC2021023,Electronics,6,21,Male,75,7.5,80,8,current,0,2,85,7,hostel,7.5`;

    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'student-data-template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Batch Prediction</h1>
        <p className="text-gray-500 mt-1">Upload CSV files for bulk risk assessment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-12">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  <Upload className="w-12 h-12 text-blue-600" />
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Upload Student Dataset
                </h2>
                <p className="text-gray-600">
                  Drag and drop your CSV file here, or click the button below to browse
                </p>
              </div>

              <Button onClick={onUploadClick} size="lg" className="px-8 py-4 text-lg">
                <Upload className="w-5 h-5 mr-2" />
                Select CSV File
              </Button>

              <div className="text-sm text-gray-500">
                <p>CSV files only, max 5MB</p>
                <p className="mt-1">The dataset will replace current student data</p>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <Button
                  variant="secondary"
                  onClick={handleDownloadTemplate}
                  className="inline-flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Sample Template
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            CSV Format Requirements
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Required Columns</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• name (or student_name)</li>
                <li>• student_id (or roll_number)</li>
                <li>• department</li>
                <li>• semester</li>
                <li>• attendance (percentage)</li>
                <li>• gpa (0-10 scale)</li>
                <li>• assignment_submission (%)</li>
                <li>• library_visits (per month)</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Optional Columns</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• age</li>
                <li>• gender</li>
                <li>• financial_aid_status</li>
                <li>• financial_aid_delay_days</li>
                <li>• counselor_visits</li>
                <li>• lab_participation</li>
                <li>• peer_engagement</li>
                <li>• hostel_or_day_scholar</li>
                <li>• previous_semester_gpa</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800">
                  Column names are case-insensitive. The system will automatically map common variations.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              How Batch Prediction Works
            </h3>
            <ol className="text-sm text-gray-700 space-y-2">
              <li>1. Upload a CSV file with student data following the required format</li>
              <li>2. The system will parse and validate each row</li>
              <li>3. Our ML model calculates risk scores for all students</li>
              <li>4. Preview the results with risk levels and scores</li>
              <li>5. Load the data into the system or export results</li>
            </ol>
          </div>
        </div>
      </Card>
    </div>
  );
}
