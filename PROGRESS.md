# Gen4 Document Management Portal — Project Progress

**Project:** Gen4 Manufacturing Document Management Portal  
**Prepared by:** Jeeva  
**Last Updated:** 15 May 2026  
**Status:** Live ✅

---

## Live URLs

| Hosting | URL | Status |
|---|---|---|
| Firebase Hosting | https://gen4-portal.web.app | ✅ Live |
| GitHub Pages | https://jeeva-embedded.github.io/DocVault_Gen4/ | ✅ Live |

> Firebase Hosting is the primary URL to share with the team.  
> GitHub Pages remains active as a backup.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite 5 |
| UI Icons | @tabler/icons-react |
| Database | Firebase Firestore (real-time) |
| File Storage | Google Drive (via Apps Script) |
| Hosting 1 | GitHub Pages (auto-deploy via Actions) |
| Hosting 2 | Firebase Hosting (auto-deploy via Actions) |
| Routing | React Router v6 |

---

## Features Implemented

### Dashboard
- [x] Total Documents, Categories, Downloads, Team Sync stat cards
- [x] Category grid with auto-generated icons from category name
- [x] Recent Documents table (last 6 uploads)

### Documents Page
- [x] Category tabs (Mechanical, Electronics, Software + custom)
- [x] Sub-category tabs with add/remove support
- [x] Real-time search (by name, notes, author)
- [x] Date range filter (From / To)
- [x] Author column (highlighted in blue)
- [x] Modified By column
- [x] Modified Date column
- [x] View, Download, Edit, Delete actions per document
- [x] Direct Drive download (no redirect to Drive page)
- [x] Delete from portal + Google Drive simultaneously

### Upload Page
- [x] Drag & drop + file picker
- [x] Multi-file upload queue with progress bars
- [x] Upload directly to Google Drive via Apps Script
- [x] Category + Sub-category selection
- [x] Author field (required — blocks upload if empty)
- [x] Description/Notes field
- [x] Saves modifiedBy + modifiedDate to Firestore on upload

### Edit Document (DocModal)
- [x] Edit name, category, sub-category, author, notes
- [x] Modified By field (required)
- [x] Auto-saves modifiedDate timestamp on every save

### Sidebar
- [x] Toggle open/close on desktop and mobile (hamburger button)
- [x] Close button (×) always visible inside sidebar
- [x] Collapsible category tree with sub-category links
- [x] Add / Edit / Delete custom categories
- [x] Add custom sub-categories per category

### Categories
- [x] Built-in: Mechanical, Electronics, Software (with General, QC, IQC subs)
- [x] Custom categories — name only, icon auto-generated from keyword matching
- [x] Sub-categories stored in Firestore (subSettings collection)

### Google Drive Integration
- [x] Upload via Google Apps Script (base64 → Drive)
- [x] Direct download URL construction from Drive file ID
- [x] Delete from Drive on document delete
- [x] 90-second upload timeout with clear error messages

### Deployment
- [x] GitHub Actions auto-deploy to GitHub Pages on every push to main
- [x] GitHub Actions auto-deploy to Firebase Hosting on every push to main
- [x] All Firebase secrets stored as GitHub repository secrets
- [x] Dynamic base path — same codebase builds for both hosts
- [x] SPA routing fix (404.html redirect for GitHub Pages)
- [x] Firebase Hosting rewrites all routes to index.html

---

## GitHub Repository

**Repo:** https://github.com/Jeeva-Embedded/DocVault_Gen4  
**Branch:** main  
**CI/CD:** GitHub Actions (two workflows)

### Workflows
| Workflow | File | Trigger |
|---|---|---|
| Deploy to GitHub Pages | `.github/workflows/deploy.yml` | Push to main |
| Deploy to Firebase Hosting | `.github/workflows/firebase-deploy.yml` | Push to main |

### GitHub Secrets Required
| Secret | Purpose |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase config |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase config |
| `VITE_FIREBASE_PROJECT_ID` | Firebase config |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase config |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase config |
| `VITE_FIREBASE_APP_ID` | Firebase config |
| `VITE_APPS_SCRIPT_URL` | Google Apps Script endpoint for Drive upload/delete |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase Hosting deployment auth (service account JSON) |

---

## Firebase Project

**Project ID:** gen4-portal  
**Console:** https://console.firebase.google.com/project/gen4-portal  
**Firestore:** Enabled (asia-south1 region)  
**Hosting:** Enabled → gen4-portal.web.app

### Firestore Collections
| Collection | Purpose |
|---|---|
| `documents` | All uploaded document records |
| `categories` | Custom category definitions |
| `subSettings` | Sub-categories per category |

---

## Commit History

| Commit | Description |
|---|---|
| `41c92f4` | Add Firebase Hosting deployment alongside GitHub Pages |
| `1c0b4e5` | Add date filter, author/modified-by tracking, sidebar toggle |
| `2befc7d` | Fix dashboard to use auto-generated category icons |
| `9b81c86` | Auto-generate category icon from name; remove icon input field |
| `2fe4c6b` | Fix download to use direct Drive URL; fix Drive delete secret |
| `9fe08df` | Add VITE_APPS_SCRIPT_URL to build env for Drive delete |
| `ec061cd` | Add 404.html for SPA routing on GitHub Pages |
| `e0f2218` | Fix base path for GitHub Pages deployment |
| `4d812a8` | Initial commit — Gen4 Document Management Portal |

---

## Pending / Future Improvements

- [ ] User authentication (restrict access to team members only)
- [ ] Email notifications on new uploads
- [ ] Document version history
- [ ] Bulk download / bulk delete
- [ ] Admin panel for managing users and permissions
- [ ] Mobile app (PWA)
