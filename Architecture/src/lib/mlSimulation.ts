import { Student, RiskFactor } from '../types';

export function calculateRiskScore(student: Partial<Student>): number {
  const weights = {
    attendance: 22.4,
    previousGPA: 18.7,
    assignmentSubmission: 15.3,
    financialAidDelay: 9.8,
    libraryVisits: 7.2,
    counselorVisits: 6.5,
    labParticipation: 5.9,
    peerEngagement: 4.8,
    age: 3.2,
    hostel: 2.7,
    currentGPA: 3.5
  };

  let riskScore = 0;

  const attendanceContribution = ((75 - (student.attendance || 75)) / 75) * weights.attendance;
  riskScore += Math.max(0, attendanceContribution);

  const gpaContribution = ((7.5 - (student.previousSemesterGPA || 7.5)) / 7.5) * weights.previousGPA;
  riskScore += Math.max(0, gpaContribution);

  const assignmentContribution = ((80 - (student.assignmentSubmission || 80)) / 80) * weights.assignmentSubmission;
  riskScore += Math.max(0, assignmentContribution);

  const financeContribution = ((student.financialAidDelayDays || 0) / 60) * weights.financialAidDelay;
  riskScore += Math.min(weights.financialAidDelay, financeContribution);

  const libraryContribution = ((8 - (student.libraryVisits || 8)) / 8) * weights.libraryVisits;
  riskScore += Math.max(0, libraryContribution);

  const counselorOptimal = 2;
  const counselorDeviation = Math.abs((student.counselorVisits || 2) - counselorOptimal);
  const counselorContribution = (counselorDeviation / 5) * weights.counselorVisits;
  riskScore += Math.min(weights.counselorVisits, counselorContribution);

  const labContribution = ((85 - (student.labParticipation || 85)) / 85) * weights.labParticipation;
  riskScore += Math.max(0, labContribution);

  const peerContribution = ((7 - (student.peerEngagement || 7)) / 7) * weights.peerEngagement;
  riskScore += Math.max(0, peerContribution);

  return Math.min(100, Math.max(0, riskScore));
}

export function getRiskLevel(score: number): { level: 'Low Risk' | 'At Risk' | 'High Risk'; color: 'green' | 'orange' | 'red' } {
  if (score < 30) return { level: 'Low Risk', color: 'green' };
  if (score < 65) return { level: 'At Risk', color: 'orange' };
  return { level: 'High Risk', color: 'red' };
}

export function generateRiskFactors(student: Student): RiskFactor[] {
  const factors: RiskFactor[] = [];

  if (student.attendance < 75) {
    factors.push({
      factor: 'Attendance',
      currentValue: `${student.attendance}%`,
      expectedValue: '75%+',
      impact: ((75 - student.attendance) / 75) * 22.4,
      direction: 'positive'
    });
  }

  if (student.assignmentSubmission < 80) {
    factors.push({
      factor: 'Assignment Submission',
      currentValue: `${student.assignmentSubmission}%`,
      expectedValue: '80%+',
      impact: ((80 - student.assignmentSubmission) / 80) * 15.3,
      direction: 'positive'
    });
  }

  if (student.libraryVisits < 8) {
    factors.push({
      factor: 'Library Visits',
      currentValue: `${student.libraryVisits}/month`,
      expectedValue: '8+/month',
      impact: ((8 - student.libraryVisits) / 8) * 7.2,
      direction: 'positive'
    });
  }

  if (student.financialAidDelayDays > 0) {
    factors.push({
      factor: 'Financial Aid Delay',
      currentValue: `${student.financialAidDelayDays} days`,
      expectedValue: '0 days',
      impact: (student.financialAidDelayDays / 60) * 9.8,
      direction: 'positive'
    });
  }

  if (student.previousSemesterGPA < 7.5) {
    factors.push({
      factor: 'Previous Semester GPA',
      currentValue: student.previousSemesterGPA.toFixed(2),
      expectedValue: '7.5+',
      impact: ((7.5 - student.previousSemesterGPA) / 7.5) * 18.7,
      direction: 'positive'
    });
  }

  if (student.labParticipation < 85) {
    factors.push({
      factor: 'Lab Participation',
      currentValue: `${student.labParticipation}%`,
      expectedValue: '85%+',
      impact: ((85 - student.labParticipation) / 85) * 5.9,
      direction: 'positive'
    });
  }

  if (student.peerEngagement < 7) {
    factors.push({
      factor: 'Peer Engagement',
      currentValue: `${student.peerEngagement}/10`,
      expectedValue: '7+/10',
      impact: ((7 - student.peerEngagement) / 7) * 4.8,
      direction: 'positive'
    });
  }

  return factors.sort((a, b) => b.impact - a.impact).slice(0, 5);
}

export function generateInterventions(student: Student): string[] {
  const interventions: string[] = [];

  if (student.attendance < 75) {
    interventions.push('Schedule attendance improvement meeting with student and parents');
    interventions.push('Implement daily attendance tracking with counselor check-ins');
  }

  if (student.assignmentSubmission < 80) {
    interventions.push('Assign peer mentor for assignment guidance and time management');
    interventions.push('Enroll in academic skills workshop series');
  }

  if (student.libraryVisits < 8) {
    interventions.push('Introduce to library resources and study group programs');
    interventions.push('Create structured study schedule with library time blocks');
  }

  if (student.financialAidDelayDays > 0) {
    interventions.push('Connect with financial aid office for installment plan options');
    interventions.push('Refer to scholarship opportunities and emergency aid programs');
  }

  if (student.previousSemesterGPA < 7.5) {
    interventions.push('Enroll in subject-specific tutoring sessions');
    interventions.push('Schedule weekly academic progress meetings with faculty advisor');
  }

  if (student.peerEngagement < 5) {
    interventions.push('Encourage participation in student clubs and peer support groups');
    interventions.push('Assign to collaborative project teams to build social connections');
  }

  if (student.labParticipation < 85) {
    interventions.push('Provide additional lab session support and hands-on guidance');
  }

  return interventions.slice(0, 4);
}
