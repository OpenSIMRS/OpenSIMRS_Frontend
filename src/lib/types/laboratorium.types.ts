import type { GormModel } from '../types';

// Master Test Lab
export type TestLab = {
	ID: string;
	KodeTest: string;
	NamaTest: string;
	Kategori: string;
	SatuanHasil: string;
	NilaiNormalMin?: number;
	NilaiNormalMax?: number;
	NilaiNormalTeks?: string;
	MetodeTest?: string;
	Tarif: number;
	Status: 'Aktif' | 'Nonaktif';
} & GormModel;

// Order Lab (dari OrderPenunjang)
export type OrderLab = {
	ID: string;
	NomorOrder: string;
	OrderPenunjangID: string;
	KunjunganID: string;
	PasienID: string;
	DokterPengirim: string;
	TanggalOrder: string;
	Catatan?: string;
	Status: 'Pending' | 'Sampel Diambil' | 'Diproses' | 'Selesai' | 'Batal';
} & GormModel;

// Order Lab Item
export type OrderLabItem = {
	ID: string;
	OrderLabID: string;
	TestLabID: string;
	NamaTest: string;
	Status: 'Pending' | 'Diproses' | 'Selesai';
} & GormModel;

// Sampel Lab
export type SampelLab = {
	ID: string;
	OrderLabID: string;
	NomorSampel: string;
	JenisSampel: string; // e.g., "Darah", "Urine", "Feses"
	WaktuPengambilan: string;
	PetugasPengambil: string; // Employee ID
	KondisiSampel: 'Baik' | 'Hemolisis' | 'Lipemik' | 'Ikterik' | 'Rusak';
	Catatan?: string;
} & GormModel;

// Hasil Lab
export type HasilLab = {
	ID: string;
	OrderLabItemID: string;
	NilaiHasil: string;
	Satuan: string;
	NilaiNormal: string;
	Keterangan?: 'Normal' | 'Tinggi' | 'Rendah';
	MetodeTest?: string;
	TanggalPemeriksaan: string;
	AnalisID: string; // Employee ID
	Status: 'Draft' | 'Validated';
} & GormModel;

// Validasi Hasil Lab
export type ValidasiHasilLab = {
	ID: string;
	OrderLabID: string;
	ValidatorID: string; // Employee ID (usually Senior Analyst or Doctor)
	TanggalValidasi: string;
	Catatan?: string;
	Status: 'Validated';
} & GormModel;

// Tim Terlibat Lab
export type TimLabTerlibat = {
	ID: string;
	OrderLabID: string;
	PegawaiID: string;
	Peran: 'Pengambil Sampel' | 'Analis' | 'Validator';
	PersentaseJP?: number;
} & GormModel;
