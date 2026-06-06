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

/**
 * Submit New Activity Points Request
 * Route: POST /api/student/requests/submit
 * Expects multipart/form-data payload body format
 */
export const submitStudentActivity = async (payload: SubmitActivityPayload): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('event_name', payload.event_name);
    formData.append('event_date', payload.event_date);
    formData.append('event_type', payload.event_type);
    formData.append('points', payload.points.toString());
    formData.append('proof', payload.proof); // Maps cleanly to upload.single('proof')

    // Note: Do NOT set Content-Type header manually when sending FormData;
    // the browser must automatically define boundary lines.
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
 * Fetch Student Pending Requests
 * Route: GET /api/student/requests/pending
 * Requires authentication cookie to be present
 */
export const getPendingRequests = async (): Promise<any[]> => {
  try {
    const response = await apiFetch('/api/student/requests/pending', { method: 'GET' });
    return await handleApiResponse(response, 'Fetch pending requests');
  } catch (error) {
    console.error('Get pending requests error:', error);
    throw error;
  }
};

/**
 * Cached wrapper for pending requests. Returns metadata for UI.
 */
export const getPendingRequestsCached = async (bypassCache = false): Promise<{ data: any[]; fromCache: boolean; lastUpdated?: number }> => {
  const cacheKey = STUDENT_PENDING_KEY;
  if (!bypassCache) {
    const cached = getCachedData<any[]>(cacheKey);
    if (cached) {
      // read raw entry for timestamp
      const raw = sessionStorage.getItem(cacheKey);
      const entry = raw ? JSON.parse(raw) : null;
      return { data: cached, fromCache: true, lastUpdated: entry?.timestamp };
    }
  }

  const data = await getPendingRequests();
  const ttlMs = getCacheTTL(STUDENT_TTL_ENV, STUDENT_TTL_DEFAULT);
  setCacheData(cacheKey, data, ttlMs);
  return { data, fromCache: false, lastUpdated: Date.now() };
};


/**
 * Fetch Student Approved Requests
 * Route: GET /api/student/requests/approved
 */
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
      const raw = sessionStorage.getItem(cacheKey);
      const entry = raw ? JSON.parse(raw) : null;
      return { data: cached, fromCache: true, lastUpdated: entry?.timestamp };
    }
  }

  const data = await getApprovedRequests();
  const ttlMs = getCacheTTL(STUDENT_TTL_ENV, STUDENT_TTL_DEFAULT);
  setCacheData(cacheKey, data, ttlMs);
  return { data, fromCache: false, lastUpdated: Date.now() };
};

/**
 * Fetch Student Rejected Requests
 * Route: GET /api/student/requests/rejected
 */
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
      const raw = sessionStorage.getItem(cacheKey);
      const entry = raw ? JSON.parse(raw) : null;
      return { data: cached, fromCache: true, lastUpdated: entry?.timestamp };
    }
  }

  const data = await getRejectedRequests();
  const ttlMs = getCacheTTL(STUDENT_TTL_ENV, STUDENT_TTL_DEFAULT);
  setCacheData(cacheKey, data, ttlMs);
  return { data, fromCache: false, lastUpdated: Date.now() };
};

/**
 * View/Download Proof Document
 * Route: GET /api/student/requests/proof?point_id=X
 * Streams down file binary data directly into local browser blobs
 */
export const viewProofDocument = async (pointId: number | string): Promise<void> => {
  try {
    const response = await apiFetch(`/api/student/requests/proof?point_id=${pointId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to retrieve proof document from storage server.');
    }

    // Convert streamed network response cleanly to a binary block format blob
    const fileBlob = await response.blob();
    const blobUrl = window.URL.createObjectURL(fileBlob);
    
    // Open standard system viewport tab to let browser natively render the streamed PDF
    window.open(blobUrl, '_blank');
  } catch (error) {
    console.error('View proof document error:', error);
    alert('Could not open file. Verify your connection or that a valid PDF file exists.');
  }
};