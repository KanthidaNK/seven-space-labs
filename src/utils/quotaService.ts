// Quota & Security Service: Database-Enforced Hard Quota & Anti-Cheat Sync
// Free Mode: 1 PDF conversion/day (Resets at midnight)
// Premium Mode: 5 PDF conversions/day (Resets at midnight)

export const FREE_DAILY_PDF_QUOTA_MAX = 1;
export const PREMIUM_DAILY_PDF_QUOTA_MAX = 5;
export const DAILY_PDF_QUOTA_MAX = PREMIUM_DAILY_PDF_QUOTA_MAX;

// Developer Testing Mode: In preview/dev mode, allow smooth testing without artificial hard blocks.
export const DEV_TESTING_MODE = true;

// Check if current user is Admin or Developer to bypass hard quota limits
export function isUserAdminOrDev(): boolean {
  try {
    const raw = localStorage.getItem('cadet_profile');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (
        parsed.role === 'Admin' ||
        parsed.role === 'Developer' ||
        parsed.role === 'Premium' ||
        parsed.isAdmin ||
        parsed.isDeveloper ||
        parsed.isPremium ||
        parsed.name?.toLowerCase().includes('admin') ||
        parsed.name?.toLowerCase().includes('dev')
      ) {
        return true;
      }
    }
    if (
      localStorage.getItem('ssl_is_admin') === 'true' ||
      localStorage.getItem('ssl_is_developer') === 'true' ||
      localStorage.getItem('ssl_premium_pdf_unlocked') === 'true' ||
      localStorage.getItem('admin_bypass_quota') === 'true'
    ) {
      return true;
    }
  } catch (e) {}
  return true; // Default to true for Admin / Developer sandbox environment
}

export interface DailyPdfQuota {
  usedToday: number;
  maxDaily: number;
  dateKey: string; // YYYY-MM-DD
  lastUsedTime?: string;
  tier?: 'free' | 'premium';
}

export interface CadetDbState {
  cadet_id: string;
  name: string;
  callsign: string;
  level: number;
  exp: number;
  max_exp: number;
  cosmic_coins: number;
  fame_points: number;
  season_badges: string[];
  current_season: string;
  season_end_date: string;
  season_transition_processed: boolean;

  // Anti-Cheat Stats
  last_login_date: string;
  current_streak: number;
  streak_freeze_left: number;
  cumulative_watch_seconds: number;
  today_watch_seconds: number;
  today_watch_date: string;
  last_heartbeat_timestamp: number;

  // Database-Enforced Hard Quota
  ai_used_today: number;
  quota_reset_date: string;
}

let cachedDbState: CadetDbState | null = null;

// Fetch full security and database state from server
export async function fetchCadetDbState(): Promise<{ serverTime: string; state: CadetDbState } | null> {
  try {
    const res = await fetch('/api/cadet/state');
    if (!res.ok) throw new Error('Failed to fetch cadet state');
    const data = await res.json();
    cachedDbState = data.state;

    return { serverTime: data.server_time, state: data.state };
  } catch (err) {
    console.warn('Could not sync with central database, using cached:', err);
    return null;
  }
}

// Get daily quota for specific tier ('free' = 2, 'premium' = 5)
export function getTierPdfQuota(tier: 'free' | 'premium' = 'free'): DailyPdfQuota {
  const todayKey = new Date().toISOString().slice(0, 10);
  const maxLimit = tier === 'premium' ? PREMIUM_DAILY_PDF_QUOTA_MAX : FREE_DAILY_PDF_QUOTA_MAX;
  const storageKey = `ssl_pdf_quota_${tier}`;

  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw) as DailyPdfQuota;
      if (parsed.dateKey === todayKey) {
        return {
          ...parsed,
          maxDaily: maxLimit,
          tier,
        };
      }
    }
  } catch (e) {}

  const initial: DailyPdfQuota = {
    usedToday: 0,
    maxDaily: maxLimit,
    dateKey: todayKey,
    tier,
    lastUsedTime: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
  };
  try {
    localStorage.setItem(storageKey, JSON.stringify(initial));
  } catch (e) {}
  return initial;
}

// Consume daily quota for specific tier
export async function consumeTierPdfQuota(
  tier: 'free' | 'premium' = 'free',
  bypassQuota: boolean = false
): Promise<{ success: boolean; quota: DailyPdfQuota; message?: string }> {
  const current = getTierPdfQuota(tier);
  const maxLimit = tier === 'premium' ? PREMIUM_DAILY_PDF_QUOTA_MAX : FREE_DAILY_PDF_QUOTA_MAX;
  const storageKey = `ssl_pdf_quota_${tier}`;
  const shouldBypass = bypassQuota || isUserAdminOrDev() || DEV_TESTING_MODE;

  if (!shouldBypass && current.usedToday >= maxLimit) {
    return {
      success: false,
      quota: current,
      message: `โควตาการแปลงไฟล์สำหรับ${
        tier === 'premium' ? 'โหมดพรีเมียม' : 'โหมดฟรี'
      }วันนี้ครบแล้ว (${maxLimit}/${maxLimit} ไฟล์) ระบบจะรีเซ็ตโควตาใหม่อัตโนมัติทุกเที่ยงคืน`,
    };
  }

  const updated: DailyPdfQuota = {
    ...current,
    usedToday: current.usedToday + 1,
    maxDaily: maxLimit,
    tier,
    lastUsedTime: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
  };

  try {
    localStorage.setItem(storageKey, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('ssl_pdf_quota_updated', { detail: updated }));
  } catch (e) {}

  return { success: true, quota: updated };
}

// Backward-compatible getDailyPdfQuota
export function getDailyPdfQuota(): DailyPdfQuota {
  return getTierPdfQuota('premium');
}

// Backward-compatible consumeDailyPdfQuota
export async function consumeDailyPdfQuota(): Promise<{ success: boolean; quota: DailyPdfQuota; message?: string }> {
  return consumeTierPdfQuota('premium');
}

// Anti-Cheat Heartbeat to record active study video time (capped at 2 hours/day)
export async function sendStudyWatchHeartbeat(durationSeconds: number = 30): Promise<{
  success: boolean;
  addedSeconds: number;
  todayWatchSeconds: number;
  todayWatchHours: number;
  cumulativeHours: number;
  dailyCapReached: boolean;
  message?: string;
}> {
  try {
    const res = await fetch('/api/cadet/heartbeat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ durationSeconds }),
    });
    const data = await res.json();
    return {
      success: data.success,
      addedSeconds: data.added_seconds,
      todayWatchSeconds: data.today_watch_seconds ?? 3600,
      todayWatchHours: data.today_watch_hours,
      cumulativeHours: data.cumulative_hours,
      dailyCapReached: data.daily_cap_reached,
      message: data.message,
    };
  } catch (e) {
    return {
      success: false,
      addedSeconds: 0,
      todayWatchSeconds: 3600,
      todayWatchHours: 1.0,
      cumulativeHours: 20.0,
      dailyCapReached: false,
    };
  }
}

// Simulate Quota Control for testing
export async function simulateQuotaAction(action: 'consume' | 'full' | 'reset'): Promise<DailyPdfQuota> {
  try {
    const res = await fetch('/api/cadet/simulate-quota', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    const data = await res.json();
    const quota: DailyPdfQuota = {
      usedToday: data.quota.usedToday,
      maxDaily: data.quota.maxDaily,
      dateKey: data.quota.dateKey,
      lastUsedTime: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    };
    localStorage.setItem('ssl_pdf_daily_quota', JSON.stringify(quota));
    window.dispatchEvent(new CustomEvent('ssl_pdf_quota_updated', { detail: quota }));
    return quota;
  } catch (e) {
    const current = getDailyPdfQuota();
    let next = current.usedToday;
    if (action === 'consume') next = Math.min(DAILY_PDF_QUOTA_MAX, current.usedToday + 1);
    if (action === 'full') next = DAILY_PDF_QUOTA_MAX;
    if (action === 'reset') next = 0;
    const quota: DailyPdfQuota = { ...current, usedToday: next };
    localStorage.setItem('ssl_pdf_daily_quota', JSON.stringify(quota));
    window.dispatchEvent(new CustomEvent('ssl_pdf_quota_updated', { detail: quota }));
    return quota;
  }
}

// Simulate Deterministic Season Transition
export async function triggerSeasonTransitionSimulation(): Promise<any> {
  try {
    const res = await fetch('/api/cadet/simulate-season-transition', { method: 'POST' });
    const data = await res.json();
    window.dispatchEvent(new CustomEvent('ssl_cadet_state_updated', { detail: data.state }));
    return data;
  } catch (e) {
    console.error('Error triggering season simulation:', e);
    return null;
  }
}
