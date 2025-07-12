import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Video } from 'lucide-react';
import { format } from 'date-fns';

export default function UpcomingSessions({ sessions }) {
  return (
    <Card className="bg-white border-gray-200 h-full">
      <CardHeader>
        <CardTitle className="text-xl text-gray-800">Upcoming Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        {sessions.length > 0 ? (
          <ul className="space-y-4">
            {sessions.map((session) => (
              <li key={session.id} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border">
                <div className="p-3 bg-blue-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{session.session_type}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span>{format(new Date(session.session_date), 'EEEE, MMMM do')}</span>
                    <span>at {session.session_time}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-10">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-500">No upcoming sessions scheduled.</p>
            <p className="text-sm text-gray-400">Your coach will add new sessions here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}