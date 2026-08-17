# Product Requirements Document (PRD)

## Portfolio Website 3D Interaktif — AI Vibe Coding Edition

**Dokumen Versi:** 1.0
**Tanggal:** 13 Agustus 2026
**Tools Pengembangan:** Antigravity (AI Vibe Coding) — Claude Opus 4.8, Claude Sonnet 5, Gemini 2.5 Pro, Gemini 2.5 Flash
**Target:** Website Portofolio Personal dengan Elemen 3D Interaktif

\---

## 1\. Ringkasan Proyek (Executive Summary)

Website portofolio personal yang menampilkan profil, proyek, sertifikat, tech stack, dan portal berita/informasi, dengan elemen visual 3D interaktif, animasi carousel/swipe, dukungan multi-bahasa, dan mode tema gelap/terang. Seluruh konten dikelola melalui admin panel (CMS-like) berbasis Laravel Filament, sementara tampilan publik dibangun dengan React + TypeScript untuk performa dan interaktivitas tinggi.

**Tujuan utama:**

* Menyajikan portofolio profesional yang dinamis dan mudah di-update tanpa coding ulang (semua section bersifat CRUD).
* Memberikan pengalaman visual premium (3D, animasi, carousel) yang membedakan dari portofolio statis pada umumnya.
* Mendukung audiens multi-bahasa (EN/ID/ZH) dan aksesibilitas lintas perangkat.

\---

## 2\. Tech Stack

|Layer|Teknologi|
|-|-|
|Backend Framework|Laravel (versi terbaru LTS)|
|Admin Panel / CMS|Laravel Filament|
|Frontend Framework|React JS + TypeScript|
|Database|MySQL|
|UI Component Library|Shadcn/ui|
|Komponen Tambahan|21st.dev (21st.dev components)|
|3D Rendering|React Three Fiber + drei (di atas Three.js)|
|Animasi Carousel|Swiper.js|
|Animasi Umum|Framer Motion (untuk hover, transisi, scroll reveal)|
|State Management (FE)|Zustand atau React Query (untuk data fetching dari API Laravel)|
|API Layer|Laravel REST API (Sanctum untuk auth admin)|
|Styling|Tailwind CSS (basis dari Shadcn)|

**Arsitektur:** Laravel sebagai backend + REST API + Filament admin panel (server-rendered, terpisah dari frontend publik). React TS sebagai SPA/frontend publik yang mengonsumsi API Laravel. Disarankan struktur **decoupled/headless**: `laravel-backend/` (API + Filament) dan `react-frontend/` (Vite + React TS).

\---

## 3\. Arahan Desain Visual (Design System)

### 3.1 Tipografi (Font)

Rekomendasi kombinasi font yang cocok untuk portofolio developer bernuansa modern/tech dengan elemen 3D:

|Fungsi|Font|Alasan|
|-|-|-|
|Heading / Display|**Space Grotesk** atau **Clash Display**|Karakter geometris, modern, terkesan teknikal — cocok untuk hero title 3D|
|Body Text|**Inter** atau **Plus Jakarta Sans**|Sangat readable di berbagai ukuran layar, netral, profesional|
|Code / Aksen Teknikal|**JetBrains Mono**|Untuk badge tech stack, label kategori, angka statistik (Count Skills Project)|

### 3.2 Palet Warna

**Dark Mode (default, cocok untuk nuansa 3D/futuristik):**

* Background utama: `#0A0A0F` (hampir hitam, sedikit navy)
* Background surface/card: `#13131A`
* Border/divider: `#22222C`
* Teks utama: `#F5F5F7`
* Teks sekunder: `#A1A1AA`
* Aksen primer (gradient): `#8B5CF6` → `#22D3EE` (violet ke cyan, untuk glow effect di bawah card)
* Aksen sekunder: `#F59E0B` (amber, untuk highlight/CTA)

**Light Mode:**

* Background utama: `#FAFAFA`
* Background surface/card: `#FFFFFF`
* Border/divider: `#E4E4E7`
* Teks utama: `#18181B`
* Teks sekunder: `#52525B`
* Aksen primer: tetap `#8B5CF6` → `#22D3EE` (konsisten brand di kedua mode)
* Aksen sekunder: `#D97706`

**Catatan animasi glow:** efek "cahaya di bawah card saat hover" menggunakan `box-shadow` radial dengan warna aksen primer (opacity rendah di light mode, lebih terang di dark mode), dikombinasikan dengan `translateY(-8px)` pada hover via Framer Motion.

\---

## 4\. Modul \& Fitur (Functional Requirements)

Setiap modul di bawah ini dikelola penuh via **Laravel Filament Admin Panel** (CRUD) dan ditampilkan di frontend React via REST API.

### 4.1 Hero Section

* CRUD Foto/Gambar Hero (upload image, bisa untuk background atau elemen 3D asset)
* CRUD Title Hero (headline utama)
* CRUD About/Subtitle Hero (deskripsi singkat)
* **FE:** area hero dengan elemen 3D interaktif (React Three Fiber) sebagai centerpiece, teks headline dengan animasi entrance (fade + slide).

### 4.2 Section About Me

* CRUD Deskripsi About Me (rich text)
* CRUD Statistik/Counter: Project Completed, Certifications, Years Experience (angka + label, animasi count-up saat masuk viewport)

### 4.3 Section Projects

* CRUD Project: Gambar Project, Nama Project, Deskripsi Project, Tech Stack yang digunakan (relasi many-to-many ke tabel Technology)
* Field tambahan disarankan: link demo, link repository, status (featured/tidak)
* **FE:** ditampilkan sebagai card dalam carousel Swiper, hover → geser vertikal + glow

### 4.4 Section Tech Stack / Skills

* CRUD Technology (nama, logo/icon, kategori)
* CRUD Kategori Stack: Languages Programming, Frameworks, Database Tools, Other Tools (relasi one-to-many: 1 kategori punya banyak technology)
* **FE:** grid/grouped by kategori, dengan tab atau accordion filter per kategori

### 4.5 Section Language Skills

* CRUD Logo Language (bendera/icon bahasa)
* CRUD Foto Language (opsional, foto pendukung)
* CRUD Name Language
* CRUD Description Language (level kemampuan/deskripsi)
* **FE:** card carousel Swiper dengan hover animation yang sama

### 4.6 Section Certificates

* CRUD Image Certificate
* CRUD Name Certificate
* CRUD Description Certificate
* Field tambahan disarankan: issuer, tanggal terbit, link verifikasi
* **FE:** card carousel Swiper

### 4.7 Portal Berita / Informasi (News/Information)

* CRUD Foto Berita
* CRUD Nama/Judul Berita
* CRUD Deskripsi Singkat Berita
* CRUD Detail/Isi Berita (halaman detail terpisah, rich text/markdown)
* **FE:** list/carousel di homepage + halaman detail dengan routing dinamis (`/news/:slug`)

### 4.8 Section Announcement (Popup Pengumuman)

* CRUD Image Announcement
* CRUD Name/Title Announcement
* CRUD Description Announcement
* CRUD Time Open \& Close (scheduling — popup hanya tampil dalam rentang waktu tertentu)
* **FE:** modal popup muncul otomatis saat load (jika dalam rentang waktu aktif), dengan opsi "jangan tampilkan lagi" (localStorage/cookie)

### 4.9 Navbar

* Responsif \& adaptif: desktop (horizontal, sticky), tablet (condensed), mobile (hamburger menu / drawer)
* Include: menu navigasi, toggle theme, switch bahasa

### 4.10 Theme Switcher

* Toggle Dark Mode / Light Mode
* Persist preference di localStorage, sinkron dengan `prefers-color-scheme` sebagai default awal

### 4.11 Language Switcher

* Switch antara English, Indonesia, Chinese (Mandarin)
* Implementasi: `react-i18next` atau `next-intl` (jika menggunakan Next.js), dengan tombol switch berupa dropdown/flag icon
* Konten dinamis (Project, News, dsb.) sebaiknya punya field multi-bahasa di database (kolom per bahasa atau tabel translation terpisah)

### 4.12 Sistem Card \& Animasi (Cross-cutting Requirement)

Berlaku untuk section: Projects, Certificates, Language Skills, News/Information.

* Layout: card proporsional, grid/carousel per section, dipisahkan komponennya per section (reusable `<Card>` component dengan props berbeda per konteks)
* Carousel: Swiper.js dengan swipe gesture, autoplay opsional, pagination dots
* Hover animation: card bergerak naik (`translateY`) secara vertikal + efek glow/cahaya di bagian bawah card (radial gradient shadow menggunakan warna aksen)

\---

## 5\. Struktur Database (High-Level Entities)

* `users` (admin, Filament auth)
* `hero\_sections` (title, about, image)
* `about\_me` (description, stats: projects\_completed, certifications, years\_experience)
* `projects` (image, name, description) — relasi many-to-many ke `technologies` via `project\_technology`
* `technologies` (name, logo, category\_id) — relasi ke `technology\_categories`
* `technology\_categories` (name: Languages/Frameworks/Database Tools/Other Tools)
* `language\_skills` (logo, photo, name, description)
* `certificates` (image, name, description, issuer, issued\_at)
* `news` / `information\_posts` (image, title, short\_description, detail\_content, slug)
* `announcements` (image, title, description, start\_time, end\_time)
* `translations` (polymorphic, untuk field multi-bahasa) — atau kolom `\_en`, `\_id`, `\_zh` per tabel jika lebih sederhana

\---

## 6\. Non-Functional Requirements

* **Performa:** lazy-load asset 3D dan gambar (React Suspense + `loading="lazy"`), code-splitting per route
* **Responsivitas:** breakpoint mobile-first (Tailwind: `sm`, `md`, `lg`, `xl`)
* **SEO:** meta tag dinamis per halaman (React Helmet / metadata API), penting untuk section News
* **Aksesibilitas:** kontras warna sesuai WCAG AA di kedua tema, keyboard navigation untuk carousel
* **Keamanan:** Laravel Sanctum untuk proteksi endpoint admin, validasi upload file (tipe \& ukuran gambar)

\---

## 7\. Strategi Alokasi Model AI (Antigravity Vibe Coding)

Panduan pembagian tugas ke model AI di Antigravity berdasarkan kompleksitas task, agar efisien dari sisi biaya \& kualitas:

|Task|Model Rekomendasi|Alasan|
|-|-|-|
|Arsitektur sistem awal (struktur folder, skema database, relasi model)|**Claude Opus 4.8**|Reasoning kompleks, perlu konsistensi desain sistem end-to-end|
|Setup Laravel + Filament resource (CRUD generator, migration, policy)|**Claude Sonnet 5**|Kuat untuk kode backend terstruktur, cepat dan akurat untuk boilerplate Laravel|
|Komponen React + TypeScript (termasuk integrasi Shadcn, 21st.dev)|**Claude Sonnet 5**|Konsisten untuk typing TS ketat dan komponen reusable|
|Implementasi 3D (React Three Fiber) \& animasi kompleks (Framer Motion, Swiper custom)|**Gemini 2.5 Pro**|Kuat di reasoning visual/spasial dan debugging animasi WebGL|
|Perbaikan bug kecil, refactor sederhana, penulisan style/CSS iteratif|**Gemini 2.5 Flash**|Cepat \& murah untuk iterasi kecil berulang|
|Review kode \& audit keamanan/performance sebelum deploy|**Claude Opus 4.8**|Reasoning mendalam untuk catch edge case|
|Penulisan konten i18n (terjemahan EN/ID/ZH)|**Gemini 2.5 Flash** atau **Claude Sonnet 5**|Cukup untuk translasi konsisten, biaya rendah|

**Alur kerja disarankan di Antigravity:**

1. Prompt awal ke **Claude Opus** untuk menghasilkan blueprint arsitektur (folder structure, ERD, API contract) dari PRD ini.
2. Breakdown blueprint jadi task-task kecil, eksekusi CRUD backend via **Claude Sonnet**.
3. Eksekusi komponen UI/3D via **Claude Sonnet** (komponen umum) dan **Gemini Pro** (khusus 3D/animasi berat).
4. Iterasi cepat/bugfix pakai **Gemini Flash**.
5. Review akhir \& optimisasi pakai **Claude Opus** sebelum deployment.

\---

## 8\. Milestone Pengembangan (Fase)

|Fase|Cakupan|Estimasi|
|-|-|-|
|Fase 1|Setup project (Laravel + Filament + React TS + MySQL), auth admin|3–5 hari|
|Fase 2|CRUD backend semua modul (Filament resources) + API endpoints|5–7 hari|
|Fase 3|Frontend: Hero, About, Navbar, Theme \& Language switcher|5–7 hari|
|Fase 4|Frontend: Projects, Tech Stack, Language Skills, Certificates (card + carousel + hover animation)|5–7 hari|
|Fase 5|Frontend: News Portal + detail page, Announcement popup|3–4 hari|
|Fase 6|Integrasi elemen 3D (React Three Fiber) di Hero/section terpilih|4–6 hari|
|Fase 7|Testing responsif, optimisasi performa, SEO, deployment|3–5 hari|

\---

## 9\. Kriteria Sukses (Acceptance Criteria)

* Semua 9 section/modul dapat dikelola penuh (Create, Read, Update, Delete) dari admin panel tanpa perlu ubah kode.
* Frontend responsif sempurna di 3 breakpoint utama (mobile, tablet, desktop).
* Dark/light mode berfungsi konsisten di seluruh halaman tanpa flicker.
* Switch bahasa (EN/ID/ZH) mengubah seluruh teks statis \& konten dinamis yang relevan.
* Card di section Projects, Certificates, Language Skills, dan News menggunakan carousel Swiper dengan animasi hover (translateY + glow) yang konsisten.
* Popup Announcement muncul/hilang sesuai jadwal (start\_time/end\_time) yang diatur admin.
* Elemen 3D di Hero section berjalan smooth (≥ 30fps) di perangkat mid-range.

\---

*Dokumen ini dirancang sebagai prompt dasar untuk proses AI vibe coding di Antigravity. Setiap section dapat di-breakdown lebih lanjut menjadi prompt granular per model sesuai tabel Strategi Alokasi Model AI (Bagian 7).*

