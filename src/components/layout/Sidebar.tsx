
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Users, 
  User, 
  Calendar, 
  CheckSquare, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight,
  Home
} from "lucide-react";
import { LogoIcon } from "@/assets/logo";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  
  const navigationItems = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Membros", path: "/members", icon: Users },
    { name: "Cadastrar Membro", path: "/members/new", icon: User },
    { name: "Registro de Presenças", path: "/attendance", icon: CheckSquare },
    { name: "Calendário", path: "/calendar", icon: Calendar },
    { name: "Relatório de Faltas", path: "/absence-report", icon: AlertTriangle },
  ];

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-10 flex flex-col w-64 bg-church-900 text-white transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-48'}`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <div className={`${isOpen ? 'block' : 'hidden'}`}>
            <LogoIcon className="w-10 h-10 mr-2" />
          </div>
          <span className={`font-bold text-lg transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            Rhema CFM
          </span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded-md hover:bg-church-800 focus:outline-none"
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-church-700 text-white' 
                      : 'text-gray-300 hover:bg-church-800 hover:text-white'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span className={`${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-church-800">
        <div className={`text-sm text-gray-400 ${isOpen ? 'block' : 'hidden'}`}>
          <p>Church Connect Nexus</p>
          <p>v1.0.0</p>
        </div>
      </div>
    </aside>
  );
};
