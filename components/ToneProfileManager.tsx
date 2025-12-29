'use client';

import { useState } from 'react';
import { ToneProfile } from '@/types';
import { saveToneProfiles, loadToneProfiles } from '@/lib/storage';
import { defaultToneProfiles } from '@/lib/defaultTones';

export default function ToneProfileManager() {
  const [profiles, setProfiles] = useState<ToneProfile[]>(() => {
    const loaded = loadToneProfiles();
    if (loaded.length === 0) {
      // Initialize with default profiles
      const defaults = defaultToneProfiles.map((p, idx) => ({
        ...p,
        id: `default-${idx}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      saveToneProfiles(defaults);
      return defaults;
    }
    return loaded;
  });
  const [editingProfile, setEditingProfile] = useState<ToneProfile | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = () => {
    const newProfile: ToneProfile = {
      id: `profile-${Date.now()}`,
      name: '',
      description: '',
      keywords: [],
      samplePhrases: [],
      personalityInstructions: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setEditingProfile(newProfile);
    setIsCreating(true);
  };

  const handleSave = () => {
    if (!editingProfile) return;

    const updatedProfiles = isCreating
      ? [...profiles, editingProfile]
      : profiles.map((p) => (p.id === editingProfile.id ? editingProfile : p));

    setProfiles(updatedProfiles);
    saveToneProfiles(updatedProfiles);
    setEditingProfile(null);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    const updatedProfiles = profiles.filter((p) => p.id !== id);
    setProfiles(updatedProfiles);
    saveToneProfiles(updatedProfiles);
  };

  const handleCancel = () => {
    setEditingProfile(null);
    setIsCreating(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tone Profiles</h2>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          + Create New
        </button>
      </div>

      {editingProfile ? (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {isCreating ? 'Create New Profile' : 'Edit Profile'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                value={editingProfile.name}
                onChange={(e) =>
                  setEditingProfile({ ...editingProfile, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                placeholder="e.g., Friendly"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <input
                type="text"
                value={editingProfile.description}
                onChange={(e) =>
                  setEditingProfile({ ...editingProfile, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                placeholder="e.g., Warm, approachable, and conversational"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Keywords (comma-separated)
              </label>
              <input
                type="text"
                value={editingProfile.keywords.join(', ')}
                onChange={(e) =>
                  setEditingProfile({
                    ...editingProfile,
                    keywords: e.target.value.split(',').map((k) => k.trim()),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                placeholder="e.g., thanks, appreciate, happy to"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sample Phrases (one per line)
              </label>
              <textarea
                value={editingProfile.samplePhrases.join('\n')}
                onChange={(e) =>
                  setEditingProfile({
                    ...editingProfile,
                    samplePhrases: e.target.value.split('\n').filter((p) => p.trim()),
                  })
                }
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                placeholder="e.g., Thanks so much for reaching out!"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Personality Instructions
              </label>
              <textarea
                value={editingProfile.personalityInstructions}
                onChange={(e) =>
                  setEditingProfile({
                    ...editingProfile,
                    personalityInstructions: e.target.value,
                  })
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                placeholder="e.g., Write in a warm, friendly tone. Use casual but professional language."
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {profile.name}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingProfile(profile)}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(profile.id)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {profile.description}
            </p>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <strong>Keywords:</strong> {profile.keywords.join(', ')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
