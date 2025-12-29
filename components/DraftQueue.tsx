'use client';

import { useState } from 'react';
import { EmailDraft } from '@/types';
import { loadDrafts, saveDrafts } from '@/lib/storage';

export default function DraftQueue() {
  const [drafts, setDrafts] = useState<EmailDraft[]>(() => loadDrafts());
  const [editingDraft, setEditingDraft] = useState<EmailDraft | null>(null);

  const handleEdit = (draft: EmailDraft) => {
    setEditingDraft({ ...draft });
  };

  const handleSave = () => {
    if (!editingDraft) return;

    const updatedDrafts = drafts.map((d) =>
      d.id === editingDraft.id ? { ...editingDraft, updatedAt: new Date() } : d
    );
    setDrafts(updatedDrafts);
    saveDrafts(updatedDrafts);
    setEditingDraft(null);
  };

  const handleApprove = (id: string) => {
    const updatedDrafts = drafts.map((d) =>
      d.id === id ? { ...d, status: 'approved' as const, updatedAt: new Date() } : d
    );
    setDrafts(updatedDrafts);
    saveDrafts(updatedDrafts);
  };

  const handleDiscard = (id: string) => {
    const updatedDrafts = drafts.map((d) =>
      d.id === id ? { ...d, status: 'discarded' as const, updatedAt: new Date() } : d
    );
    setDrafts(updatedDrafts);
    saveDrafts(updatedDrafts);
  };

  const handleDelete = (id: string) => {
    const updatedDrafts = drafts.filter((d) => d.id !== id);
    setDrafts(updatedDrafts);
    saveDrafts(updatedDrafts);
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Draft copied to clipboard!');
  };

  const pendingDrafts = drafts.filter((d) => d.status === 'pending');
  const approvedDrafts = drafts.filter((d) => d.status === 'approved');
  const discardedDrafts = drafts.filter((d) => d.status === 'discarded');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Draft Queue</h2>

      {drafts.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p className="text-lg">No drafts yet.</p>
          <p className="text-sm mt-2">Generate some drafts to get started!</p>
        </div>
      )}

      {/* Editing Modal */}
      {editingDraft && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Edit Draft</h3>
            <textarea
              value={editingDraft.draftContent}
              onChange={(e) =>
                setEditingDraft({ ...editingDraft, draftContent: e.target.value })
              }
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingDraft(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pending Drafts */}
      {pendingDrafts.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📝 Pending Review ({pendingDrafts.length})
          </h3>
          <div className="space-y-4">
            {pendingDrafts.map((draft) => (
              <div
                key={draft.id}
                className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {draft.toneProfileName}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {draft.createdAt.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(draft)}
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleCopyToClipboard(draft.draftContent)}
                      className="text-sm text-green-600 hover:text-green-800 dark:text-green-400"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => handleApprove(draft.id)}
                      className="text-sm text-green-600 hover:text-green-800 dark:text-green-400"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => handleDiscard(draft.id)}
                      className="text-sm text-red-600 hover:text-red-800 dark:text-red-400"
                    >
                      ✗ Discard
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  {draft.draftContent}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approved Drafts */}
      {approvedDrafts.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            ✅ Approved ({approvedDrafts.length})
          </h3>
          <div className="space-y-4">
            {approvedDrafts.map((draft) => (
              <div
                key={draft.id}
                className="p-4 border border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20 rounded-lg"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                      {draft.toneProfileName}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {draft.createdAt.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopyToClipboard(draft.draftContent)}
                      className="text-sm text-green-600 hover:text-green-800 dark:text-green-400"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => handleDelete(draft.id)}
                      className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {draft.draftContent}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Discarded Drafts */}
      {discardedDrafts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🗑️ Discarded ({discardedDrafts.length})
          </h3>
          <div className="space-y-4">
            {discardedDrafts.map((draft) => (
              <div
                key={draft.id}
                className="p-4 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700/50 rounded-lg opacity-60"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                      {draft.toneProfileName}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {draft.createdAt.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(draft.id)}
                    className="text-sm text-red-600 hover:text-red-800 dark:text-red-400"
                  >
                    Delete
                  </button>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {draft.draftContent}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
