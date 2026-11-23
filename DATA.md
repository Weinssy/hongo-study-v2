# Catatan Sumber & Lisensi Dataset

Dataset Fase 1 hidup di `data/kana.ts` dan `data/vocab.ts`. File ini mencatat
dari mana isinya berasal dan dasar lisensinya, sesuai catatan outline Fase 1
("cek lisensi sumber daftar N5").

## Kana (`data/kana.ts`)

- Isi: 46 hiragana + 46 katakana dasar (tabel gojuuon), romaji Hepburn.
- Sifat: karakter kana dan tabel gojuuon adalah **fakta dasar bahasa**
  (domain publik) — bukan karya berhak cipta. Romaji mengikuti sistem
  Hepburn standar.
- Acuan silang bentuk & urutan: tabel kana di Wikipedia ("Kana",
  CC BY-SA) dan tabel gojuuon standar di buku teks mana pun.

## Kosakata N5 (`data/vocab.ts`)

- Isi: 100 kata inti yang umum muncul di daftar kosakata JLPT N5
  (kata benda tempat/benda/alam/waktu, kata sifat dasar, kata kerja dasar).
  Ini **pilihan 100 kata inti**, bukan seluruh daftar N5 (±800 kata).
- Catatan lisensi penting: JLPT diselenggarakan Japan Foundation/JEES dan
  **tidak ada daftar kosakata N5 resmi yang diterbitkan** — daftar "N5" yang
  beredar adalah kompilasi pihak ketiga. Kata-kata itu sendiri adalah fakta
  bahasa (satu kata + bacaan + arti tidak dilindungi hak cipta).
- Yang ditulis sendiri untuk project ini: seluruh arti Bahasa Indonesia dan
  seluruh contoh kalimat + terjemahannya (bukan salinan dari situs daftar
  kosakata mana pun).
- Acuan silang pemilihan kata: kompilasi kosakata N5 yang umum dipakai
  pembelajar (mis. daftar JLPT Sensei / Nihongo Ichiban) — dipakai hanya
  untuk memastikan kata yang dipilih memang lazim di level N5, bukan untuk
  menyalin teksnya.

## Aturan ke depan

- Jangan menyalin contoh kalimat, definisi panjang, atau audio dari situs
  kompilasi komersial ke dataset ini.
- Bila nanti mengimpor dataset besar (mis. dari JMdict/EDICT, CC BY-SA,
  atau Tatoeba, CC BY), catat sumber + lisensinya di file ini sebelum impor.
