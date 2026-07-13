# Metodologi Visualisasi Batch 2

Mesin visualisasi `IDN-VIS-v1` menerima baris impor yang sudah cocok ke wilayah kanonik. Baris kosong, tidak valid, ambigu, duplikat, diabaikan, atau tanpa nilai numerik tidak pernah diperlakukan sebagai angka nol. Baris tersebut masuk ke legenda **Tidak ada data** dan tetap terlihat di tabel.

## Metode

- **Kategori**: label dinormalisasi untuk pencocokan (trim, aksen dihapus, huruf besar), lalu diurutkan deterministik menurut locale Indonesia. Label yang tampil tetap berasal dari data pengguna.
- **Interval sama**: rentang minimum–maksimum dibagi menjadi kelas dengan lebar sama. Nilai di batas atas masuk ke kelas tersebut; matematika memakai nilai penuh dan pembulatan hanya untuk label.
- **Kuantil**: nilai diurutkan berdasarkan nilai, ID wilayah, lalu ID baris. Batas dihitung dari posisi kuantil. Nilai yang sama tidak dipaksa terpisah; bila jumlah kelas efektif berkurang, peringatan ditampilkan.
- **Batas manual**: pengguna memberikan batas atas yang naik dan unik, dipisahkan koma. Interval menggunakan konvensi `nilai <= batas`; batas terbalik, duplikat, dan non-angka ditolak.
- **Divergen berpusat**: kelas tengah berisi nilai tepat pada pusat (nol secara default atau target pengguna). Sisi bawah dan atas dihitung terpisah; jumlah kelas dibuat ganjil agar pusat terlihat jelas. Data satu sisi diberi peringatan.

## Palet dan legenda

Palet lokal versi `IDN-PALETTE-v1` tidak diambil dari jaringan. Default kualitatif memakai pasangan warna yang dapat dibedakan untuk pengguna dengan buta warna; palet berurutan dipakai untuk interval/kuantil; palet biru–oranye dipakai untuk divergen. Pembalikan palet hanya mengubah urutan, bukan kelas.

Legenda disimpan bersama spesifikasi visualisasi dan dipakai kembali oleh peta, tabel, proyek, serta ekspor. Setiap spesifikasi menyimpan metode, opsi, palet, pembalikan, batas/pusat, daftar kelas, peringatan, warna tidak ada data, dan versi formatter.

## Batasan Batch 2

Jenks/natural breaks tidak digunakan. Kategori sangat banyak memakai warna tambahan HSL deterministik dan menampilkan peringatan. Agregasi beberapa baris ke satu wilayah belum dihitung otomatis; aturan duplikat Prompt 4 tetap berlaku dan pengguna harus memilih/menyelesaikannya terlebih dahulu.
