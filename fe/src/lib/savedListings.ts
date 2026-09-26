const STORAGE_KEY = 'pa-saved-listings';

export type SavedListing = {
  id: string;
  title: string;
  location?: string;
  price?: number;
  thumb?: string;
  savedAt: string;
};

function read(): SavedListing[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(rows: SavedListing[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows.slice(0, 100)));
    window.dispatchEvent(new Event('pa-saved-changed'));
  } catch {
    /* ignore quota */
  }
}

export function getSavedListings(): SavedListing[] {
  return read();
}

export function getSavedCount(): number {
  return read().length;
}

export function isListingSaved(id: string): boolean {
  if (!id) return false;
  return read().some((r) => r.id === id);
}

export function toggleSavedListing(entry: Omit<SavedListing, 'savedAt'>): boolean {
  const rows = read();
  const idx = rows.findIndex((r) => r.id === entry.id);
  if (idx >= 0) {
    rows.splice(idx, 1);
    write(rows);
    return false;
  }
  rows.unshift({ ...entry, savedAt: new Date().toISOString() });
  write(rows);
  return true;
}

export function subscribeSaved(cb: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) cb();
  };
  window.addEventListener('pa-saved-changed', cb);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener('pa-saved-changed', cb);
    window.removeEventListener('storage', onStorage);
  };
}
