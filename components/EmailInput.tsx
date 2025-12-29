'use client';

import { useState, useEffect } from 'react';
import { ToneProfile, EmailDraft } from '@/types';
import { loadToneProfiles, saveDrafts, loadDrafts } from '@/lib/storage';
import { checkOllamaConnection } from '@/lib/ollama';

type GenerationStage = 'idle' | 'loading-model' | 'generating-1' | 'generating-2' | 'generating-3' | 'saving' | 'complete';

export default function EmailInput() {
  const [emailText, setEmailText] = useState('');
  const [selectedToneId, setSelectedToneId] = useState('');
  const [profiles, setProfiles] = useState<ToneProfile[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState<GenerationStage>('idle');
  const [generatedDrafts, setGeneratedDrafts] = useState<string[]>([]);
  const [ollamaConnected, setOllamaConnected] = useState(false);
  const [error, setError] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [hasTimedOut, setHasTimedOut] = useState(false);

  useEffect(() => {
    setProfiles(loadToneProfiles());
    checkConnection();
  }, []);

  const checkConnection = async () => {
    const connected = await checkOllamaConnection();
    setOllamaConnected(connected);
  };

  // Timer for elapsed time
  useEffect(() => {
    if (!isGenerating) return;

    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    // Timeout after 3 minutes (180 seconds) - likely stuck
    const timeout = setTimeout(() => {
      if (isGenerating) {
        setHasTimedOut(true);
      }
    }, 180000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isGenerating]);

  // Reset timer when generation starts
  useEffect(() => {
    if (isGenerating) {
      setElapsedTime(0);
      setHasTimedOut(false);
    }
  }, [isGenerating]);

  const handleGenerate = async () => {
    if (!emailText.trim() || !selectedToneId) {
      setError('Please enter email text and select a tone profile');
      return;
    }

    if (!ollamaConnected) {
      setError('Ollama is not running. Please start Ollama and try again.');
      return;
    }

    setError('');
    setIsGenerating(true);
    setGenerationStage('loading-model');
    setGeneratedDrafts([]);
    setHasTimedOut(false);
    setElapsedTime(0);

    try {
      const selectedProfile = profiles.find((p) => p.id === selectedToneId);
      if (!selectedProfile) {
        throw new Error('Selected tone profile not found');
      }

      setGenerationStage('generating-1');
      const draft1 = await generateWithTimeout(emailText, selectedProfile, 1);

      setGenerationStage('generating-2');
      const draft2 = await generateWithTimeout(emailText, selectedProfile, 2);

      setGenerationStage('generating-3');
      const draft3 = await generateWithTimeout(emailText, selectedProfile, 3);

      const drafts = [draft1, draft2, draft3];
      setGenerationStage('saving');
      setGeneratedDrafts(drafts);

      // Save to queue
      const existingDrafts = loadDrafts();
      const newDrafts: EmailDraft[] = drafts.map((draft, idx) => ({
        id: `draft-${Date.now()}-${idx}`,
        originalEmail: emailText,
        toneProfileId: selectedProfile.id,
        toneProfileName: selectedProfile.name,
        draftContent: draft,
        status: 'pending' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      saveDrafts([...existingDrafts, ...newDrafts]);
      setGenerationStage('complete');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to generate drafts');
    } finally {
      setIsGenerating(false);
      setTimeout(() => setGenerationStage('idle'), 3000);
    }
  };

  const generateWithTimeout = async (
    emailText: string,
    profile: ToneProfile,
    variation: number
  ): Promise<string> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 480000); // 8-minute timeout per draft

    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'mistral',
          prompt: buildPrompt(emailText, profile, variation),
          stream: false,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.response || '';
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Draft ${variation} generation timed out (>2 min). Try shorter email text.`);
      }
      throw error;
    }
  };

  const buildPrompt = (emailText: string, profile: ToneProfile, variation: number): string => {
    const variationInstructions = [
      'Create a balanced response.',
      'Make the response slightly more detailed.',
      'Keep the response brief and to the point.',
    ];

    return `You are an email draft assistant. Write professional replies matching the "${profile.name}" tone.

**Tone:** ${profile.description}
**Instructions:** ${profile.personalityInstructions}

**Original Email:**
${emailText}

**Reply in "${profile.name}" tone (${variationInstructions[variation - 1].toLowerCase()}):`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Generate Email Drafts
      </h2>

      {/* Ollama Status */}
      <div className="mb-4 p-3 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-between">
        <span className="text-sm text-gray-700 dark:text-gray-300">Ollama Status:</span>
        <span
          className={`text-sm font-semibold ${
            ollamaConnected ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {ollamaConnected ? '✓ Connected' : '✗ Not Connected'}
        </span>
        <button
          onClick={checkConnection}
          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400"
        >
          Refresh
        </button>
      </div>

      {!ollamaConnected && (
        <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-md text-sm">
          <strong>Note:</strong> Make sure Ollama is running locally. Run{' '}
          <code className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">ollama serve</code> in
          your terminal.
        </div>
      )}

      {/* Tone Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Tone Profile
        </label>
        <select
          value={selectedToneId}
          onChange={(e) => setSelectedToneId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="">-- Choose a tone --</option>
          {profiles.map((profile) => (
            <option key={profile.id} value={profile.id}>
              {profile.name} - {profile.description}
            </option>
          ))}
        </select>
      </div>

      {/* Email Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Original Email (Paste the email you received)
        </label>
        <textarea
          value={emailText}
          onChange={(e) => setEmailText(e.target.value)}
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Paste the email you want to respond to..."
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Loading Indicator */}
      {isGenerating && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <span className="font-semibold text-blue-900 dark:text-blue-200">Processing...</span>
            </div>
            <span className="text-sm text-blue-700 dark:text-blue-300 font-mono">{elapsedTime}s</span>
          </div>

          {/* Progress Stages */}
          <div className="space-y-2">
            {/* Stage 1: Loading Model */}
            <div className="flex items-center gap-2">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                  generationStage === 'loading-model' || ['generating-1', 'generating-2', 'generating-3', 'saving', 'complete'].includes(generationStage)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {['generating-1', 'generating-2', 'generating-3', 'saving', 'complete'].includes(generationStage) ? '✓' : '1'}
              </div>
              <span className={`text-sm ${generationStage === 'loading-model' ? 'text-blue-900 dark:text-blue-100 font-semibold' : 'text-gray-700 dark:text-gray-400'}`}>
                Loading AI Model {generationStage === 'loading-model' && '(first time is slower)'}
              </span>
            </div>

            {/* Stage 2: Draft 1 */}
            <div className="flex items-center gap-2">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                  generationStage === 'generating-1'
                    ? 'bg-yellow-500 text-white animate-pulse'
                    : ['generating-2', 'generating-3', 'saving', 'complete'].includes(generationStage)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                }`}
              >
                {['generating-2', 'generating-3', 'saving', 'complete'].includes(generationStage) ? '✓' : '2'}
              </div>
              <span className={`text-sm ${generationStage === 'generating-1' ? 'text-blue-900 dark:text-blue-100 font-semibold' : 'text-gray-700 dark:text-gray-400'}`}>
                Generating Draft 1 of 3
              </span>
            </div>

            {/* Stage 3: Draft 2 */}
            <div className="flex items-center gap-2">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                  generationStage === 'generating-2'
                    ? 'bg-yellow-500 text-white animate-pulse'
                    : ['generating-3', 'saving', 'complete'].includes(generationStage)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                }`}
              >
                {['generating-3', 'saving', 'complete'].includes(generationStage) ? '✓' : '3'}
              </div>
              <span className={`text-sm ${generationStage === 'generating-2' ? 'text-blue-900 dark:text-blue-100 font-semibold' : 'text-gray-700 dark:text-gray-400'}`}>
                Generating Draft 2 of 3
              </span>
            </div>

            {/* Stage 4: Draft 3 */}
            <div className="flex items-center gap-2">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                  generationStage === 'generating-3'
                    ? 'bg-yellow-500 text-white animate-pulse'
                    : ['saving', 'complete'].includes(generationStage)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                }`}
              >
                {['saving', 'complete'].includes(generationStage) ? '✓' : '4'}
              </div>
              <span className={`text-sm ${generationStage === 'generating-3' ? 'text-blue-900 dark:text-blue-100 font-semibold' : 'text-gray-700 dark:text-gray-400'}`}>
                Generating Draft 3 of 3
              </span>
            </div>

            {/* Stage 5: Saving */}
            <div className="flex items-center gap-2">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                  generationStage === 'saving'
                    ? 'bg-yellow-500 text-white animate-pulse'
                    : generationStage === 'complete'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                }`}
              >
                {generationStage === 'complete' ? '✓' : '5'}
              </div>
              <span className={`text-sm ${generationStage === 'saving' ? 'text-blue-900 dark:text-blue-100 font-semibold' : 'text-gray-700 dark:text-gray-400'}`}>
                Saving to Queue
              </span>
            </div>
          </div>

          {/* Timeout Warning */}
          {hasTimedOut && (
            <div className="mt-3 p-2 bg-red-100 dark:bg-red-900 rounded text-red-800 dark:text-red-200 text-sm">
              ⚠️ Taking longer than expected. This might indicate:
              <ul className="mt-1 ml-4 list-disc text-xs">
                <li>Low system specs (office laptop)</li>
                <li>Ollama model is loading (first time)</li>
                <li>Email text is too long</li>
              </ul>
              Try with shorter email text or wait a bit longer.
            </div>
          )}
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={isGenerating || !ollamaConnected}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {isGenerating ? `Generating Drafts... (${elapsedTime}s)` : 'Generate 3 Draft Responses'}
      </button>

      {/* Generated Drafts Preview */}
      {generatedDrafts.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            ✓ Generated 3 Drafts (Saved to Queue)
          </h3>
          <div className="space-y-4">
            {generatedDrafts.map((draft, idx) => (
              <div
                key={idx}
                className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md"
              >
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Draft {idx + 1}
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {draft}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
            Go to the <strong>Draft Queue</strong> tab to edit, approve, or discard these drafts.
          </p>
        </div>
      )}
    </div>
  );
}
