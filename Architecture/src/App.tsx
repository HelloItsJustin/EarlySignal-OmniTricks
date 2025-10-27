import React, { useState, useEffect } from 'react';
import { DataProvider } from './contexts/DataContext';
import { Layout } from './components/Layout';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { StudentsPage } from './components/students/StudentsPage';
import { StudentDetailPage } from './components/students/StudentDetailPage';
import { BatchPredictionPage } from './components/batch/BatchPredictionPage';
import { AnalyticsPage } from './components/analytics/AnalyticsPage';
import { CSVUploadModal } from './components/CSVUploadModal';
import { Chatbot } from './components/chatbot/Chatbot';
import { Card } from './components/common/Card';
import { Button } from './components/common/Button';
import { X } from 'lucide-react';

type Page = 'dashboard' | 'students' | 'batch' | 'analytics';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setShowWelcomeModal(true);
      localStorage.setItem('hasSeenWelcome', 'true');
    }
  }, []);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    setSelectedStudentId(null);
  };

  const handleStudentClick = (studentId: string) => {
    setSelectedStudentId(studentId);
  };

  const handleBack = () => {
    setSelectedStudentId(null);
  };

  const renderPage = () => {
    if (selectedStudentId) {
      return <StudentDetailPage studentId={selectedStudentId} onBack={handleBack} />;
    }

    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'students':
        return <StudentsPage onStudentClick={handleStudentClick} />;
      case 'batch':
        return <BatchPredictionPage onUploadClick={() => setShowUploadModal(true)} />;
      case 'analytics':
        return <AnalyticsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <>
      <Layout
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onUploadClick={() => setShowUploadModal(true)}
      >
        {renderPage()}
      </Layout>

      <CSVUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
      />

      <Chatbot />

      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Welcome to EarlySignal
                </h2>
                <button
                  onClick={() => setShowWelcomeModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 text-gray-700">
                <p className="text-lg">
                  Your AI-powered Student Engagement Prediction System
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Getting Started</h3>
                  <p className="text-sm text-blue-800">
                    This application is currently loaded with 20 sample students to demonstrate functionality.
                    For the hackathon, you can upload your real dataset using the button in the top-right corner.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Key Features:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span><strong>Dashboard:</strong> Real-time overview of student engagement metrics</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span><strong>Students:</strong> Browse, search, and filter all students with risk assessments</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span><strong>What-If Simulator:</strong> Test intervention scenarios and predict outcomes</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span><strong>Batch Prediction:</strong> Upload CSV files for bulk risk assessment</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span><strong>Analytics:</strong> Comprehensive insights and predictive analytics</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span><strong>AI Chatbot:</strong> Get instant help and data insights (bottom-right corner)</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-900 mb-2">Upload Your Dataset</h3>
                  <p className="text-sm text-purple-800 mb-3">
                    Click the "Upload Dataset" button in the navigation bar to replace sample data with your real student information.
                  </p>
                  <Button onClick={() => {
                    setShowWelcomeModal(false);
                    setShowUploadModal(true);
                  }}>
                    Upload Now
                  </Button>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button onClick={() => setShowWelcomeModal(false)} size="lg">
                  Get Started
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}

export default App;
