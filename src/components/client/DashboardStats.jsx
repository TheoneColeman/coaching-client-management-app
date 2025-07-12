import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, CalendarCheck, Users } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, description }) => (
  <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
      <Icon className="h-5 w-5 text-blue-500" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <p className="text-xs text-gray-500">{description}</p>
    </CardContent>
  </Card>
);

export default function DashboardStats({ client }) {
  const sessionsRemaining = (client.total_sessions || 0) - (client.sessions_used || 0);
  const activeStage = client.program_stages?.find(s => s.status === 'in_progress')?.name || 'Planning';

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <StatCard
        icon={CalendarCheck}
        title="Sessions Remaining"
        value={sessionsRemaining}
        description={`Out of ${client.total_sessions || 0} total sessions`}
      />
      <StatCard
        icon={Target}
        title="Current Focus"
        value={activeStage}
        description="Your active program stage"
      />
      <StatCard
        icon={Users}
        title="Your Coach"
        value={client.coach_name}
        description="Your partner in success"
      />
    </div>
  );
}