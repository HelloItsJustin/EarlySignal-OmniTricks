export interface Student {
  id: string;
  name: string;
  studentId: string;
  department: string;
  semester: number;
  age: number;
  gender: string;
  attendance: number;
  gpa: number;
  assignmentSubmission: number;
  libraryVisits: number;
  financialAidStatus: 'current' | 'delayed' | 'none';
  financialAidDelayDays: number;
  counselorVisits: number;
  labParticipation: number;
  peerEngagement: number;
  hostelOrDayScholar: 'hostel' | 'day_scholar';
  previousSemesterGPA: number;
  riskScore: number;
  riskLevel: 'Low Risk' | 'At Risk' | 'High Risk';
  riskColor: 'green' | 'orange' | 'red';
  lastUpdated: string;
}

export interface RiskFactor {
  factor: string;
  currentValue: string | number;
  expectedValue: string | number;
  impact: number;
  direction: 'positive' | 'negative';
}

export interface PredictionResult {
  student: Student;
  riskScore: number;
  riskLevel: string;
  riskColor: string;
  topRiskFactors: RiskFactor[];
  interventionRecommendations: string[];
  confidenceScore: number;
}

export interface SimulationInput {
  studentId: string;
  modifiedFeatures: Partial<Omit<Student, 'id' | 'name' | 'studentId'>>;
}

export interface AnalyticsData {
  totalStudents: number;
  highRiskCount: number;
  atRiskCount: number;
  lowRiskCount: number;
  avgAttendance: number;
  avgGPA: number;
  engagementRate: number;
  departmentBreakdown: { department: string; highRisk: number; total: number }[];
  riskTrend: { date: string; highRisk: number; atRisk: number; lowRisk: number }[];
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}
