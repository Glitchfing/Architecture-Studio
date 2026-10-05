# BY TANVI — Architecture Studio (React + Vite + three.js)

    npm install
    npm run dev       # http://localhost:5173
    npm run build     # production build -> /dist

## How Tanvi uploads her work
1. Scroll to the footer → **Edit studio** (or any “＋ Upload” button) → enter the key (default `tanvi`, change it in `src/config.js`).
2. “＋ Upload” buttons and dashed tiles appear on Work, Models, Sketchbook, Materials, Thinking, About (photo) and inside each project.
3. Choose image → drag/zoom to crop into the frame → write the description (projects also take site analysis: wind, sun, climate, context, concept) → **Preview** → **Save to website**.
4. The newest 3 projects hang in the 3D studio's wall frames; the newest sketches appear on the wall and desk.

## Important
Uploads are stored in the browser (IndexedDB) of the device used to upload. Visitors on other devices will NOT see them yet.
To make uploads public for everyone, connect `src/store.js` to a backend (Firebase / Supabase storage + database) — only that one file needs replacing.

## Structure
    src/config.js            contact details, nav, services, materials, form fields
    src/store.js             persistence hooks (useCollection, useKV)
    src/components/Studio.jsx   interactive 3D room (every object routes to a page)
    src/components/Uploader.jsx upload -> crop -> preview -> save
    src/components/Common.jsx   nav, footer, tilt, lightbox, helpers
    src/pages/*              Home, Work (+project page), Sketchbook, Materials, Thinking, Services, Book, About, Contact
    src/styles/global.css    palette (brick, moss, clay, cream), layout, responsive
