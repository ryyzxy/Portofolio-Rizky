# Portofolio Rizky Aulia Hamdan

Website statis: HTML + CSS + sedikit JavaScript, tanpa framework.

## Struktur
- `index.html` : beranda (hero, tentang saya, 7 proyek, kontak)
- `css/style.css` : satu file gaya untuk semua halaman (warna tema di bagian 1)
- `js/main.js` : interaksi (menu aktif, animasi, filter proyek, lightbox galeri)
- `projects/*.html` : 7 halaman detail proyek
- `images/profile.jpg` : foto profil
- `images/projects/` : gambar proyek (`<nama-proyek>-cover.jpg`, `-1.jpg`, `-2.jpg`)

## Yang wajib diganti sebelum online
Cari kata `GANTI` (Ctrl+Shift+F) dan teks berawalan `Isi ...`, lalu ganti:
1. Nomor WhatsApp `6281234567890` -> Replace All (Ctrl+Shift+H)
2. `username-anda` (Instagram & LinkedIn) -> Replace All
3. Semua gambar di `images/` (timpa dengan nama file yang sama)
4. Detail proyek AirNav, Samator, dan Survey LOS TSSR (masih ada teks "Isi ...")

## Daftar file proyek
1. rollout-ftth-purwakarta.html (proyek unggulan, tampil lebar)
2. vsat-bakti.html
3. jakarta-smart-city-cctv.html
4. ftth-fiber-to-the-home.html
5. survey-los-tssr.html
6. airnav-adsb.html
7. migrasi-domain-samator.html

## Kategori filter proyek
Atribut `data-category` di `index.html`: `fiber`, `monitoring`, `survei-it`.
Satu proyek boleh punya dua kategori, contoh: `data-category="fiber monitoring"`.
