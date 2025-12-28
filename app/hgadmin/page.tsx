import React from 'react';
import AdminLoginForm from '@/components/AdminLoginForm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function HgAdminLoginPage() {
  const cookieStore = await cookies();
  const { isAdminFromCookies } = await import('@/lib/adminAuth');
  if (isAdminFromCookies(cookieStore)) {
    redirect('/hgadmin/dashboard');
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
      <AdminLoginForm />
    </div>
  );
}
