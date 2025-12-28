import { cookies } from 'next/headers';
import React from 'react';
import { getEvents } from '@/lib/eventsService';
import AdminEventForm from '@/components/AdminEventForm';
import AdminEventList from '@/components/AdminEventList';
import AdminLogout from '@/components/AdminLogout';

export default async function HgAdminDashboard() {
  const cookieStore = await cookies();
  const isAuth = cookieStore.get('hgadmin_auth')?.value === '1';
  if (!isAuth) {
    if (typeof window !== 'undefined') {
      window.location.href = '/hgadmin';
    }
    return <div style={{ color: '#fff', textAlign: 'center', marginTop: 64 }}>Unauthorized. Please <a href="/hgadmin" style={{ color: '#00b894' }}>login</a>.</div>;
  }

  const events = await getEvents();

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1>Admin Dashboard</h1>
        <div>
          {/* client logout */}
          {/* @ts-ignore */}
          <script suppressHydrationWarning={true} />
          <div>
            {/* client component will be hydrated */}
            <AdminLogout />
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1000, marginTop: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            {/* Create form */}
            {/* @ts-ignore */}
            <AdminEventForm />

          </div>
          <div>
            <AdminEventList events={events} />
          </div>
        </div>
      </div>
    </div>
  );
}
