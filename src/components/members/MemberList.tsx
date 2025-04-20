
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Member } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { MemberListItem } from "./MemberListItem";
import { Search, RefreshCw, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Helper function para validar e converter valores de gênero
const validateGender = (value: string | null): 'Masculino' | 'Feminino' | 'Outro' => {
  if (value === 'Masculino' || value === 'Feminino' || value === 'Outro') {
    return value;
  }
  return 'Outro';
};

// Helper function para validar e converter valores de categoria
const validateCategory = (value: string | null): 'Jovem' | 'Mamã' | 'Papá' | 'Visitante' => {
  if (value === 'Jovem' || value === 'Mamã' || value === 'Papá' || value === 'Visitante') {
    return value;
  }
  return 'Jovem';
};

// Helper function para validar e converter valores de status
const validateStatus = (value: string | null): 'Ativo' | 'Inativo' => {
  if (value === 'Ativo' || value === 'Inativo') {
    return value;
  }
  return 'Ativo';
};

// Helper function para validar e converter valores de função
const validateRole = (value: string | null): 'Obreiro' | 'Discípulo' | 'Em Formação' => {
  if (value === 'Obreiro' || value === 'Discípulo' || value === 'Em Formação') {
    return value;
  }
  return 'Em Formação';
};

export const MemberList: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  
  // Carregar membros do Supabase
  const loadMembers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('membros')
        .select('*');
        
      if (error) throw error;
      
      if (data) {
        // Mapeando os dados do Supabase para o formato Member
        const mappedMembers: Member[] = data.map(member => ({
          id: member.id,
          name: member.nome,
          age: member.idade || 0,
          gender: validateGender(member.genero),
          phone: member.telefone || '',
          address: member.endereco || '',
          category: validateCategory(member.categoria),
          status: validateStatus(member.status),
          role: validateRole(member.funcao),
        }));
        
        setMembers(mappedMembers);
        setFilteredMembers(mappedMembers);
      }
    } catch (error) {
      console.error("Erro ao carregar membros:", error);
      setError("Não foi possível carregar a lista de membros.");
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de membros.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Carregar dados na inicialização
  useEffect(() => {
    loadMembers();
  }, []);
  
  // Aplicar filtros quando qualquer critério de filtro mudar
  useEffect(() => {
    let result = [...members];
    
    // Filtrar por termo de busca
    if (searchTerm) {
      result = result.filter(member => 
        member.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrar por categoria
    if (categoryFilter !== "all") {
      result = result.filter(member => member.category === categoryFilter);
    }
    
    // Filtrar por status
    if (statusFilter !== "all") {
      result = result.filter(member => member.status === statusFilter);
    }
    
    // Filtrar por função
    if (roleFilter !== "all") {
      result = result.filter(member => member.role === roleFilter);
    }
    
    setFilteredMembers(result);
  }, [members, searchTerm, categoryFilter, statusFilter, roleFilter]);
  
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Cabeçalho com filtros */}
      <div className="p-5 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
          <h2 className="text-xl font-semibold text-gray-800">
            Lista de Membros
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({filteredMembers.length} {filteredMembers.length === 1 ? 'membro' : 'membros'})
            </span>
          </h2>
          
          <div className="flex space-x-2">
            <button
              onClick={loadMembers}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-church-500"
            >
              <RefreshCw size={16} className="mr-2" />
              Atualizar
            </button>
            
            <Link
              to="/members/new"
              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-church-600 hover:bg-church-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-church-500"
            >
              <UserPlus size={16} className="mr-2" />
              Novo Membro
            </Link>
          </div>
        </div>
        
        {/* Filtros */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Busca por nome */}
          <div className="col-span-1 md:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-church-500 focus:border-church-500"
              />
            </div>
          </div>
          
          {/* Filtro de categoria */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-church-500 focus:border-church-500"
            >
              <option value="all">Todas categorias</option>
              <option value="Jovem">Jovem</option>
              <option value="Mamã">Mamã</option>
              <option value="Papá">Papá</option>
              <option value="Visitante">Visitante</option>
            </select>
          </div>
          
          {/* Filtro de status */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-church-500 focus:border-church-500"
            >
              <option value="all">Todos status</option>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>
          
          {/* Filtro de função */}
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-church-500 focus:border-church-500"
            >
              <option value="all">Todas funções</option>
              <option value="Obreiro">Obreiro</option>
              <option value="Discípulo">Discípulo</option>
              <option value="Em Formação">Em Formação</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Lista de membros */}
      <div className="divide-y divide-gray-200">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-church-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Carregando membros...</span>
            </div>
          </div>
        ) : error ? (
          <div className="p-5 text-center text-red-500">
            <p>{error}</p>
            <button 
              onClick={loadMembers}
              className="mt-2 text-church-600 hover:text-church-800"
            >
              Tentar novamente
            </button>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>Nenhum membro encontrado com os filtros selecionados.</p>
          </div>
        ) : (
          filteredMembers.map((member) => (
            <MemberListItem key={member.id} member={member} onRefresh={loadMembers} />
          ))
        )}
      </div>
    </div>
  );
};
