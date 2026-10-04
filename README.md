# Vérisme Masterclasses & Lyric Atelier

Official website for **Abdellah Lasri** — European Lead Tenor, Vocal Coach, and Ear-First Somatic Pedagogy.

---

## 🚀 How to View & Deploy on GitHub Pages

If you pushed this repository to GitHub and the page is blank or not showing, here is how to make it work in 30 seconds:

### Step 1: Enable GitHub Actions for Pages
1. Go to your GitHub repository in your web browser.
2. Click on **Settings** (top menu bar of the repo).
3. In the left sidebar, click **Pages**.
4. Under **Build and deployment** → **Source**, change the dropdown to **GitHub Actions**.
5. Save or refresh.

### Step 2: Automatic Build & Publish
- A ready-to-use GitHub Actions workflow is already included in `.github/workflows/deploy.yml`.
- Every time you push a commit to `main` (or `master`), GitHub will automatically:
  1. Install dependencies (`npm install`)
  2. Build the production site (`npm run build`) with relative paths (`base: './'`)
  3. Deploy the site live to `https://<your-username>.github.io/<your-repo>/`

---

## 💻 Local Development

To run this site on your computer:

```bash
# 1. Install dependencies
npm install

# 2. Start the local development server
npm run dev

# 3. Build for production (outputs to /dist)
npm run build

# 4. Preview the production build locally
npm run preview
```

---

## ✨ Features
- **Bilingual Support**: German 🇩🇪 & English 🇬🇧 with persistent local storage.
- **Somatic & Ear-First Pedagogy**: Audio demonstration of harmonic tension and resolution.
- **Tailored Tracks**: Specialized guidance for Voice Students, Music Producers, and Listeners.
- **French Repertoire & Diction**: Opera role coaching, mélodie duo coaching, and the one-time speech anatomy / IPA intensive.
- **Video & Photo Galleries**: Responsive media vault with YouTube embed player and full-screen lightbox.
- **Audition & Lesson Inquiry Form**: Direct contact with Netlify Forms integration.
