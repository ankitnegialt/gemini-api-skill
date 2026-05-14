# Installation Guide

Complete step-by-step guide to install Edge Gallery skills on your Android device.

## Prerequisites

Before you start, make sure you have:

✅ **Android device** with Edge Gallery app installed
✅ **Google Gemini API key** (free from https://aistudio.google.com/apikey)
✅ **Internet connection** (required for all skills)
✅ **This repository** (downloaded or cloned)

## Prerequisites in Detail

### 1. Install Edge Gallery App

1. Open **Google Play Store** on your Android phone
2. Search for **"Google AI Edge Gallery"**
3. Tap **Install**
4. Wait for installation to complete
5. Open the app

### 2. Get Gemini API Key

Required for: `gemini-api`, `gemini-search`, `document-analyzer`

1. On your phone or computer, go to **https://aistudio.google.com/apikey**
2. Click **"Get API Key"** button
3. Select **"Create API key in new project"**
4. Click **"Create API key"**
5. A key will appear (looks like a long string)
6. **Copy it** and save it somewhere safe
7. **Note:** Keep this key private! Don't share it.

The key looks like: `AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 3. Download This Repository

**Option A: Download as ZIP**
1. Go to https://github.com/ankitnegialt/gemini-api-skill
2. Click **Code** button (green)
3. Click **Download ZIP**
4. Extract the ZIP on your phone using a file manager
5. Remember the folder location

**Option B: Clone with Git** (if you have Git installed)
```bash
git clone https://github.com/ankitnegialt/gemini-api-skill.git
cd gemini-api-skill
```

## Installation Steps

### Step 1: Prepare Skills Folder

On your **Android phone:**

1. Open **File Manager** app (or similar)
2. Navigate to your home directory
3. Create a new folder called **"Edge Gallery Skills"** (or any name you prefer)
4. Move the extracted repository folder here

Example path: `/storage/emulated/0/Edge Gallery Skills/gemini-api-skill/`

### Step 2: Open Edge Gallery App

1. Tap to open **Google AI Edge Gallery** app
2. You'll see the main chat interface
3. Look for **Agent Skills** section (usually on the home screen)

### Step 3: Access Skills Manager

1. Tap **Agent Skills** 
2. Look for a section that says **"Skills"** with a number (e.g., "11 skills")
3. Tap on the **Skills** chip/button
4. You'll see a **"Manage Skills"** dialog

### Step 4: Import First Skill

1. In the **Manage Skills** dialog, look for a blue **"+"** button (bottom right)
2. Tap the **"+"** button
3. Select **"Import local skill"**
4. A file picker will open
5. Navigate to: `gemini-api/` folder
6. Tap the folder to import it
7. Wait for loading to complete

**What happens next:**
- App shows "Initializing model"
- Skill is imported
- You're returned to the Manage Skills dialog

### Step 5: Repeat for Other Skills

Import the remaining skills one by one:

**Second import:**
1. Tap **"+"** button again
2. Select **"Import local skill"**
3. Navigate to: `gemini-search/` folder
4. Tap to import
5. Wait for completion

**Third import:**
1. Repeat for: `document-analyzer/` folder

**Fourth import (optional, doesn't need API key):**
1. Repeat for: `google-web-search/` folder

**Note:** Import one at a time. Don't try multiple imports simultaneously.

### Step 6: Enter API Key (First Use)

When you first **use** a skill requiring API key:

1. A dialog appears: **"Enter your Gemini API key"**
2. Paste the key you saved from Step 2
3. Tap **OK** or **Confirm**
4. Edge Gallery stores it securely
5. You won't need to enter it again

**Important:**
- Only `google-web-search` doesn't need an API key
- The other 3 skills will prompt you the first time
- Each skill shares the same API key quota

### Step 7: Verify Installation

Try using a skill to confirm everything works:

**Test Gemini API:**
```
Prompt: "Ask Gemini: What is artificial intelligence?"
Expected: Gemini responds with explanation
Time: 2-5 seconds
```

**Test Gemini Search:**
```
Prompt: "What's the latest AI news?"
Expected: Search results + Gemini analysis with sources
Time: 3-8 seconds
```

**Test Document Analyzer:**
1. Select a PDF or image from your device
2. Prompt: "Summarize this"
3. Expected: Document summary
4. Time: 2-5 seconds

**Test Web Search:**
```
Prompt: "Search for Python documentation"
Expected: Links and brief summaries
Time: 1-2 seconds
```

## Troubleshooting Installation

### Problem: "Skill execution failed"

**Solutions (try in order):**
1. Delete the skill and re-import
2. Restart the Edge Gallery app
3. Ensure SKILL.md is in the root of the folder
4. Check Android storage permissions
5. Try importing a different skill to isolate the issue

### Problem: "Can't find local skill option"

**Solutions:**
1. Make sure you're in **Manage Skills** dialog
2. Look for the blue **"+"** button (may be bottom right)
3. If it's not there, tap the **"Skills"** chip to open dialog
4. Restart app if still not visible

### Problem: "File picker doesn't show my files"

**Solutions:**
1. Grant file access permission to Edge Gallery:
   - Settings → Apps → Edge Gallery → Permissions → Files
2. Ensure files are on internal storage (not SD card)
3. Move skills folder to: `/storage/emulated/0/[foldername]/`

### Problem: "Import succeeds but skill doesn't work"

**Solutions:**
1. Make sure you have internet connection
2. Wait 5-10 seconds before using (first initialization can be slow)
3. Try closing app and reopening
4. Check your Gemini API key is correct
5. Verify you have API quota remaining

### Problem: "API key error on first use"

**Solutions:**
1. Go to https://aistudio.google.com/apikeys
2. Verify the key is still valid (hasn't been revoked)
3. Copy key again and paste carefully (no extra spaces)
4. If key is invalid, create a new one
5. Delete skill and re-import to re-enter key

### Problem: "Free tier quota exceeded"

**Solutions:**
1. Free tier is **500 requests per day** (shared across all Gemini skills)
2. Usage resets at **midnight UTC**
3. To continue, either:
   - Wait for quota reset
   - Upgrade to paid plan at https://aistudio.google.com/billing
   - Use only `google-web-search` which has unlimited quota

### Problem: "Skills folder not found after restart"

**Solutions:**
1. Skills are stored separately from imported files
2. You can delete the original downloaded folder after import
3. Edge Gallery keeps an internal copy
4. To reinstall, just re-import from backup

## Uninstalling a Skill

If you want to remove a skill:

1. Open **Manage Skills** dialog
2. Find the skill you want to remove
3. Tap **"View"** or the three dots **⋯**
4. Tap **"Delete"**
5. Confirm deletion

**Note:** Deleting from Edge Gallery doesn't delete the files on your storage.

## Updating Skills

If there's a new version:

1. Download the new version from GitHub
2. Delete the old skill in Edge Gallery
3. Re-import the new skill folder
4. Re-enter API key if prompted

## Advanced: Manual Installation (No GUI)

If the import dialog isn't working, you can manually place files:

1. Copy skill folder to: `/sdcard/Android/data/com.google.edgegallery/skills/`
2. Restart Edge Gallery app
3. Skills should appear in Manage Skills

(Adjust path if your device uses different storage path)

---

## Next Steps

1. Read **QUICK_START.md** for usage examples
2. Check **SKILLS_OVERVIEW.md** for skill comparison
3. Look at individual skill **USAGE_GUIDE.md** files
4. Start prompting! 🚀

## Getting Help

- **GitHub Issues:** https://github.com/ankitnegialt/gemini-api-skill/issues
- **Edge Gallery Help:** https://support.google.com/edge-gallery
- **Gemini API Docs:** https://ai.google.dev/docs
- **Edge Gallery Docs:** https://developer.google.com/edge-ai/edge-gallery

---

**You're all set! Happy using! 🎉**
