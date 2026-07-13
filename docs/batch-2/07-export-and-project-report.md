# Batch 2 Prompt 7 — Export dan Persistensi Proyek

## Arsitektur ekspor

Semua format memakai `IDN-EXPORT-v2` melalui `MapExport.buildExportSpec`. Spesifikasi menyimpan fitur, legenda, metadata, cakupan, bounds, ukuran, transparansi, versi boundary/registry, dan atribusi wajib. SVG, PNG, dan PDF dibangun dari SVG yang sama sehingga warna, label, metadata, dan legenda tidak memiliki jalur rendering yang saling bertentangan.

Format yang tersedia:

- SVG dan PNG untuk rasio 16:9, 4:3, A4, A3, square, serta tampilan peta.
- PDF A4/A3 landscape. PDF menggunakan raster JPEG lokal yang ditanam ke PDF minimal; ini sengaja didokumentasikan sebagai fallback aman, bukan PDF vektor.
- CSV mapping deterministik yang memuat row ID/nomor, teks sumber, provinsi/kode, canonical ID, nama cocok, status/method, koreksi, nilai/kategori, kelas/warna visualisasi, serta versi boundary/registry.

Cakupan `Seluruh Indonesia` dan `Tampilan peta saat ini` dipilih secara eksplisit. Filename diubah menjadi slug aman; teks pengguna di-escape sebagai teks, bukan HTML/SVG.

## Metadata

Judul, subjudul, sumber angka pengguna, periode, catatan kaki, judul legenda, dan nama file dibatasi panjangnya, disimpan lokal, dan dipakai lintas format. Atribusi boundary tetap otomatis dan tidak dapat dihapus melalui field pengguna.

## Persistensi

Project JSON tetap schema `1.1` agar proyek Batch 1 dapat dibuka. Field baru yang aman dan backward-compatible mencakup `exportMeta`, `visualization`, `workflowStage`, `uiMode`, dan `importRows` yang dibatasi 2.000 baris. Sanitizer menolak struktur berbahaya, membatasi panjang teks, memvalidasi warna, dan menghapus visualisasi/metadata yang tidak sah tanpa menghapus highlight lama. Autosave tetap berada di localStorage; migrasi IndexedDB ditunda sampai ukuran proyek nyata memerlukannya.

## Bukti pengujian

- Unit suite: 30/30 lulus, termasuk lima metode visualisasi dan round-trip field proyek baru.
- Smoke/regresi SVG, PNG, dan visualisasi: lulus.
- PDF A3, mapping CSV, metadata escaping, extent nasional, dan filename slug: lulus.
- Mapping CSV meng-escape awalan formula (`=`, `+`, `@`, `-`) dan tidak menghilangkan baris unresolved.
- PDF tidak memuat dependency/CDN baru; startup tidak memuat library PDF atau visualisasi (mesin visualisasi tetap lazy-loaded).

## Batasan format

- PDF saat ini raster sehingga teks tidak selectable dan detail sangat tinggi membutuhkan memori lebih besar.
- XLSX mapping export belum ditambahkan karena tidak ada writer lokal yang telah disetujui tanpa menambah dependency besar.
- Penyimpanan proyek besar masih menggunakan localStorage dengan batas baris; IndexedDB menjadi pekerjaan lanjutan bila workflow mulai menyimpan dataset besar secara penuh.
