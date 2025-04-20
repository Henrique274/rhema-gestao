
import React, { useState, useEffect } from "react";
import { firebaseDB } from "@/lib/firebase";
import { Member, Service, Attendance } from "@/types";
import { CheckCircle2, XCircle, Search, UserCheck } from "lucide-react";

export const AttendanceForm: React.FC = () => {
  // Estados
  const [members, setMembers] = useState<Member[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [attendanceRecords, setAttendanceRecords] = useState<Map<string, boolean>>(new Map());
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Ativo");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Estatísticas
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0
  });
  
  // Carregar dados iniciais
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Carregar serviços (cultos)
        const servicesData = await firebaseDB.getAll('services');
        setServices(servicesData);
        
        // Carregar membros
        const membersData = await firebaseDB.getAll('members');
        setMembers(membersData);
        
        // Configurar data atual
        const today = new Date();
        setSelectedDate(formatDateForInput(today));
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Filtrar membros
  useEffect(() => {
    // Aplicar filtros aos membros
    let filtered = [...members];
    
    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(member => 
        member.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrar por status
    if (statusFilter !== "todos") {
      filtered = filtered.filter(member => member.status === statusFilter);
    }
    
    setFilteredMembers(filtered);
    
    // Atualizar estatísticas
    updateStats(filtered, attendanceRecords);
  }, [members, searchTerm, statusFilter, attendanceRecords]);
  
  // Formato de data para input
  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  
  // Formato de data para exibição
  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Atualizar estatísticas
  const updateStats = (members: Member[], attendanceMap: Map<string, boolean>) => {
    const total = members.length;
    let present = 0;
    
    members.forEach(member => {
      if (attendanceMap.get(member.id || "")) {
        present++;
      }
    });
    
    setStats({
      total,
      present,
      absent: total - present
    });
  };
  
  // Manipular mudança de presença
  const handleAttendanceChange = (memberId?: string, isPresent: boolean = false) => {
    if (!memberId) return;
    
    const newAttendance = new Map(attendanceRecords);
    newAttendance.set(memberId, isPresent);
    setAttendanceRecords(newAttendance);
  };
  
  // Carregar registros de presença existentes
  const loadAttendanceRecords = async () => {
    if (!selectedService || !selectedDate) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Em um cenário real, faríamos uma consulta ao Firebase para obter os registros
      // Aqui, vamos simular a recuperação de dados
      
      // Criar registros de presença vazios para todos os membros
      const newAttendance = new Map<string, boolean>();
      members.forEach(member => {
        newAttendance.set(member.id || "", false);
      });
      
      setAttendanceRecords(newAttendance);
      
    } catch (error) {
      console.error("Erro ao carregar registros de presença:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Limpar formulário
  const resetForm = () => {
    setAttendanceRecords(new Map());
    setSearchTerm("");
    setSaveSuccess(false);
  };
  
  // Salvar registros de presença
  const handleSave = async () => {
    if (!selectedService || !selectedDate) {
      alert("Por favor, selecione um culto e uma data.");
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Criar data para registros
      const recordDate = new Date(selectedDate);
      
      // Obter serviço selecionado
      const service = services.find(s => s.id === selectedService);
      
      if (!service) {
        throw new Error("Serviço não encontrado");
      }
      
      // Preparar registros para salvar
      const records: Attendance[] = [];
      
      filteredMembers.forEach(member => {
        if (member.id) {
          records.push({
            memberId: member.id,
            memberName: member.name,
            serviceId: service.id,
            serviceName: service.name,
            date: recordDate,
            present: attendanceRecords.get(member.id) || false
          });
        }
      });
      
      // Salvar registros
      // Em um cenário real, salvaríamos no Firebase
      console.log("Salvando registros de presença:", records);
      
      // Simular sucesso após salvar
      setSaveSuccess(true);
      
      // Limpar depois de alguns segundos
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error("Erro ao salvar presenças:", error);
      alert("Ocorreu um erro ao salvar os registros de presença.");
    } finally {
      setIsSaving(false);
    }
  };
  
  // Marcar todos presentes/ausentes
  const markAll = (present: boolean) => {
    const newAttendance = new Map(attendanceRecords);
    
    filteredMembers.forEach(member => {
      if (member.id) {
        newAttendance.set(member.id, present);
      }
    });
    
    setAttendanceRecords(newAttendance);
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Cabeçalho */}
      <div className="p-5 border-b border-gray-200 bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-800">
          Registro de Presenças
        </h2>
      </div>
      
      {/* Formulário de seleção */}
      <div className="p-5 bg-white border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Seleção do culto */}
          <div className="space-y-2">
            <label htmlFor="service" className="block text-sm font-medium text-gray-700">
              Culto *
            </label>
            <select
              id="service"
              value={selectedService}
              onChange={(e) => {
                setSelectedService(e.target.value);
                resetForm();
                loadAttendanceRecords();
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-500"
              disabled={isLoading}
            >
              <option value="">Selecione o culto</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Seleção da data */}
          <div className="space-y-2">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Data *
            </label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                resetForm();
                loadAttendanceRecords();
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-500"
              disabled={isLoading}
            />
            {selectedDate && (
              <p className="text-xs text-gray-500">
                {formatDateForDisplay(selectedDate)}
              </p>
            )}
          </div>
          
          {/* Busca */}
          <div className="space-y-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Buscar membro
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                id="search"
                placeholder="Nome do membro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-church-500 focus:border-church-500"
              />
            </div>
          </div>
          
          {/* Status filter */}
          <div className="space-y-2">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status do membro
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-500"
            >
              <option value="Ativo">Ativos</option>
              <option value="Inativo">Inativos</option>
              <option value="todos">Todos</option>
            </select>
          </div>
        </div>
        
        {/* Estatísticas e ações */}
        <div className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {/* Total */}
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <p className="text-xs font-medium text-gray-500 uppercase">Total de Membros</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            
            {/* Presentes */}
            <div className="bg-green-50 p-4 rounded-md border border-green-200">
              <p className="text-xs font-medium text-green-600 uppercase">Presentes</p>
              <p className="text-2xl font-bold text-green-700">{stats.present}</p>
            </div>
            
            {/* Ausentes */}
            <div className="bg-red-50 p-4 rounded-md border border-red-200">
              <p className="text-xs font-medium text-red-600 uppercase">Ausentes</p>
              <p className="text-2xl font-bold text-red-700">{stats.absent}</p>
            </div>
          </div>
          
          {/* Ações em massa */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => markAll(true)}
              disabled={filteredMembers.length === 0 || isSaving}
              className="inline-flex items-center px-3 py-2 border border-green-600 text-sm font-medium rounded-md text-green-700 bg-white hover:bg-green-50"
            >
              <CheckCircle2 size={16} className="mr-2" />
              Marcar Todos Presentes
            </button>
            
            <button
              onClick={() => markAll(false)}
              disabled={filteredMembers.length === 0 || isSaving}
              className="inline-flex items-center px-3 py-2 border border-red-600 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
            >
              <XCircle size={16} className="mr-2" />
              Marcar Todos Ausentes
            </button>
            
            <button
              onClick={handleSave}
              disabled={!selectedService || !selectedDate || filteredMembers.length === 0 || isSaving}
              className="ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-church-600 hover:bg-church-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <UserCheck size={16} className="mr-2" />
              {isSaving ? "Salvando..." : "Salvar Presenças"}
            </button>
          </div>
          
          {/* Mensagem de sucesso */}
          {saveSuccess && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
              <p className="flex items-center">
                <CheckCircle2 size={16} className="mr-2" />
                Presenças registradas com sucesso!
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Lista de membros para marcar presença */}
      <div className="divide-y divide-gray-200">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-church-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Carregando...</span>
            </div>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>Nenhum membro encontrado com os critérios selecionados.</p>
          </div>
        ) : (
          filteredMembers.map((member) => {
            const isPresent = attendanceRecords.get(member.id || "") || false;
            
            return (
              <div key={member.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                    member.status === 'Ativo' ? 'bg-church-600' : 'bg-gray-400'
                  }`}>
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                    <div className="flex mt-1 flex-wrap gap-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border badge-${member.category.toLowerCase()}`}>
                        {member.category}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <button
                    onClick={() => handleAttendanceChange(member.id, true)}
                    className={`mr-2 p-2 rounded-full ${
                      isPresent
                        ? 'bg-green-100 text-green-700 ring-2 ring-green-600'
                        : 'bg-gray-100 text-gray-400 hover:bg-green-50 hover:text-green-600'
                    }`}
                  >
                    <CheckCircle2 size={20} />
                  </button>
                  
                  <button
                    onClick={() => handleAttendanceChange(member.id, false)}
                    className={`p-2 rounded-full ${
                      !isPresent
                        ? 'bg-red-100 text-red-700 ring-2 ring-red-600'
                        : 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-600'
                    }`}
                  >
                    <XCircle size={20} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
