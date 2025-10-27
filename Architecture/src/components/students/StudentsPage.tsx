import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, RefreshCw } from 'lucide-react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { useData } from '../../contexts/DataContext';
import { exportToCSV, getInitials } from '../../lib/utils';
import { Student } from '../../types';

interface StudentsPageProps {
  onStudentClick: (studentId: string) => void;
}

export function StudentsPage({ onStudentClick }: StudentsPageProps) {
  const { students } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string[]>([]);
  const [riskFilter, setRiskFilter] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<keyof Student>('riskScore');
  const [sortDesc, setSortDesc] = useState(true);
  const rowsPerPage = 20;

  const departments = Array.from(new Set(students.map(s => s.department)));

  const filteredStudents = useMemo(() => {
    let filtered = students;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.studentId.toLowerCase().includes(query) ||
        s.department.toLowerCase().includes(query)
      );
    }

    if (departmentFilter.length > 0) {
      filtered = filtered.filter(s => departmentFilter.includes(s.department));
    }

    if (riskFilter.length > 0) {
      filtered = filtered.filter(s => riskFilter.includes(s.riskLevel));
    }

    filtered = [...filtered].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      const comparison = aVal > bVal ? 1 : -1;
      return sortDesc ? -comparison : comparison;
    });

    return filtered;
  }, [students, searchQuery, departmentFilter, riskFilter, sortBy, sortDesc]);

  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);

  const handleSort = (field: keyof Student) => {
    if (sortBy === field) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(field);
      setSortDesc(true);
    }
  };

  const handleExport = () => {
    exportToCSV(filteredStudents, `students-${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-500 mt-1">{filteredStudents.length} students</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="secondary" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, ID, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <select
                multiple
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(Array.from(e.target.selectedOptions, option => option.value))}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <label className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  checked={riskFilter.includes('High Risk')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setRiskFilter([...riskFilter, 'High Risk']);
                    } else {
                      setRiskFilter(riskFilter.filter(r => r !== 'High Risk'));
                    }
                  }}
                  className="rounded text-blue-500"
                />
                <span className="text-sm">High Risk</span>
              </label>
              <label className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  checked={riskFilter.includes('At Risk')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setRiskFilter([...riskFilter, 'At Risk']);
                    } else {
                      setRiskFilter(riskFilter.filter(r => r !== 'At Risk'));
                    }
                  }}
                  className="rounded text-blue-500"
                />
                <span className="text-sm">At Risk</span>
              </label>
              <label className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  checked={riskFilter.includes('Low Risk')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setRiskFilter([...riskFilter, 'Low Risk']);
                    } else {
                      setRiskFilter(riskFilter.filter(r => r !== 'Low Risk'));
                    }
                  }}
                  className="rounded text-blue-500"
                />
                <span className="text-sm">Low Risk</span>
              </label>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('studentId')}>
                  Student ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('name')}>
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('department')}>
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('semester')}>
                  Semester
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('attendance')}>
                  Attendance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('gpa')}>
                  GPA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('riskScore')}>
                  Risk Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('riskLevel')}>
                  Risk Level
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedStudents.map(student => (
                <tr
                  key={student.id}
                  onClick={() => onStudentClick(student.id)}
                  className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                    student.riskColor === 'red' ? 'bg-red-50 bg-opacity-30' :
                    student.riskColor === 'orange' ? 'bg-orange-50 bg-opacity-30' :
                    'bg-green-50 bg-opacity-30'
                  }`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-blue-600">{student.studentId}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                        {getInitials(student.name)}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.department}</td>
                  <td className="px-6 py-4">
                    <Badge variant="blue" size="sm">{student.semester}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                        <div
                          className={`h-2 rounded-full ${
                            student.attendance >= 75 ? 'bg-green-500' :
                            student.attendance >= 65 ? 'bg-orange-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${student.attendance}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{student.attendance.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.gpa.toFixed(2)}</td>
                  <td className="px-6 py-4 text-lg font-bold text-gray-900">{student.riskScore.toFixed(0)}</td>
                  <td className="px-6 py-4">
                    <Badge variant={student.riskColor}>{student.riskLevel}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, filteredStudents.length)} of {filteredStudents.length} students
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
