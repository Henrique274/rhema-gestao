
import React, { useState, useEffect } from "react";
import { firebaseDB } from "@/lib/firebase";
import { Member, Attendance, AbsenceReport as AbsenceReportType } from "@/types";
import { AlertCircle, Calendar, RefreshCw, Download, Filter } from "lucide-react";

export const AbsenceReport: React.FC = () => {
  // Estados
  const [members, setMembers] = useState<Member[]>([]);
  const [absenceReports, setAbsenceReports] = useState<AbsenceReportType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: getDefaultStartDate(),
    endDate: formatDateForInput(new Date())
  });
  const [filterOptions, setFilterOptions] = useState({
    category: "all",
    minAbsences: 1
  });
  
  // Formatando a data para uso em inputs
  function formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }
  
  // Data padrão de início (uma semana atrás)
  function getDefaultStartDate(): string {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return formatDateForInput(date);
  }
  
  // Carregando dados
  useEffect(() => {
    loadData();
  }, []);
  
  // Carregar dados de membros
  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const membersData = await firebaseDB.getAll('members');
      setMembers(membersData);
      
      // Com os membros carregados, gerar o relatório inicial
      generateReport(membersData, dateRange.startDate, dateRange.endDate);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setError("Não foi possível carregar os dados necessários.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Gerando relatório de faltas
  const generateReport = (membersData: Member[], start: string, end: string) => {
    // Simulando registros de presença (na implementação real, seriam consultados do Firebase)
    // Aqui apenas criamos alguns registros fictícios para demonstração
    
    const mockAttendances = generateMockAttendances(membersData, new Date(start), new Date(end));
    
    // Processar os dados para gerar o relatório
    const reports: AbsenceReportType[] = [];
    
    // Para cada membro, calcular suas faltas
    membersData.forEach(member => {
      if (!member.id) return;
      
      // Filtrar presenças deste membro
      const memberAttendances = mockAttendances.filter(att => att.memberId === member.id);
      
      // Filtrar faltas (where present = false)
      const absences = memberAttendances.filter(att => !att.present);
      
      // Se tem ao menos uma falta, adicionar ao relatório
      if (absences.length > 0) {
        reports.push({
          memberId: member.id,
          memberName: member.name,
          category: member.category,
          role: member.role,
          absenceDates: absences.map(a => a.date),
          consecutiveAbsences: calculateConsecutiveAbsences(absences)
        });
      }
    });
    
    setAbsenceReports(reports);
  };
  
  // Função auxiliar para simular presenças/faltas (apenas para demonstração)
  const generateMockAttendances = (members: Member[], startDate: Date, endDate: Date): Attendance[] => {
    const attendances: Attendance[] = [];
    const services = ["quarta", "sexta", "domingo"];
    const serviceNames = ["Culto de Quarta", "Culto de Sexta", "Culto de Domingo"];
    
    // Para cada membro
    members.forEach(member => {
      if (!member.id) return;
      
      // Para cada serviço
      services.forEach((serviceId, index) => {
        // Para cada data no intervalo
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          // Verificar se o dia da semana corresponde ao serviço
          const dayOfWeek = currentDate.getDay();
          const isServiceDay = 
            (serviceId === "quarta" && dayOfWeek === 3) || // Quarta = 3
            (serviceId === "sexta" && dayOfWeek === 5) || // Sexta = 5
            (serviceId === "domingo" && dayOfWeek === 0); // Domingo = 0
          
          // Se for um dia de culto específico
          if (isServiceDay) {
            // Gerar presença aleatória (70% chance de estar presente)
            const isPresent = Math.random() > 0.3;
            
            attendances.push({
              id: `${member.id}-${serviceId}-${currentDate.toISOString()}`,
              memberId: member.id,
              memberName: member.name,
              serviceId: serviceId,
              serviceName: serviceNames[index],
              date: new Date(currentDate),
              present: isPresent
            });
          }
          
          // Próximo dia
          currentDate.setDate(currentDate.getDate() + 1);
        }
      });
    });
    
    return attendances;
  };
  
  // Calcular faltas consecutivas
  const calculateConsecutiveAbsences = (absences: Attendance[]): number => {
    if (absences.length === 0) return 0;
    
    // Ordenar por data
    const sortedAbsences = [...absences].sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Contar sequência atual
    let maxConsecutive = 1;
    let currentConsecutive = 1;
    
    for (let i = 1; i < sortedAbsences.length; i++) {
      const prevDate = sortedAbsences[i-1].date;
      const currDate = sortedAbsences[i].date;
      
      // Verificar se as datas são consecutivas (considerando apenas dias de culto)
      const diffTime = Math.abs(currDate.getTime() - prevDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 7) { // Consideramos consecutivo se for na próxima semana
        currentConsecutive++;
        if (currentConsecutive > maxConsecutive) {
          maxConsecutive = currentConsecutive;
        }
      } else {
        currentConsecutive = 1;
      }
    }
    
    return maxConsecutive;
  };
  
  // Filtrar o relatório baseado nas opções
  const filteredReports = absenceReports.filter(report => {
    const categoryMatch = filterOptions.category === "all" || report.category === filterOptions.category;
    const absencesMatch = report.absenceDates.length >= filterOptions.minAbsences;
    
    return categoryMatch && absencesMatch;
  });
  
  // Formatar data para exibição
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('pt-BR');
  };
  
  // Atualizar relatório ao mudar intervalo de datas
  const handleDateRangeChange = (field: 'startDate' | 'endDate', value: string) => {
    const newDateRange = { ...dateRange, [field]: value };
    setDateRange(newDateRange);
    
    // Regenerar relatório
    generateReport(members, newDateRange.startDate, newDateRange.endDate);
  };
  
  // Exportar relatório como CSV
  const exportToCSV = () => {
    // Título das colunas
    let csvContent = "Nome do Membro,Categoria,Função na Igreja,Número de Faltas,Faltas Consecutivas,Datas das Faltas\n";
    
    // Adicionar dados de cada membro
    filteredReports.forEach(report => {
      const formattedDates = report.absenceDates.map(date => formatDate(date)).join('; ');
      
      csvContent += `"${report.memberName}","${report.category}","${report.role}",${report.absenceDates.length},${report.consecutiveAbsences},"${formattedDates}"\n`;
    });
    
    // Criar e baixar o arquivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `relatorio_faltas_${dateRange.startDate}_a_${dateRange.endDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Cabeçalho */}
      <div className="p-5 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
          <h2 className="text-xl font-semibold text-gray-800">
            Relatório de Faltas
            {filteredReports.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({filteredReports.length} {filteredReports.length === 1 ? 'membro' : 'membros'})
              </span>
            )}
          </h2>
          
          <div className="flex space-x-2">
            <button
              onClick={loadData}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <RefreshCw size={16} className="mr-2" />
              Atualizar
            </button>
            
            <button
              onClick={exportToCSV}
              disabled={filteredReports.length === 0}
              className="inline-flex items-center px-3 py-2 border border-church-600 shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-church-600 hover:bg-church-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={16} className="mr-2" />
              Exportar CSV
            </button>
          </div>
        </div>
      </div>
      
      {/* Filtros e intervalo de datas */}
      <div className="p-5 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Data inicial */}
          <div className="space-y-2">
            <label htmlFor="startDate" className="flex items-center text-sm font-medium text-gray-700">
              <Calendar size={16} className="mr-2" /> 
              Data Inicial
            </label>
            <input
              type="date"
              id="startDate"
              value={dateRange.startDate}
              onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-500"
            />
          </div>
          
          {/* Data final */}
          <div className="space-y-2">
            <label htmlFor="endDate" className="flex items-center text-sm font-medium text-gray-700">
              <Calendar size={16} className="mr-2" />
              Data Final
            </label>
            <input
              type="date"
              id="endDate"
              value={dateRange.endDate}
              onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-500"
            />
          </div>
          
          {/* Filtro de categoria */}
          <div className="space-y-2">
            <label htmlFor="category" className="flex items-center text-sm font-medium text-gray-700">
              <Filter size={16} className="mr-2" />
              Categoria
            </label>
            <select
              id="category"
              value={filterOptions.category}
              onChange={(e) => setFilterOptions({...filterOptions, category: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-500"
            >
              <option value="all">Todas</option>
              <option value="Jovem">Jovem</option>
              <option value="Mamã">Mamã</option>
              <option value="Papá">Papá</option>
              <option value="Visitante">Visitante</option>
            </select>
          </div>
          
          {/* Filtro de número mínimo de faltas */}
          <div className="space-y-2">
            <label htmlFor="minAbsences" className="flex items-center text-sm font-medium text-gray-700">
              <AlertCircle size={16} className="mr-2" />
              Mínimo de Faltas
            </label>
            <select
              id="minAbsences"
              value={filterOptions.minAbsences}
              onChange={(e) => setFilterOptions({...filterOptions, minAbsences: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-500"
            >
              <option value="1">1 ou mais</option>
              <option value="2">2 ou mais</option>
              <option value="3">3 ou mais</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Relatório de faltas */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-church-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Gerando relatório...</span>
            </div>
          </div>
        ) : error ? (
          <div className="p-5 text-center text-red-500">
            <p>{error}</p>
            <button 
              onClick={loadData}
              className="mt-2 text-church-600 hover:text-church-800"
            >
              Tentar novamente
            </button>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <AlertCircle size={48} className="mx-auto mb-4 text-gray-400" />
            <p>Nenhum registro de faltas encontrado no período selecionado.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Membro
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Função
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total de Faltas
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Faltas Consecutivas
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Datas de Ausência
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.map((report) => {
                // Determinar classe de severidade baseada em faltas consecutivas
                const severityClass = 
                  report.consecutiveAbsences >= 3 ? 'bg-red-50 text-red-800' :
                  report.consecutiveAbsences === 2 ? 'bg-amber-50 text-amber-800' :
                  '';
                
                return (
                  <tr key={report.memberId} className={severityClass}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {report.memberName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border badge-${report.category.toLowerCase()}`}>
                        {report.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
                      <span className="px-2 py-1 rounded-full bg-red-100 text-red-800">
                        {report.absenceDates.length}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span className={`px-2 py-1 rounded-full ${
                        report.consecutiveAbsences >= 3 
                          ? 'bg-red-100 text-red-800' 
                          : report.consecutiveAbsences === 2
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {report.consecutiveAbsences}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex flex-wrap gap-1">
                        {report.absenceDates.map((date, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 rounded-md text-xs">
                            {formatDate(date)}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
