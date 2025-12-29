import { ToneProfile } from '@/types';

export const defaultToneProfiles: Omit<ToneProfile, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Friendly',
    description: 'Warm, approachable, and conversational',
    keywords: ['thanks', 'appreciate', 'happy to', 'glad', 'hope'],
    samplePhrases: [
      'Thanks so much for reaching out!',
      'I really appreciate you bringing this to my attention.',
      'I\'d be happy to help with that.',
      'Hope this helps!',
      'Looking forward to hearing from you!'
    ],
    personalityInstructions: 'Write in a warm, friendly tone. Use casual but professional language. Show enthusiasm and gratitude. Keep it conversational and approachable.'
  },
  {
    name: 'Direct',
    description: 'Clear, concise, and to-the-point',
    keywords: ['regarding', 'please', 'will', 'confirmed', 'noted'],
    samplePhrases: [
      'Regarding your request:',
      'Please find the information below.',
      'I will follow up by [date].',
      'Confirmed.',
      'This has been noted.'
    ],
    personalityInstructions: 'Be clear and concise. Get straight to the point. Use short sentences. Avoid unnecessary pleasantries. Focus on facts and action items.'
  },
  {
    name: 'Strict',
    description: 'Professional, firm, and authoritative',
    keywords: ['must', 'required', 'policy', 'deadline', 'important'],
    samplePhrases: [
      'Please note that this is required.',
      'As per our policy,',
      'The deadline is non-negotiable.',
      'This is an important matter that requires immediate attention.',
      'I must emphasize the importance of'
    ],
    personalityInstructions: 'Maintain a professional and firm tone. Be authoritative but not rude. Set clear boundaries and expectations. Emphasize rules, policies, and deadlines when relevant.'
  },
  {
    name: 'Casual',
    description: 'Relaxed, informal, and easy-going',
    keywords: ['hey', 'sure', 'no problem', 'sounds good', 'cool'],
    samplePhrases: [
      'Hey! Thanks for getting in touch.',
      'Sure thing, no problem!',
      'Sounds good to me.',
      'Cool, I\'ll take a look at that.',
      'Let me know if you need anything else!'
    ],
    personalityInstructions: 'Write in a relaxed, informal tone. Use contractions and casual language. Be friendly and easy-going. Keep it brief and conversational.'
  }
];
