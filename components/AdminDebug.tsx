'use client';

import React, { useEffect, useState } from 'react';

export default function AdminDebug() {
  const [serverCookies, setServerCookies] = useState<any>(null);

  useEffect(() => {
    fetch('/api/hgadmin/session').then(r => r.json()).then(d => setServerCookies(d));
  }, []);

  return (
    <div style={{ marginTop: 12, padding: 12, background: '#0b0b0b', borderRadius: 8 }}>
      <h4 style={{ color: '#fff' }}>Debug</h4>
      <div style={{ color: '#ddd' }}>
        <div><strong>document.cookie</strong>: <span style={{ color: '#9ae6b4' }}>{typeof document !== 'undefined' ? document.cookie : ''}</span></div>
        <div style={{ marginTop: 8 }}><strong>Server sees cookies</strong>:</div>
        <pre style={{ color: '#9ae6b4' }}>{serverCookies ? JSON.stringify(serverCookies, null, 2) : 'loading...'}</pre>
      </div>
    </div>
  );
}
