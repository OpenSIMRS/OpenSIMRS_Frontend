// Jasa Pelayanan Module Types

// Enums
export enum PeranEnum {
	OPERATOR = 'OPERATOR',
	ASISTEN_1 = 'ASISTEN_1',
	ASISTEN_2 = 'ASISTEN_2',
	ANESTESI = 'ANESTESI',
	PERAWAT = 'PERAWAT',
	LAINNYA = 'LAINNYA'
}

export enum StatusPelaksanaEnum {
	PENDING = 'PENDING',
	CALCULATED = 'CALCULATED',
	PAID = 'PAID'
}

export enum StatusAkumulasiEnum {
	DRAFT = 'DRAFT',
	APPROVED = 'APPROVED',
	PAID = 'PAID'
}

export enum StatusPeriodeEnum {
	OPEN = 'OPEN',
	CALCULATING = 'CALCULATING',
	CLOSED = 'CLOSED',
	PAID = 'PAID'
}

// Main Types
export type PelaksanaTindakan = {
	id: string;
	billing_detail_id: string;
	tindakan_id: string;
	pegawai_id: string;
	peran: PeranEnum;
	persentase: number;
	nilai_jasa: number;
	status: StatusPelaksanaEnum;
	created_at: string;
	updated_at: string;
	created_by: string;
};

export type FormulaJasa = {
	id: string;
	kode: string;
	nama: string;
	kategori_tindakan_id: string;
	komponen_jasa_medis: number;
	komponen_jasa_sarana: number;
	komponen_jasa_rs: number;
	is_active: boolean;
	tanggal_berlaku: string;
	tanggal_berakhir: string | null;
	created_at: string;
	updated_at: string;
};

export type DistribusiFormula = {
	id: string;
	formula_id: string;
	peran: PeranEnum;
	persentase: number;
	is_active: boolean;
	created_at: string;
};

export type AkumulasiJasa = {
	id: string;
	pegawai_id: string;
	periode_tahun: number;
	periode_bulan: number;
	total_jasa_medis: number;
	total_jasa_keperawatan: number;
	total_jasa_lainnya: number;
	grand_total: number;
	potongan_pajak: number;
	potongan_lainnya: number;
	netto: number;
	status: StatusAkumulasiEnum;
	approved_by: string | null;
	approved_at: string | null;
	paid_at: string | null;
	created_at: string;
	updated_at: string;
};

export type AkumulasiJasaDetail = {
	id: string;
	akumulasi_id: string;
	pelaksana_id: string;
	tanggal: string;
	billing_id: string;
	pasien_nama: string;
	tindakan_nama: string;
	peran: string;
	nilai_jasa: number;
	created_at: string;
};

export type TemplatePeran = {
	id: string;
	tindakan_id: string;
	peran: PeranEnum;
	is_required: boolean;
	default_pegawai_id: string | null;
	created_at: string;
};

export type PeriodeJasa = {
	id: string;
	tahun: number;
	bulan: number;
	tanggal_mulai: string;
	tanggal_akhir: string;
	status: StatusPeriodeEnum;
	closed_by: string | null;
	closed_at: string | null;
	created_at: string;
};

// Form Input Types
export type PelaksanaInput = {
	peran: PeranEnum;
	pegawai_id: string;
	pegawai_nama: string;
	persentase: number;
	nilai_jasa: number;
};

export type FormulaJasaInput = {
	kode: string;
	nama: string;
	kategori_tindakan_id: string;
	tanggal_berlaku: string;
	tanggal_berakhir: string | null;
	komponen_jasa_medis: number;
	komponen_jasa_sarana: number;
	komponen_jasa_rs: number;
	distribusi: DistribusiFormulaInput[];
};

export type DistribusiFormulaInput = {
	peran: PeranEnum;
	persentase: number;
};

// Filter Types
export type KalkulasiJasaFilter = {
	periode_tahun: number;
	periode_bulan: number;
	unit_id?: string;
	pegawai_id?: string;
};

// View/Display Types
export type PelaksanaDisplay = {
	no: number;
	nip: string;
	nama: string;
	unit: string;
	jasa_medis: number;
	jasa_keperawatan: number;
	total: number;
};

export type SlipJasaData = {
	nip: string;
	nama: string;
	unit: string;
	periode_bulan: number;
	periode_tahun: number;
	rincian: SlipJasaRincian[];
	total_bruto: number;
	potongan_pajak: number;
	total_netto: number;
};

export type SlipJasaRincian = {
	tindakan_nama: string;
	pasien_nama: string;
	pasien_rm: string;
	tanggal: string;
	nilai_jasa: number;
};

// Master Data Types (supporting types)
export type Pegawai = {
	id: string;
	nip: string;
	nama: string;
	jabatan: string;
	unit_id: string;
	unit_nama: string;
	is_active: boolean;
	created_at: string;
	updated_at: string;
};

export type Tindakan = {
	id: string;
	kode: string;
	nama: string;
	kategori_tindakan_id: string;
	kategori_nama: string;
	tarif: number;
	komponen_jasa: number;
	is_active: boolean;
	created_at: string;
	updated_at: string;
};

export type KategoriTindakan = {
	id: string;
	kode: string;
	nama: string;
	is_active: boolean;
	created_at: string;
	updated_at: string;
};

export type Unit = {
	id: string;
	kode: string;
	nama: string;
	is_active: boolean;
	created_at: string;
	updated_at: string;
};

// Dashboard Types
export type DashboardJasaWidget = {
	total_jasa_bulan_ini: number;
	perbandingan_bulan_lalu: number;
	persentase_perubahan: number;
	top_penerima: TopPenerimaJasa[];
	distribusi_per_unit: DistribusiPerUnit[];
};

export type TopPenerimaJasa = {
	pegawai_id: string;
	pegawai_nama: string;
	total_jasa: number;
	ranking: number;
};

export type DistribusiPerUnit = {
	unit_id: string;
	unit_nama: string;
	total_jasa: number;
	jumlah_pegawai: number;
	rata_rata: number;
};

export type TrendJasa = {
	bulan: number;
	tahun: number;
	total_jasa: number;
};
