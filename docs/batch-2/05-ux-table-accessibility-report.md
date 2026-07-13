# Batch 2 Prompt 5 — UX, Tabel Data, dan Keterkaitan Peta

## Ringkasan perubahan

Studio sekarang memperlihatkan alur `Input → Match → Visualize → Export` melalui stepper yang dapat dipilih. Tahap yang belum dapat dikerjakan memberi alasan singkat, sehingga pengguna pemula tidak perlu menebak tindakan berikutnya. Mode Dasar menjadi default; Mode Lanjutan mempertahankan pilihan dan data yang sama.

Data yang telah diterapkan disimpan sebagai baris lokal dengan `rowId` stabil. Tabel Data Anda menyediakan pencarian, pengurutan, status kecocokan, wilayah/provinsi sumber, wilayah kanonik, nilai/kategori, serta pemilihan keyboard. Baris yang cocok dapat dipilih untuk memperbesar wilayah di peta. Klik wilayah di peta memilih baris pertama yang cocok; bila tidak ada baris data, peta tidak membuat pilihan palsu dan mengumumkan alasannya.

Pada layar sempit, area peta ditempatkan sebelum panel kontrol agar hasil tetap dapat dijangkau tanpa melewati sidebar panjang. Tabel menggunakan scroll horizontal terkontrol dan batas render 200 baris per tampilan; pencarian tetap mencakup seluruh dataset tersimpan. Tidak ada dependensi grid berat atau pengiriman data ke server.

## Keputusan aksesibilitas

- Stepper memakai tombol dengan `aria-current` dan status tahap `aria-live`.
- Tabel memakai caption, header `scope`, baris fokus keyboard, `Enter`/`Space`, dan pengumuman pemilihan.
- Status baris dibedakan dengan teks dan chip, bukan warna saja.
- Fokus tidak dipindahkan secara paksa ketika peta memilih baris.
- Ukuran kontrol mengikuti target sentuh minimum yang telah ada pada aplikasi.
- Pemeriksaan axe halaman utama tidak menemukan pelanggaran serius/kritis.

## Bukti pengujian

- Unit suite Batch 2: 25/25 lulus.
- Smoke desktop/regresi sebelumnya: 7/7 lulus.
- Skenario baru workflow, tabel dua arah, filter, mode Dasar/Lanjutan: lulus.
- Skenario mobile: peta berada sebelum panel kontrol dan tetap terlihat: lulus.
- Pemeriksaan aksesibilitas otomatis halaman utama: lulus tanpa pelanggaran serius/kritis.
- Build dist dan allowlist aset: lulus.

## Batasan yang diketahui

- Tabel belum memakai virtualisasi penuh; tampilan dibatasi 200 baris dan pencarian digunakan untuk dataset lebih besar.
- Jika beberapa baris valid menunjuk satu wilayah, tabel memilih baris pertama yang tersimpan dan tidak menggabungkan nilai secara diam-diam.
- Pemilihan wilayah dari peta tidak membuka dialog koreksi; koreksi tetap dilakukan di pratinjau Match.
- Klasifikasi numerik dan legenda deterministik menjadi pekerjaan Prompt 6.
