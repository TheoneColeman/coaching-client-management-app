import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Client } from '@/api/entities';
import { Session } from '@/api/entities';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Frown } from 'lucide-react';

import DashboardStats from '../components/client/DashboardStats';
import ProgramStages from '../components/client/ProgramStages';
import UpcomingSessions from '../components/client/UpcomingSessions';
import ContactCoachForm from '../components/client/ContactCoachForm';

export default function ClientDashboard() {
  const [client, setClient] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const currentUser = await User.me();
        if (!currentUser || currentUser.user_type !== 'client') {
          throw new Error('Access denied. You must be logged in as a client.');
        }

        const clientData = await Client.filter({ email: currentUser.email });
        if (clientData.length === 0) {
          throw new Error("Your client profile could not be found. Please contact your coach.");
        }
        setClient(clientData[0]);

        const upcomingSessions = await Session.filter(
          { client_email: currentUser.email, status: 'scheduled' },
          'session_date' // Sort by session date, ascending
        );
        setSessions(upcomingSessions);
        
      } catch (err) {
        console.error("Failed to fetch client data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-lg mx-auto">
        <Frown className="h-4 w-4" />
        <AlertTitle>An Error Occurred</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {client.full_name}</h1>
        <p className="text-gray-500">Here's your personal coaching dashboard.</p>
      </div>
      
      <DashboardStats client={client} />
      
      <ProgramStages stages={client.program_stages || []} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <UpcomingSessions sessions={sessions} />
        </div>
        <div className="lg:col-span-2">
          <ContactCoachForm client={client} />
        </div>
      </div>
    </div>
  );
}