import type { GormModel } from '../types';

// Master Pasien (Patient Master)
export type Patient = {
	ID: string;
	NoRM: string; // Medical Record Number
	NIK: string; // National ID
	Nama: string;
	TanggalLahir: string;
	JenisKelamin: 'L' | 'P'; // L = Laki-laki, P = Perempuan
	Alamat: string;
	NoTelepon: string;
	Email?: string;
	Agama: string;
	Pekerjaan: string;
	StatusPerkawinan: string;
	GolonganDarah?: string;
	Alergi?: string[];
	NomorKartuBPJS?: string;
	NomorKartuAsuransi?: string;
} & GormModel;

// Master Pegawai (Employee Master)
export type Employee = {
	ID: string;
	NIP: string; // Employee ID Number
	Nama: string;
	JenisKelamin: 'L' | 'P';
	TanggalLahir: string;
	Jabatan: string;
	Unit: string;
	NoTelepon: string;
	Email: string;
	Status: 'Aktif' | 'Nonaktif';
	PersentaseJP?: number; // Jasa Pelayanan percentage
} & GormModel;

// Master ICD-10 (Diagnosis)
export type ICD10 = {
	ID: string;
	Kode: string; // e.g., "A00.0"
	Deskripsi: string;
	KategoriUtama: string;
	Status: 'Aktif' | 'Nonaktif';
} & GormModel;

// Master ICD-9 CM (Procedure)
export type ICD9CM = {
	ID: string;
	Kode: string; // e.g., "00.01"
	Deskripsi: string;
	KategoriUtama: string;
	Status: 'Aktif' | 'Nonaktif';
} & GormModel;

// Master Ruangan (Room/Unit)
export type Ruangan = {
	ID: string;
	KodeRuangan: string;
	NamaRuangan: string;
	JenisRuangan: 'Poliklinik' | 'Lab' | 'Radiologi' | 'Farmasi' | 'IGD' | 'Rawat Inap' | 'Lainnya';
	Lantai?: number;
	Gedung?: string;
	Status: 'Aktif' | 'Nonaktif';
} & GormModel;

// Master Kamar (Bed/Room for Inpatient)
export type Kamar = {
	ID: string;
	RuanganID: string;
	NomorKamar: string;
	KelasPelayanan: 'VIP' | 'Kelas 1' | 'Kelas 2' | 'Kelas 3';
	JumlahBed: number;
	BedTersedia: number;
	TarifPerHari: number;
	Status: 'Tersedia' | 'Terisi' | 'Maintenance';
} & GormModel;

// Master Penjamin (Insurance/Guarantor)
export type Penjamin = {
	ID: string;
	KodePenjamin: string;
	NamaPenjamin: string;
	JenisPenjamin: 'BPJS' | 'Asuransi Swasta' | 'Perusahaan' | 'Umum';
	NoKontrak?: string;
	TanggalMulai?: string;
	TanggalBerakhir?: string;
	PersentaseDiskon?: number;
	Status: 'Aktif' | 'Nonaktif';
} & GormModel;

// Master Obat/Alkes/BHP (Medicine/Medical Supplies)
export type Barang = {
	ID: string;
	KodeBarang: string;
	NamaBarang: string;
	JenisBarang: 'Obat' | 'Alkes' | 'BHP';
	Satuan: string;
	HargaBeli: number;
	HargaJual: number;
	StokMinimal: number;
	StokAktual: number;
	TanggalKadaluarsa?: string;
	NoBatch?: string;
	Status: 'Aktif' | 'Nonaktif';
} & GormModel;

// Master Tindakan (Procedures/Services)
export type Tindakan = {
	ID: string;
	KodeTindakan: string;
	NamaTindakan: string;
	Kategori: string;
	ICD9CMID?: string;
	BiayaDasar: number;
	Status: 'Aktif' | 'Nonaktif';
} & GormModel;

// Master Tarif (Tariff Matrix: Tindakan x Kelas x Penjamin)
export type Tarif = {
	ID: string;
	TindakanID: string;
	KelasPelayanan: 'VIP' | 'Kelas 1' | 'Kelas 2' | 'Kelas 3' | 'Umum';
	PenjaminID: string;
	Harga: number;
	PersentaseJP?: number;
	Status: 'Aktif' | 'Nonaktif';
} & GormModel;

// Master Supplier
export type Supplier = {
	ID: string;
	KodeSupplier: string;
	NamaSupplier: string;
	Alamat: string;
	NoTelepon: string;
	Email?: string;
	ContactPerson: string;
	TermPembayaran: string; // e.g., "Net 30"
	Status: 'Aktif' | 'Nonaktif';
} & GormModel;

// Master Demografi
export type Agama = {
	ID: string;
	Nama: string;
};

export type Pekerjaan = {
	ID: string;
	Nama: string;
};

export type StatusPerkawinan = {
	ID: string;
	Nama: string;
};
