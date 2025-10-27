import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { useData } from '../../contexts/DataContext';
import { ChatMessage } from '../../types';
import { exportToCSV } from '../../lib/utils';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hello! I am EarlySignal AI Assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { students } = useData();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickActions = [
    'Show high-risk CS students',
    'Explain risk calculation',
    'Intervention for low attendance',
    'Export department report'
  ]; // End of quickActions

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateResponse(input);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  }; // End of handleSend

  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('high risk') || lowerQuery.includes('at risk')) {
      const deptMatch = lowerQuery.match(/\b(cs|computer science|me|mechanical|ec|electronics|civil|mba)\b/i);
      let filtered = students;

      if (deptMatch) {
        const dept = deptMatch[0];
        filtered = students.filter(s =>
          s.department.toLowerCase().includes(dept.toLowerCase()) ||
          s.department.toLowerCase().startsWith(dept.substring(0, 2).toLowerCase())
        );
      }

      if (lowerQuery.includes('high risk')) {
        const highRisk = filtered.filter(s => s.riskLevel === 'High Risk');
        return `I found ${highRisk.length} high-risk students${deptMatch ? ` in ${deptMatch[0].toUpperCase()}` : ''}. Their average attendance is ${(highRisk.reduce((sum, s) => sum + s.attendance, 0) / highRisk.length).toFixed(1)}% and average GPA is ${(highRisk.reduce((sum, s) => sum + s.gpa, 0) / highRisk.length).toFixed(2)}. Would you like me to provide specific intervention recommendations?`;
      } else {
        const atRisk = filtered.filter(s => s.riskLevel === 'At Risk');
        return `I found ${atRisk.length} at-risk students${deptMatch ? ` in ${deptMatch[0].toUpperCase()}` : ''}. These students show warning signs but can be helped with timely interventions.`;
      }
    }

    if (lowerQuery.includes('explain') || lowerQuery.includes('how') || lowerQuery.includes('calculate')) {
      return `Our risk prediction model uses a weighted scoring system based on 10 key features:\n\n• Attendance (22.4% weight) - Most important factor\n• Previous GPA (18.7%) - Academic performance\n• Assignment Submission (15.3%) - Engagement indicator\n• Financial Aid Delay (9.8%) - Economic stress\n• Library Visits (7.2%) - Learning resources usage\n\nRisk scores range from 0-100, where:\n• 0-30: Low Risk (Green)\n• 30-65: At Risk (Orange)\n• 65-100: High Risk (Red)\n\nThe model has 92% confidence based on historical data.`;
    }

    if (lowerQuery.includes('intervention') || lowerQuery.includes('help') || lowerQuery.includes('improve')) {
      if (lowerQuery.includes('attendance')) {
        return `For students with low attendance, I recommend:\n\n1. Schedule attendance improvement meeting with student and parents\n2. Implement daily attendance tracking with counselor check-ins\n3. Identify and address barriers to attendance (transportation, health, etc.)\n4. Create personalized attendance recovery plan\n5. Provide attendance incentives and recognition\n\nWould you like to see students with attendance below 75%?`;
      } else if (lowerQuery.includes('grade') || lowerQuery.includes('gpa')) {
        return `For students with low GPA, I recommend:\n\n1. Enroll in subject-specific tutoring sessions\n2. Schedule weekly academic progress meetings with faculty advisor\n3. Connect with peer study groups\n4. Assess learning style and provide tailored resources\n5. Monitor progress with mid-term assessments\n\nShould I identify students with GPA below 7.0?`;
      } else {
        return `General intervention strategies include:\n\n1. Academic Support: Tutoring, study groups, time management\n2. Financial Assistance: Aid programs, emergency funds, scholarships\n3. Counseling: Mental health support, academic advising\n4. Engagement: Club participation, peer mentoring, campus events\n5. Monitoring: Regular check-ins, progress tracking\n\nWhich area would you like to focus on?`;
      }
    }

    if (lowerQuery.includes('export') || lowerQuery.includes('download') || lowerQuery.includes('report')) {
      const deptMatch = lowerQuery.match(/\b(cs|computer science|me|mechanical|ec|electronics|civil|mba)\b/i);
      let filtered = students;

      if (deptMatch) {
        const dept = deptMatch[0];
        filtered = students.filter(s =>
          s.department.toLowerCase().includes(dept.toLowerCase()) ||
          s.department.toLowerCase().startsWith(dept.substring(0, 2).toLowerCase())
        );
      }

      exportToCSV(filtered, `student-report-${new Date().toISOString().split('T')[0]}.csv`);
      return `I've exported a CSV report with ${filtered.length} students${deptMatch ? ` from ${deptMatch[0].toUpperCase()}` : ''}. The file includes all student data with risk scores and levels. Check your downloads folder!`;
    }

    if (lowerQuery.includes('department') || lowerQuery.includes('dept')) {
      const deptStats = Array.from(new Set(students.map(s => s.department))).map(dept => {
        const deptStudents = students.filter(s => s.department === dept);
        const highRisk = deptStudents.filter(s => s.riskLevel === 'High Risk').length;
        return `${dept}: ${deptStudents.length} students, ${highRisk} high-risk (${((highRisk / deptStudents.length) * 100).toFixed(1)}%)`;
      });

      return `Here's the breakdown by department:\n\n${deptStats.join('\n')}\n\nWhich department would you like to focus on?`;
    }

    if (lowerQuery.includes('total') || lowerQuery.includes('count') || lowerQuery.includes('how many')) {
      const highRisk = students.filter(s => s.riskLevel === 'High Risk').length;
      const atRisk = students.filter(s => s.riskLevel === 'At Risk').length;
      const lowRisk = students.filter(s => s.riskLevel === 'Low Risk').length;

      return `Current student statistics:\n\n• Total Students: ${students.length}\n• High Risk: ${highRisk} (${((highRisk / students.length) * 100).toFixed(1)}%)\n• At Risk: ${atRisk} (${((atRisk / students.length) * 100).toFixed(1)}%)\n• Low Risk: ${lowRisk} (${((lowRisk / students.length) * 100).toFixed(1)}%)\n\nAverage Attendance: ${(students.reduce((sum, s) => sum + s.attendance, 0) / students.length).toFixed(1)}%\nAverage GPA: ${(students.reduce((sum, s) => sum + s.gpa, 0) / students.length).toFixed(2)}`;
    }

    return `I understand you're asking about "${query}". I can help you with:\n\n• Finding high-risk or at-risk students by department\n• Explaining how risk scores are calculated\n• Providing intervention recommendations\n• Exporting reports and data\n• Analyzing department statistics\n\nTry asking something like "Show high-risk CS students" or use one of the quick actions above!`;
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
    handleSend();
  }; // End of handleQuickAction

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group animate-pulse hover:animate-none z-50"
        >
          <MessageCircle className="w-7 h-7" />
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            AI
          </span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] z-50 flex flex-col shadow-2xl rounded-lg overflow-hidden">
          <Card className="flex flex-col h-full">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold">EarlySignal AI</h3>
                  <p className="text-xs opacity-90">Always here to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-gray-200 bg-white">
              <div className="flex flex-wrap gap-2 mb-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action)}
                    className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
// End of Chatbot.tsx
