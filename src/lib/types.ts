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

// ============================================
// MASTER DATA TYPES
// ============================================

// Master Lookup (for simple reference data)
export type MasterLookup = {
    id: string;
    value: string;
    category: 'AGAMA' | 'PENDIDIKAN' | 'PEKERJAAN' | 'STATUS_PERKAWINAN' | 'GOLONGAN_DARAH' | 'HUBUNGAN_KELUARGA';
};

// Master Patient
export type Patient = {
    id: string;
    no_rm: string; // Medical Record Number
    nik: string; // National ID
    nama_lengkap: string;
    tempat_lahir: string;
    tanggal_lahir: string; // ISO date string
    jenis_kelamin: 'L' | 'P'; // L=Laki-laki, P=Perempuan
    golongan_darah?: 'A' | 'B' | 'AB' | 'O' | '-';
    alamat: string;
    rt?: string;
    rw?: string;
    kode_wilayah: string; // BPS code format: PP.KK.CC.DDDD
    kode_pos?: string;
    no_telepon?: string;
    no_hp: string;
    email?: string;
    agama_id: string; // FK to MasterLookup
    pendidikan_id?: string;
    pekerjaan_id?: string;
    status_perkawinan_id: string;
    nama_ayah?: string;
    nama_ibu: string;
    nama_pasangan?: string;
    foto?: string;
    created_at: string;
    updated_at: string;
};

// Master Poli (Polyclinic)
export type Poli = {
    id: string;
    kode: string;
    nama: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
};

// Master Dokter (Doctor)
export type Dokter = {
    id: string;
    nip: string;
    nama_lengkap: string;
    gelar_depan?: string;
    gelar_belakang?: string;
    spesialisasi?: string;
    no_sip?: string;
    poli_id?: string; // FK to Poli
    is_active: boolean;
    created_at: string;
    updated_at: string;
};

// Master Ruangan (Room)
export type Ruangan = {
    id: string;
    kode: string;
    nama: string;
    jenis: 'POLI' | 'IGD' | 'RAWAT_INAP' | 'PENUNJANG';
    is_active: boolean;
    created_at: string;
    updated_at: string;
};

// Master Tindakan (Medical Action/Procedure)
export type Tindakan = {
    id: string;
    kode: string;
    nama: string;
    kategori: string;
    tarif: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
};

// Master Penjamin (Insurance/Payment Method)
export type Penjamin = {
    id: string;
    kode: string;
    nama: string;
    jenis: 'UMUM' | 'BPJS' | 'ASURANSI';
    is_active: boolean;
    created_at: string;
    updated_at: string;
};

// Master ICD-10 (International Classification of Diseases 10th Revision)
export type ICD10 = {
    id: string;
    code: string;
    name: string;
    category?: string;
    is_active: boolean;
};

// Master ICD-9-CM (Procedures)
export type ICD9 = {
    id: string;
    code: string;
    name: string;
    category?: string;
    is_active: boolean;
};

// ============================================
// TRANSACTION TYPES
// ============================================

// Kunjungan (Visit)
export type Kunjungan = {
    id: string;
    no_registrasi: string;
    pasien_id: string;
    tanggal_kunjungan: string; // ISO date
    waktu_kunjungan: string; // ISO time
    jenis_kunjungan: 'RAJAL' | 'IGD' | 'RANAP'; // RAJAL = Rawat Jalan
    poli_id?: string;
    ruangan_id: string;
    dokter_id: string;
    penjamin_id: string;
    no_penjamin?: string;
    status_kunjungan: 'DAFTAR' | 'DILAYANI' | 'SELESAI' | 'BATAL';
    no_antrian: number;
    keterangan?: string;
    created_at: string;
    updated_at: string;
};

// Asesmen Keperawatan (Nursing Assessment)
export type AsesmenKeperawatan = {
    id: string;
    kunjungan_id: string;
    pasien_id: string;
    waktu_asesmen: string; // ISO datetime
    keluhan_utama: string;
    riwayat_penyakit_sekarang: string;
    riwayat_penyakit_dahulu?: string;
    riwayat_penyakit_keluarga?: string;
    alergi_obat?: string;
    alergi_makanan?: string;
    alergi_lainnya?: string;
    td_sistole: number; // Systolic Blood Pressure
    td_diastole: number; // Diastolic Blood Pressure
    nadi: number; // Pulse
    respirasi: number; // Respiratory Rate
    suhu: number; // Temperature
    tinggi_badan?: number;
    berat_badan?: number;
    spo2?: number;
    nyeri_skor?: number; // Pain scale 0-10
    perawat_id: string;
    created_at: string;
    updated_at: string;
};

// SOAP Record (Doctor's Examination)
export type SOAP = {
    id: string;
    kunjungan_id: string;
    pasien_id: string;
    tanggal_pemeriksaan: string; // ISO date
    waktu_pemeriksaan: string; // ISO time
    subjective: string; // S - Patient's complaint
    objective: string; // O - Physical examination findings
    assessment: string; // A - Diagnosis
    plan: string; // P - Treatment plan
    td_sistole: number;
    td_diastole: number;
    nadi: number;
    respirasi: number;
    suhu: number;
    dokter_id: string;
    is_dpjp: boolean; // Is this doctor the DPJP (Dokter Penanggung Jawab Pasien)
    created_at: string;
    updated_at: string;
};

// Diagnosa (Diagnosis)
export type Diagnosa = {
    id: string;
    soap_id: string;
    kunjungan_id: string;
    icd10_code: string;
    icd10_name: string;
    icd9_code?: string; // For procedures
    icd9_name?: string;
    jenis_diagnosa: 'UTAMA' | 'SEKUNDER' | 'KOMPLIKASI';
    keterangan?: string;
    urutan: number;
    created_at: string;
};

// Tindakan Medis (Medical Procedure)
export type TindakanMedis = {
    id: string;
    soap_id: string;
    kunjungan_id: string;
    tindakan_id: string;
    tanggal_tindakan: string; // ISO datetime
    dokter_pelaksana_id: string;
    perawat_asisten_id?: string;
    hasil?: string;
    catatan?: string;
    status: 'RENCANA' | 'DILAKUKAN' | 'BATAL';
    created_at: string;
    updated_at: string;
};

// ============================================
// VIEW MODELS (for display with joined data)
// ============================================

export type PatientWithDetails = Patient & {
    agama?: string;
    pendidikan?: string;
    pekerjaan?: string;
    status_perkawinan?: string;
    umur?: number;
};

export type KunjunganWithDetails = Kunjungan & {
    pasien?: Patient;
    poli?: Poli;
    ruangan?: Ruangan;
    dokter?: Dokter;
    penjamin?: Penjamin;
};

export type SOAPWithDetails = SOAP & {
    pasien?: Patient;
    dokter?: Dokter;
    diagnosa?: Diagnosa[];
    tindakan?: TindakanMedis[];
};

// ============================================
// FORM INPUT TYPES
// ============================================

export type PatientFormInput = Omit<Patient, 'id' | 'no_rm' | 'created_at' | 'updated_at'>;

export type KunjunganFormInput = Omit<Kunjungan, 'id' | 'no_registrasi' | 'no_antrian' | 'status_kunjungan' | 'created_at' | 'updated_at'>;

export type AsesmenFormInput = Omit<AsesmenKeperawatan, 'id' | 'created_at' | 'updated_at'>;

export type SOAPFormInput = Omit<SOAP, 'id' | 'created_at' | 'updated_at'>;