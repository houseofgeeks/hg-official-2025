'use client';

import React, { useState } from 'react';
import { uploadToCloudinary } from '@/lib/cloudinaryUtils';

type EventImage = { public_id: string; url: string };

export default function AdminEventList({ events, onDeleted }: { events: any[]; onDeleted?: () => void }) {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  // Toggle selection for an image
  const toggle = (id: string) => setSelected(prev => ({ ...prev, [id]: !prev[id] }));

  // Delete selected images for an event
  const deleteSelectedImages = async (eventId: string) => {
    setLoading(true);
    try {
      const event = events.find(e => e.id === eventId);
      if (!event) throw new Error('Event not found');
      const publicIds = (event.images || []).filter((img: EventImage) => selected[img.public_id]).map((i: EventImage) => i.public_id);
      if (publicIds.length === 0) { alert('No images selected'); setLoading(false); return; }
      if (!confirm(`Delete ${publicIds.length} selected image(s) from Cloudinary?`)) { setLoading(false); return; }
      const res = await fetch('/api/hgadmin/images/delete', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicIds, eventId })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error((data && data.message) || 'Failed to delete images');
      const results = data?.results || [];
      const succeeded = results.filter((r: any) => r.ok).length;
      const failed = results.filter((r: any) => !r.ok);
      let msg = `Deleted: ${succeeded}`;
      if (failed.length > 0) {
        msg += `\nFailed: ${failed.length}\n` + failed.map((f: any) => `${f.id}: ${f.error || 'error'}`).join('\n');
      }
      alert(msg);
      setSelected({});
      if (onDeleted) onDeleted(); else window.location.reload();
    } catch (err: any) {
      alert(err.message || 'Error');
    }
    setLoading(false);
  };

  const deleteEvent = async (id: string) => {
    if (!confirm('Delete event and all its images?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/hgadmin/events/${id}`, { method: 'DELETE', credentials: 'same-origin' });
      if (!res.ok) throw new Error('Failed to delete event');
      alert('Event deleted');
      if (onDeleted) onDeleted();
    } catch (err: any) {
      alert(err.message || 'Error');
    }
    setLoading(false);
  };

  const addImagesToEvent = async (eventId: string, files: FileList | null) => {
    if (!files || files.length === 0) { alert('No files selected'); return; }
    setLoading(true);
    try {
      const arr = Array.from(files);
      const uploaded = await Promise.all(arr.map(f => uploadToCloudinary(f)));
      const images = uploaded.map(u => ({ public_id: u.public_id, url: u.url }));
      const res = await fetch(`/api/hgadmin/events/${eventId}/images`, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ images }) });
      if (!res.ok) throw new Error('Failed to add images');
      alert('Images added');
      window.location.reload();
    } catch (err: any) {
      alert(err.message || 'Error');
    }
    setLoading(false);
  };

  return (
    <div className="mt-6">
      {events.length === 0 && <div className="text-white">No events yet</div>}
      {events.map(ev => (
        <div key={ev.id} className="p-4 mb-4 bg-[#111] rounded">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-semibold">{ev.title}</h4>
              <div className="text-sm text-white/60">{ev.date} • {ev.category}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => deleteEvent(ev.id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete Event</button>
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-4">
            {(ev.images || []).map((img: EventImage) => (
              <div key={img.public_id} className="relative">
                <img src={img.url} className="w-full h-28 object-cover rounded" />
                <label className="absolute top-1 left-1 bg-black/50 p-1 rounded">
                  <input type="checkbox" checked={!!selected[img.public_id]} onChange={() => toggle(img.public_id)} />
                </label>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-4">
            <label className="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer">
              Add Images
              <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => addImagesToEvent(ev.id, e.target.files)} />
            </label>
            <button
              onClick={() => deleteSelectedImages(ev.id)}
              disabled={loading}
              className="bg-yellow-600 text-white px-3 py-1 rounded disabled:opacity-60"
            >
              Delete Selected Images
            </button>
            <button onClick={() => deleteEvent(ev.id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete Event</button>
          </div>

          {/* Cloudinary delete warning removed */}
        </div>
      ))}
    </div>
  );
}
