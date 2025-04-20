
import React from "react";
import { useLocation } from "react-router-dom";
import { Menu, Bell, Search, ChevronDown } from "lucide-react";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  
  // Determinar título baseado na rota atual
  const getTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/members':
        return 'Gestão de Membros';
      case '/members/new':
        return 'Cadastrar Novo Membro';
      case '/attendance':
        return 'Registro de Presenças';
      case '/calendar':
        return 'Calendário de Cultos';
      case '/absence-report':
        return 'Relatório de Faltas';
      default:
        if (location.pathname.startsWith('/members/')) {
          return 'Detalhes do Membro';
        }
        return 'Church Connect Nexus';
    }
  };
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 mr-3 rounded-md hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">{getTitle()}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Barra de pesquisa */}
          <div className="hidden md:flex items-center bg-gray-100 rounded-md px-3 py-2">
            <Search size={18} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Buscar..."
              className="bg-transparent border-none focus:outline-none text-sm"
            />
          </div>
          
          {/* Notificações */}
          <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
            <Bell size={18} />
          </button>
          
          {/* Perfil do usuário */}
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-church-600 flex items-center justify-center text-white font-medium">
              A
            </div>
            <div className="hidden md:block ml-2">
              <span className="text-sm font-medium">Admin</span>
            </div>
            <ChevronDown size={16} className="ml-1 text-gray-500" />
          </div>
        </div>
      </div>
    </header>
  );
};
