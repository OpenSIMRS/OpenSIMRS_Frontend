import type { GormModel } from '../types';

// Billing/Invoice
export type Billing = {
	ID: string;
	NomorBilling: string;
	KunjunganID: string;
	PasienID: string;
	PenjaminID: string;
	TanggalBilling: string;
	TotalBiaya: number;
	TotalDiskon: number;
	TotalPajak: number;
	TotalTagihan: number;
	TotalBayar: number;
	SisaTagihan: number;
	Status: 'Draft' | 'Final' | 'Lunas' | 'Piutang' | 'Batal';
	KasirID?: string; // Employee ID
	TanggalLunas?: string;
} & GormModel;

// Item Billing
export type ItemBilling = {
	ID: string;
	BillingID: string;
	JenisItem: 'Tindakan' | 'Obat' | 'Alkes' | 'BHP' | 'Kamar' | 'Konsultasi' | 'Lainnya';
	ItemID: string; // TindakanID, ObatID, KamarID, etc.
	NamaItem: string;
	Jumlah: number;
	HargaSatuan: number;
	Subtotal: number;
	Diskon: number;
	Total: number;
	TanggalLayanan: string;
	DokterPelaksana?: string; // Employee ID
	RuanganID?: string;
	Catatan?: string;
} & GormModel;

// Pembayaran (Payment)
export type Pembayaran = {
	ID: string;
	BillingID: string;
	NomorPembayaran: string;
	TanggalPembayaran: string;
	MetodePembayaran: 'Tunai' | 'Kartu Debit' | 'Kartu Kredit' | 'Transfer' | 'QRIS';
	JumlahBayar: number;
	NomorReferensi?: string; // for card/transfer payments
	KasirID: string; // Employee ID
	Catatan?: string;
} & GormModel;

// Deposit Pasien (Patient Deposit)
export type DepositPasien = {
	ID: string;
	PasienID: string;
	KunjunganID?: string;
	TanggalDeposit: string;
	JumlahDeposit: number;
	JumlahTerpakai: number;
	SisaDeposit: number;
	MetodePembayaran: 'Tunai' | 'Kartu Debit' | 'Kartu Kredit' | 'Transfer';
	Status: 'Aktif' | 'Terpakai' | 'Dikembalikan';
	KasirID: string; // Employee ID
} & GormModel;

// Pengembalian Deposit
export type PengembalianDeposit = {
	ID: string;
	DepositPasienID: string;
	TanggalPengembalian: string;
	JumlahDikembalikan: number;
	MetodePengembalian: 'Tunai' | 'Transfer';
	KasirID: string; // Employee ID
	Catatan?: string;
} & GormModel;

// Diskon
export type DiskonBilling = {
	ID: string;
	BillingID: string;
	JenisDiskon: 'Persentase' | 'Nominal';
	NilaiDiskon: number;
	AlasanDiskon: string;
	DisetujuiOleh: string; // Employee ID
	TanggalPersetujuan: string;
} & GormModel;

// Retur Billing (Return/Refund)
export type ReturBilling = {
	ID: string;
	BillingID: string;
	ItemBillingID: string;
	TanggalRetur: string;
	JumlahRetur: number;
	AlasanRetur: string;
	NilaiRetur: number;
	DisetujuiOleh: string; // Employee ID
	Status: 'Pending' | 'Disetujui' | 'Ditolak';
	Catatan?: string;
} & GormModel;

// Piutang (Accounts Receivable)
export type Piutang = {
	ID: string;
	BillingID: string;
	PasienID: string;
	PenjaminID?: string;
	TotalPiutang: number;
	Terbayar: number;
	SisaPiutang: number;
	TanggalJatuhTempo?: string;
	Status: 'Belum Dibayar' | 'Cicilan' | 'Lunas' | 'Bad Debt';
} & GormModel;

// Cicilan Piutang
export type CicilanPiutang = {
	ID: string;
	PiutangID: string;
	TanggalCicilan: string;
	JumlahCicilan: number;
	MetodePembayaran: 'Tunai' | 'Transfer';
	KasirID: string; // Employee ID
	Catatan?: string;
} & GormModel;
