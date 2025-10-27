import { Student } from '../types';
import { calculateRiskScore, getRiskLevel } from './mlSimulation';

const indianNames = [
  'Rahul Kumar', 'Priya Sharma', 'Amit Patel', 'Ananya Singh', 'Arjun Reddy',
  'Divya Gupta', 'Karan Malhotra', 'Meera Iyer', 'Neha Verma', 'Rohan Desai',
  'Sneha Kapoor', 'Vikram Shah', 'Anjali Nair', 'Aditya Joshi', 'Kavya Rao',
  'Siddharth Mehta', 'Pooja Saxena', 'Ravi Pillai', 'Ishita Bose', 'Varun Khanna'
];

const departments = ['Computer Science', 'Mechanical Engineering', 'Electronics', 'Civil Engineering', 'MBA'];

function createStudent(
  id: number,
  name: string,
  department: string,
  riskProfile: 'high' | 'at-risk' | 'low'
): Student {
  let baseData: Partial<Student>;

  if (riskProfile === 'high') {
    baseData = {
      attendance: 45 + Math.random() * 20,
      gpa: 5.0 + Math.random() * 1.5,
      assignmentSubmission: 30 + Math.random() * 25,
      libraryVisits: Math.floor(Math.random() * 3),
      financialAidStatus: Math.random() > 0.5 ? 'delayed' : 'current',
      financialAidDelayDays: Math.random() > 0.5 ? Math.floor(20 + Math.random() * 40) : 0,
      counselorVisits: Math.floor(Math.random() * 2),
      labParticipation: 40 + Math.random() * 25,
      peerEngagement: Math.floor(1 + Math.random() * 4),
      previousSemesterGPA: 5.0 + Math.random() * 1.8
    };
  } else if (riskProfile === 'at-risk') {
    baseData = {
      attendance: 65 + Math.random() * 15,
      gpa: 6.5 + Math.random() * 1.2,
      assignmentSubmission: 60 + Math.random() * 20,
      libraryVisits: Math.floor(4 + Math.random() * 5),
      financialAidStatus: Math.random() > 0.7 ? 'delayed' : 'current',
      financialAidDelayDays: Math.random() > 0.7 ? Math.floor(10 + Math.random() * 20) : 0,
      counselorVisits: Math.floor(1 + Math.random() * 3),
      labParticipation: 65 + Math.random() * 15,
      peerEngagement: Math.floor(4 + Math.random() * 3),
      previousSemesterGPA: 6.2 + Math.random() * 1.5
    };
  } else {
    baseData = {
      attendance: 85 + Math.random() * 15,
      gpa: 7.8 + Math.random() * 2.2,
      assignmentSubmission: 85 + Math.random() * 15,
      libraryVisits: Math.floor(8 + Math.random() * 8),
      financialAidStatus: 'current',
      financialAidDelayDays: 0,
      counselorVisits: Math.floor(1 + Math.random() * 3),
      labParticipation: 85 + Math.random() * 15,
      peerEngagement: Math.floor(7 + Math.random() * 3),
      previousSemesterGPA: 7.5 + Math.random() * 2.5
    };
  }

  const studentId = `${department.substring(0, 2).toUpperCase()}${2020 + Math.floor(Math.random() * 4)}${String(id).padStart(3, '0')}`;

  const student: Partial<Student> = {
    id: String(id),
    name,
    studentId,
    department,
    semester: Math.floor(1 + Math.random() * 8),
    age: 18 + Math.floor(Math.random() * 5),
    gender: Math.random() > 0.4 ? 'Male' : 'Female',
    hostelOrDayScholar: Math.random() > 0.6 ? 'hostel' : 'day_scholar',
    lastUpdated: new Date().toISOString(),
    ...baseData
  };

  const riskScore = calculateRiskScore(student);
  const { level, color } = getRiskLevel(riskScore);

  return {
    ...student,
    riskScore,
    riskLevel: level,
    riskColor: color
  } as Student;
}

export function generateSampleStudents(): Student[] {
  const students: Student[] = [];
  let id = 1;

  for (let i = 0; i < 6; i++) {
    students.push(createStudent(id++, indianNames[i], departments[i % departments.length], 'high'));
  }

  for (let i = 6; i < 14; i++) {
    students.push(createStudent(id++, indianNames[i], departments[i % departments.length], 'at-risk'));
  }

  for (let i = 14; i < 20; i++) {
    students.push(createStudent(id++, indianNames[i], departments[i % departments.length], 'low'));
  }

  return students;
}

export const sampleStudents: Student[] = generateSampleStudents();
