import type { GormModel } from '../types';

// Resep Farmasi (dari Resep di EMR)
export type ResepFarmasi = {
	ID: string;
	NomorResep: string;
	ResepID: string; // Reference to Resep from EMR
	KunjunganID: string;
	PasienID: string;
	DokterID: string;
	TanggalResep: string;
	ApotekerID?: string;
	Status: 'Pending' | 'Verifikasi' | 'Disiapkan' | 'Diserahkan' | 'Batal';
	TanggalVerifikasi?: string;
	TanggalDiserahkan?: string;
	TotalHarga: number;
} & GormModel;

// Item Resep Farmasi
export type ItemResepFarmasi = {
	ID: string;
	ResepFarmasiID: string;
	ObatID: string;
	NamaObat: string;
	Jumlah: number;
	Satuan: string;
	Dosis: string;
	Frekuensi: string;
	Durasi: string;
	Rute: string;
	Instruksi?: string;
	HargaSatuan: number;
	Subtotal: number;
	StokTersedia: boolean;
	BatchNumber?: string;
	TanggalKadaluarsa?: string;
	Status: 'Pending' | 'Disiapkan' | 'Diserahkan';
} & GormModel;

// Stok Obat (Medicine Stock)
export type StokObat = {
	ID: string;
	ObatID: string;
	BatchNumber: string;
	TanggalMasuk: string;
	TanggalKadaluarsa: string;
	JumlahMasuk: number;
	JumlahKeluar: number;
	StokAkhir: number;
	HargaBeli: number;
	HargaJual: number;
	SupplierID?: string;
	Status: 'Tersedia' | 'Kadaluarsa' | 'Habis';
} & GormModel;

// Mutasi Stok (Stock Movement)
export type MutasiStokFarmasi = {
	ID: string;
	ObatID: string;
	BatchNumber: string;
	JenisMutasi: 'Masuk' | 'Keluar' | 'Retur' | 'Adjustment';
	Jumlah: number;
	TanggalMutasi: string;
	ReferensiID?: string; // e.g., ResepFarmasiID, PurchaseOrderID
	Keterangan?: string;
	PetugasID: string; // Employee ID
	StokSebelum: number;
	StokSesudah: number;
} & GormModel;

// Verifikasi Resep
export type VerifikasiResep = {
	ID: string;
	ResepFarmasiID: string;
	ApotekerID: string; // Employee ID
	TanggalVerifikasi: string;
	StatusVerifikasi: 'Disetujui' | 'Ditolak' | 'Revisi';
	Catatan?: string;
	InteraksiObat?: string;
	PeringatanAlergi?: string;
} & GormModel;

// Penyerahan Obat
export type PenyerahanObat = {
	ID: string;
	ResepFarmasiID: string;
	PetugasPenyerah: string; // Employee ID
	TanggalPenyerahan: string;
	PenerimaNama: string;
	PenerimaHubungan: string; // e.g., "Pasien", "Keluarga"
	TandaTanganPenerima?: string;
	Catatan?: string;
} & GormModel;

// Racikan Obat (Compounded Medicine)
export type RacikanObat = {
	ID: string;
	ResepFarmasiID: string;
	NamaRacikan: string;
	Jumlah: number;
	Satuan: string;
	Instruksi: string;
	Status: 'Pending' | 'Diracik' | 'Selesai';
} & GormModel;

// Item Racikan
export type ItemRacikan = {
	ID: string;
	RacikanObatID: string;
	ObatID: string;
	NamaObat: string;
	Jumlah: number;
	Satuan: string;
} & GormModel;
