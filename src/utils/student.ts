/**
 * Student Utilities
 * Handles student-specific requests, submissions, and history updates
 */

import { apiFetch, handleApiResponse } from './api';
import { getCachedData, setCacheData, getCacheTTL } from './cache';

const STUDENT_PENDING_KEY = 'student_pending_requests';
const STUDENT_APPROVED_KEY = 'student_approved_requests';
const STUDENT_REJECTED_KEY = 'student_rejected_requests';
const STUDENT_TTL_ENV = 'VITE_STUDENT_CACHE_TTL_MIN';
const STUDENT_TTL_DEFAULT = 3; // minutes

export interface SubmitActivityPayload {
  event_name: string;
  event_date: string;
  event_type: 'institute_level' | 'department_level' | 'fa_assigned' | string;
  points: number;
  proof: File;
}

export interface ResubmitActivityPayload extends Omit<SubmitActivityPayload, 'proof'> {
  point_id: number | string;
  proof?: File | null; // Optional on resubmissions
}

/**
 * Sanitizes input dates to a clean YYYY-MM-DD string format
 * This stops local system timezones from shifting dates back or forward inside Postgres.
 */
const cleanDateString = (dateInput: string): string => {
  if (!dateInput) return '';
  try {
    const d = new Date(dateInput);
    return isNaN(d.getTime()) ? dateInput : d.toISOString().split('T')[0];
  } catch {
    return dateInput;
  }
};

/**
 * Submit New Activity Points Request
 * Route: POST /api/student/requests/submit
 */
export const submitStudentActivity = async (payload: SubmitActivityPayload): Promise<any> => {
  try {
    const formData = new FormData();
    
    // 💥 CRITICAL ORDER: Append text fields first, files last
    formData.append('event_name', payload.event_name);
    formData.append('event_date', cleanDateString(payload.event_date)); // Standardized date string
    formData.append('event_type', payload.event_type);
    formData.append('points', payload.points.toString());
    formData.append('proof', payload.proof); 

    const response = await apiFetch('/api/student/requests/submit', {
      method: 'POST',
      body: formData,
    });

    return await handleApiResponse(response, 'Submit student activity request');
  } catch (error) {
    console.error('Submit student activity error:', error);
    throw error;
  }
};

/**
 * Resubmit a Rejected Activity Points Request
 * Route: PUT /api/student/requests/resubmit
 */
export const resubmitStudentActivity = async (payload: ResubmitActivityPayload): Promise<any> => {
  try {
    const formData = new FormData();
    
    // 💥 CRITICAL ORDER: Text fields go into the stream first so Multer parses them instantly
    formData.append('point_id', payload.point_id.toString());
    formData.append('event_name', payload.event_name);
    formData.append('event_date', cleanDateString(payload.event_date)); // Standardized date string
    formData.append('event_type', payload.event_type);
    formData.append('points', payload.points.toString());
    
    if (payload.proof) {
      formData.append('proof', payload.proof); // File goes last
    }

    const response = await apiFetch('/api/student/requests/resubmit', {
      method: 'PUT',
      body: formData, // No URL parameters! Sent entirely inside the multi-part body payload
    });

    return await handleApiResponse(response, 'Resubmit student activity request');
  } catch (error) {
    console.error('Resubmit student activity error:', error);
    throw error;
  }
};

// --- View requests and download utilities remain unchanged ---
export const getPendingRequests = async (): Promise<any[]> => {
  try {
    const response = await apiFetch('/api/student/requests/pending', { method: 'GET' });
    return await handleApiResponse(response, 'Fetch pending requests');
  } catch (error) {
    console.error('Get pending requests error:', error);
    throw error;
  }
};

export const getPendingRequestsCached = async (bypassCache = false): Promise<{ data: any[]; fromCache: boolean; lastUpdated?: number }> => {
  const cacheKey = STUDENT_PENDING_KEY;
  if (!bypassCache) {
    const cached = getCachedData<any[]>(cacheKey);
    if (cached) {
      const rawCache = sessionStorage.getItem(cacheKey);
      const entry = rawCache ? JSON.parse(rawCache) : null;
      return { data: cached, fromCache: true, lastUpdated: entry?.timestamp };
    }
  }
  const data = await getPendingRequests();
  const ttlMs = getCacheTTL(STUDENT_TTL_ENV, STUDENT_TTL_DEFAULT);
  setCacheData(cacheKey, data, ttlMs);
  return { data, fromCache: false, lastUpdated: Date.now() };
};

export const getApprovedRequests = async (): Promise<any[]> => {
  try {
    const response = await apiFetch('/api/student/requests/approved', { method: 'GET' });
    return await handleApiResponse(response, 'Fetch approved requests');
  } catch (error) {
    console.error('Get approved requests error:', error);
    throw error;
  }
};

export const getApprovedRequestsCached = async (bypassCache = false): Promise<{ data: any[]; fromCache: boolean; lastUpdated?: number }> => {
  const cacheKey = STUDENT_APPROVED_KEY;
  if (!bypassCache) {
    const cached = getCachedData<any[]>(cacheKey);
    if (cached) {
      const rawCache = sessionStorage.getItem(cacheKey);
      const entry = rawCache ? JSON.parse(rawCache) : null;
      return { data: cached, fromCache: true, lastUpdated: entry?.timestamp };
    }
  }
  const data = await getApprovedRequests();
  const ttlMs = getCacheTTL(STUDENT_TTL_ENV, STUDENT_TTL_DEFAULT);
  setCacheData(cacheKey, data, ttlMs);
  return { data, fromCache: false, lastUpdated: Date.now() };
};

export const getRejectedRequests = async (): Promise<any[]> => {
  try {
    const response = await apiFetch('/api/student/requests/rejected', { method: 'GET' });
    return await handleApiResponse(response, 'Fetch rejected requests');
  } catch (error) {
    console.error('Get rejected requests error:', error);
    throw error;
  }
};

export const getRejectedRequestsCached = async (bypassCache = false): Promise<{ data: any[]; fromCache: boolean; lastUpdated?: number }> => {
  const cacheKey = STUDENT_REJECTED_KEY;
  if (!bypassCache) {
    const cached = getCachedData<any[]>(cacheKey);
    if (cached) {
      const rawCache = sessionStorage.getItem(cacheKey);
      const entry = rawCache ? JSON.parse(rawCache) : null;
      return { data: cached, fromCache: true, lastUpdated: entry?.timestamp };
    }
  }
  const data = await getRejectedRequests();
  const ttlMs = getCacheTTL(STUDENT_TTL_ENV, STUDENT_TTL_DEFAULT);
  setCacheData(cacheKey, data, ttlMs);
  return { data, fromCache: false, lastUpdated: Date.now() };
};

export const viewProofDocument = async (pointId: number | string): Promise<void> => {
  try {
    const response = await apiFetch(`/api/student/requests/proof?point_id=${pointId}`, {
      method: 'GET',
    });
    if (!response.ok) throw new Error('Failed to retrieve proof document.');
    const fileBlob = await response.blob();
    const blobUrl = window.URL.createObjectURL(fileBlob);
    window.open(blobUrl, '_blank');
  } catch (error) {
    console.error('View proof document error:', error);
    alert('Could not open file.');
  }
};