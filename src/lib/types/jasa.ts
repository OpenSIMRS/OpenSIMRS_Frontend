// Jasa Pelayanan (Service Fee) Module Types

// Enum Types
export type PeranTindakan = 
    | 'OPERATOR' 
    | 'ASISTEN_1' 
    | 'ASISTEN_2' 
    | 'ANESTESI' 
    | 'PERAWAT' 
    | 'LAINNYA';

export type StatusPelaksana = 'PENDING' | 'CALCULATED' | 'PAID';

export type StatusAkumulasi = 'DRAFT' | 'APPROVED' | 'PAID';

export type StatusPeriode = 'OPEN' | 'CALCULATING' | 'CLOSED' | 'PAID';

// Main Data Types

/**
 * Pelaksana Tindakan - Records who performed a service/action
 */
export type PelaksanaTindakan = {
    id: string;
    billing_detail_id: string;
    tindakan_id: string;
    pegawai_id: string;
    peran: PeranTindakan;
    persentase: number; // DECIMAL(5,2)
    nilai_jasa: number; // DECIMAL(15,2)
    status: StatusPelaksana;
    created_at: string;
    updated_at: string;
    created_by: string;
};

/**
 * Formula Jasa - Service fee calculation formula
 */
export type FormulaJasa = {
    id: string;
    kode: string; // VARCHAR(20)
    nama: string; // VARCHAR(100)
    kategori_tindakan_id: string;
    komponen_jasa_medis: number; // DECIMAL(5,2) - percentage of medical service fee
    komponen_jasa_sarana: number; // DECIMAL(5,2) - percentage of facility fee
    komponen_jasa_rs: number; // DECIMAL(5,2) - percentage for hospital
    is_active: boolean;
    tanggal_berlaku: string; // DATE
    tanggal_berakhir: string | null; // DATE, optional
    created_at: string;
    updated_at: string;
};

/**
 * Distribusi Formula per Peran - Formula distribution per role
 */
export type DistribusiFormula = {
    id: string;
    formula_id: string;
    peran: PeranTindakan;
    persentase: number; // DECIMAL(5,2) - percentage of medical component
    is_active: boolean;
    created_at: string;
};

/**
 * Akumulasi Jasa - Service fee accumulation per employee per period
 */
export type AkumulasiJasa = {
    id: string;
    pegawai_id: string;
    periode_tahun: number;
    periode_bulan: number;
    total_jasa_medis: number; // DECIMAL(15,2)
    total_jasa_keperawatan: number; // DECIMAL(15,2)
    total_jasa_lainnya: number; // DECIMAL(15,2)
    grand_total: number; // DECIMAL(15,2)
    potongan_pajak: number; // DECIMAL(15,2)
    potongan_lainnya: number | null; // DECIMAL(15,2)
    netto: number; // DECIMAL(15,2)
    status: StatusAkumulasi;
    approved_by: string | null;
    approved_at: string | null; // DATETIME
    paid_at: string | null; // DATETIME
    created_at: string;
    updated_at: string;
};

/**
 * Detail Akumulasi - Details of service fee accumulation
 */
export type AkumulasiJasaDetail = {
    id: string;
    akumulasi_id: string;
    pelaksana_id: string;
    tanggal: string; // DATE
    billing_id: string;
    pasien_nama: string; // VARCHAR(100)
    tindakan_nama: string; // VARCHAR(150)
    peran: string; // VARCHAR(50)
    nilai_jasa: number; // DECIMAL(15,2)
    created_at: string;
};

/**
 * Template Peran Tindakan - Role template for actions
 */
export type TemplatePeran = {
    id: string;
    tindakan_id: string;
    peran: PeranTindakan;
    is_required: boolean;
    default_pegawai_id: string | null;
    created_at: string;
};

/**
 * Periode Jasa - Service fee period
 */
export type PeriodeJasa = {
    id: string;
    tahun: number;
    bulan: number;
    tanggal_mulai: string; // DATE
    tanggal_akhir: string; // DATE
    status: StatusPeriode;
    closed_by: string | null;
    closed_at: string | null; // DATETIME
    created_at: string;
};

// Supporting Types for Master Data

/**
 * Pegawai (Employee) - Simplified from Master Data
 */
export type Pegawai = {
    id: string;
    nip: string;
    nama: string;
    unit_id: string;
    unit_nama: string;
    jabatan: string;
    email?: string;
    is_active: boolean;
};

/**
 * Tindakan (Medical Action/Service) - Simplified from Master Data
 */
export type Tindakan = {
    id: string;
    kode: string;
    nama: string;
    kategori_id: string;
    kategori_nama: string;
    tarif: number;
    komponen_jasa: number; // Service fee component amount
    is_active: boolean;
};

/**
 * Kategori Tindakan - Service/Action Category
 */
export type KategoriTindakan = {
    id: string;
    kode: string;
    nama: string;
    is_active: boolean;
};

// Form Input Types

/**
 * Input for Pelaksana Tindakan Form
 */
export type InputPelaksana = {
    peran: PeranTindakan;
    pegawai_id: string;
    pegawai_nama?: string;
    persentase: number;
    nilai_jasa: number;
};

/**
 * Input for Formula Jasa Form
 */
export type InputFormulaJasa = {
    kode: string;
    nama: string;
    kategori_tindakan_id: string;
    komponen_jasa_medis: number;
    komponen_jasa_sarana: number;
    komponen_jasa_rs: number;
    tanggal_berlaku: string;
    tanggal_berakhir?: string;
    distribusi: Array<{
        peran: PeranTindakan;
        persentase: number;
    }>;
};

/**
 * Filter for Kalkulasi Jasa
 */
export type FilterKalkulasiJasa = {
    periode_tahun: number;
    periode_bulan: number;
    unit_id?: string;
    pegawai_id?: string;
};

/**
 * Result for Kalkulasi Preview
 */
export type PreviewKalkulasi = {
    nip: string;
    nama: string;
    unit: string;
    jasa_medis: number;
    jasa_keperawatan: number;
    jasa_lainnya: number;
    total: number;
};

/**
 * Slip Jasa Individual
 */
export type SlipJasa = {
    pegawai: {
        nip: string;
        nama: string;
        unit: string;
    };
    periode: {
        tahun: number;
        bulan: number;
        bulan_nama: string;
    };
    rincian: Array<{
        tanggal: string;
        tindakan: string;
        pasien: string;
        rm: string;
        nilai: number;
    }>;
    total_bruto: number;
    potongan_pajak: number;
    potongan_lainnya: number;
    total_netto: number;
};

/**
 * Laporan per Unit
 */
export type LaporanJasaUnit = {
    unit_id: string;
    unit_nama: string;
    periode: {
        tahun: number;
        bulan: number;
    };
    data: Array<{
        nama: string;
        jabatan: string;
        jumlah_tindakan: number;
        total_jasa: number;
    }>;
    summary: {
        total_jasa: number;
        rata_rata: number;
        top_performer: string;
    };
};

// Dashboard Types

/**
 * Dashboard Widget Data
 */
export type DashboardJasa = {
    total_bulan_ini: number;
    perbandingan_bulan_lalu: {
        nilai: number;
        persentase: number; // positive or negative
    };
    top_penerima: Array<{
        nama: string;
        unit: string;
        total: number;
    }>;
    distribusi_unit: Array<{
        unit: string;
        total: number;
    }>;
    trend_12_bulan: Array<{
        bulan: string;
        tahun: number;
        total: number;
    }>;
};
