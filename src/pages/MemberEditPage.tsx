
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MemberForm } from "@/components/members/MemberForm";
import { Member } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const MemberEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadMember = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Busca o membro diretamente no Supabase
        const { data, error } = await supabase
          .from('membros')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          // Mapeando os campos do banco para o formato do componente
          const mappedMember: Member = {
            id: data.id,
            name: data.nome,
            age: data.idade,
            gender: data.genero,
            phone: data.telefone,
            address: data.endereco,
            category: data.categoria,
            status: data.status,
            role: data.funcao,
          };
          
          setMember(mappedMember);
        } else {
          setError("Membro não encontrado");
        }
      } catch (error) {
        console.error("Erro ao carregar membro:", error);
        setError("Erro ao carregar dados do membro");
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do membro",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMember();
  }, [id, toast]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="inline-flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-church-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Carregando dados do membro...</span>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{error}</h3>
        <button
          onClick={() => navigate('/members')}
          className="px-4 py-2 bg-church-600 text-white rounded-md hover:bg-church-700"
        >
          Voltar para Lista de Membros
        </button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Editar Membro</h1>
        <p className="text-gray-500 mt-1">Atualize os dados do membro</p>
      </div>
      
      {member && (
        <MemberForm member={member} isEditing={true} />
      )}
    </div>
  );
};

export default MemberEditPage;
