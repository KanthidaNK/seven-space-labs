export interface UserSyncPayload {
  name: string;
  email: string;
  role: 'Free' | 'Student' | 'Premium' | 'Admin' | 'Developer';
  unlockedCourse?: string;
  timestamp?: string;
  action?: 'LOGIN' | 'PIN_UNLOCK' | 'UPGRADE_PREMIUM' | 'ROLE_CHANGE';
}

/**
 * Synchronizes user authentication, PIN unlock, and role status to Google Sheets via Google Apps Script Webhook
 */
export const syncUserToGoogleSheet = async (userData: UserSyncPayload) => {
  const payload = {
    name: userData.name || 'Cadet_Nova',
    email: userData.email || `${(userData.name || 'cadet').toLowerCase()}@space.io`,
    role: userData.role || 'Free',
    unlockedCourse: userData.unlockedCourse || 'None',
    timestamp: userData.timestamp || new Date().toISOString(),
    action: userData.action || 'LOGIN',
  };

  try {
    const res = await fetch('/api/webhook/google-sheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    return result;
  } catch (err) {
    console.warn('[Google Sheets Sync Service Error]:', err);
    return { success: false, error: err };
  }
};
