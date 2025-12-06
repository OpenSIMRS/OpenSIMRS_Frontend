// ==================== Core Types ====================

export type HttpResponse<T, M = undefined> = {
    message: string;
    data: T;
    meta?: M;
};

export type GormModel = {
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: null | string;
}

export type PaginatedMeta = {
    "total_count": number,
    "total_page": number,
    "page": number,
    "count": number
}

// ==================== Auth Types ====================

export type GetAuthMe = {
    "ID": string
    "Email": string,
    "Name": string,
    "Role": string
}  & GormModel

export type PostAuthLogin = {
    "accessToken": string,
    "refreshToken": string
}

export type PostAuthRefesh = {
    "accessToken": string,
}

export type GetUser = {
    "ID": string,
    "Email": string,
    "Name": string,
    "Role": string
} & GormModel

// ==================== Enums ====================

export enum JenisKelamin {
    L = "L", // Laki-laki
    P = "P", // Perempuan
    K = "K"  // Lainnya
}

export enum GolonganDarah {
    A = "A",
    B = "B",
    AB = "AB",
    O = "O",
    UNKNOWN = "-"
}

export enum JenisKunjungan {
    RAJAL = "RAJAL", // Rawat Jalan
    IGD = "IGD",     // Instalasi Gawat Darurat
    RANAP = "RANAP"  // Rawat Inap
}

export enum StatusKunjungan {
    DAFTAR = "DAFTAR",
    DILAYANI = "DILAYANI",
    SELESAI = "SELESAI",
    BATAL = "BATAL"
}

export enum KategoriTriage {
    MERAH = "MERAH",   // Kritis
    KUNING = "KUNING", // Mendesak
    HIJAU = "HIJAU",   // Tidak mendesak
    HITAM = "HITAM"    // Meninggal
}

export enum StatusRawatInap {
    AKTIF = "AKTIF",
    PINDAH_KAMAR = "PINDAH_KAMAR",
    PULANG = "PULANG",
    MENINGGAL = "MENINGGAL",
    RUJUK = "RUJUK"
}

export enum CaraMasukRawatInap {
    POLIKLINIK = "POLIKLINIK",
    IGD = "IGD",
    RUJUKAN = "RUJUKAN",
    LAHIR_DI_RS = "LAHIR_DI_RS"
}

export enum CaraKeluarRawatInap {
    SEMBUH = "SEMBUH",
    PAPS = "PAPS",       // Pulang Atas Permintaan Sendiri
    MENINGGAL = "MENINGGAL",
    RUJUK = "RUJUK"
}

export enum StatusPegawai {
    AKTIF = "AKTIF",
    CUTI = "CUTI",
    RESIGN = "RESIGN",
    PENSIUN = "PENSIUN"
}

export enum JenisPegawai {
    PNS = "PNS",
    KONTRAK = "KONTRAK",
    HONORER = "HONORER",
    DOKTER_TAMU = "DOKTER_TAMU"
}

export enum StatusBed {
    KOSONG = "KOSONG",
    TERISI = "TERISI",
    DIBERSIHKAN = "DIBERSIHKAN",
    MAINTENANCE = "MAINTENANCE"
}

export enum StatusOrderLab {
    PENDING = "PENDING",
    DIPROSES = "DIPROSES",
    SELESAI = "SELESAI",
    BATAL = "BATAL"
}

export enum StatusOrderRadiologi {
    PENDING = "PENDING",
    DIJADWALKAN = "DIJADWALKAN",
    DIPROSES = "DIPROSES",
    SELESAI = "SELESAI",
    BATAL = "BATAL"
}

export enum StatusResep {
    PENDING = "PENDING",
    DIPROSES = "DIPROSES",
    DISERAHKAN = "DISERAHKAN",
    BATAL = "BATAL"
}

export enum StatusBilling {
    BELUM_BAYAR = "BELUM_BAYAR",
    DIBAYAR_SEBAGIAN = "DIBAYAR_SEBAGIAN",
    LUNAS = "LUNAS",
    BATAL = "BATAL"
}

// ==================== Master Data Types ====================

export type MasterPasien = {
    id: string;
    no_rm: string;
    nik: string;
    nama_lengkap: string;
    tempat_lahir: string;
    tanggal_lahir: string; // ISO date string
    jenis_kelamin: JenisKelamin;
    golongan_darah?: GolonganDarah;
    alamat: string;
    rt?: string;
    rw?: string;
    kode_wilayah: string;
    kode_pos?: string;
    no_telepon?: string;
    no_hp: string;
    email?: string;
    agama_id: string;
    pendidikan_id?: string;
    pekerjaan_id?: string;
    status_perkawinan_id: string;
    nama_ayah?: string;
    nama_ibu: string;
    nama_pasangan?: string;
    foto?: string;
    created_at: string;
    updated_at: string;
    created_by: string;
    updated_by: string;
}

export type Kunjungan = {
    id: string;
    no_registrasi: string;
    pasien_id: string;
    pasien?: MasterPasien;
    tanggal_kunjungan: string;
    waktu_kunjungan: string;
    jenis_kunjungan: JenisKunjungan;
    ruangan_id: string;
    ruangan?: MasterRuangan;
    dokter_id: string;
    dokter?: Pegawai;
    penjamin_id: string;
    penjamin?: MasterPenjamin;
    no_penjamin?: string;
    status_kunjungan: StatusKunjungan;
    no_antrian: number;
    keterangan?: string;
    created_at: string;
    updated_at: string;
    created_by: string;
    updated_by: string;
}

export type RawatInap = {
    id: string;
    kunjungan_id: string;
    kunjungan?: Kunjungan;
    pasien_id: string;
    pasien?: MasterPasien;
    tanggal_masuk: string;
    tanggal_keluar?: string;
    kamar_id: string;
    kamar?: MasterKamar;
    bed_id: string;
    bed?: MasterBed;
    kelas_id: string;
    kelas?: KelasKamar;
    dpjp_id: string;
    dpjp?: Pegawai;
    diagnosa_masuk: string;
    cara_masuk: CaraMasukRawatInap;
    status_rawat: StatusRawatInap;
    cara_keluar?: CaraKeluarRawatInap;
    created_at: string;
    updated_at: string;
    created_by: string;
    updated_by: string;
}

export type PenanggungJawabPasien = {
    id: string;
    pasien_id: string;
    nama: string;
    hubungan: string;
    nik: string;
    alamat: string;
    no_telepon: string;
    is_primary: boolean;
    created_at: string;
    updated_at: string;
}

export type TriageIGD = {
    id: string;
    kunjungan_id: string;
    waktu_triage: string;
    kategori: KategoriTriage;
    keluhan_utama: string;
    tanda_vital_td: string;
    tanda_vital_nadi: number;
    tanda_vital_rr: number;
    tanda_vital_suhu: number;
    tanda_vital_spo2?: number;
    gcs_eye?: number;
    gcs_verbal?: number;
    gcs_motor?: number;
    petugas_triage_id: string;
    petugas_triage?: Pegawai;
    catatan?: string;
    created_at: string;
}

// ==================== EMR Types ====================

export type AsesmenKeperawatan = {
    id: string;
    kunjungan_id: string;
    pasien_id: string;
    waktu_asesmen: string;
    keluhan_utama: string;
    riwayat_penyakit_sekarang: string;
    riwayat_penyakit_dahulu?: string;
    riwayat_penyakit_keluarga?: string;
    alergi_obat?: string;
    alergi_makanan?: string;
    alergi_lainnya?: string;
    td_sistole: number;
    td_diastole: number;
    nadi: number;
    respirasi: number;
    suhu: number;
    tinggi_badan?: number;
    berat_badan?: number;
    spo2?: number;
    nyeri_skor?: number;
    perawat_id: string;
    perawat?: Pegawai;
    created_at: string;
    updated_at: string;
}

export type SOAP = {
    id: string;
    kunjungan_id: string;
    waktu_pemeriksaan: string;
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
    dokter_id: string;
    dokter?: Pegawai;
    created_at: string;
    updated_at: string;
}

export type Diagnosis = {
    id: string;
    kunjungan_id: string;
    icd10_id: string;
    icd10?: MasterICD10;
    jenis_diagnosa: 'UTAMA' | 'SEKUNDER';
    urutan: number;
    keterangan?: string;
    created_at: string;
}

export type TindakanMedis = {
    id: string;
    kunjungan_id: string;
    tindakan_id: string;
    tindakan?: MasterTindakan;
    icd9cm_id?: string;
    icd9cm?: MasterICD9CM;
    waktu_tindakan: string;
    jumlah: number;
    tarif: number;
    pelaksana_id: string;
    pelaksana?: Pegawai;
    tim_terlibat?: PelaksanaTindakan[];
    keterangan?: string;
    created_at: string;
    updated_at: string;
}

export type PelaksanaTindakan = {
    id: string;
    tindakan_medis_id: string;
    pegawai_id: string;
    pegawai?: Pegawai;
    peran: string;
    persentase_jasa?: number;
    created_at: string;
}

// ==================== Lab & Radiology Types ====================

export type OrderLab = {
    id: string;
    no_order: string;
    kunjungan_id: string;
    kunjungan?: Kunjungan;
    pasien_id: string;
    pasien?: MasterPasien;
    dokter_pengirim_id: string;
    dokter_pengirim?: Pegawai;
    tanggal_order: string;
    status: StatusOrderLab;
    catatan?: string;
    detail_order?: DetailOrderLab[];
    created_at: string;
    updated_at: string;
}

export type DetailOrderLab = {
    id: string;
    order_lab_id: string;
    pemeriksaan_lab_id: string;
    pemeriksaan_lab?: MasterPemeriksaanLab;
    hasil?: string;
    nilai_normal?: string;
    satuan?: string;
    keterangan?: string;
    status: 'PENDING' | 'DIPROSES' | 'SELESAI';
    waktu_selesai?: string;
    petugas_id?: string;
    petugas?: Pegawai;
    created_at: string;
    updated_at: string;
}

export type OrderRadiologi = {
    id: string;
    no_order: string;
    kunjungan_id: string;
    kunjungan?: Kunjungan;
    pasien_id: string;
    pasien?: MasterPasien;
    dokter_pengirim_id: string;
    dokter_pengirim?: Pegawai;
    tanggal_order: string;
    status: StatusOrderRadiologi;
    catatan?: string;
    detail_order?: DetailOrderRadiologi[];
    created_at: string;
    updated_at: string;
}

export type DetailOrderRadiologi = {
    id: string;
    order_radiologi_id: string;
    pemeriksaan_radiologi_id: string;
    pemeriksaan_radiologi?: MasterPemeriksaanRadiologi;
    tanggal_jadwal?: string;
    hasil?: string;
    expertise?: string;
    radiolog_id?: string;
    radiolog?: Pegawai;
    radiografer_id?: string;
    radiografer?: Pegawai;
    status: 'PENDING' | 'DIJADWALKAN' | 'SELESAI';
    waktu_selesai?: string;
    created_at: string;
    updated_at: string;
}

// ==================== Pharmacy Types ====================

export type Resep = {
    id: string;
    no_resep: string;
    kunjungan_id: string;
    kunjungan?: Kunjungan;
    pasien_id: string;
    pasien?: MasterPasien;
    dokter_id: string;
    dokter?: Pegawai;
    tanggal_resep: string;
    status: StatusResep;
    apoteker_id?: string;
    apoteker?: Pegawai;
    waktu_diserahkan?: string;
    total_harga?: number;
    detail_resep?: DetailResep[];
    created_at: string;
    updated_at: string;
}

export type DetailResep = {
    id: string;
    resep_id: string;
    obat_id: string;
    obat?: MasterObat;
    jumlah: number;
    satuan: string;
    aturan_pakai: string;
    keterangan?: string;
    harga_satuan: number;
    total_harga: number;
    created_at: string;
}

// ==================== Billing Types ====================

export type Billing = {
    id: string;
    no_billing: string;
    kunjungan_id: string;
    kunjungan?: Kunjungan;
    pasien_id: string;
    pasien?: MasterPasien;
    tanggal_billing: string;
    total_tagihan: number;
    total_diskon: number;
    total_pajak: number;
    total_bayar: number;
    total_dibayar: number;
    sisa_tagihan: number;
    status: StatusBilling;
    detail_billing?: DetailBilling[];
    pembayaran?: Pembayaran[];
    created_at: string;
    updated_at: string;
}

export type DetailBilling = {
    id: string;
    billing_id: string;
    jenis_item: 'TINDAKAN' | 'OBAT' | 'ALKES' | 'BHP' | 'KAMAR' | 'LAINNYA';
    item_id: string;
    nama_item: string;
    jumlah: number;
    harga_satuan: number;
    total_harga: number;
    diskon: number;
    pajak: number;
    total_bayar: number;
    created_at: string;
}

export type Pembayaran = {
    id: string;
    billing_id: string;
    tanggal_bayar: string;
    jumlah_bayar: number;
    metode_pembayaran: 'TUNAI' | 'DEBIT' | 'KREDIT' | 'TRANSFER' | 'QRIS';
    nomor_referensi?: string;
    kasir_id: string;
    kasir?: Pegawai;
    created_at: string;
}

// ==================== Master Data Detail Types ====================

export type MasterICD10 = {
    id: string;
    kode: string;
    nama_id: string;
    nama_en: string;
    kategori?: string;
    parent_kode?: string;
    deskripsi?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type MasterICD9CM = {
    id: string;
    kode: string;
    nama_id: string;
    nama_en: string;
    kategori?: string;
    parent_kode?: string;
    deskripsi?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type MasterTindakan = {
    id: string;
    kode: string;
    nama: string;
    kategori_id: string;
    kategori?: KategoriTindakan;
    icd9cm_id?: string;
    icd9cm?: MasterICD9CM;
    unit_id: string;
    unit?: MasterRuangan;
    is_operasi: boolean;
    is_memerlukan_consent: boolean;
    tarif_default: number;
    komponen_jasa_medis: number;
    komponen_sarana: number;
    komponen_bhp: number;
    durasi_estimasi?: number;
    keterangan?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type KategoriTindakan = {
    id: string;
    kode: string;
    nama: string;
    deskripsi?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type MasterObat = {
    id: string;
    kode: string;
    nama_generik: string;
    nama_dagang: string;
    kategori_id: string;
    kategori?: KategoriObat;
    bentuk_sediaan: string;
    kekuatan: string;
    satuan_kekuatan: string;
    satuan_kemasan: string;
    produsen_id?: string;
    produsen?: MasterProdusen;
    harga_beli: number;
    harga_jual: number;
    stok_minimal: number;
    is_narkotika: boolean;
    is_psikotropika: boolean;
    keterangan?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type KategoriObat = {
    id: string;
    kode: string;
    nama: string;
    deskripsi?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type MasterProdusen = {
    id: string;
    kode: string;
    nama: string;
    alamat?: string;
    telepon?: string;
    email?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type Pegawai = {
    id: string;
    nip: string;
    nik: string;
    nama_lengkap: string;
    gelar_depan?: string;
    gelar_belakang?: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    jenis_kelamin: 'L' | 'P';
    alamat: string;
    no_telepon?: string;
    no_hp: string;
    email?: string;
    jabatan_id: string;
    jabatan?: MasterJabatan;
    unit_id: string;
    unit?: MasterRuangan;
    jenis_pegawai: JenisPegawai;
    status_pegawai: StatusPegawai;
    tanggal_masuk: string;
    tanggal_keluar?: string;
    foto?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type MasterJabatan = {
    id: string;
    kode: string;
    nama: string;
    deskripsi?: string;
    level: number;
    is_tenaga_medis: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type MasterRuangan = {
    id: string;
    kode: string;
    nama: string;
    jenis_ruangan: 'POLI' | 'IGD' | 'RANAP' | 'LAB' | 'RADIOLOGI' | 'FARMASI' | 'GUDANG' | 'KASIR' | 'LAINNYA';
    lantai?: number;
    gedung?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type MasterKamar = {
    id: string;
    kode: string;
    nama: string;
    ruangan_id: string;
    ruangan?: MasterRuangan;
    kelas_id: string;
    kelas?: KelasKamar;
    kapasitas_bed: number;
    tarif_per_hari: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type MasterBed = {
    id: string;
    kode: string;
    nomor: string;
    kamar_id: string;
    kamar?: MasterKamar;
    status: StatusBed;
    keterangan?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type KelasKamar = {
    id: string;
    kode: string;
    nama: string;
    deskripsi?: string;
    urutan: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type MasterPenjamin = {
    id: string;
    kode: string;
    nama: string;
    jenis: 'UMUM' | 'BPJS' | 'ASURANSI' | 'PERUSAHAAN' | 'PEMERINTAH';
    alamat?: string;
    telepon?: string;
    email?: string;
    pic?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type MasterPemeriksaanLab = {
    id: string;
    kode: string;
    nama: string;
    kategori_id: string;
    kategori?: KategoriPemeriksaanLab;
    satuan?: string;
    nilai_normal?: string;
    metode?: string;
    tarif: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type KategoriPemeriksaanLab = {
    id: string;
    kode: string;
    nama: string;
    deskripsi?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type MasterPemeriksaanRadiologi = {
    id: string;
    kode: string;
    nama: string;
    kategori_id: string;
    kategori?: KategoriPemeriksaanRadiologi;
    jenis_modalitas: string;
    tarif: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type KategoriPemeriksaanRadiologi = {
    id: string;
    kode: string;
    nama: string;
    deskripsi?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type MasterLookup = {
    id: string;
    category: string;
    kode: string;
    nama: string;
    deskripsi?: string;
    urutan: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// ==================== Nutrition Types ====================

export type OrderDiet = {
    id: string;
    no_order: string;
    kunjungan_id: string;
    kunjungan?: Kunjungan;
    pasien_id: string;
    pasien?: MasterPasien;
    dokter_id: string;
    dokter?: Pegawai;
    jenis_diet_id: string;
    jenis_diet?: MasterJenisDiet;
    tanggal_mulai: string;
    tanggal_selesai?: string;
    frekuensi_per_hari: number;
    kalori_target?: number;
    catatan?: string;
    status: 'AKTIF' | 'SELESAI' | 'BATAL';
    created_at: string;
    updated_at: string;
}

export type MasterJenisDiet = {
    id: string;
    kode: string;
    nama: string;
    deskripsi?: string;
    kalori_standar?: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// ==================== Audit Trail Types ====================

export type AuditTrail = {
    id: string;
    user_id: string;
    user?: GetUser;
    table_name: string;
    record_id: string;
    action: 'CREATE' | 'UPDATE' | 'DELETE';
    old_values?: Record<string, any>;
    new_values?: Record<string, any>;
    ip_address?: string;
    user_agent?: string;
    created_at: string;
}

// ==================== Dashboard Types ====================

export type DashboardStats = {
    total_kunjungan_hari_ini: number;
    total_pasien_aktif: number;
    total_bed_terisi: number;
    total_bed_kosong: number;
    bor: number; // Bed Occupancy Rate
    alos: number; // Average Length of Stay
    pendapatan_hari_ini: number;
    pendapatan_bulan_ini: number;
}

export type TopPenyakit = {
    icd10_kode: string;
    icd10_nama: string;
    jumlah: number;
}

export type PendapatanBulanan = {
    bulan: string;
    tahun: number;
    total_pendapatan: number;
}

// ==================== Edukasi Pasien Types ====================

export type EdukasiPasien = {
    id: string;
    kunjungan_id: string;
    pasien_id: string;
    topik: string;
    materi_edukasi: string;
    metode_edukasi: 'VERBAL' | 'DEMONSTRASI' | 'AUDIO_VISUAL' | 'BROSUR';
    edukator_id: string;
    edukator?: Pegawai;
    tanggal_edukasi: string;
    pemahaman_pasien: 'BAIK' | 'CUKUP' | 'KURANG';
    tanda_tangan_pasien?: string;
    keterangan?: string;
    created_at: string;
    updated_at: string;
}

// ==================== Retur & Pembatalan Types ====================

export type ReturObat = {
    id: string;
    no_retur: string;
    resep_id: string;
    resep?: Resep;
    detail_resep_id: string;
    detail_resep?: DetailResep;
    jumlah_retur: number;
    alasan: string;
    petugas_id: string;
    petugas?: Pegawai;
    tanggal_retur: string;
    status: 'PENDING' | 'DISETUJUI' | 'DITOLAK';
    created_at: string;
    updated_at: string;
}

export type PembatalanTindakan = {
    id: string;
    no_pembatalan: string;
    tindakan_medis_id: string;
    tindakan_medis?: TindakanMedis;
    alasan: string;
    petugas_id: string;
    petugas?: Pegawai;
    tanggal_pembatalan: string;
    status: 'PENDING' | 'DISETUJUI' | 'DITOLAK';
    created_at: string;
    updated_at: string;
}