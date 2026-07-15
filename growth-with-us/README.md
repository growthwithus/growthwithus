# Growth With Us 🌱

Website closed agency bertema kebun sayur. Multi-page statis (HTML/CSS/JS biasa, tanpa framework/build step), backend pakai Firebase (Firestore + Authentication).

## Struktur file
```
index.html        -> Konsep/tentang
caretakers.html    -> Profil 3 admin (farmers)
rules.html         -> Rules & How to Join
members.html       -> Cek username -> ID card (locked kalau belum terdaftar)
qna.html           -> Form QnA anonim (kirim doang, gak bisa dibaca publik)
admin.html         -> Login admin + kotak QnA + kelola member
css/style.css      -> Semua styling
js/firebase-config.js -> Config Firebase (WAJIB diisi sendiri)
js/members.js, qna.js, admin.js -> Logic tiap halaman
```

## 1. Setup Firebase (sekali aja)

1. Buka https://console.firebase.google.com, buat project baru (gratis, pakai plan Spark).
2. Di project, aktifkan **Firestore Database** (mode production).
3. Aktifkan **Authentication** > sign-in method **Email/Password**.
4. Di Authentication > Users, buat 3 akun manual untuk kalian bertiga (email + password masing-masing). Ini yang dipakai buat login ke `admin.html`.
5. Buka Project Settings > General > scroll ke "Your apps" > tambah **Web app**. Copy config yang muncul (`apiKey`, `authDomain`, dst).
6. Paste config itu ke `js/firebase-config.js`, ganti semua nilai `"GANTI..."`.

## 2. Firestore Security Rules

Buka Firestore > Rules, ganti dengan ini:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // QnA: siapa aja boleh kirim (create), tapi cuma admin yang login
    // yang boleh baca/edit/hapus.
    match /questions/{qid} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }

    // Members: siapa aja boleh cek 1 username spesifik (get),
    // tapi TIDAK BOLEH lihat daftar semua member (list).
    // Cuma admin yang login yang boleh nulis/list/hapus.
    match /members/{username} {
      allow get: if true;
      allow list: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

Ini bikin QnA beneran anonim & cuma admin yang bisa baca, dan member cuma bisa cek username mereka sendiri (nggak bisa lihat daftar semua member).

## 3. Cara pakai alur Member (locked -> ID card)

1. Kalau ada yang lolos seleksi form, buka `admin.html`, login.
2. Di bagian "Tambah/Update Member", isi username persis sama yang bakal dipakai orang itu buat cek di `members.html`, lalu isi nama sayur/benih, jenis, dll.
3. Simpan. Orang itu sekarang bisa buka `members.html`, ketik usernamenya, dan ID card-nya langsung muncul.
4. Kalau usernamenya nggak terdaftar/salah ketik, otomatis muncul pesan "belum terverifikasi".

## 4. Edit konten

Semua teks (konsep, nama caretakers, rules, dll) langsung diketik di file HTML masing-masing — cari bagian yang ditandai `[Nama Panggilan]` atau komentar "ganti sesuai kalian". Nggak perlu coding, tinggal edit teks di dalam tag HTML.

## 5. Hosting (gratis)

**Opsi A — Netlify:**
1. Daftar di netlify.com.
2. Drag & drop folder ini ke halaman "Deploy manually", atau hubungkan ke GitHub repo.
3. Selesai, dapat link `namakalian.netlify.app` (bisa custom domain juga).

**Opsi B — GitHub Pages:**
1. Buat repo baru di GitHub, upload semua file ini.
2. Masuk Settings > Pages > pilih branch `main` folder `/root`.
3. Link jadi `username.github.io/nama-repo`.

Karena semua file di sini murni HTML/CSS/JS statis, keduanya tinggal upload-jadi, tanpa proses build.

## Catatan desain
- Font judul & UI: **Baloo 2** (rounded, playful, gampang dibaca). Body text: **Karla** (simple, netral). Aksen tulisan tangan: **Caveat**, dipakai seperlunya aja (tagline, quote) biar nggak berlebihan.
- Warna: hijau daun, kuning matahari, putih krem, coklat tanah — cerah tapi tetap kalem.
- Nav berbentuk "papan kayu" ala label kebun, kartu konten berbentuk "seed packet" dengan garis putus-putus.
