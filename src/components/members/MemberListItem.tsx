
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Member } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Edit, Trash2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MemberListItemProps {
  member: Member;
  onRefresh: () => void;
}

export const MemberListItem: React.FC<MemberListItemProps> = ({ 
  member, 
  onRefresh 
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { toast } = useToast();
  
  // Formatação da data de criação
  const formatDate = (date?: Date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('pt-BR');
  };
  
  // Manipulação de exclusão
  const handleDelete = async () => {
    if (!member.id) return;
    
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from('membros')
        .delete()
        .eq('id', member.id);
        
      if (error) throw error;
      
      toast({
        title: "Membro excluído",
        description: "O membro foi excluído com sucesso",
        variant: "default"
      });
      
      onRefresh();
    } catch (error) {
      console.error("Erro ao excluir membro:", error);
      toast({
        title: "Erro",
        description: "Erro ao excluir membro. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };
  
  return (
    <div className="py-4 px-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        {/* Informações do membro */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
              member.status === 'Ativo' ? 'bg-church-600' : 'bg-gray-400'
            }`}>
              {member.name.charAt(0).toUpperCase()}
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 truncate">{member.name}</h3>
              <div className="flex mt-1 flex-wrap gap-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border badge-${member.category.toLowerCase()}`}>
                  {member.category}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border badge-${member.status.toLowerCase()}`}>
                  {member.status}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border badge-${
                  member.role === 'Obreiro' 
                    ? 'obreiro' 
                    : member.role === 'Discípulo' 
                      ? 'discipulo' 
                      : 'formacao'
                }`}>
                  {member.role}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Detalhes adicionais */}
        <div className="mt-4 sm:mt-0 flex-shrink-0">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span className="mr-3">Telefone: {member.phone}</span>
            <span>Idade: {member.age}</span>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Link
              to={`/members/${member.id}`}
              className="inline-flex items-center px-3 py-1 border border-church-300 text-sm leading-4 font-medium rounded-md text-church-700 bg-white hover:bg-church-50"
            >
              <Edit size={15} className="mr-1" />
              Editar
            </Link>
            
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center px-3 py-1 border border-red-300 text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
            >
              <Trash2 size={15} className="mr-1" />
              Excluir
            </button>
          </div>
        </div>
      </div>

      {/* Confirmação de exclusão */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">
                Confirmar exclusão
              </h3>
            </div>
            <p className="mb-5 text-gray-700">
              Tem certeza que deseja excluir <strong>{member.name}</strong>? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 border border-transparent rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                disabled={isDeleting}
              >
                {isDeleting ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
