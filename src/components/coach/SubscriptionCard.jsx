
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, AlertTriangle, CheckCircle } from 'lucide-react';
import { createCheckoutSession } from '@/api/functions';
import { createPortalSession } from '@/api/functions';

const statusConfig = {
  active: { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle },
  inactive: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: AlertTriangle },
  trial: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: AlertTriangle }
};

export default function SubscriptionCard({ coach, clientCount, isReadOnly = false }) {
  const [isLoading, setIsLoading] = React.useState(false);
  
  const config = statusConfig[coach.subscription_status] || statusConfig.trial;
  const StatusIcon = config.icon;
  
  const monthlyFee = (coach.subscription_fee_per_client || 10) * Math.max(clientCount, 1);
  const currency = coach.currency || 'gbp';
  
  const handleSubscribe = async () => {
    if (isReadOnly) return;
    setIsLoading(true);
    try {
      const { data } = await createCheckoutSession();
      window.location.href = data.url;
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      setIsLoading(false);
    }
  };
  
  const handleManageBilling = async () => {
    if (isReadOnly) return;
    setIsLoading(true);
    try {
      const { data } = await createPortalSession();
      window.location.href = data.url;
    } catch (error) {
      console.error('Failed to create portal session:', error);
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-200">
          <CreditCard className="h-5 w-5" />
          Subscription
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Status</span>
          <Badge className={config.color}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {coach.subscription_status}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Active Clients</span>
          <span className="font-semibold text-slate-200">{clientCount}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Monthly Fee</span>
          <span className="font-semibold text-slate-200">
            {new Intl.NumberFormat('en-US', { 
              style: 'currency', 
              currency: currency 
            }).format(monthlyFee)}
          </span>
        </div>
        
        <div className="pt-2 border-t border-slate-700">
          {coach.subscription_status === 'active' ? (
            <Button 
              variant="outline" 
              className="w-full bg-transparent border-slate-600 text-slate-200 hover:bg-slate-700" 
              onClick={handleManageBilling}
              disabled={isLoading || isReadOnly}
            >
              {isLoading ? 'Loading...' : 'Manage Billing'}
            </Button>
          ) : (
            <Button 
              className="w-full bg-indigo-600 hover:bg-indigo-700" 
              onClick={handleSubscribe}
              disabled={isLoading || isReadOnly}
            >
              {isLoading ? 'Loading...' : 'Subscribe Now'}
            </Button>
          )}
        </div>
        
        {coach.subscription_status !== 'active' && (
          <p className="text-xs text-slate-500 text-center">
            You need an active subscription to access all features
          </p>
        )}
      </CardContent>
    </Card>
  );
}
