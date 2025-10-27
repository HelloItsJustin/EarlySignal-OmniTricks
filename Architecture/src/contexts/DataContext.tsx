import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Student } from '../types';
import { sampleStudents } from '../lib/mockData';

interface DataContextType {
  students: Student[];
  setStudents: (students: Student[]) => void;
  resetToSampleData: () => void;
  getStudentById: (id: string) => Student | undefined;
  updateStudent: (id: string, updates: Partial<Student>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [students, setStudentsState] = useState<Student[]>(() => {
    const saved = localStorage.getItem('students');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return sampleStudents;
      }
    }
    return sampleStudents;
  });

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  const setStudents = (newStudents: Student[]) => {
    setStudentsState(newStudents);
  };

  const resetToSampleData = () => {
    setStudentsState(sampleStudents);
  };

  const getStudentById = (id: string) => {
    return students.find(s => s.id === id);
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudentsState(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  return (
    <DataContext.Provider value={{ students, setStudents, resetToSampleData, getStudentById, updateStudent }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
