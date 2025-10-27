import React, { ReactNode } from 'react';
import { GraduationCap, Upload } from 'lucide-react';
import { Button } from './common/Button';

interface LayoutProps {
  children: ReactNode;
  currentPage: 'dashboard' | 'students' | 'batch' | 'analytics';
  onNavigate: (page: 'dashboard' | 'students' | 'batch' | 'analytics') => void;
  onUploadClick: () => void;
}

export function Layout({ children, currentPage, onNavigate, onUploadClick }: LayoutProps) {
  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard' },
    { id: 'students' as const, label: 'Students' },
    { id: 'batch' as const, label: 'Batch Prediction' },
    { id: 'analytics' as const, label: 'Analytics' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  EarlySignal
                </span>
              </div>

              <div className="hidden md:flex space-x-1">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentPage === item.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={onUploadClick} className="flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload Dataset</span>
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
