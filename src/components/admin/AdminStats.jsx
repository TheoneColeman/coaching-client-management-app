
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const StatCard = ({ title, value, isLoading }) => (
  <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
    <h3 className="text-sm font-medium text-slate-400">{title}</h3>
    {isLoading ? (
      <Skeleton className="h-9 w-24 mt-2" />
    ) : (
      <p className="text-3xl font-bold text-slate-100 mt-1">{value}</p>
    )}
  </div>
);

export default function AdminStats({ stats, isLoading }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard 
        title="Total Revenue" 
        value={`£${stats.totalRevenue.toLocaleString()}`} 
        isLoading={isLoading} 
      />
      <StatCard title="Active Coaches" value={stats.totalCoaches} isLoading={isLoading} />
      <StatCard title="Total Clients" value={stats.totalClients} isLoading={isLoading} />
    </div>
  );
}
