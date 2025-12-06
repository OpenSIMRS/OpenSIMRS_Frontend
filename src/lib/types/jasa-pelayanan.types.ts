import type { GormModel } from '../types';

// Jasa Pelayanan Configuration
export type KonfigurasiJP = {
	ID: string;
	JenisLayanan: string; // e.g., "Konsultasi", "Tindakan", "Lab", "Radiologi"
	TindakanID?: string;
	PersentaseTotal: number; // Total percentage for this service
	PembagianDokter: number; // Percentage for doctor
	PembagianPerawat: number; // Percentage for nurse
	PembagianAnalis: number; // Percentage for analyst
	PembagianRS: number; // Percentage for hospital
	Status: 'Aktif' | 'Nonaktif';
} & GormModel;

// Jasa Pelayanan per Transaksi
export type JasaPelayanan = {
	ID: string;
	BillingID: string;
	ItemBillingID: string;
	TanggalLayanan: string;
	TotalJP: number;
	Status: 'Pending' | 'Calculated' | 'Distributed';
} & GormModel;

// Detail Jasa Pelayanan per Pegawai
export type DetailJasaPelayanan = {
	ID: string;
	JasaPelayananID: string;
	PegawaiID: string;
	Peran: string; // e.g., "Dokter", "Perawat", "Analis", "Radiografer"
	PersentaseJP: number;
	NominalJP: number;
	Status: 'Pending' | 'Approved' | 'Paid';
} & GormModel;

// Periode Pembayaran JP
export type PeriodeJP = {
	ID: string;
	NamaPeriode: string;
	TanggalMulai: string;
	TanggalSelesai: string;
	Status: 'Open' | 'Closed' | 'Paid';
} & GormModel;

// Rekapitulasi JP per Pegawai per Periode
export type RekapitulasiJP = {
	ID: string;
	PeriodeJPID: string;
	PegawaiID: string;
	TotalJP: number;
	Potongan: number; // e.g., pajak, iuran
	JasaBersih: number;
	Status: 'Draft' | 'Approved' | 'Paid';
	TanggalBayar?: string;
} & GormModel;

// Pembayaran JP
export type PembayaranJP = {
	ID: string;
	RekapitulasiJPID: string;
	TanggalPembayaran: string;
	JumlahBayar: number;
	MetodePembayaran: 'Transfer' | 'Tunai';
	NomorReferensi?: string;
	DiprosesPada: string;
	DiprosesOleh: string; // Employee ID
	Catatan?: string;
} & GormModel;

// Potongan JP
export type PotonganJP = {
	ID: string;
	RekapitulasiJPID: string;
	JenisPotongan: string; // e.g., "Pajak", "Iuran BPJS Ketenagakerjaan"
	Persentase?: number;
	NominalPotongan: number;
} & GormModel;
