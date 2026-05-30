/**
 * Admin Utilities
 * Handles admin-specific API calls for user registration, bulk operations, and editing
 */

import { apiFetch, handleApiResponse } from './api';

// ============ Single Registration Interfaces ============

export interface RegisterStudentPayload {
  email: string;
  roll_number: string;
  student_name: string;
  batch_year: number;
  fa_name: string;
}

export interface RegisterAdminPayload {
  email: string;
  admin_name: string;
}

export interface RegisterEventOrganizerPayload {
  email: string;
  organizer_name: string;
  organization_name: string;
}

export interface RegisterFacultyAdvisorPayload {
  email: string;
  fa_name: string;
  department: string;
}

// ============ Edit Interfaces ============

export interface EditStudentPayload {
  email: string;
  student_name?: string;
  roll_number?: string;
  department?: string;
  program?: string;
  batch_year?: number;
  fa_name?: string;
}

export interface EditFacultyPayload {
  email: string;
  fa_name?: string;
  department?: string;
}

export interface EditEventOrganizerPayload {
  email: string;
  organizer_name?: string;
  organization_name?: string;
}

export interface EditAdminPayload {
  email: string;
  admin_name?: string;
}

// ============ Single Registration APIs ============

/**
 * Register a single student
 * Route: POST /api/register/student
 * Input: email, roll_number, student_name, batch_year, fa_name
 * Note: department and program are extracted from roll_number (format: [program_char][6_digits][dept_code])
 * Roll number format example: b230395cs (btech, 230395, cs department)
 */
export const registerSingleStudent = async (payload: RegisterStudentPayload): Promise<any> => {
  try {
    const response = await apiFetch('/api/register/student', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return await handleApiResponse(response, 'Register student');
  } catch (error) {
    console.error('Register student error:', error);
    throw error;
  }
};

/**
 * Register a single admin
 * Route: POST /api/register/admin
 * Input: email, admin_name
 */
export const registerSingleAdmin = async (payload: RegisterAdminPayload): Promise<any> => {
  try {
    const response = await apiFetch('/api/register/admin', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return await handleApiResponse(response, 'Register admin');
  } catch (error) {
    console.error('Register admin error:', error);
    throw error;
  }
};

/**
 * Register a single event organizer
 * Route: POST /api/register/event_organizer
 * Input: email, organizer_name, organization_name
 */
export const registerSingleEventOrganizer = async (
  payload: RegisterEventOrganizerPayload
): Promise<any> => {
  try {
    const response = await apiFetch('/api/register/event_organizer', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return await handleApiResponse(response, 'Register event organizer');
  } catch (error) {
    console.error('Register event organizer error:', error);
    throw error;
  }
};

/**
 * Register a single faculty advisor
 * Route: POST /api/register/fa
 * Input: email, fa_name, department
 */
export const registerSingleFacultyAdvisor = async (
  payload: RegisterFacultyAdvisorPayload
): Promise<any> => {
  try {
    const response = await apiFetch('/api/register/fa', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return await handleApiResponse(response, 'Register faculty advisor');
  } catch (error) {
    console.error('Register faculty advisor error:', error);
    throw error;
  }
};

// ============ Bulk Registration APIs ============

/**
 * Bulk register students via CSV file
 * Route: POST /api/admin/bulk-register/student
 * CSV Columns (flexible order): email, student_name, roll_number, batch_year, fa_name
 * Note: department and program are extracted from roll_number
 * File requirements: First row contains column headers
 */
export const bulkRegisterStudents = async (file: File): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiFetch('/api/admin/bulk-register/student', {
      method: 'POST',
      body: formData,
    });
    return await handleApiResponse(response, 'Bulk register students');
  } catch (error) {
    console.error('Bulk register students error:', error);
    throw error;
  }
};

/**
 * Bulk register faculty advisors via CSV file
 * Route: POST /api/admin/bulk-register/faculty
 * CSV Columns (flexible order): email, fa_name, department
 * File requirements: First row contains column headers
 */
export const bulkRegisterFaculty = async (file: File): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiFetch('/api/admin/bulk-register/faculty', {
      method: 'POST',
      body: formData,
    });
    return await handleApiResponse(response, 'Bulk register faculty');
  } catch (error) {
    console.error('Bulk register faculty error:', error);
    throw error;
  }
};

/**
 * Bulk register event organizers via CSV file
 * Route: POST /api/admin/bulk-register/event-organizer
 * CSV Columns (flexible order): email, organizer_name, organization_name
 * File requirements: First row contains column headers
 */
export const bulkRegisterEventOrganizers = async (file: File): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiFetch('/api/admin/bulk-register/event-organizer', {
      method: 'POST',
      body: formData,
    });
    return await handleApiResponse(response, 'Bulk register event organizers');
  } catch (error) {
    console.error('Bulk register event organizers error:', error);
    throw error;
  }
};

// ============ Bulk Remove Users API ============

/**
 * Bulk remove users via CSV file (any role)
 * Route: POST /api/admin/bulk-remove
 * CSV Columns: email
 * File requirements: First row contains column header 'email'
 * Note: Cannot remove super admin or dummy FA
 */
export const bulkRemoveUsers = async (file: File): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiFetch('/api/admin/bulk-remove', {
      method: 'POST',
      body: formData,
    });
    return await handleApiResponse(response, 'Bulk remove users');
  } catch (error) {
    console.error('Bulk remove users error:', error);
    throw error;
  }
};

// ============ Edit User Details APIs ============

/**
 * Edit student details
 * Route: PATCH /api/admin/edit/student
 * Input: email (required), and any of: student_name, roll_number, department, program, batch_year, fa_name
 * Note: department and program are extracted from roll_number if provided
 */
export const editStudentDetails = async (payload: EditStudentPayload): Promise<any> => {
  try {
    const response = await apiFetch('/api/admin/edit/student', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    return await handleApiResponse(response, 'Edit student details');
  } catch (error) {
    console.error('Edit student error:', error);
    throw error;
  }
};

/**
 * Edit faculty advisor details
 * Route: PATCH /api/admin/edit/faculty
 * Input: email (required), and any of: fa_name, department
 */
export const editFacultyDetails = async (payload: EditFacultyPayload): Promise<any> => {
  try {
    const response = await apiFetch('/api/admin/edit/faculty', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    return await handleApiResponse(response, 'Edit faculty details');
  } catch (error) {
    console.error('Edit faculty error:', error);
    throw error;
  }
};

/**
 * Edit event organizer details
 * Route: PATCH /api/admin/edit/event-organizer
 * Input: email (required), and any of: organizer_name, organization_name
 */
export const editEventOrganizerDetails = async (
  payload: EditEventOrganizerPayload
): Promise<any> => {
  try {
    const response = await apiFetch('/api/admin/edit/event-organizer', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    return await handleApiResponse(response, 'Edit event organizer details');
  } catch (error) {
    console.error('Edit event organizer error:', error);
    throw error;
  }
};

/**
 * Edit admin details
 * Route: PATCH /api/admin/edit/admin
 * Input: email (required), and any of: admin_name
 */
export const editAdminDetails = async (payload: EditAdminPayload): Promise<any> => {
  try {
    const response = await apiFetch('/api/admin/edit/admin', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    return await handleApiResponse(response, 'Edit admin details');
  } catch (error) {
    console.error('Edit admin error:', error);
    throw error;
  }
};
