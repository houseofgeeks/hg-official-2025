import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DATA_FILE = path.join(process.cwd(), 'data', 'events.json');

export type EventImage = { public_id: string; url: string };
export type EventItem = {
  id: string;
  title: string;
  description?: string;
  date?: string;
  category?: string;
  eventurl: string;
  images: EventImage[];
  thumbnail?: string; // public_id of the thumbnail image
  createdAt: string;
};

async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch (err) {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
  }
}

export async function getEvents(): Promise<EventItem[]> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, 'utf8');
  const events: EventItem[] = JSON.parse(raw);
  return events.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getEventByUrl(eventurl: string): Promise<EventItem | undefined> {
  const events = await getEvents();
  return events.find(e => e.eventurl === eventurl);
}

export async function createEvent(payload: Omit<EventItem, 'id' | 'createdAt'>): Promise<EventItem> {
  const events = await getEvents();
  const newEvent: EventItem = { ...payload, id: uuidv4(), createdAt: new Date().toISOString() };
  events.unshift(newEvent);
  await fs.writeFile(DATA_FILE, JSON.stringify(events, null, 2));
  return newEvent;
}
// Set thumbnail image for an event
export async function setThumbnailToEvent(id: string, public_id: string): Promise<EventItem> {
  const events = await getEvents();
  const idx = events.findIndex(e => String(e.id) === String(id));
  if (idx === -1) throw new Error('Event not found');
  events[idx].thumbnail = public_id;
  await fs.writeFile(DATA_FILE, JSON.stringify(events, null, 2));
  return events[idx];
}

export async function deleteEvent(id: string): Promise<void> {
  const events = await getEvents();
  const filtered = events.filter(e => e.id !== id);
  await fs.writeFile(DATA_FILE, JSON.stringify(filtered, null, 2));
}

export async function addImagesToEvent(id: string, images: EventImage[]): Promise<EventItem> {
  const events = await getEvents();
  const idx = events.findIndex(e => String(e.id) === String(id));
  if (idx === -1) throw new Error('Event not found');
  events[idx].images = [...(events[idx].images || []), ...images];
  await fs.writeFile(DATA_FILE, JSON.stringify(events, null, 2));
  return events[idx];
}

export async function removeImagesFromEvent(id: string, publicIds: string[]): Promise<EventItem> {
  const events = await getEvents();
  const idx = events.findIndex(e => String(e.id) === String(id));
  if (idx === -1) throw new Error('Event not found');
  events[idx].images = (events[idx].images || []).filter(img => !publicIds.includes(img.public_id));
  await fs.writeFile(DATA_FILE, JSON.stringify(events, null, 2));
  return events[idx];
}