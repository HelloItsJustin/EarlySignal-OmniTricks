import React from 'react';
import { Users, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { KPICard } from './KPICard';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { useData } from '../../contexts/DataContext';

export function DashboardPage() {
  const { students } = useData();

  const totalStudents = students.length;
  const highRiskCount = students.filter(s => s.riskLevel === 'High Risk').length;
  const atRiskCount = students.filter(s => s.riskLevel === 'At Risk').length;
  const lowRiskCount = students.filter(s => s.riskLevel === 'Low Risk').length;

  const avgAttendance = students.reduce((sum, s) => sum + s.attendance, 0) / students.length;
  const engagementRate = 100 - (highRiskCount / totalStudents * 100);

  const riskDistribution = [
    { name: 'Low Risk', value: lowRiskCount, color: '#10B981' },
    { name: 'At Risk', value: atRiskCount, color: '#F59E0B' },
    { name: 'High Risk', value: highRiskCount, color: '#EF4444' }
  ];

  const trendData = [
    { week: 'Week 1', highRisk: highRiskCount + 5, atRisk: atRiskCount - 2, lowRisk: lowRiskCount - 3 },
    { week: 'Week 2', highRisk: highRiskCount + 4, atRisk: atRiskCount - 1, lowRisk: lowRiskCount - 3 },
    { week: 'Week 3', highRisk: highRiskCount + 3, atRisk: atRiskCount, lowRisk: lowRiskCount - 3 },
    { week: 'Week 4', highRisk: highRiskCount + 2, atRisk: atRiskCount + 1, lowRisk: lowRiskCount - 3 },
    { week: 'Week 5', highRisk: highRiskCount + 1, atRisk: atRiskCount + 1, lowRisk: lowRiskCount - 2 },
    { week: 'Week 6', highRisk: highRiskCount, atRisk: atRiskCount, lowRisk: lowRiskCount }
  ];

  const departments = ['Computer Science', 'Mechanical Engineering', 'Electronics', 'Civil Engineering', 'MBA'];
  const departmentStats = departments.map(dept => {
    const deptStudents = students.filter(s => s.department === dept);
    const deptHighRisk = deptStudents.filter(s => s.riskLevel === 'High Risk').length;
    return {
      department: dept,
      total: deptStudents.length,
      highRisk: deptHighRisk,
      percentage: deptStudents.length > 0 ? (deptHighRisk / deptStudents.length * 100).toFixed(1) : '0'
    };
  }).filter(d => d.total > 0);

  const recentHighRisk = students
    .filter(s => s.riskLevel === 'High Risk')
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Real-time student engagement monitoring</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Students"
          value={totalStudents}
          icon={Users}
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
          gradient="bg-gradient-to-br from-green-50 to-green-100"
        />
        <KPICard
          title="Engagement Rate"
          value={`${engagementRate.toFixed(1)}%`}
          icon={Activity}
          gradient="bg-gradient-to-br from-purple-50 to-purple-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Risk Trend Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="highRisk" stroke="#EF4444" strokeWidth={2} name="High Risk" />
              <Line type="monotone" dataKey="atRisk" stroke="#F59E0B" strokeWidth={2} name="At Risk" />
              <Line type="monotone" dataKey="lowRisk" stroke="#10B981" strokeWidth={2} name="Low Risk" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Department Breakdown</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Students</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">High Risk</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk %</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {departmentStats.map(dept => (
                    <tr key={dept.department} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{dept.department}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{dept.total}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{dept.highRisk}</td>
                      <td className="px-4 py-3">
                        <Badge variant={parseFloat(dept.percentage) > 30 ? 'red' : parseFloat(dept.percentage) > 15 ? 'orange' : 'green'}>
                          {dept.percentage}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent High Risk Alerts</h2>
          <div className="space-y-3">
            {recentHighRisk.map(student => (
              <div key={student.id} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-100">
                <div className="w-10 h-10 rounded-full bg-red-200 flex items-center justify-center text-red-800 font-semibold">
                  {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{student.name}</p>
                  <p className="text-xs text-gray-500">{student.department}</p>
                </div>
                <Badge variant="red" size="sm">
                  {student.riskScore.toFixed(0)}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
