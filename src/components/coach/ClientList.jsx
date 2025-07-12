
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Mail, Calendar, Trash2 } from 'lucide-react';
import { Client } from '@/api/entities';

export default function ClientList({ clients, onClientChange, isLoading, isReadOnly = false }) {
  const handleRemoveClient = async (clientId) => {
    if (isReadOnly) return;
    if (window.confirm('Are you sure you want to remove this client? This action cannot be undone.')) {
      try {
        await Client.delete(clientId);
        onClientChange();
      } catch (error) {
        console.error('Failed to remove client:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-200">
          <Users className="h-5 w-5" />
          My Clients ({clients.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full bg-slate-700" />
            ))}
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Users className="h-12 w-12 mx-auto mb-4 text-slate-500" />
            <p>No clients yet. Invite your first client to get started!</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-300">Name</TableHead>
                <TableHead className="text-slate-300">Email</TableHead>
                <TableHead className="text-slate-300">Program</TableHead>
                <TableHead className="text-slate-300">Start Date</TableHead>
                <TableHead className="text-slate-300">Sessions</TableHead>
                <TableHead className="text-slate-300"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id} className="border-slate-800">
                  <TableCell className="font-medium text-slate-200">{client.full_name}</TableCell>
                  <TableCell className="text-slate-300">{client.email}</TableCell>
                  <TableCell>
                    {client.program_type && (
                      <Badge variant="outline" className="border-slate-600 text-slate-300">{client.program_type}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {client.start_date ? formatDate(client.start_date) : '-'}
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {client.sessions_used || 0} / {client.total_sessions || 0}
                  </TableCell>
                  <TableCell>
                    {!isReadOnly && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveClient(client.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-slate-700"
                        disabled={isReadOnly}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
