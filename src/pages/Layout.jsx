

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { LayoutDashboard, Users, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User } from '@/api/entities';

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await User.logout();
    window.location.reload();
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Admin Layout
  if (user?.role === 'admin') {
    return (
      <div className="flex h-screen bg-slate-900 text-slate-200">
        <style>{`body { background-color: #0f172a; }`}</style>
        <aside className="w-16 lg:w-56 bg-slate-950/70 backdrop-blur-lg border-r border-slate-800 flex flex-col items-center py-4">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center mb-8">
            <span className="font-bold text-white text-lg">A</span>
          </div>
          <nav className="flex-1 flex flex-col items-center lg:items-stretch lg:px-4 space-y-2">
            <Link
              to={createPageUrl('AdminDashboard')}
              className={`flex items-center justify-center lg:justify-start gap-3 p-3 rounded-lg transition-colors ${
                currentPageName === 'AdminDashboard'
                  ? 'bg-indigo-500/20 text-indigo-400'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="hidden lg:inline">Dashboard</span>
            </Link>
          </nav>
          <div className="mt-auto">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-400" onClick={handleLogout}>
              <LogOut className="w-5 h-5"/>
            </Button>
          </div>
        </aside>
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    );
  }

  // Coach Layout - Dark theme to match TR1BE brand
  if (user?.role === 'user' && user?.user_type === 'coach') {
    const navItems = [
      { name: 'Dashboard', icon: LayoutDashboard, page: 'CoachDashboard' }
    ];

    return (
      <div className="flex h-screen bg-slate-900 text-slate-200">
        <style>{`body { background-color: #0f172a; }`}</style>
        <aside className="w-16 lg:w-56 bg-slate-950/70 backdrop-blur-lg border-r border-slate-800 flex flex-col items-center py-4">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center mb-8">
            <span className="font-bold text-white text-lg">C</span>
          </div>
          <nav className="flex-1 flex flex-col items-center lg:items-stretch lg:px-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={createPageUrl(item.page)}
                className={`flex items-center justify-center lg:justify-start gap-3 p-3 rounded-lg transition-colors ${
                  currentPageName === item.page
                    ? 'bg-indigo-500/20 text-indigo-400'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="hidden lg:inline">{item.name}</span>
              </Link>
            ))}
          </nav>
          <div className="mt-auto">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-400" onClick={handleLogout}>
              <LogOut className="w-5 h-5"/>
            </Button>
          </div>
        </aside>
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    );
  }
  
  // Client Layout - Light theme
  if (user?.role === 'user' && user?.user_type === 'client') {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                            <span className="font-bold text-white text-md">C</span>
                        </div>
                        <span className="font-semibold text-gray-700">Client Portal</span>
                    </div>
                    <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-500" onClick={handleLogout}>
                        <LogOut className="w-5 h-5"/>
                    </Button>
                </div>
            </header>
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
  }

  // Default layout for other users (clients, etc.) - also dark theme
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <style>{`body { background-color: #0f172a; }`}</style>
      <main className="p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}

