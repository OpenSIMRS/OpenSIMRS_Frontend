import type { GormModel } from '../types';

// Master Pemeriksaan Radiologi
export type PemeriksaanRadiologi = {
	ID: string;
	KodePemeriksaan: string;
	NamaPemeriksaan: string;
	Kategori: string; // e.g., "X-Ray", "CT-Scan", "MRI", "USG"
	Modalitas: string;
	Tarif: number;
	EstimasiWaktu: number; // in minutes
	Status: 'Aktif' | 'Nonaktif';
} & GormModel;

// Order Radiologi (dari OrderPenunjang)
export type OrderRadiologi = {
	ID: string;
	NomorOrder: string;
	OrderPenunjangID: string;
	KunjunganID: string;
	PasienID: string;
	DokterPengirim: string;
	TanggalOrder: string;
	DiagnosisKlinis: string;
	Catatan?: string;
	Status: 'Pending' | 'Dijadwalkan' | 'Diproses' | 'Selesai' | 'Batal';
} & GormModel;

// Order Radiologi Item
export type OrderRadiologiItem = {
	ID: string;
	OrderRadiologiID: string;
	PemeriksaanRadiologiID: string;
	NamaPemeriksaan: string;
	JadwalPemeriksaan?: string;
	Status: 'Pending' | 'Dijadwalkan' | 'Diproses' | 'Selesai';
} & GormModel;

// Pemeriksaan (Examination Process)
export type ProsesRadiologi = {
	ID: string;
	OrderRadiologiItemID: string;
	RadiograferID: string; // Employee ID
	WaktuMulai: string;
	WaktuSelesai?: string;
	KondisiPasien: string;
	PersiapanPasien: string;
	PosisiPemeriksaan: string;
	JumlahFoto: number;
	Catatan?: string;
} & GormModel;

// PACS (Picture Archiving and Communication System)
export type GambarRadiologi = {
	ID: string;
	OrderRadiologiItemID: string;
	URLGambar: string; // URL to image file
	ThumbnailURL?: string;
	TipeGambar: string; // e.g., "DICOM", "JPEG", "PNG"
	UkuranFile: number; // in bytes
	Keterangan?: string;
	TanggalUpload: string;
} & GormModel;

// Expertise (Radiologist's Report)
export type ExpertiseRadiologi = {
	ID: string;
	OrderRadiologiID: string;
	RadiologID: string; // Employee ID
	TanggalExpertise: string;
	Deskripsi: string; // Radiologist's findings
	Kesimpulan: string;
	Saran?: string;
	Status: 'Draft' | 'Finalized';
} & GormModel;

// Tim Terlibat Radiologi
export type TimRadiologiTerlibat = {
	ID: string;
	OrderRadiologiID: string;
	PegawaiID: string;
	Peran: 'Radiografer' | 'Radiolog';
	PersentaseJP?: number;
} & GormModel;
