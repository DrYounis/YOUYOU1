# 🌍 Younis World (`younis.world`)

Welcome to the ultimate, unified source code for **Younis World**! 
This repository (`YOUYOU1`) houses the entire modern Next.js learning ecosystem as well as the classic legacy interactive HTML games.

## 📁 Repository Structure

```
YOUYOU1/ (formerly younis-adventures)
├── app/                  # Next.js 14 App Router (Modern Pages)
│   ├── page.js           # The Main Home Page
│   ├── practice/         # Interactive Trace & Write Tools
│   └── ... 
├── components/           # Reusable React components (Navbar, TracingPad)
├── public/               # Static assets
│   ├── assets/           # Unified images (.png, .jpg) & PDFs 
│   └── legacy/           # Original interactive HTML apps (index.html, science-study, etc)
└── README.md             # This documentation
```

---

## 🚀 Running Locally

To spin up the modern development environment and view the site locally:

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.

---

## 🗃️ Legacy Awael Apps

In April 2026, the original `YOUNIS STUDY` static repository was gracefully merged into this Next.js project. 
All legacy Vanilla JS applications (like the `index.html` phonics engine or `arabic-writing.html`) have been moved into:
**`public/legacy/`**

They are seamlessly served by Next.js as static routes. If you need to edit the old question bank arrays, edit them inside `public/legacy/index.html`. 

---

## 📚 Adding New Study Material

When adding new study content (notes, exams, quizzes, or any learning resource) ensure you follow this standard process to maintain the codebase:

### 1. Add to Header Navigation
- Place your new page component in `app/` (Next.js) or HTML file in `public/` (Legacy).
- Edit `components/Navbar.js`
- Add a new `<Link href="/new-topic">New Topic</Link>` under the **Study & Practice** Dropdown.
- Keep alphabetical or logical order.

### 2. Link from Study Hub Page
- Open the `/exams` page (or full `/study` hub after refactor).
- Add a new card/link in the appropriate section:
  - 📚 Exams → `/new-exam`
  - 📝 Notes → `/new-notes`
  - ✅ Quizzes → `/new-quiz`

### 3. Cross-Link with Related Pages
- If content relates to Naskh → add link on the Naskh page.
- If content relates to English Notebook → add a link there.
- If general study → strictly link from the Study Hub only.

### 4. Update This List
- Add the new page name and URL to the table below to track it.

| Page Name | URL | Category |
|-----------|-----|----------|
| Home | `/` | Main |
| Naskh | `/practice/naskh` | Study |
| English Notebook | `/practice/english-notebook` | Study |
| Exams | `/exams` | Study Hub |
| Classic Main Apps | `/legacy/index.html` | Legacy Study |
| (add yours) | `/your-page` | (your category) |

---

## 🌐 Deployment (`younis.world`)

This project is actively linked to **Vercel**. 
Any changes pushed to the `main` branch of this GitHub repository will automatically trigger a new Vercel build.

```bash
git add -A
git commit -m "update: your message"
git push
```

**Note:** Builds take approximately 1-3 minutes. If you encounter a `404 NOT_FOUND` immediately after pushing, wait 2 minutes and refresh!
