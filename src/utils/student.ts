/**
 * Student Utilities
 * Handles student-specific requests, submissions, and history updates
 */

import { apiFetch, handleApiResponse } from './api';

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
    const response = await apiFetch('/api/student/requests/pending', {
      method: 'GET',
    });
    return await handleApiResponse(response, 'Fetch pending requests');
  } catch (error) {
    console.error('Get pending requests error:', error);
    throw error;
  }
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