# 🚀 Email Draft Buddy - Setup & Testing Guide

## Step 1: Install Ollama

### Windows
1. Download from https://ollama.ai/download
2. Run the installer
3. Open PowerShell/Command Prompt
4. Verify installation: `ollama --version`

### Mac
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### Pull the AI Model
```bash
ollama pull llama3.1
```

## Step 2: Start Ollama Server

Open a terminal and run:
```bash
ollama serve
```

Leave this running in the background. You should see:
```
Ollama is running on http://localhost:11434
```

## Step 3: Start the App

In a new terminal, navigate to the project folder:
```bash
cd "D:\Email Draft Buddy\email-draft-buddy"
npm run dev
```

Open http://localhost:3000

## Step 4: Test the App

### Test 1: Check Ollama Connection
- Go to "Generate Drafts" tab
- Check if "Ollama Status" shows "✓ Connected"
- If not, click "Refresh" and make sure `ollama serve` is running

### Test 2: Generate Drafts
1. Select tone: "Friendly"
2. Paste this test email:
   ```
   Hi,
   
   I noticed you haven't submitted the project report yet. 
   The deadline was yesterday. Can you please send it by end of day?
   
   Thanks,
   John
   ```
3. Click "Generate 3 Draft Responses"
4. Wait 10-20 seconds (first generation is slower)
5. You should see 3 different drafts appear

### Test 3: Review Queue
1. Go to "Draft Queue" tab
2. You should see the 3 generated drafts
3. Click "Edit" on one draft and modify it
4. Click "Approve" on your favorite draft
5. Click "Copy" to copy to clipboard

### Test 4: Custom Tone Profile
1. Go to "Tone Profiles" tab
2. Click "+ Create New"
3. Fill in:
   - Name: "Apologetic"
   - Description: "Sincere apologies with commitment to fix"
   - Keywords: sorry, apologize, mistake, fix
   - Sample Phrases: "I sincerely apologize for..."
   - Instructions: "Always acknowledge the mistake, apologize sincerely, and provide a solution"
4. Click "Save"
5. Go back to "Generate Drafts" and test with your new tone

## Troubleshooting

### "Ollama is not running"
- Make sure `ollama serve` is running in terminal
- Check if port 11434 is not blocked
- Try: `curl http://localhost:11434/api/tags`

### "Failed to generate drafts"
- Verify model is installed: `ollama list`
- Should see `llama3.1` in the list
- Try regenerating with smaller email text

### Drafts are slow
- First generation takes ~20 seconds (model loading)
- Subsequent generations are faster (~5-10 seconds)
- Smaller emails generate faster

## Next Steps for Portfolio

1. **Take Screenshots**:
   - Tone profiles page
   - Draft generation with all 3 results
   - Draft queue with approved drafts

2. **Add to Portfolio**:
   - Explain the problem it solves
   - Highlight "privacy-first" and "local AI"
   - Show before/after (bad email vs. generated draft)

3. **Optional Enhancements**:
   - Add dark mode toggle
   - Add draft comparison view
   - Export drafts to .txt file
   - Add keyboard shortcuts

## Demo Flow (for Portfolio)

**Problem**: "I got an email asking why my report is late. I don't know how to respond professionally."

**Solution**:
1. Open Email Draft Buddy
2. Select "Apologetic" tone
3. Paste the email
4. Get 3 professional draft responses instantly
5. Pick one, edit if needed, copy & send

**Result**: Professional, appropriate response in under 30 seconds.
