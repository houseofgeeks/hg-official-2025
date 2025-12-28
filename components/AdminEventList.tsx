'use client';

import React, { useState } from 'react';
import { uploadToCloudinary } from '@/lib/cloudinaryUtils';

type EventImage = { public_id: string; url: string };

export default function AdminEventList({ events, onDeleted }: { events: any[]; onDeleted?: () => void }) {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState<string | null>(null); // eventId or null
  const [deletingImages, setDeletingImages] = useState<string | null>(null); // eventId or null
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<{ title?: string; description?: string; date?: string; category?: string }>({});
  const [savingEdit, setSavingEdit] = useState(false);
  // Handle edit field changes
  const handleEditChange = (field: string, value: string) => {
    setEditFields(prev => ({ ...prev, [field]: value }));
  };

  // Start editing an event
  const startEdit = (ev: any) => {
    setEditingId(ev.id);
    setEditFields({
      title: ev.title || '',
      description: ev.description || '',
      date: ev.date || '',
      category: ev.category || '',
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditFields({});
  };

  // Save event edits
  const saveEdit = async (id: string) => {
    setSavingEdit(true);
    try {
      const res = await fetch('/api/hgadmin/events/edit', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...editFields })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error((data && data.message) || 'Failed to update event');
      setEditingId(null);
      setEditFields({});
      if (onDeleted) onDeleted(); else window.location.reload();
    } catch (err: any) {
      alert(err.message || 'Error');
    }
    setSavingEdit(false);
  };

  // Toggle selection for an image
  const toggle = (id: string) => setSelected(prev => ({ ...prev, [id]: !prev[id] }));

  // Delete selected images for an event
  const deleteSelectedImages = async (eventId: string) => {
    setDeletingImages(eventId);
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
    setDeletingImages(null);
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
    setAdding(eventId);
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
    setAdding(null);
  };

  return (
    <div className="mt-6">
      {events.length === 0 && <div className="text-white">No events yet</div>}
      {events.map(ev => (
        <div key={ev.id} className="p-4 mb-4 bg-[#111] rounded">
          <div className="flex items-center justify-between">
            <div>
              {editingId === ev.id ? (
                <>
                  <input
                    className="w-full p-2 mb-2 rounded bg-[#222] text-white border border-gray-600"
                    value={editFields.title || ''}
                    onChange={e => handleEditChange('title', e.target.value)}
                    placeholder="Title"
                  />
                  <input
                    className="w-full p-2 mb-2 rounded bg-[#222] text-white border border-gray-600"
                    value={editFields.date || ''}
                    onChange={e => handleEditChange('date', e.target.value)}
                    placeholder="Date"
                  />
                  <input
                    className="w-full p-2 mb-2 rounded bg-[#222] text-white border border-gray-600"
                    value={editFields.category || ''}
                    onChange={e => handleEditChange('category', e.target.value)}
                    placeholder="Category"
                  />
                  <textarea
                    className="w-full p-2 mb-2 rounded bg-[#222] text-white border border-gray-600"
                    value={editFields.description || ''}
                    onChange={e => handleEditChange('description', e.target.value)}
                    placeholder="Description"
                  />
                  <div className="flex gap-2 mb-2">
                    <button onClick={() => saveEdit(ev.id)} className="bg-green-600 text-white px-3 py-1 rounded" disabled={savingEdit}>
                      {savingEdit ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={cancelEdit} className="bg-gray-600 text-white px-3 py-1 rounded">Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <h4 className="text-white font-semibold">{ev.title}</h4>
                  <div className="text-sm text-white/60">{ev.date} • {ev.category}</div>
                  <div className="text-white text-xs mb-1 whitespace-pre-line">{ev.description}</div>
                </>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => deleteEvent(ev.id)} className="bg-red-600 text-white px-3 py-1 rounded" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-1"><span className="loader mr-1"></span>Deleting...</span>
                ) : (
                  'Delete Event'
                )}
              </button>
              {editingId !== ev.id && (
                <button onClick={() => startEdit(ev)} className="bg-yellow-600 text-white px-3 py-1 rounded">Edit</button>
              )}
            </div>
          </div>

          <div
            className="grid gap-2 mt-4 overflow-y-auto"
            style={{
              maxHeight: '220px',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              WebkitOverflowScrolling: 'touch',
            }}
          >
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
              {adding === ev.id ? (
                <span className="flex items-center gap-1"><span className="loader mr-1"></span>Adding...</span>
              ) : (
                <>
                  Add Images
                  <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => addImagesToEvent(ev.id, e.target.files)} />
                </>
              )}
            </label>
            <button
              onClick={() => deleteSelectedImages(ev.id)}
              disabled={!!deletingImages}
              className="bg-yellow-600 text-white px-3 py-1 rounded disabled:opacity-60"
            >
              {deletingImages === ev.id ? (
                <span className="flex items-center gap-1"><span className="loader mr-1"></span>Deleting...</span>
              ) : (
                'Delete Selected Images'
              )}
            </button>
          </div>
<style jsx global>{`
  .loader {
    border: 2px solid #f3f3f3;
    border-top: 2px solid #555;
    border-radius: 50%;
    width: 1em;
    height: 1em;
    animation: spin 0.8s linear infinite;
    display: inline-block;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`}</style>

          {/* Cloudinary delete warning removed */}
        </div>
      ))}
    </div>
  );
}
