import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Zap, Loader, Flag } from 'lucide-react';

const stageIcons = {
  planning: { icon: Flag, color: 'text-gray-500', bg: 'bg-gray-100' },
  in_progress: { icon: Zap, color: 'text-blue-600', bg: 'bg-blue-100' },
  completed: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
};

export default function ProgramStages({ stages }) {
  if (!stages || stages.length === 0) {
    return null;
  }

  return (
    <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Program Journey</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stages.map((stage, index) => {
            const config = stageIcons[stage.status] || stageIcons.planning;
            const Icon = config.icon;
            return (
            <Card key={index} className={`bg-white border-gray-200 transition-all ${stage.status === 'in_progress' ? 'border-blue-500 shadow-md' : 'opacity-70'}`}>
                <CardHeader>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${config.bg}`}>
                        <Icon className={`w-6 h-6 ${config.color}`} />
                    </div>
                    <CardTitle className="text-lg text-gray-800">{stage.name}</CardTitle>
                </div>
                </CardHeader>
                <CardContent>
                <p className="text-sm text-gray-600 h-12">{stage.description}</p>
                </CardContent>
            </Card>
            );
        })}
        </div>
    </div>
  );
}