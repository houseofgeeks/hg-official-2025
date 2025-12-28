'use client';

import React, { useState } from 'react';
import { uploadToCloudinary } from '@/lib/cloudinaryUtils';

export default function AdminEventForm({ onCreated }: { onCreated?: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [eventurl, setEventurl] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files;
    if (!f) return;
    const arr = Array.from(f);
    setFiles(arr);
    setPreviews(arr.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // upload images to cloudinary
      const uploaded = await Promise.all(files.map((file) => uploadToCloudinary(file)));
      const images = uploaded.map(u => ({ public_id: u.public_id, url: u.url }));

      const res = await fetch('/api/hgadmin/events', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, date, category, eventurl, images }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create event');
      }

      setTitle(''); setDescription(''); setDate(''); setCategory(''); setEventurl(''); setFiles([]); setPreviews([]);
      if (onCreated) onCreated();
      else window.location.reload();
      alert('Event created');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#0f0f0f] p-6 rounded-lg">
      <h3 className="text-xl text-white mb-4">Create Event</h3>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required className="w-full p-2 mb-2 rounded" />
      <input value={eventurl} onChange={e => setEventurl(e.target.value)} placeholder="URL slug (no spaces)" required className="w-full p-2 mb-2 rounded" />
      <input value={date} onChange={e => setDate(e.target.value)} placeholder="Date" className="w-full p-2 mb-2 rounded" />
      <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" className="w-full p-2 mb-2 rounded" />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="w-full p-2 mb-2 rounded" />

      <label className="block text-sm text-white mb-2">Images</label>
      <input type="file" multiple accept="image/*" onChange={onFileChange} />

      <div className="flex gap-2 mt-4 mb-4">
        {previews.map((p, i) => (
          <img key={i} src={p} alt={`preview-${i}`} className="h-24 w-24 object-cover rounded" />
        ))}
      </div>

      {error && <div className="text-red-400 mb-2">{error}</div>}

      <button type="submit" disabled={loading} className="bg-green-500 text-white px-4 py-2 rounded">
        {loading ? 'Creating...' : 'Create Event'}
      </button>
    </form>
  );
}
