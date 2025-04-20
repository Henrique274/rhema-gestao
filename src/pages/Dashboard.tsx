
import React, { useState, useEffect } from "react";
import { firebaseDB } from "@/lib/firebase";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { 
  Users, UserCheck, AlertTriangle, Calendar, 
  Clock, Clipboard, BarChart 
} from "lucide-react";

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    inactiveMembers: 0,
    totalAttendance: 0,
    averageAttendance: 0,
    absenceCount: 0,
    categories: {
      jovem: 0,
      mama: 0,
      papa: 0,
      visitante: 0
    }
  });
  
  const [loading, setLoading] = useState(true);
  
  // Carregar estatísticas
  useEffect(() => {
    const loadStats = async () => {
      try {
        // Em uma implementação real, estes dados viriam do Firebase
        const members = await firebaseDB.getAll('members');
        
        // Cálculo de estatísticas básicas
        const activeMembers = members.filter(m => m.status === 'Ativo');
        const inactiveMembers = members.filter(m => m.status === 'Inativo');
        
        // Contagem por categoria
        const categories = {
          jovem: members.filter(m => m.category === 'Jovem').length,
          mama: members.filter(m => m.category === 'Mamã').length,
          papa: members.filter(m => m.category === 'Papá').length,
          visitante: members.filter(m => m.category === 'Visitante').length
        };
        
        // Simular estatísticas de presença
        const totalAttendance = Math.floor(Math.random() * 100) + 50;
        const averageAttendance = Math.floor(Math.random() * 50) + 30;
        const absenceCount = Math.floor(Math.random() * 20) + 5;
        
        setStats({
          totalMembers: members.length,
          activeMembers: activeMembers.length,
          inactiveMembers: inactiveMembers.length,
          totalAttendance,
          averageAttendance,
          absenceCount,
          categories
        });
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadStats();
  }, []);
  
  // Obter data atual
  const today = new Date();
  const formattedDate = today.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Próximos cultos (simulado)
  const nextServices = [
    { day: "Quarta-feira", date: "19h00 - Culto de Ensino" },
    { day: "Sexta-feira", date: "19h30 - Culto de Libertação" },
    { day: "Domingo", date: "9h00 - Escola Dominical / 18h00 - Culto de Celebração" }
  ];
  
  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">{formattedDate}</p>
      </div>
      
      {/* Cartões de estatísticas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total de membros */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-500">
                TOTAL DE MEMBROS
              </CardTitle>
              <Users className="h-4 w-4 text-church-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                stats.totalMembers
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.activeMembers} ativos, {stats.inactiveMembers} inativos
            </p>
          </CardContent>
        </Card>
        
        {/* Presença média */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-500">
                PRESENÇA MÉDIA
              </CardTitle>
              <UserCheck className="h-4 w-4 text-church-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                `${stats.averageAttendance}%`
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Último culto: {stats.totalAttendance} pessoas
            </p>
          </CardContent>
        </Card>
        
        {/* Faltas recentes */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-500">
                FALTAS RECENTES
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                stats.absenceCount
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Membros com 2+ faltas consecutivas
            </p>
          </CardContent>
        </Card>
        
        {/* Próximo culto */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-500">
                PRÓXIMO CULTO
              </CardTitle>
              <Clock className="h-4 w-4 text-church-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-semibold">
              {nextServices[0].day}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {nextServices[0].date}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Seção inferior */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribuição por categoria */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Categorias de Membros
              </CardTitle>
              <BarChart className="h-5 w-5 text-gray-500" />
            </div>
            <CardDescription>
              Distribuição de membros por categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Jovens */}
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Jovens</span>
                    <span className="font-medium">{stats.categories.jovem}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ 
                        width: `${stats.totalMembers ? (stats.categories.jovem / stats.totalMembers) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                {/* Mamãs */}
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Mamãs</span>
                    <span className="font-medium">{stats.categories.mama}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ 
                        width: `${stats.totalMembers ? (stats.categories.mama / stats.totalMembers) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                {/* Papás */}
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Papás</span>
                    <span className="font-medium">{stats.categories.papa}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-amber-500 h-2 rounded-full" 
                      style={{ 
                        width: `${stats.totalMembers ? (stats.categories.papa / stats.totalMembers) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                {/* Visitantes */}
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Visitantes</span>
                    <span className="font-medium">{stats.categories.visitante}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-teal-500 h-2 rounded-full" 
                      style={{ 
                        width: `${stats.totalMembers ? (stats.categories.visitante / stats.totalMembers) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Calendário de cultos */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Agenda de Cultos
              </CardTitle>
              <Calendar className="h-5 w-5 text-gray-500" />
            </div>
            <CardDescription>
              Próximos cultos e eventos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nextServices.map((service, idx) => (
                <div key={idx} className="flex items-start space-x-4">
                  <div className="min-w-[45px] h-10 rounded-md bg-church-100 text-church-700 flex flex-col items-center justify-center">
                    <span className="text-xs font-medium">
                      {service.day.split('-')[0]}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{service.day}</h4>
                    <p className="text-sm text-gray-500">{service.date}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <a href="/calendar" className="text-church-600 hover:text-church-800 text-sm font-medium inline-flex items-center">
                <Clipboard className="h-4 w-4 mr-1" />
                Ver calendário completo
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
