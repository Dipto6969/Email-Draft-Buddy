'use client';

import { useState } from 'react';
import ToneProfileManager from '@/components/ToneProfileManager';
import EmailInput from '@/components/EmailInput';
import DraftQueue from '@/components/DraftQueue';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'generate' | 'tones' | 'queue'>('generate');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            📧 Email Draft Buddy
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Your local AI coach for professional email responses
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-1 flex gap-1">
            <button
              onClick={() => setActiveTab('generate')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'generate'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Generate Drafts
            </button>
            <button
              onClick={() => setActiveTab('tones')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'tones'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Tone Profiles
            </button>
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'queue'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Draft Queue
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'generate' && <EmailInput />}
          {activeTab === 'tones' && <ToneProfileManager />}
          {activeTab === 'queue' && <DraftQueue />}
        </div>
      </div>
    </div>
  );
}
