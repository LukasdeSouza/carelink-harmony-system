export type StaffRole = 
  | 'FISIOTERAPEUTA'
  | 'MEDICO'
  | 'ENFERMEIRO'
  | 'TECNICO_ENFERMAGEM'
  | 'INSTRUMENTISTA'
  | 'FARMACEUTICO'
  | 'SECRETARIA';

export interface Staff {
  id: string;
  nome: string;
  documento_pessoal: string;
  email: string;
  telefone: string;
  endereco: string;
  registro_profissional?: string;
  funcao: StaffRole;
  data_criacao: string;
  profile_id?: string;
}

export interface Nurse {
  id: string;
  fullName: string;
  document: string; // CPF or CNPJ
  gender: 'male' | 'female' | 'other';
  address: string;
  email: string;
  phone: string;
  cboCode?: string; // Optional for non-nursing technicians
}

export interface Patient {
  id: string;
  responsibleName: string;
  responsibleCPF: string;
  address: string;
  email: string;
  phone1: string;
  phone2: string;
  patientName: string;
  gender: 'male' | 'female' | 'other';
  patientCPF: string;
  birthDate: string;
  observations: string;
}
