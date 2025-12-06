import type { GormModel } from '../types';

// Kunjungan (Visit/Encounter)
export type Kunjungan = {
	ID: string;
	NoKunjungan: string;
	PasienID: string;
	TanggalKunjungan: string;
	JenisKunjungan: 'Rawat Jalan' | 'IGD' | 'Rawat Inap';
	PenjaminID: string;
	KelasPelayanan: 'VIP' | 'Kelas 1' | 'Kelas 2' | 'Kelas 3' | 'Umum';
	PoliTujuan?: string; // For Rawat Jalan
	DokterID?: string;
	NomorAntrian?: number;
	StatusKunjungan: 'Terdaftar' | 'Sedang Dilayani' | 'Selesai' | 'Batal';
	WaktuDatang?: string;
	WaktuSelesai?: string;
} & GormModel;

// Pendaftaran Rawat Jalan
export type PendaftaranRawatJalan = {
	ID: string;
	KunjunganID: string;
	PoliID: string;
	DokterID: string;
	NomorAntrian: number;
	Keluhan: string;
	TekananDarah?: string;
	Nadi?: number;
	Suhu?: number;
	RespirasiRate?: number;
	BeratBadan?: number;
	TinggiBadan?: number;
	Status: 'Menunggu' | 'Dipanggil' | 'Sedang Periksa' | 'Selesai';
} & GormModel;

// Pendaftaran IGD (Emergency Department)
export type PendaftaranIGD = {
	ID: string;
	KunjunganID: string;
	Triage: 'Merah' | 'Kuning' | 'Hijau';
	Keluhan: string;
	CaraDatang: 'Jalan Kaki' | 'Ambulans' | 'Kendaraan Pribadi';
	ReferensiDari?: string;
	TekananDarah?: string;
	Nadi?: number;
	Suhu?: number;
	RespirasiRate?: number;
	SadaranGCS?: number;
	KeputusanAkhir?: 'Pulang' | 'Rawat Inap' | 'Rujuk' | 'Meninggal';
	Status: 'Triage' | 'Penanganan' | 'Observasi' | 'Selesai';
} & GormModel;

// Pendaftaran Rawat Inap
export type PendaftaranRawatInap = {
	ID: string;
	KunjunganID: string;
	KamarID: string;
	BedNumber: number;
	DokterPenanggungJawab: string;
	DiagnosaMasuk: string;
	TanggalMasuk: string;
	TanggalKeluar?: string;
	LamaInap?: number;
	DiagnosaPulang?: string;
	CaraPulang?: 'Sembuh' | 'Pulang Atas Permintaan Sendiri' | 'Rujuk' | 'Meninggal';
	Status: 'Aktif' | 'Pulang';
} & GormModel;

// Antrian (Queue)
export type Antrian = {
	ID: string;
	KunjunganID: string;
	PoliID: string;
	NomorAntrian: number;
	TanggalAntrian: string;
	Status: 'Menunggu' | 'Dipanggil' | 'Dilayani' | 'Selesai' | 'Batal';
	WaktuPanggil?: string;
	WaktuMulaiLayanan?: string;
	WaktuSelesai?: string;
} & GormModel;

// Bed Management
export type BedOccupancy = {
	ID: string;
	KamarID: string;
	BedNumber: number;
	RawatInapID: string;
	PasienID: string;
	TanggalMulai: string;
	TanggalSelesai?: string;
	Status: 'Terisi' | 'Kosong' | 'Cleaning';
} & GormModel;
