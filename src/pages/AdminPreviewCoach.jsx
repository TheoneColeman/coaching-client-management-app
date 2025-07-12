
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Client } from '@/api/entities';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

import ClientList from '../components/coach/ClientList';
import SubscriptionCard from '../components/coach/SubscriptionCard';

export default function AdminPreviewCoach() {
    const [coach, setCoach] = useState(null);
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const coachId = urlParams.get('id');

        if (!coachId) {
            setError('No coach ID provided.');
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const selectedCoach = await User.get(coachId);
                if (selectedCoach.user_type !== 'coach') {
                    setError(`This user (${selectedCoach.full_name}) has not been confirmed as a coach. Please use the "Manage" button on the dashboard to set their status.`);
                    setIsLoading(false);
                    return;
                }
                setCoach(selectedCoach);

                const coachClients = await Client.filter({ coach_email: selectedCoach.email });
                setClients(coachClients);
            } catch (err) {
                console.error("Failed to fetch coach data for preview:", err);
                setError('Failed to load coach data. The user may not exist or is not a coach.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);
    
    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-12 w-1/2" />
                <Skeleton className="h-20 w-full" />
                <div className="grid grid-cols-3 gap-6">
                    <Skeleton className="col-span-2 h-64" />
                    <Skeleton className="h-64" />
                </div>
            </div>
        )
    }

    if (error) {
         return (
            <div className="space-y-6">
                 <Alert variant="destructive">
                    <AlertTitle>Cannot Preview User</AlertTitle>
                    <AlertDescription>
                        {error}
                        <Link to={createPageUrl('AdminDashboard')} className="mt-4 block text-sm font-semibold text-red-300 hover:text-red-200">
                            &larr; Return to Admin Dashboard
                        </Link>
                    </AlertDescription>
                </Alert>
            </div>
         )
    }

    return (
        <div className="space-y-6">
            <Alert className="bg-slate-800 border-indigo-500/50 text-slate-300">
                <Eye className="h-4 w-4 !text-indigo-400" />
                <AlertTitle>Preview Mode</AlertTitle>
                <AlertDescription className="flex justify-between items-center">
                    You are viewing the dashboard as <span className="font-bold text-white mx-1">{coach.full_name}</span>. This is a read-only view.
                    <Link to={createPageUrl('AdminDashboard')} className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                        <ArrowLeft className="w-4 h-4"/>
                        Return to Admin Dashboard
                    </Link>
                </AlertDescription>
            </Alert>
            
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold">Coach Dashboard</h1>
                    <p className="text-gray-600">Welcome back, {coach.full_name}</p>
                </div>
                 {/* No invite button in preview */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ClientList clients={clients} isLoading={false} isReadOnly={true} />
                </div>
                <div>
                    <SubscriptionCard coach={coach} clientCount={clients.length} isReadOnly={true} />
                </div>
            </div>
        </div>
    );
}
