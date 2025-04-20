
// Tipos para o sistema de gerenciamento da igreja

// Tipo para um membro da igreja
export interface Member {
  id?: string;
  name: string;
  age: number;
  gender: 'Masculino' | 'Feminino' | 'Outro';
  phone: string;
  address: string;
  category: 'Jovem' | 'Mamã' | 'Papá' | 'Visitante';
  status: 'Ativo' | 'Inativo';
  role: 'Obreiro' | 'Discípulo' | 'Em Formação';
  createdAt?: Date;
  updatedAt?: Date;
}

// Tipo para um serviço/culto da igreja
export interface Service {
  id: string;
  name: string;
  dayOfWeek?: number;
}

// Tipo para um registro de presença
export interface Attendance {
  id?: string;
  memberId: string;
  memberName: string;
  serviceId: string;
  serviceName: string;
  date: Date;
  present: boolean;
}

// Tipo para estatísticas de presença
export interface AttendanceStats {
  totalMembers: number;
  presentCount: number;
  absentCount: number;
  serviceDate: Date;
  serviceId: string;
}

// Tipo para relatório de faltas
export interface AbsenceReport {
  memberId: string;
  memberName: string;
  category: string;
  role: string;
  absenceDates: Date[];
  consecutiveAbsences: number;
}
