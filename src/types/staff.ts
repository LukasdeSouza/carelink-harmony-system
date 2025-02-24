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
  nome: string;
  email: string;
  documento: string;
  cidade_natal: string;
  estado_natal: string;
  telefone_familia: string;
  idade: number;
  peso: number;
  altura: number;
  anamnese_id?: number;
  atestado_id?: number;
}
