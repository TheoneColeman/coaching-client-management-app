
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Client, Session, Message } from '@/api/entities';
import { Trash2, AlertTriangle } from 'lucide-react';

export default function ManageCoachModal({ isOpen, onClose, coach, clients, onSubscriptionChange, onDataDeleted }) {
  const [status, setStatus] = useState(coach.subscription_status);
  const [currency, setCurrency] = useState(coach.currency || 'usd');
  const [feePerClient, setFeePerClient] = useState(coach.subscription_fee_per_client || 10);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await User.update(coach.id, { 
        user_type: 'coach', // Ensure they're marked as a coach
        subscription_status: status,
        currency: currency,
        subscription_fee_per_client: feePerClient
      });
      onSubscriptionChange(); // Refresh data on parent
      onClose();
    } catch (error) {
      console.error("Failed to update subscription:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDeleteData = async () => {
    if (!window.confirm(`Are you sure you want to permanently delete all data for ${coach.full_name}? This cannot be undone.`)) {
        return;
    }
    setIsDeleting(true);
    try {
        const clientEmails = clients.map(c => c.created_by);
        // Delete related data first
        if (clientEmails.length > 0) {
            await Promise.all([
                Session.bulkDelete({ client_email: { $in: clientEmails } }),
                Message.bulkDelete({ client_email: { $in: clientEmails } })
            ]);
        }
        await Client.bulkDelete({ coach_email: coach.email });
        // Finally, delete the coach user
        await User.delete(coach.id);
        
        onDataDeleted();
    } catch (error) {
        console.error("Failed to delete coach data:", error);
    } finally {
        setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-slate-200">
        <DialogHeader>
          <DialogTitle>Manage Coach: {coach.full_name}</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subscription_status">Subscription Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="subscription_status" className="bg-slate-800 border-slate-600">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600 text-slate-200">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="trial">Trial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="currency" className="bg-slate-800 border-slate-600">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600 text-slate-200">
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="eur">EUR (€)</SelectItem>
                  <SelectItem value="gbp">GBP (£)</SelectItem>
                  <SelectItem value="cad">CAD (C$)</SelectItem>
                  <SelectItem value="aud">AUD (A$)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fee_per_client">Fee per Client ({currency.toUpperCase()})</Label>
            <input
              id="fee_per_client"
              type="number"
              step="0.01"
              value={feePerClient}
              onChange={(e) => setFeePerClient(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-slate-200"
            />
          </div>
          
          <div className="bg-slate-800/30 p-4 rounded-lg">
            <h4 className="font-semibold text-slate-300 mb-2">Current Stats</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Active Clients</p>
                <p className="text-slate-200 font-medium">{clients.length}</p>
              </div>
              <div>
                <p className="text-slate-400">Monthly Revenue</p>
                <p className="text-slate-200 font-medium">
                  {new Intl.NumberFormat('en-US', { 
                    style: 'currency', 
                    currency: currency 
                  }).format(clients.length * feePerClient)}
                </p>
              </div>
              <div>
                <p className="text-slate-400">Stripe Customer ID</p>
                <p className="text-slate-200 font-mono text-xs">{coach.stripe_customer_id || 'Not set'}</p>
              </div>
              <div>
                <p className="text-slate-400">Stripe Subscription ID</p>
                <p className="text-slate-200 font-mono text-xs">{coach.stripe_subscription_id || 'Not set'}</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 border border-red-500/30 bg-red-500/10 rounded-lg space-y-3">
            <h4 className="font-semibold text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5"/> Danger Zone
            </h4>
            <p className="text-sm text-red-300/80">
                Deleting a coach will permanently remove their account and all associated client data, sessions, and messages.
            </p>
            <Button variant="destructive" onClick={handleDeleteData} disabled={isDeleting}>
                <Trash2 className="w-4 h-4 mr-2"/>
                {isDeleting ? 'Deleting Data...' : `Delete Coach & All Data (${clients.length} clients)`}
            </Button>
          </div>
        </div>
        <DialogFooter className="border-t border-slate-700 pt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="bg-transparent border-slate-600 hover:bg-slate-800">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleSave} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700">
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
