import { useState, useEffect, useCallback } from 'react';
import { getUserDetails } from '../utils/user';

export interface UserProfilePayload {
  role: string;
  profile: {
    roll_number?: string;
    student_name?: string;
    department?: string;
    program?: string;
    total_points?: number;
    department_level_points?: number;
    institute_level_points?: number;
    fa_assigned_points?: number;
    graduation_eligible?: boolean;
    faculty_advisor_name?: string;

    fa_id?: string | number;
    fa_name?: string;

    organizer_id?: string | number;
    organizer_name?: string;
    organization_name?: string;

    admin_id?: string | number;
    admin_name?: string;
    email?: string;
  };
}

interface UseUserProfileResult {
  profile: UserProfilePayload | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUserProfile = (): UseUserProfileResult => {
  const [profile, setProfile] = useState<UserProfilePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = (await getUserDetails()) as unknown as UserProfilePayload;
      setProfile(data);

      if (data?.role) {
        localStorage.setItem('role', data.role);
      }
    } catch (err: any) {
      console.error('Failed to fetch user profile:', err);
      setError(err.message || 'Failed to load user profile');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // FIXED: Lifecycle gate prevents multiple calls during rapid layout shifts
  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      fetchProfile();
    }

    return () => {
      isMounted = false; // Cancels secondary executions if React re-mounts the view instantly
    };
  }, [fetchProfile]);

  return { profile, loading, error, refetch: fetchProfile };
};

const normalizeProfileRole = (rawRole?: string | null) => {
  if (!rawRole) return '';
  const role = rawRole.toString().trim().toLowerCase();
  if (role.includes('admin')) return 'admin';
  if (role.includes('event')) return 'event_organizer';
  if (role.includes('faculty') || role.includes('staff')) return 'faculty_advisor';
  if (role.includes('student')) return 'student';
  return role;
};

export const formatProfileData = (profile: UserProfilePayload) => {
  const normalizedRole = normalizeProfileRole(profile.role);
  const profileData = profile.profile;

  switch (normalizedRole) {
    case 'student':
      return {
        name: profileData?.student_name || 'Unknown',
        rollNo: profileData?.roll_number || 'N/A',
        department: profileData?.department || 'N/A',
        faAssigned: profileData?.faculty_advisor_name || 'Not Assigned',
        totalPoints: profileData?.total_points || 0,
        faPoints: profileData?.fa_assigned_points ?? 0,
        graduationEligible: profileData?.graduation_eligible || false,
      };

    case 'faculty_advisor':
      return {
        name: profileData?.fa_name || 'Unknown',
        id: profileData?.fa_id || 'N/A',
        department: profileData?.department || 'N/A',
      };

    case 'event_organizer':
      return {
        name: profileData?.organizer_name || 'Unknown',
        id: profileData?.organizer_id || 'N/A',
        organization: profileData?.organization_name || 'N/A',
      };

    case 'admin':
      return {
        name: profileData?.admin_name || 'Unknown',
        id: profileData?.admin_id || 'N/A',
        email: profileData?.email || 'N/A',
      };

    default:
      return {
        name: 'Unknown User',
      };
  }
};