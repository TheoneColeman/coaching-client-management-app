import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Client } from '@/api/entities';
import { Info } from 'lucide-react';

export default function InviteClientModal({ isOpen, onClose, coach, onClientInvited }) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    program_type: '',
    total_sessions: 10,
    start_date: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInviteInfo, setShowInviteInfo] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await Client.create({
        ...formData,
        coach_name: coach.full_name,
        coach_email: coach.email,
        sessions_used: 0,
        program_stages: [
          { name: 'Initial Assessment', status: 'planning', description: 'Getting to know the client and their goals' },
          { name: 'Program Design', status: 'planning', description: 'Creating a customized coaching program' },
          { name: 'Implementation', status: 'planning', description: 'Working through the coaching program' },
          { name: 'Review & Adjust', status: 'planning', description: 'Evaluating progress and making adjustments' }
        ]
      });
      
      setShowInviteInfo(true);
      onClientInvited();
    } catch (error) {
      console.error('Failed to create client:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showInviteInfo) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Client Added Successfully!</DialogTitle>
          </DialogHeader>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>{formData.full_name}</strong> has been added to your client list. To give them access to the platform:
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Go to your workspace (top-left menu)</li>
                <li>Navigate to <strong>Users → Invite User</strong></li>
                <li>Enter their email: <strong>{formData.email}</strong></li>
                <li>Select the <strong>'user'</strong> role</li>
                <li>Send the invitation</li>
              </ol>
              <p className="mt-2 text-sm text-gray-600">
                Once they accept the invitation, they'll automatically be set up as your client.
              </p>
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button onClick={onClose}>Got it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Invite New Client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              required
              value={formData.full_name}
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="program_type">Program Type</Label>
              <Select value={formData.program_type} onValueChange={(value) => setFormData({...formData, program_type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="life-coaching">Life Coaching</SelectItem>
                  <SelectItem value="business-coaching">Business Coaching</SelectItem>
                  <SelectItem value="career-coaching">Career Coaching</SelectItem>
                  <SelectItem value="wellness-coaching">Wellness Coaching</SelectItem>
                  <SelectItem value="executive-coaching">Executive Coaching</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="total_sessions">Total Sessions</Label>
              <Input
                id="total_sessions"
                type="number"
                min="1"
                value={formData.total_sessions}
                onChange={(e) => setFormData({...formData, total_sessions: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="start_date">Start Date</Label>
            <Input
              id="start_date"
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({...formData, start_date: e.target.value})}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding Client...' : 'Add Client'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}