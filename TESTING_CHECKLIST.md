# ✅ Installation & Testing Checklist

Use this checklist to verify your Email Draft Buddy is working correctly.

## 🔧 Pre-Installation

- [ ] Node.js installed (version 18+)
- [ ] npm or yarn available
- [ ] 4GB+ RAM available (for AI model)
- [ ] Windows, Mac, or Linux OS

---

## 📦 Step 1: Install Ollama

### Windows
- [ ] Download from https://ollama.ai/download
- [ ] Run installer (OllamaSetup.exe)
- [ ] Verify: Open PowerShell, run `ollama --version`
- [ ] Should see: "ollama version X.X.X"

### Mac
- [ ] Run: `curl -fsSL https://ollama.ai/install.sh | sh`
- [ ] Verify: Run `ollama --version`

### Linux
- [ ] Run: `curl -fsSL https://ollama.ai/install.sh | sh`
- [ ] Verify: Run `ollama --version`

---

## 🤖 Step 2: Install AI Model

- [ ] Open terminal/PowerShell
- [ ] Run: `ollama pull llama3.1`
- [ ] Wait for download (~4GB, takes 5-10 mins)
- [ ] Verify: Run `ollama list`
- [ ] Should see: `llama3.1` in the list

---

## 🚀 Step 3: Start Ollama Server

- [ ] Open terminal/PowerShell
- [ ] Run: `ollama serve`
- [ ] **Keep this terminal open**
- [ ] Should see: "Listening on http://localhost:11434"
- [ ] Test: Open browser → http://localhost:11434
- [ ] Should see: "Ollama is running"

---

## 📱 Step 4: Start the App

- [ ] Open **new** terminal (don't close Ollama terminal)
- [ ] Navigate: `cd "D:\Email Draft Buddy\email-draft-buddy"`
- [ ] Run: `npm run dev`
- [ ] Wait for: "Ready in XXXXms"
- [ ] Should see: "Local: http://localhost:3000"

---

## ✅ Step 5: Functional Tests

### Test 1: App Loads
- [ ] Open browser → http://localhost:3000
- [ ] Page loads without errors
- [ ] See "📧 Email Draft Buddy" header
- [ ] See 3 tabs: Generate Drafts, Tone Profiles, Draft Queue

### Test 2: Ollama Connection
- [ ] Click "Generate Drafts" tab
- [ ] Check "Ollama Status" in top section
- [ ] Should show: "✓ Connected" (green)
- [ ] If red, click "Refresh"
- [ ] If still red, check Step 3

### Test 3: Tone Profiles
- [ ] Click "Tone Profiles" tab
- [ ] Should see 4 default profiles:
  - [ ] Friendly
  - [ ] Direct
  - [ ] Strict
  - [ ] Casual
- [ ] Each has description and keywords
- [ ] Click "Edit" on any profile → modal opens
- [ ] Click "Cancel" → modal closes

### Test 4: Create Custom Tone
- [ ] Click "+ Create New"
- [ ] Fill in:
  - Name: "Test Tone"
  - Description: "Test description"
  - Keywords: "test, keywords"
  - Sample Phrases: "Test phrase"
  - Instructions: "Test instructions"
- [ ] Click "Save"
- [ ] New "Test Tone" appears in list
- [ ] Click "Delete" on "Test Tone" → it disappears

### Test 5: Generate Drafts
- [ ] Click "Generate Drafts" tab
- [ ] Select tone: "Friendly"
- [ ] Paste test email:
  ```
  Hi,
  
  Your report is overdue. Please submit by EOD.
  
  Thanks,
  Manager
  ```
- [ ] Click "Generate 3 Draft Responses"
- [ ] Button shows "Generating Drafts..." (disabled)
- [ ] Wait 10-30 seconds (first time is slower)
- [ ] Should see: "✓ Generated 3 Drafts (Saved to Queue)"
- [ ] 3 different draft responses appear below
- [ ] Each draft is different but maintains "Friendly" tone

### Test 6: Review Queue
- [ ] Click "Draft Queue" tab
- [ ] Should see section: "📝 Pending Review (3)"
- [ ] 3 drafts from previous test visible
- [ ] Each shows:
  - Tone profile name (Friendly)
  - Timestamp
  - Draft content
  - Action buttons: Edit, Copy, ✓ Approve, ✗ Discard

### Test 7: Edit Draft
- [ ] Click "Edit" on first draft
- [ ] Modal opens with editable text
- [ ] Modify text (add/remove words)
- [ ] Click "Save Changes"
- [ ] Modal closes
- [ ] Draft shows updated text

### Test 8: Copy to Clipboard
- [ ] Click "Copy" on any draft
- [ ] Alert: "Draft copied to clipboard!"
- [ ] Open Notepad/TextEdit
- [ ] Paste (Ctrl+V / Cmd+V)
- [ ] Draft text appears correctly

### Test 9: Approve Draft
- [ ] Click "✓ Approve" on one draft
- [ ] Draft moves to "✅ Approved" section
- [ ] Still has "Copy" and "Delete" buttons
- [ ] Pending count decreases by 1

### Test 10: Discard Draft
- [ ] Click "✗ Discard" on one draft
- [ ] Draft moves to "🗑️ Discarded" section
- [ ] Appears grayed out (opacity reduced)
- [ ] Only has "Delete" button

### Test 11: Delete Draft
- [ ] Click "Delete" on any draft
- [ ] Draft disappears completely
- [ ] Counter updates

### Test 12: Generate with Different Tone
- [ ] Click "Generate Drafts" tab
- [ ] Select tone: "Direct"
- [ ] Paste same test email from Test 5
- [ ] Generate drafts
- [ ] New drafts should be more concise/professional
- [ ] Go to "Draft Queue" → now shows 6 total drafts (3 old + 3 new)

### Test 13: Page Refresh (Data Persistence)
- [ ] Refresh browser (F5)
- [ ] Page reloads
- [ ] Go to "Tone Profiles" → custom profiles still there
- [ ] Go to "Draft Queue" → all drafts still there
- [ ] Status (approved/pending/discarded) preserved

---

## 🐛 Troubleshooting

### Issue: "Ollama Status: ✗ Not Connected"

**Fix:**
1. Check if Ollama is running: `curl http://localhost:11434/api/tags`
2. If error, restart: Close terminal → Run `ollama serve` again
3. Click "Refresh" in app

---

### Issue: "Failed to generate drafts"

**Fix:**
1. Verify model installed: `ollama list` → should show `llama3.1`
2. If missing: `ollama pull llama3.1`
3. Check Ollama terminal for errors
4. Try shorter email text first

---

### Issue: Generation takes too long (>60 seconds)

**Causes:**
- First generation loads model (20-30s is normal)
- CPU-only processing (no GPU)
- Large email text

**Fix:**
- Wait for first generation (subsequent ones are faster)
- Use shorter emails
- Consider upgrading to model with GPU support

---

### Issue: Drafts are identical or low quality

**Fix:**
1. Check tone profile has clear instructions
2. Provide more sample phrases
3. Use more specific personality instructions
4. Try different models: `ollama pull mistral` (faster, lighter)

---

### Issue: Port 3000 already in use

**Fix:**
```powershell
npx kill-port 3000
npm run dev
```

---

### Issue: npm/node not found

**Fix:**
1. Install Node.js from https://nodejs.org
2. Restart terminal
3. Verify: `node --version` and `npm --version`

---

## ✨ Success Criteria

You're ready to demo if:

- [x] All 13 functional tests pass
- [x] Drafts generate in <30 seconds
- [x] Data persists after page refresh
- [x] No console errors (F12 → Console tab)
- [x] UI is responsive on your screen

---

## 📸 Portfolio Screenshots to Take

1. **Tone Profiles page** - showing all 4 defaults
2. **Generate Drafts page** - with Ollama connected, email pasted
3. **Draft results** - showing all 3 variations
4. **Draft Queue** - with pending, approved, and discarded sections
5. **Edit modal** - showing inline editing capability

---

## 🎉 You're Ready!

If all tests pass, your Email Draft Buddy is **production-ready** for portfolio demos.

**Next Steps:**
- Take screenshots (see above)
- Write portfolio description (see PROJECT_SUMMARY.md)
- Practice demo script (see SETUP.md)
- Deploy to Vercel (frontend only) or GitHub Pages

**Need help?** Check the troubleshooting section or review QUICKSTART.md.
