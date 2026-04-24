'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';

export function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Show app layout only if authenticated and not on login page
  const isPublic = pathname === '/login' || pathname === '/';
  const shouldShowAppLayout = user && !isPublic;

  return (
    <div className="min-h-screen bg-background">
      {shouldShowAppLayout && <Navbar />}
      <div className="flex">
        {shouldShowAppLayout && <Sidebar />}
        <main className={`flex-1 ${shouldShowAppLayout ? 'ml-64' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
