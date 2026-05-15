# Gen4 Manufacturing – Document Management Portal

A real-time document management web portal for Gen4 Manufacturing Pvt. Ltd.

---

## 1. Clone and Run Locally

```bash
git clone <your-repo-url>
cd gen4-portal
npm install
cp .env.example .env   # then fill in Firebase values (see step 2)
npm run dev
```

Open http://localhost:5173/gen4-docs/

---

## 2. Firebase Setup (step by step)

### 2a. Create a Firebase project
1. Go to https://console.firebase.google.com → **Add project** → name it (e.g. `gen4-portal`)
2. Disable Google Analytics (optional) → **Create project**

### 2b. Enable Firestore
1. In the Firebase console sidebar: **Build → Firestore Database**
2. Click **Create database** → choose **Start in test mode** (allows open read/write)
3. Pick a region (e.g. `asia-south1`) → **Done**

### 2c. Enable Firebase Storage
1. Sidebar: **Build → Storage**
2. Click **Get started** → **Start in test mode** → choose the same region → **Done**

### 2d. Register a Web App
1. Sidebar: **Project Overview** → gear icon → **Project settings**
2. Scroll to **Your apps** → click **</>** (web)
3. App nickname: `gen4-portal-web` → **Register app**
4. Copy the `firebaseConfig` object values

### 2e. Fill in `.env`
Open `.env` and replace placeholders with your actual values:
```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=gen4-portal.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=gen4-portal
VITE_FIREBASE_STORAGE_BUCKET=gen4-portal.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456:web:abc123
```

### 2f. Firestore security rules (open access for internal team)
In Firebase console → **Firestore → Rules**, paste:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
Click **Publish**.

### 2g. Storage security rules
In Firebase console → **Storage → Rules**, paste:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```
Click **Publish**.

---

## 3. Deploy to GitHub Pages

### 3a. Create a GitHub repo
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/gen4-docs.git
git push -u origin main
```

### 3b. Add Firebase secrets to GitHub
Go to your repo → **Settings → Secrets and variables → Actions → New repository secret**
Add each key from your `.env` file as a separate secret (same names: `VITE_FIREBASE_API_KEY`, etc.)

### 3c. Enable GitHub Pages
Go to **Settings → Pages → Source** → select **Deploy from a branch** → choose `gh-pages` branch → **Save**

### 3d. Trigger first deploy
Push any commit to `main`. The Actions workflow will build and deploy automatically.

Your portal will be live at:
```
https://YOUR_USERNAME.github.io/gen4-docs/
```

---

## 4. Add the Company Logo

1. Copy your `logo_TM.jpg` file into the `public/` folder:
   ```
   gen4-portal/
   └── public/
       └── logo_TM.jpg   ← place it here
   ```
2. The logo will automatically appear in the sidebar and browser tab.

---

## 5. Share the URL with Your Team

Once deployed, share this URL with all team members:
```
https://YOUR_USERNAME.github.io/gen4-docs/
```
- No login required — the portal is open access (internal team tool)
- Any document uploaded by one team member appears in real-time for everyone else
- Works on desktop and mobile browsers
