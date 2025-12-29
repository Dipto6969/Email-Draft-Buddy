export interface ToneProfile {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  samplePhrases: string[];
  personalityInstructions: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailDraft {
  id: string;
  originalEmail: string;
  toneProfileId: string;
  toneProfileName: string;
  draftContent: string;
  status: 'pending' | 'approved' | 'discarded';
  createdAt: Date;
  updatedAt: Date;
}

export interface DraftGenerationRequest {
  emailText: string;
  toneProfileId: string;
}
