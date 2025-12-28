'use client';

import React, { useState } from 'react';

export default function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/hgadmin/login', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      window.location.href = '/hgadmin/dashboard';
    } else {
      const data = await res.json();
      setError(data.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: '#181818', padding: 32, borderRadius: 12, boxShadow: '0 2px 16px #0008', minWidth: 320 }}>
      <h2 style={{ color: '#fff', marginBottom: 24 }}>Admin Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        style={{ width: '100%', marginBottom: 16, padding: 8, borderRadius: 6, border: '1px solid #333', background: '#222', color: '#fff' }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        style={{ width: '100%', marginBottom: 16, padding: 8, borderRadius: 6, border: '1px solid #333', background: '#222', color: '#fff' }}
      />
      {error && <div style={{ color: '#ff5252', marginBottom: 12 }}>{error}</div>}
      <button type="submit" disabled={loading} style={{ width: '100%', padding: 10, borderRadius: 6, background: '#00b894', color: '#fff', border: 'none', fontWeight: 600 }}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
