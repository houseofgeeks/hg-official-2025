'use client';

import React from 'react';

export default function AdminLogout() {
  const onLogout = async () => {
    await fetch('/api/hgadmin/logout', { method: 'POST' });
    window.location.href = '/hgadmin';
  };

  return (
    <button onClick={onLogout} style={{ background: '#ff4757', color: '#fff', padding: '8px 12px', borderRadius: 6, border: 'none' }}>Logout</button>
  );
}
