
import React, { useState, useEffect, useMemo } from "react";
import { User } from "@/api/entities";
import { Client } from "@/api/entities";
import { Session } from "@/api/entities";
import { Message } from "@/api/entities";
import { Subscription } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { PlusCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import AdminStats from "../components/admin/AdminStats";
import CoachList from "../components/admin/CoachList";
import ManageCoachModal from "../components/admin/ManageCoachModal";

export default function AdminDashboard() {
  const [coaches, setCoaches] = useState([]);
  const [clients, setClients] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [showInviteInfo, setShowInviteInfo] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Get all users
      const allUsers = await User.list();
      // Filter for users that have user_type 'coach' OR don't have user_type set yet and are 'user' role
      const coachUsers = allUsers.filter(user => 
        user.role === 'user' && (user.user_type === 'coach' || !user.user_type)
      );
      
      const [allClients, allSubscriptions] = await Promise.all([
        Client.list(),
        Subscription.list()
      ]);
      
      setCoaches(coachUsers);
      setClients(allClients);
      setSubscriptions(allSubscriptions);
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const stats = useMemo(() => {
    const totalRevenue = subscriptions
      .filter(s => s.status === 'paid')
      .reduce((sum, s) => sum + s.amount_due, 0);

    return {
      totalCoaches: coaches.length,
      totalClients: clients.length,
      totalRevenue,
    };
  }, [coaches, clients, subscriptions]);

  const handleManageCoach = (coach) => {
    setSelectedCoach(coach);
    setIsModalOpen(true);
  };
  
  const handleDataDeleted = () => {
    fetchData(); // Refresh data after deletion
    setIsModalOpen(false);
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
            <h1 className="text-3xl font-bold text-slate-100">Admin Dashboard</h1>
            <p className="text-slate-400">Oversee all platform activity from here.</p>
        </div>
        <Button onClick={() => setShowInviteInfo(!showInviteInfo)} className="bg-indigo-600 hover:bg-indigo-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            Invite Coach
        </Button>
      </div>

      {showInviteInfo && (
        <Alert className="bg-slate-800 border-indigo-500/50 text-slate-300">
          <Info className="h-4 w-4 !text-indigo-400" />
          <AlertTitle>How to Invite a New Coach</AlertTitle>
          <AlertDescription>
            To add a new coach to the platform, go to your workspace via the top-left menu, then navigate to <span className="font-bold text-white">Users &gt; Invite User</span>. Enter their email address with the <span className="font-bold text-white">'user'</span> role. After they accept, you can manage them here and they'll automatically be set as a coach.
          </AlertDescription>
        </Alert>
      )}

      <AdminStats stats={stats} isLoading={isLoading} />
      <CoachList coaches={coaches} clients={clients} onManageCoach={handleManageCoach} isLoading={isLoading} />
      
      {isModalOpen && (
        <ManageCoachModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          coach={selectedCoach}
          clients={clients.filter(c => c.coach_email === selectedCoach.email)}
          onSubscriptionChange={fetchData}
          onDataDeleted={handleDataDeleted}
        />
      )}
    </div>
  );
}
