import type { 
  MasterLookup, 
  Patient, 
  Poli, 
  Dokter, 
  Ruangan, 
  Tindakan, 
  Penjamin,
  Kunjungan,
  AsesmenKeperawatan,
  SOAP
} from '$lib/types';

// Import JSON data
import masterLookupData from './master-lookup.json';
import poliData from './poli.json';
import dokterData from './dokter.json';
import ruanganData from './ruangan.json';
import tindakanData from './tindakan.json';
import penjaminData from './penjamin.json';
import pasienData from './pasien.json';

/**
 * Dummy API Service
 * This simulates backend API calls with local JSON data
 * All functions return Promises to simulate async behavior
 */

// Helper to simulate API delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================
// MASTER DATA SERVICES
// ============================================

export const masterDataService = {
  // Master Lookup
  async getMasterLookup(category?: string): Promise<MasterLookup[]> {
    await delay();
    const data = masterLookupData as MasterLookup[];
    if (category) {
      return data.filter(item => item.category === category);
    }
    return data;
  },

  async getMasterLookupById(id: string): Promise<MasterLookup | null> {
    await delay();
    const data = masterLookupData as MasterLookup[];
    return data.find(item => item.id === id) || null;
  },

  async createMasterLookup(item: Omit<MasterLookup, 'id'>): Promise<MasterLookup> {
    await delay();
    const newItem: MasterLookup = {
      id: `${item.category.toLowerCase()}-${Date.now()}`,
      ...item
    };
    // In real app, this would save to backend
    return newItem;
  },

  async updateMasterLookup(id: string, item: Partial<MasterLookup>): Promise<MasterLookup> {
    await delay();
    const data = masterLookupData as MasterLookup[];
    const existing = data.find(i => i.id === id);
    if (!existing) throw new Error('Item not found');
    return { ...existing, ...item };
  },

  async deleteMasterLookup(id: string): Promise<void> {
    await delay();
    // In real app, this would delete from backend
  },

  // Poli
  async getPoli(): Promise<Poli[]> {
    await delay();
    return poliData as Poli[];
  },

  async getPoliById(id: string): Promise<Poli | null> {
    await delay();
    const data = poliData as Poli[];
    return data.find(item => item.id === id) || null;
  },

  async createPoli(item: Omit<Poli, 'id' | 'created_at' | 'updated_at'>): Promise<Poli> {
    await delay();
    const newItem: Poli = {
      id: `poli-${Date.now()}`,
      ...item,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return newItem;
  },

  async updatePoli(id: string, item: Partial<Poli>): Promise<Poli> {
    await delay();
    const data = poliData as Poli[];
    const existing = data.find(i => i.id === id);
    if (!existing) throw new Error('Poli not found');
    return { ...existing, ...item, updated_at: new Date().toISOString() };
  },

  async deletePoli(id: string): Promise<void> {
    await delay();
  },

  // Dokter
  async getDokter(poliId?: string): Promise<Dokter[]> {
    await delay();
    const data = dokterData as Dokter[];
    if (poliId) {
      return data.filter(item => item.poli_id === poliId && item.is_active);
    }
    return data;
  },

  async getDokterById(id: string): Promise<Dokter | null> {
    await delay();
    const data = dokterData as Dokter[];
    return data.find(item => item.id === id) || null;
  },

  async createDokter(item: Omit<Dokter, 'id' | 'created_at' | 'updated_at'>): Promise<Dokter> {
    await delay();
    const newItem: Dokter = {
      id: `dokter-${Date.now()}`,
      ...item,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return newItem;
  },

  async updateDokter(id: string, item: Partial<Dokter>): Promise<Dokter> {
    await delay();
    const data = dokterData as Dokter[];
    const existing = data.find(i => i.id === id);
    if (!existing) throw new Error('Dokter not found');
    return { ...existing, ...item, updated_at: new Date().toISOString() };
  },

  async deleteDokter(id: string): Promise<void> {
    await delay();
  },

  // Ruangan
  async getRuangan(jenis?: string): Promise<Ruangan[]> {
    await delay();
    const data = ruanganData as Ruangan[];
    if (jenis) {
      return data.filter(item => item.jenis === jenis && item.is_active);
    }
    return data;
  },

  async getRuanganById(id: string): Promise<Ruangan | null> {
    await delay();
    const data = ruanganData as Ruangan[];
    return data.find(item => item.id === id) || null;
  },

  async createRuangan(item: Omit<Ruangan, 'id' | 'created_at' | 'updated_at'>): Promise<Ruangan> {
    await delay();
    const newItem: Ruangan = {
      id: `ruangan-${Date.now()}`,
      ...item,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return newItem;
  },

  async updateRuangan(id: string, item: Partial<Ruangan>): Promise<Ruangan> {
    await delay();
    const data = ruanganData as Ruangan[];
    const existing = data.find(i => i.id === id);
    if (!existing) throw new Error('Ruangan not found');
    return { ...existing, ...item, updated_at: new Date().toISOString() };
  },

  async deleteRuangan(id: string): Promise<void> {
    await delay();
  },

  // Tindakan
  async getTindakan(): Promise<Tindakan[]> {
    await delay();
    return tindakanData as Tindakan[];
  },

  async getTindakanById(id: string): Promise<Tindakan | null> {
    await delay();
    const data = tindakanData as Tindakan[];
    return data.find(item => item.id === id) || null;
  },

  async createTindakan(item: Omit<Tindakan, 'id' | 'created_at' | 'updated_at'>): Promise<Tindakan> {
    await delay();
    const newItem: Tindakan = {
      id: `tindakan-${Date.now()}`,
      ...item,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return newItem;
  },

  async updateTindakan(id: string, item: Partial<Tindakan>): Promise<Tindakan> {
    await delay();
    const data = tindakanData as Tindakan[];
    const existing = data.find(i => i.id === id);
    if (!existing) throw new Error('Tindakan not found');
    return { ...existing, ...item, updated_at: new Date().toISOString() };
  },

  async deleteTindakan(id: string): Promise<void> {
    await delay();
  },

  // Penjamin
  async getPenjamin(): Promise<Penjamin[]> {
    await delay();
    return penjaminData as Penjamin[];
  },

  async getPenjaminById(id: string): Promise<Penjamin | null> {
    await delay();
    const data = penjaminData as Penjamin[];
    return data.find(item => item.id === id) || null;
  },

  async createPenjamin(item: Omit<Penjamin, 'id' | 'created_at' | 'updated_at'>): Promise<Penjamin> {
    await delay();
    const newItem: Penjamin = {
      id: `penjamin-${Date.now()}`,
      ...item,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return newItem;
  },

  async updatePenjamin(id: string, item: Partial<Penjamin>): Promise<Penjamin> {
    await delay();
    const data = penjaminData as Penjamin[];
    const existing = data.find(i => i.id === id);
    if (!existing) throw new Error('Penjamin not found');
    return { ...existing, ...item, updated_at: new Date().toISOString() };
  },

  async deletePenjamin(id: string): Promise<void> {
    await delay();
  }
};

// ============================================
// PATIENT SERVICES
// ============================================

export const patientService = {
  async searchPatient(query: string): Promise<Patient[]> {
    await delay();
    const data = pasienData as Patient[];
    const lowerQuery = query.toLowerCase();
    return data.filter(p => 
      p.no_rm.toLowerCase().includes(lowerQuery) ||
      p.nik.includes(query) ||
      p.nama_lengkap.toLowerCase().includes(lowerQuery) ||
      p.no_hp.includes(query)
    );
  },

  async getPatientById(id: string): Promise<Patient | null> {
    await delay();
    const data = pasienData as Patient[];
    return data.find(p => p.id === id) || null;
  },

  async getPatientByRM(noRm: string): Promise<Patient | null> {
    await delay();
    const data = pasienData as Patient[];
    return data.find(p => p.no_rm === noRm) || null;
  },

  async getPatientByNIK(nik: string): Promise<Patient | null> {
    await delay();
    const data = pasienData as Patient[];
    return data.find(p => p.nik === nik) || null;
  },

  async createPatient(patient: Omit<Patient, 'id' | 'no_rm' | 'created_at' | 'updated_at'>): Promise<Patient> {
    await delay();
    
    // Generate No. RM (format: YYMM-XXXXX)
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const sequence = (pasienData.length + 1).toString().padStart(5, '0');
    const no_rm = `${year}${month}-${sequence}`;

    const newPatient: Patient = {
      id: `pasien-${Date.now()}`,
      no_rm,
      ...patient,
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    };

    return newPatient;
  },

  async updatePatient(id: string, patient: Partial<Patient>): Promise<Patient> {
    await delay();
    const data = pasienData as Patient[];
    const existing = data.find(p => p.id === id);
    if (!existing) throw new Error('Patient not found');
    return { ...existing, ...patient, updated_at: new Date().toISOString() };
  },

  async deletePatient(id: string): Promise<void> {
    await delay();
  }
};

// ============================================
// VISIT/KUNJUNGAN SERVICES
// ============================================

// In-memory storage for kunjungan (visits)
let kunjunganStore: Kunjungan[] = [];

export const kunjunganService = {
  async getKunjungan(status?: string, tanggal?: string): Promise<Kunjungan[]> {
    await delay();
    let filtered = [...kunjunganStore];
    if (status) {
      filtered = filtered.filter(k => k.status_kunjungan === status);
    }
    if (tanggal) {
      filtered = filtered.filter(k => k.tanggal_kunjungan === tanggal);
    }
    return filtered.sort((a, b) => b.created_at.localeCompare(a.created_at));
  },

  async getKunjunganById(id: string): Promise<Kunjungan | null> {
    await delay();
    return kunjunganStore.find(k => k.id === id) || null;
  },

  async getKunjunganByPasien(pasienId: string): Promise<Kunjungan[]> {
    await delay();
    return kunjunganStore.filter(k => k.pasien_id === pasienId);
  },

  async createKunjungan(kunjungan: Omit<Kunjungan, 'id' | 'no_registrasi' | 'no_antrian' | 'status_kunjungan' | 'created_at' | 'updated_at'>): Promise<Kunjungan> {
    await delay();

    // Generate No. Registrasi (format: YYYYMMDD-XXXX)
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
    const todayVisits = kunjunganStore.filter(k => k.tanggal_kunjungan === kunjungan.tanggal_kunjungan);
    const sequence = (todayVisits.length + 1).toString().padStart(4, '0');
    const no_registrasi = `${dateStr}-${sequence}`;

    // Generate queue number for the poli
    const poliVisits = todayVisits.filter(k => 
      k.poli_id === kunjungan.poli_id && 
      k.tanggal_kunjungan === kunjungan.tanggal_kunjungan
    );
    const no_antrian = poliVisits.length + 1;

    const newKunjungan: Kunjungan = {
      id: `kunjungan-${Date.now()}`,
      no_registrasi,
      no_antrian,
      status_kunjungan: 'DAFTAR',
      ...kunjungan,
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    };

    kunjunganStore.push(newKunjungan);
    return newKunjungan;
  },

  async updateKunjungan(id: string, kunjungan: Partial<Kunjungan>): Promise<Kunjungan> {
    await delay();
    const index = kunjunganStore.findIndex(k => k.id === id);
    if (index === -1) throw new Error('Kunjungan not found');
    
    kunjunganStore[index] = {
      ...kunjunganStore[index],
      ...kunjungan,
      updated_at: new Date().toISOString()
    };
    
    return kunjunganStore[index];
  },

  async deleteKunjungan(id: string): Promise<void> {
    await delay();
    kunjunganStore = kunjunganStore.filter(k => k.id !== id);
  }
};

// ============================================
// EMR SERVICES
// ============================================

// In-memory storage for EMR data
let asesmenStore: AsesmenKeperawatan[] = [];
let soapStore: SOAP[] = [];

export const emrService = {
  // Asesmen Keperawatan
  async getAsesmenByKunjungan(kunjunganId: string): Promise<AsesmenKeperawatan | null> {
    await delay();
    return asesmenStore.find(a => a.kunjungan_id === kunjunganId) || null;
  },

  async createAsesmen(asesmen: Omit<AsesmenKeperawatan, 'id' | 'created_at' | 'updated_at'>): Promise<AsesmenKeperawatan> {
    await delay();
    const newAsesmen: AsesmenKeperawatan = {
      id: `asesmen-${Date.now()}`,
      ...asesmen,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    asesmenStore.push(newAsesmen);
    return newAsesmen;
  },

  async updateAsesmen(id: string, asesmen: Partial<AsesmenKeperawatan>): Promise<AsesmenKeperawatan> {
    await delay();
    const index = asesmenStore.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Asesmen not found');
    
    asesmenStore[index] = {
      ...asesmenStore[index],
      ...asesmen,
      updated_at: new Date().toISOString()
    };
    
    return asesmenStore[index];
  },

  // SOAP
  async getSOAPByKunjungan(kunjunganId: string): Promise<SOAP[]> {
    await delay();
    return soapStore.filter(s => s.kunjungan_id === kunjunganId);
  },

  async createSOAP(soap: Omit<SOAP, 'id' | 'created_at' | 'updated_at'>): Promise<SOAP> {
    await delay();
    const newSOAP: SOAP = {
      id: `soap-${Date.now()}`,
      ...soap,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    soapStore.push(newSOAP);
    return newSOAP;
  },

  async updateSOAP(id: string, soap: Partial<SOAP>): Promise<SOAP> {
    await delay();
    const index = soapStore.findIndex(s => s.id === id);
    if (index === -1) throw new Error('SOAP not found');
    
    soapStore[index] = {
      ...soapStore[index],
      ...soap,
      updated_at: new Date().toISOString()
    };
    
    return soapStore[index];
  }
};
