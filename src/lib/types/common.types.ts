import type { GormModel } from '../types';

// Audit Trail
export type AuditTrail = {
	ID: string;
	TableName: string; // e.g., "patients", "emr_records", "stok_obat"
	RecordID: string; // ID of the affected record
	Action: 'Create' | 'Update' | 'Delete';
	UserID: string; // Employee/User ID who performed the action
	UserName: string;
	Timestamp: string;
	OldValue?: string; // JSON string of old values
	NewValue?: string; // JSON string of new values
	IPAddress?: string;
	UserAgent?: string;
	Catatan?: string;
} & GormModel;

// Dashboard Metrics
export type DashboardMetrics = {
	TanggalData: string;
	TotalKunjungan: number;
	KunjunganRawatJalan: number;
	KunjunganIGD: number;
	KunjunganRawatInap: number;
	PasienBaru: number;
	BOR: number; // Bed Occupancy Rate
	ALOS: number; // Average Length of Stay
	TotalPendapatan: number;
	TotalPiutang: number;
};

// Top 10 Penyakit
export type TopPenyakit = {
	ICD10ID: string;
	KodeICD10: string;
	NamaPenyakit: string;
	JumlahKasus: number;
	Periode: string; // e.g., "2024-01"
};

// Laporan Kunjungan
export type LaporanKunjungan = {
	TanggalAwal: string;
	TanggalAkhir: string;
	TotalKunjungan: number;
	DetailPerPoli: Array<{
		PoliID: string;
		NamaPoli: string;
		JumlahKunjungan: number;
	}>;
	DetailPerPenjamin: Array<{
		PenjaminID: string;
		NamaPenjamin: string;
		JumlahKunjungan: number;
	}>;
};

// Laporan Pendapatan
export type LaporanPendapatan = {
	TanggalAwal: string;
	TanggalAkhir: string;
	TotalPendapatan: number;
	PendapatanKasir: number;
	Piutang: number;
	DetailPerLayanan: Array<{
		JenisLayanan: string;
		TotalPendapatan: number;
	}>;
};

// Laporan Stok
export type LaporanStok = {
	TanggalLaporan: string;
	DetailStok: Array<{
		BarangID: string;
		NamaBarang: string;
		StokAkhir: number;
		StokMinimal: number;
		Status: 'Aman' | 'Menipis' | 'Habis';
		NilaiStok: number;
	}>;
};

// Notifikasi
export type Notifikasi = {
	ID: string;
	UserID: string;
	Judul: string;
	Pesan: string;
	Tipe: 'Info' | 'Warning' | 'Error' | 'Success';
	Kategori: 'Kunjungan' | 'Lab' | 'Radiologi' | 'Farmasi' | 'Billing' | 'Stok' | 'Lainnya';
	TanggalKirim: string;
	Dibaca: boolean;
	TanggalDibaca?: string;
	ReferensiID?: string; // Related record ID
	ReferensiTipe?: string; // e.g., "OrderLab", "ResepFarmasi"
} & GormModel;
