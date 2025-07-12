
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Eye } from 'lucide-react';

const statusColors = {
  active: 'bg-green-500/20 text-green-400 border-green-500/30',
  inactive: 'bg-red-500/20 text-red-400 border-red-500/30',
  trial: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

export default function CoachList({ coaches, clients, onManageCoach, isLoading }) {
  const getClientCount = (coachEmail) => {
    return clients.filter(client => client.coach_email === coachEmail).length;
  };

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700">
        <h3 className="p-6 text-lg font-semibold">Coaches Overview</h3>
        <Table>
          <TableHeader>
            <TableRow className="border-slate-700">
              <TableHead className="text-slate-300">Coach Name</TableHead>
              <TableHead className="text-slate-300">Email</TableHead>
              <TableHead className="text-slate-300">Client Count</TableHead>
              <TableHead className="text-slate-300">Subscription Status</TableHead>
              <TableHead className="text-slate-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <TableRow key={i} className="border-slate-800">
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-24 rounded-md" /></TableCell>
                </TableRow>
              ))
            ) : coaches.map((coach) => (
              <TableRow key={coach.id} className="border-slate-800">
                <TableCell className="font-medium text-slate-100">{coach.full_name}</TableCell>
                <TableCell>{coach.email}</TableCell>
                <TableCell>{getClientCount(coach.email)}</TableCell>
                <TableCell>
                  <Badge className={statusColors[coach.subscription_status] || statusColors.inactive}>
                    {coach.subscription_status}
                  </Badge>
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="bg-transparent border-slate-600 hover:bg-slate-700 hover:text-white" onClick={() => onManageCoach(coach)}>
                    Manage
                  </Button>
                  
                  {coach.user_type === 'coach' ? (
                    <Link to={createPageUrl(`AdminPreviewCoach?id=${coach.id}`)}>
                      <Button variant="outline" size="sm" className="bg-transparent border-slate-600 hover:bg-slate-700 hover:text-white flex items-center gap-2">
                          <Eye className="w-4 h-4"/> Preview
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="outline" size="sm" className="bg-transparent border-slate-700 text-slate-500 cursor-not-allowed flex items-center gap-2" disabled>
                        <Eye className="w-4 h-4"/> Preview
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    </div>
  );
}
