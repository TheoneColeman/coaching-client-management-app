
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Client } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Users, CreditCard, AlertTriangle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

import ClientList from "../components/coach/ClientList";
import InviteClientModal from "../components/coach/InviteClientModal";
import SubscriptionCard from "../components/coach/SubscriptionCard";

export default function CoachDashboard() {
  const [coach, setCoach] = useState(null);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const currentCoach = await User.me();
      if (currentCoach.user_type !== 'coach') {
        throw new Error('Access denied: Coach account required');
      }
      setCoach(currentCoach);
      
      const coachClients = await Client.filter({ coach_email: currentCoach.email });
      setClients(coachClients);
    } catch (error) {
      console.error("Failed to fetch coach data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClientInvited = () => {
    fetchData();
    setShowInviteModal(false);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-slate-200">Loading...</div>;
  }

  if (!coach) {
    return (
      <Alert className="max-w-md mx-auto mt-8 bg-slate-800 border-slate-700">
        <AlertTriangle className="h-4 w-4 text-red-400" />
        <AlertTitle className="text-slate-200">Access Denied</AlertTitle>
        <AlertDescription className="text-slate-300">You need a coach account to access this dashboard.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Coach Dashboard</h1>
          <p className="text-slate-400">Welcome back, {coach.full_name}</p>
        </div>
        <Button onClick={() => setShowInviteModal(true)} className="bg-indigo-600 hover:bg-indigo-700">
          <PlusCircle className="mr-2 h-4 w-4" />
          Invite Client
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ClientList clients={clients} onClientChange={fetchData} isLoading={isLoading} isReadOnly={false} />
        </div>
        <div>
          <SubscriptionCard coach={coach} clientCount={clients.length} isReadOnly={false} />
        </div>
      </div>

      {showInviteModal && (
        <InviteClientModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          coach={coach}
          onClientInvited={handleClientInvited}
        />
      )}
    </div>
  );
}
