"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Shell } from '@/components/layout/Shell';
import { LoadingPanel } from '@/components/ui/loading-panel';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, profileLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !profileLoading && !user) {
      router.push('/login');
    }
  }, [user, loading, profileLoading, router]);

  if (loading || profileLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl">
          <LoadingPanel className="h-[420px]" lines={5} />
          <p className="mt-4 text-center text-sm font-medium text-[#5f7a81]">
            {loading ? "Loading session..." : "Preparing your workspace..."}
          </p>
        </div>
      </div>
    );
  }

  return <Shell>{children}</Shell>;
}
