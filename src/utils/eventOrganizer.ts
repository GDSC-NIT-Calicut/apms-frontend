import { apiFetch, handleApiResponse } from './api';
import { getCachedData, setCacheData, getCacheTTL } from './cache';

const EVENT_ALLOCATED_KEY = 'eo_allocated_allocations';
const EVENT_REVOKED_KEY = 'eo_revoked_allocations';
const EVENT_TTL_ENV = 'VITE_STUDENT_CACHE_TTL_MIN';
const EVENT_TTL_DEFAULT = 3; // minutes

export interface PointAllocationPayload {
  event_name: string;
  event_date: string;
  event_type: 'institute_level' | 'department_level' | string;
  file: File;
}

export interface ReallocatePayload {
  allocation_id: number | string;
  event_name?: string;
  event_date?: string;
  event_type?: string;
  file?: File;
}

export interface UpdateDetailsPayload {
  allocation_id: number | string;
  event_name?: string;
  event_date?: string;
  event_type?: string;
}

/**
 * 1) Submit New Bulk CSV Allocation Request
 * Route: POST /api/event-organizer/allocate
 */
export const allocatePointsBulk = async (payload: PointAllocationPayload): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('event_name', payload.event_name);
    formData.append('event_date', payload.event_date);
    formData.append('event_type', payload.event_type);
    formData.append('file', payload.file);

    const response = await apiFetch('/api/event-organizer/allocate', {
      method: 'POST',
      body: formData,
    });

    return await handleApiResponse(response, 'Bulk allocate student points');
  } catch (error) {
    console.error('Allocate points bulk utility error:', error);
    throw error;
  }
};

/**
 * 2) Reallocate Points (Handles both Active & Revoked - Form-Data with structural file re-upload)
 * Route: PUT /api/event-organizer/reallocate
 */
export const reallocatePointsGroup = async (payload: ReallocatePayload): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('allocation_id', String(payload.allocation_id));
    if (payload.event_name) formData.append('event_name', payload.event_name);
    if (payload.event_date) formData.append('event_date', payload.event_date);
    if (payload.event_type) formData.append('event_type', payload.event_type);
    if (payload.file) formData.append('file', payload.file);

    const response = await apiFetch('/api/event-organizer/reallocate', {
      method: 'PUT',
      body: formData,
    });

    return await handleApiResponse(response, 'Reallocate event points pool');
  } catch (error) {
    console.error('Reallocate points utility error:', error);
    throw error;
  }
};

/**
 * 3) Update Details Only (Active allocations only - JSON Format)
 * Route: PUT /api/event-organizer/reallocate/details
 */
export const updateAllocationDetails = async (payload: UpdateDetailsPayload): Promise<any> => {
  try {
    const response = await apiFetch('/api/event-organizer/reallocate/details', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    return await handleApiResponse(response, 'Update allocation descriptive details');
  } catch (error) {
    console.error('Update allocation details utility error:', error);
    throw error;
  }
};

/**
 * 4) Revoke an Active Points Allocation Record Group
 * Route: POST /api/event-organizer/revoke
 */
export const revokeAllocationGroup = async (allocationId: number | string): Promise<any> => {
  try {
    const response = await apiFetch('/api/event-organizer/revoke', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ allocation_id: allocationId }),
    });
    return await handleApiResponse(response, 'Revoke specific points allocation');
  } catch (error) {
    console.error('Revoke allocation utility error:', error);
    throw error;
  }
};

/**
 * 5) Fetch All Active Allocated Event Folders
 * Route: GET /api/event-organizer/allocations/allocated
 */
export const getAllocatedAllocations = async (): Promise<any[]> => {
  try {
    const response = await apiFetch('/api/event-organizer/allocations/allocated', {
      method: 'GET',
    });
    return await handleApiResponse(response, 'Fetch allocated requests records');
  } catch (error) {
    console.error('Get allocated logs error:', error);
    throw error;
  }
};

export const getAllocatedAllocationsCached = async (bypassCache = false): Promise<{ data: any[]; fromCache: boolean; lastUpdated?: number }> => {
  const cacheKey = EVENT_ALLOCATED_KEY;
  if (!bypassCache) {
    const cached = getCachedData<any[]>(cacheKey);
    if (cached) {
      const raw = sessionStorage.getItem(cacheKey);
      const entry = raw ? JSON.parse(raw) : null;
      return { data: cached, fromCache: true, lastUpdated: entry?.timestamp };
    }
  }

  const data = await getAllocatedAllocations();
  const ttlMs = getCacheTTL(EVENT_TTL_ENV, EVENT_TTL_DEFAULT);
  setCacheData(cacheKey, data, ttlMs);
  return { data, fromCache: false, lastUpdated: Date.now() };
};

/**
 * 6) Fetch All Revoked Event Allocation Folders
 * Route: GET /api/event-organizer/allocations/revoked
 */
export const getRevokedAllocations = async (): Promise<any[]> => {
  try {
    const response = await apiFetch('/api/event-organizer/allocations/revoked', {
      method: 'GET',
    });
    return await handleApiResponse(response, 'Fetch revoked requests records');
  } catch (error) {
    console.error('Get revoked logs error:', error);
    throw error;
  }
};

export const getRevokedAllocationsCached = async (bypassCache = false): Promise<{ data: any[]; fromCache: boolean; lastUpdated?: number }> => {
  const cacheKey = EVENT_REVOKED_KEY;
  if (!bypassCache) {
    const cached = getCachedData<any[]>(cacheKey);
    if (cached) {
      const raw = sessionStorage.getItem(cacheKey);
      const entry = raw ? JSON.parse(raw) : null;
      return { data: cached, fromCache: true, lastUpdated: entry?.timestamp };
    }
  }

  const data = await getRevokedAllocations();
  const ttlMs = getCacheTTL(EVENT_TTL_ENV, EVENT_TTL_DEFAULT);
  setCacheData(cacheKey, data, ttlMs);
  return { data, fromCache: false, lastUpdated: Date.now() };
};

/**
 * 7) Download Allocation Ledger Template File (.CSV)
 * Route: GET /api/event-organizer/allocations/file?allocation_id=...
 */
export const downloadAllocationFile = async (allocationId: number | string, eventName: string): Promise<void> => {
  try {
    const response = await apiFetch(`/api/event-organizer/allocations/file?allocation_id=${allocationId}`, {
      method: 'GET',
    });

    if (!response.ok) throw new Error('Failed to download ledger source file');

    // Convert raw network payload to download link block
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = blobUrl;
    
    // Formats filename cleanly based on event context
    const secureFilename = `${eventName.trim().toLowerCase().replace(/[^a-z0-9]/g, '_')}_attendees.csv`;
    downloadAnchor.setAttribute('download', secureFilename);
    
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Download allocation file utility error:', error);
    alert('Failed to extract and download the requested CSV tracking template ledger.');
  }
};