import React, { ReactNode } from 'react';
import { Card } from '../common/Card';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  gradient?: string;
}

export function KPICard({ title, value, icon: Icon, change, gradient }: KPICardProps) {
  return (
    <Card className={`p-6 ${gradient || ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-4xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className="text-sm text-gray-600 mt-2">{change}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${gradient ? 'bg-white bg-opacity-50' : 'bg-gray-100'}`}>
          <Icon className="w-8 h-8 text-blue-600" />
        </div>
      </div>
    </Card>
  );
}
