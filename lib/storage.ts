import { ToneProfile, EmailDraft } from '@/types';

const TONE_PROFILES_KEY = 'email_draft_buddy_tone_profiles';
const DRAFTS_KEY = 'email_draft_buddy_drafts';

// Tone Profiles Storage
export const saveToneProfiles = (profiles: ToneProfile[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TONE_PROFILES_KEY, JSON.stringify(profiles));
  }
};

export const loadToneProfiles = (): ToneProfile[] => {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(TONE_PROFILES_KEY);
  if (!stored) return [];
  
  try {
    const profiles = JSON.parse(stored);
    return profiles.map((p: ToneProfile) => ({
      ...p,
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt)
    }));
  } catch {
    return [];
  }
};

// Email Drafts Storage
export const saveDrafts = (drafts: EmailDraft[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
  }
};

export const loadDrafts = (): EmailDraft[] => {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(DRAFTS_KEY);
  if (!stored) return [];
  
  try {
    const drafts = JSON.parse(stored);
    return drafts.map((d: EmailDraft) => ({
      ...d,
      createdAt: new Date(d.createdAt),
      updatedAt: new Date(d.updatedAt)
    }));
  } catch {
    return [];
  }
};
