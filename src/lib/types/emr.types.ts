import type { GormModel } from '../types';

// EMR Record
export type EMRRecord = {
	ID: string;
	KunjunganID: string;
	PasienID: string;
	DokterID: string;
	TanggalPemeriksaan: string;
	// SOAP
	Subjective: string; // Keluhan pasien
	Objective: string; // Hasil pemeriksaan
	Assessment: string; // Diagnosa
	Plan: string; // Rencana tindakan
	// Vital Signs
	TekananDarah?: string;
	Nadi?: number;
	Suhu?: number;
	RespirasiRate?: number;
	BeratBadan?: number;
	TinggiBadan?: number;
	// Clinical Data
	Alergi?: string[];
	RiwayatPenyakit?: string;
	RiwayatPengobatan?: string;
	// Diagnosis (Multiple ICD-10)
	DiagnosisUtama?: string; // ICD-10 ID
	DiagnosisSekunder?: string[]; // Array of ICD-10 IDs
	// Procedure (Multiple ICD-9 CM)
	ProsedurUtama?: string; // ICD-9 CM ID
	ProsedurSekunder?: string[]; // Array of ICD-9 CM IDs
	Status: 'Draft' | 'Verified' | 'Finalized';
} & GormModel;

// Order Penunjang (Supporting Examination Order)
export type OrderPenunjang = {
	ID: string;
	EMRRecordID: string;
	KunjunganID: string;
	JenisOrder: 'Lab' | 'Radiologi';
	TanggalOrder: string;
	DokterPengirim: string;
	Catatan?: string;
	Status: 'Pending' | 'Diproses' | 'Selesai' | 'Batal';
} & GormModel;

// Order Item (Detail of Order)
export type OrderPenunjangItem = {
	ID: string;
	OrderPenunjangID: string;
	ItemID: string; // Lab Test ID or Radiology Exam ID
	NamaItem: string;
	Instruksi?: string;
	Status: 'Pending' | 'Diproses' | 'Selesai';
} & GormModel;

// E-Resep (Electronic Prescription)
export type Resep = {
	ID: string;
	EMRRecordID: string;
	KunjunganID: string;
	DokterID: string;
	TanggalResep: string;
	Catatan?: string;
	Status: 'Pending' | 'Diproses' | 'Selesai' | 'Batal';
} & GormModel;

// Resep Item (Prescription Detail)
export type ResepItem = {
	ID: string;
	ResepID: string;
	ObatID: string;
	NamaObat: string;
	Jumlah: number;
	Satuan: string;
	Dosis: string;
	Frekuensi: string;
	Durasi: string;
	Rute: string; // e.g., "Oral", "IV", "IM"
	Instruksi?: string;
	Status: 'Pending' | 'Disiapkan' | 'Diserahkan';
} & GormModel;

// Riwayat Penyakit (Medical History)
export type RiwayatPenyakit = {
	ID: string;
	PasienID: string;
	JenisRiwayat: 'Pribadi' | 'Keluarga';
	Penyakit: string;
	Keterangan?: string;
	TahunDiagnosa?: string;
} & GormModel;

// Alergi (Allergies)
export type Alergi = {
	ID: string;
	PasienID: string;
	JenisAlergi: 'Obat' | 'Makanan' | 'Lainnya';
	NamaAlergen: string;
	Reaksi: string;
	Tingkat: 'Ringan' | 'Sedang' | 'Berat';
	TanggalDiketahui?: string;
} & GormModel;

// Edukasi Pasien
export type EdukasiPasien = {
	ID: string;
	EMRRecordID: string;
	PasienID: string;
	TanggalEdukasi: string;
	MateriEdukasi: string;
	EdukatorID: string; // Employee ID
	MetodeEdukasi: string; // e.g., "Verbal", "Demonstrasi", "Media Visual"
	EvaluasiPemahaman: 'Paham' | 'Kurang Paham' | 'Tidak Paham';
	TandaTanganPasien?: string;
	Catatan?: string;
} & GormModel;
