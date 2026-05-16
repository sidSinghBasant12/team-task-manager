'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Optionally show a loading spinner while checking auth
  if (typeof window !== 'undefined' && !localStorage.getItem('token') && !isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen w-full bg-[#050505]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
