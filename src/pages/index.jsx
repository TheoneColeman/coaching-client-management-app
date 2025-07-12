
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { createPageUrl } from '@/utils';

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        
        // Redirect based on user type
        if (currentUser.role === 'admin') {
          window.location.href = createPageUrl('AdminDashboard');
        } else if (currentUser.role === 'user' && currentUser.user_type === 'coach') {
          window.location.href = createPageUrl('CoachDashboard');
        } else if (currentUser.role === 'user' && currentUser.user_type === 'client') {
          window.location.href = createPageUrl('ClientDashboard');
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to ElevateFlow</h1>
        {user ? (
          <p>Redirecting you to your dashboard...</p>
        ) : (
          <p>Please log in to continue.</p>
        )}
      </div>
    </div>
  );
}
