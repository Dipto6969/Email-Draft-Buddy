import { ToneProfile } from '@/types';

const OLLAMA_API_URL = 'http://localhost:11434/api/generate';

export interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  stream: boolean;
}

export const generateDraft = async (
  emailText: string,
  toneProfile: ToneProfile
): Promise<string> => {
  const prompt = buildPrompt(emailText, toneProfile);

  try {
    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.1',
        prompt,
        stream: false,
      } as OllamaGenerateRequest),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response || 'Error generating draft';
  } catch (error) {
    console.error('Error calling Ollama:', error);
    throw new Error('Failed to generate draft. Make sure Ollama is running locally.');
  }
};

export const generate3Drafts = async (
  emailText: string,
  toneProfile: ToneProfile
): Promise<string[]> => {
  const prompts = [
    buildPrompt(emailText, toneProfile, 1),
    buildPrompt(emailText, toneProfile, 2),
    buildPrompt(emailText, toneProfile, 3),
  ];

  try {
    const draftPromises = prompts.map(async (prompt) => {
      const response = await fetch(OLLAMA_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3.1',
          prompt,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.response || '';
    });

    return await Promise.all(draftPromises);
  } catch (error) {
    console.error('Error generating drafts:', error);
    throw error;
  }
};

const buildPrompt = (
  emailText: string,
  toneProfile: ToneProfile,
  variation: number = 1
): string => {
  const variationInstructions = [
    'Create a balanced response.',
    'Make the response slightly more detailed.',
    'Keep the response brief and to the point.',
  ];

  return `You are an email draft assistant. Your job is to help users reply to emails professionally.

**Tone Profile: ${toneProfile.name}**
${toneProfile.description}

**Tone Instructions:**
${toneProfile.personalityInstructions}

**Keywords to consider:** ${toneProfile.keywords.join(', ')}

**Sample phrases (use similar style):**
${toneProfile.samplePhrases.map((p, i) => `${i + 1}. ${p}`).join('\n')}

**Variation Instruction:** ${variationInstructions[variation - 1]}

**Original Email:**
${emailText}

**Instructions:**
1. Read the original email carefully
2. Write a reply that matches the "${toneProfile.name}" tone
3. Address the main points from the original email
4. ${variationInstructions[variation - 1]}
5. Keep it professional and appropriate
6. Do NOT include a subject line
7. Start directly with the email body

**Reply:**`;
};

export const checkOllamaConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:11434/api/tags');
    return response.ok;
  } catch {
    return false;
  }
};
