import React, { useState } from 'react';
import { ChevronDown, ChevronUp, RotateCcw, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Student } from '../../types';
import { calculateRiskScore, getRiskLevel } from '../../lib/mlSimulation';

interface WhatIfSimulatorProps {
  student: Student;
}

export function WhatIfSimulator({ student }: WhatIfSimulatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [modifiedValues, setModifiedValues] = useState({
    attendance: student.attendance,
    assignmentSubmission: student.assignmentSubmission,
    libraryVisits: student.libraryVisits,
    gpa: student.gpa,
    counselorVisits: student.counselorVisits,
    labParticipation: student.labParticipation,
    peerEngagement: student.peerEngagement
  });
  const [simulatedRisk, setSimulatedRisk] = useState<number | null>(null);
  const [simulatedLevel, setSimulatedLevel] = useState<string | null>(null);

  const handleReset = () => {
    setModifiedValues({
      attendance: student.attendance,
      assignmentSubmission: student.assignmentSubmission,
      libraryVisits: student.libraryVisits,
      gpa: student.gpa,
      counselorVisits: student.counselorVisits,
      labParticipation: student.labParticipation,
      peerEngagement: student.peerEngagement
    });
    setSimulatedRisk(null);
    setSimulatedLevel(null);
  };

  const handleCalculate = () => {
    const modifiedStudent = {
      ...student,
      ...modifiedValues,
      previousSemesterGPA: modifiedValues.gpa
    };

    const newRiskScore = calculateRiskScore(modifiedStudent);
    const { level } = getRiskLevel(newRiskScore);

    setSimulatedRisk(newRiskScore);
    setSimulatedLevel(level);
  };

  const hasChanges = Object.keys(modifiedValues).some(
    key => modifiedValues[key as keyof typeof modifiedValues] !== student[key as keyof Student]
  );

  const improvement = simulatedRisk !== null ? student.riskScore - simulatedRisk : 0;

  return (
    <Card className="p-6 border-2 border-blue-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <h2 className="text-lg font-semibold text-gray-900">Run Intervention Simulation</h2>
        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {isExpanded && (
        <div className="mt-6 space-y-6">
          <p className="text-sm text-gray-600">
            Adjust student metrics below to see predicted risk score change
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attendance: {modifiedValues.attendance.toFixed(1)}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={modifiedValues.attendance}
                onChange={(e) => setModifiedValues({ ...modifiedValues, attendance: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignment Submission: {modifiedValues.assignmentSubmission.toFixed(1)}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={modifiedValues.assignmentSubmission}
                onChange={(e) => setModifiedValues({ ...modifiedValues, assignmentSubmission: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Library Visits: {modifiedValues.libraryVisits}/month
              </label>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={modifiedValues.libraryVisits}
                onChange={(e) => setModifiedValues({ ...modifiedValues, libraryVisits: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>20</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GPA: {modifiedValues.gpa.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={modifiedValues.gpa}
                onChange={(e) => setModifiedValues({ ...modifiedValues, gpa: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0.0</span>
                <span>10.0</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Counselor Visits: {modifiedValues.counselorVisits}
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={modifiedValues.counselorVisits}
                onChange={(e) => setModifiedValues({ ...modifiedValues, counselorVisits: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>10</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lab Participation: {modifiedValues.labParticipation.toFixed(1)}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={modifiedValues.labParticipation}
                onChange={(e) => setModifiedValues({ ...modifiedValues, labParticipation: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peer Engagement: {modifiedValues.peerEngagement}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={modifiedValues.peerEngagement}
                onChange={(e) => setModifiedValues({ ...modifiedValues, peerEngagement: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1</span>
                <span>10</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button onClick={handleCalculate} disabled={!hasChanges} className="flex-1">
              Calculate New Risk
            </Button>
            <Button variant="secondary" onClick={handleReset} disabled={!hasChanges}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          {simulatedRisk !== null && simulatedLevel && (
            <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Simulation Results</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Current Risk Score</p>
                  <p className="text-3xl font-bold text-gray-900">{student.riskScore.toFixed(0)}</p>
                  <Badge variant={student.riskColor} size="sm" className="mt-2">
                    {student.riskLevel}
                  </Badge>
                </div>

                <div className="flex items-center justify-center">
                  <ArrowRight className="w-8 h-8 text-gray-400" />
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Predicted Risk Score</p>
                  <p className={`text-3xl font-bold ${improvement > 0 ? 'text-green-600' : improvement < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                    {simulatedRisk.toFixed(0)}
                  </p>
                  <Badge
                    variant={simulatedLevel === 'Low Risk' ? 'green' : simulatedLevel === 'At Risk' ? 'orange' : 'red'}
                    size="sm"
                    className="mt-2"
                  >
                    {simulatedLevel}
                  </Badge>
                </div>
              </div>

              {improvement !== 0 && (
                <div className={`p-4 rounded-lg ${improvement > 0 ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'}`}>
                  <p className={`text-sm font-medium ${improvement > 0 ? 'text-green-900' : 'text-red-900'}`}>
                    {improvement > 0 ? (
                      <>
                        Risk score improved by {improvement.toFixed(1)} points ({((improvement / student.riskScore) * 100).toFixed(1)}%)!
                        {student.riskLevel !== simulatedLevel && (
                          <span className="block mt-1">
                            Student moved from {student.riskLevel} to {simulatedLevel}
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        Risk score increased by {Math.abs(improvement).toFixed(1)} points
                      </>
                    )}
                  </p>
                </div>
              )}

              <div className="mt-4 p-4 bg-white rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Key Changes</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  {modifiedValues.attendance !== student.attendance && (
                    <li>• Attendance: {student.attendance.toFixed(1)}% → {modifiedValues.attendance.toFixed(1)}%</li>
                  )}
                  {modifiedValues.assignmentSubmission !== student.assignmentSubmission && (
                    <li>• Assignment Submission: {student.assignmentSubmission.toFixed(1)}% → {modifiedValues.assignmentSubmission.toFixed(1)}%</li>
                  )}
                  {modifiedValues.libraryVisits !== student.libraryVisits && (
                    <li>• Library Visits: {student.libraryVisits} → {modifiedValues.libraryVisits} per month</li>
                  )}
                  {modifiedValues.gpa !== student.gpa && (
                    <li>• GPA: {student.gpa.toFixed(2)} → {modifiedValues.gpa.toFixed(2)}</li>
                  )}
                  {modifiedValues.counselorVisits !== student.counselorVisits && (
                    <li>• Counselor Visits: {student.counselorVisits} → {modifiedValues.counselorVisits}</li>
                  )}
                  {modifiedValues.labParticipation !== student.labParticipation && (
                    <li>• Lab Participation: {student.labParticipation.toFixed(1)}% → {modifiedValues.labParticipation.toFixed(1)}%</li>
                  )}
                  {modifiedValues.peerEngagement !== student.peerEngagement && (
                    <li>• Peer Engagement: {student.peerEngagement} → {modifiedValues.peerEngagement}</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
