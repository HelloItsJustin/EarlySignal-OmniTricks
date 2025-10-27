import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Users, AlertTriangle } from 'lucide-react';
import { Card } from '../common/Card';
import { KPICard } from '../dashboard/KPICard';
import { useData } from '../../contexts/DataContext';

export function AnalyticsPage() {
  const { students } = useData();

  const totalStudents = students.length;
  const highRiskCount = students.filter(s => s.riskLevel === 'High Risk').length;
  const atRiskCount = students.filter(s => s.riskLevel === 'At Risk').length;
  const lowRiskCount = students.filter(s => s.riskLevel === 'Low Risk').length;

  const avgAttendance = students.reduce((sum, s) => sum + s.attendance, 0) / students.length;
  const avgGPA = students.reduce((sum, s) => sum + s.gpa, 0) / students.length;
  const engagementRate = 100 - (highRiskCount / totalStudents * 100);

  const featureImportance = [
    { feature: 'Attendance', importance: 22.4 }, //Attendance is the most important feature
    { feature: 'Previous GPA', importance: 18.7 }, //Previous GPA is the second most important feature
    { feature: 'Assignment Submission', importance: 15.3 }, //Assignment Submission is the third most important feature
    { feature: 'Financial Aid Delay', importance: 9.8 }, //Financial Aid Delay is the fourth most important feature
    { feature: 'Library Visits', importance: 7.2 }, //Library Visits is the fifth most important feature
    { feature: 'Counselor Visits', importance: 6.5 }, //Counselor Visits is the sixth most important feature
    { feature: 'Lab Participation', importance: 5.9 }, //Lab Participation is the seventh most important feature
    { feature: 'Peer Engagement', importance: 4.8 }, //Peer Engagement is the eighth most important feature
    { feature: 'Age', importance: 3.2 }, //Age is the ninth most important feature
    { feature: 'Hostel Status', importance: 2.7 } //Hostel Status is the tenth most important feature
  ];

  const departments = Array.from(new Set(students.map(s => s.department))); // Get unique departments
  const departmentComparison = departments.map(dept => {
    const deptStudents = students.filter(s => s.department === dept);
    return {
      department: dept.split(' ')[0],
      'High Risk': deptStudents.filter(s => s.riskLevel === 'High Risk').length,
      'At Risk': deptStudents.filter(s => s.riskLevel === 'At Risk').length,
      'Low Risk': deptStudents.filter(s => s.riskLevel === 'Low Risk').length
    };
  }).filter(d => d['High Risk'] + d['At Risk'] + d['Low Risk'] > 0);

  const genderDistribution = [
    { name: 'Male', highRisk: students.filter(s => s.gender === 'Male' && s.riskLevel === 'High Risk').length, color: '#3B82F6' },
    { name: 'Female', highRisk: students.filter(s => s.gender === 'Female' && s.riskLevel === 'High Risk').length, color: '#EC4899' }
  ];

  const hostelDistribution = [
    { name: 'Hostel', highRisk: students.filter(s => s.hostelOrDayScholar === 'hostel' && s.riskLevel === 'High Risk').length, color: '#8B5CF6' },
    { name: 'Day Scholar', highRisk: students.filter(s => s.hostelOrDayScholar === 'day_scholar' && s.riskLevel === 'High Risk').length, color: '#10B981' }
  ];

  const semesterDistribution = Array.from({ length: 8 }, (_, i) => {
    const sem = i + 1;
    const semStudents = students.filter(s => s.semester === sem);
    return {
      semester: `Sem ${sem}`,
      'High Risk': semStudents.filter(s => s.riskLevel === 'High Risk').length,
      'At Risk': semStudents.filter(s => s.riskLevel === 'At Risk').length
    };
  }).filter(s => s['High Risk'] + s['At Risk'] > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 mt-1">Comprehensive insights and predictive analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Students"
          value={totalStudents}
          icon={Users}
          change="+5.2% from last month"
          gradient="bg-gradient-to-br from-blue-50 to-blue-100"
        />
        <KPICard
          title="High Risk Students"
          value={highRiskCount}
          icon={AlertTriangle}
          change={`${((highRiskCount / totalStudents) * 100).toFixed(1)}% of total`}
          gradient="bg-gradient-to-br from-red-50 to-red-100"
        />
        <KPICard
          title="Average Attendance"
          value={`${avgAttendance.toFixed(1)}%`}
          icon={TrendingUp}
          change="+2.3% from last month"
          gradient="bg-gradient-to-br from-green-50 to-green-100"
        />
        <KPICard
          title="Average GPA"
          value={avgGPA.toFixed(2)}
          icon={TrendingDown}
          change="-0.1 from last semester"
          gradient="bg-gradient-to-br from-purple-50 to-purple-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Feature Importance</h2>
          <p className="text-sm text-gray-600 mb-4">Top factors that predict student dropout risk</p>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={featureImportance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 25]} />
              <YAxis type="category" dataKey="feature" width={150} />
              <Tooltip />
              <Bar dataKey="importance" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Department Comparison</h2>
          <p className="text-sm text-gray-600 mb-4">Risk distribution across departments</p>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={departmentComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="High Risk" fill="#EF4444" />
              <Bar dataKey="At Risk" fill="#F59E0B" />
              <Bar dataKey="Low Risk" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution by Demographics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Risk by Gender</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={genderDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="highRisk"
                  label={({ name, highRisk }) => `${name}: ${highRisk}`}
                >
                  {genderDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Risk by Accommodation</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={hostelDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="highRisk"
                  label={({ name, highRisk }) => `${name}: ${highRisk}`}
                >
                  {hostelDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Risk by Semester</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={semesterDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semester" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="High Risk" fill="#EF4444" />
                <Bar dataKey="At Risk" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </div>
  );
}
