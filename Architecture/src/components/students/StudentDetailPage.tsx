import React, { useState } from 'react';
import { ArrowLeft, TrendingDown, TrendingUp } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { useData } from '../../contexts/DataContext';
import { generateRiskFactors, generateInterventions, calculateRiskScore, getRiskLevel } from '../../lib/mlSimulation';
import { formatDate, getInitials } from '../../lib/utils';
import { WhatIfSimulator } from './WhatIfSimulator';
import { Student } from '../../types';

interface StudentDetailPageProps {
  studentId: string;
  onBack: () => void;
}

export function StudentDetailPage({ studentId, onBack }: StudentDetailPageProps) {
  const { getStudentById } = useData();
  const student = getStudentById(studentId);

  if (!student) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Student not found</p>
        <Button onClick={onBack} className="mt-4">Go Back</Button>
      </div>
    );
  }

  const riskFactors = generateRiskFactors(student);
  const interventions = generateInterventions(student);

  const riskGaugeData = [
    {
      name: 'Risk Score',
      value: student.riskScore,
      fill: student.riskColor === 'green' ? '#10B981' : student.riskColor === 'orange' ? '#F59E0B' : '#EF4444'
    }
  ];

  const attendanceTrend = [
    { week: 'Week 1', attendance: student.attendance - 8 },
    { week: 'Week 2', attendance: student.attendance - 6 },
    { week: 'Week 3', attendance: student.attendance - 4 },
    { week: 'Week 4', attendance: student.attendance - 2 },
    { week: 'Week 5', attendance: student.attendance - 1 },
    { week: 'Week 6', attendance: student.attendance }
  ];

  const gpaTrend = [
    { semester: 'Sem 1', gpa: student.previousSemesterGPA - 0.3 },
    { semester: 'Sem 2', gpa: student.previousSemesterGPA - 0.1 },
    { semester: 'Sem 3', gpa: student.previousSemesterGPA },
    { semester: 'Sem 4', gpa: student.gpa }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
              {getInitials(student.name)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
              <p className="text-gray-500">{student.studentId} • {student.department}</p>
              <p className="text-xs text-gray-400 mt-1">Last updated: {formatDate(student.lastUpdated)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-1">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h2>
          <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="100%"
              data={riskGaugeData}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar
                minAngle={15}
                background
                clockWise
                dataKey="value"
              />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-4xl font-bold">
                {student.riskScore.toFixed(0)}
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="text-center mt-4">
            <Badge variant={student.riskColor} size="lg">
              {student.riskLevel}
            </Badge>
            <p className="text-sm text-gray-500 mt-2">92% confidence</p>
          </div>
        </Card>

        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100">
            <p className="text-sm text-gray-600 mb-1">Attendance</p>
            <div className="flex items-baseline space-x-2">
              <p className="text-3xl font-bold text-gray-900">{student.attendance.toFixed(1)}%</p>
              {student.attendance >= 75 ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${student.attendance >= 75 ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${student.attendance}%` }}
              />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100">
            <p className="text-sm text-gray-600 mb-1">GPA</p>
            <div className="flex items-baseline space-x-2">
              <p className="text-3xl font-bold text-gray-900">{student.gpa.toFixed(2)}</p>
              {student.gpa >= student.previousSemesterGPA ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600" />
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Previous: {student.previousSemesterGPA.toFixed(2)}</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100">
            <p className="text-sm text-gray-600 mb-1">Assignments</p>
            <p className="text-3xl font-bold text-gray-900">{student.assignmentSubmission.toFixed(0)}%</p>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${student.assignmentSubmission >= 80 ? 'bg-green-500' : 'bg-orange-500'}`}
                style={{ width: `${student.assignmentSubmission}%` }}
              />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100">
            <p className="text-sm text-gray-600 mb-1">Library Visits</p>
            <p className="text-3xl font-bold text-gray-900">{student.libraryVisits}</p>
            <p className="text-xs text-gray-500 mt-1">per month</p>
          </Card>
        </div>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Why is this student at risk?</h2>
        <div className="space-y-3">
          {riskFactors.map((factor, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{factor.factor}</h3>
                <Badge variant="red" size="sm">+{factor.impact.toFixed(1)} points</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Current Value</p>
                  <p className="font-medium text-red-600">{factor.currentValue}</p>
                </div>
                <div>
                  <p className="text-gray-500">Expected Value</p>
                  <p className="font-medium text-green-600">{factor.expectedValue}</p>
                </div>
              </div>
              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-red-500"
                  style={{ width: `${Math.min(100, factor.impact * 4)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Attendance Trend</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={attendanceTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="attendance" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey={() => 75} stroke="#10B981" strokeDasharray="5 5" name="Target" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">GPA Trend</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={gpaTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="semester" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Line type="monotone" dataKey="gpa" stroke="#8B5CF6" strokeWidth={2} />
              <Line type="monotone" dataKey={() => 7.5} stroke="#10B981" strokeDasharray="5 5" name="Target" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommended Interventions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {interventions.map((intervention, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <input type="checkbox" className="mt-1 rounded text-blue-500" />
              <div className="flex-1">
                <Badge variant="blue" size="sm">Priority {index === 0 ? 'High' : index === 1 ? 'Medium' : 'Low'}</Badge>
                <p className="text-sm text-gray-700 mt-2">{intervention}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <WhatIfSimulator student={student} />
    </div>
  );
}
