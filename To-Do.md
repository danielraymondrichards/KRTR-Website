# KRTR CMS Integration To-Do

Integrate the following third-party services to make the CMS fully functional.

---

## 🔐 Clerk (Authentication & Users)

- [X] Install Clerk:
  ```bash
  npm install @clerk/nextjs
  ```
- [X] Set up Clerk project & add environment variables:
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
- [X] Wrap app with `<ClerkProvider>` in `middleware.ts` or `layout.tsx`
- [X] Add sign-in/sign-up UI (`<SignIn />`, `<SignUp />`)
- [X] Protect CMS routes using Clerk's `authMiddleware` or `<SignedIn>` wrappers
- [X] Replace static Admin Panel with Clerk user data via API
- [X] Implement user creation & password reset via Clerk dashboard or API

---

## 🗃 Supabase (Database + Storage)

- [X] Install Supabase client:
  ```bash
  npm install @supabase/supabase-js
  ```
- [X] Create tables:
  - `stories` (id, author, title, tease, text, image_url, video_url, created_at)
  - `ads` (type: 'HS' | 'TS' | 'SP', url)
  - `assignments` (hero_story_id, top_story_ids[])
- [X] Add Supabase env vars:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [X] Connect Supabase in CMS pages:
  - `ads/page.tsx` → CRUD ad URLs
  - `assignments/page.tsx` → assign stories
  - `stories/new.tsx`, `edit.tsx` → create/edit stories
  - `stories/page.tsx` → list stories

---

## 🎥 Mux (Video Hosting)

- [X] Create Mux account & access token
- [X] Install Mux SDK (optional):
  ```bash
  npm install @mux/mux-node
  ```
- [ ] Build secure upload endpoint or use dashboard to upload
- [ ] Store Mux playback ID or URL in Supabase
- [ ] Add Mux preview/player in story builder/editor

---

## 🖼 Cloudinary (Image Hosting)

- [X] Create Cloudinary account, note cloud name + API key/secret
- [X] Install SDK if needed:
  ```bash
  npm install cloudinary
  ```
- [ ] Implement upload component or allow direct URL input
- [ ] Store image URL in Supabase `image_url`
- [ ] Show previews in CMS and front-end as needed

---

## 🧪 Optional Enhancements

- [ ] Add form validation (e.g. Zod or native)
- [ ] Add loading/saving UI feedback
- [ ] Add optimistic UI updates
- [ ] Enable role-based access using Clerk