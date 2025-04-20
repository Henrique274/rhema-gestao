
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Member } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface MemberFormProps {
  member?: Member;
  isEditing?: boolean;
}

export const MemberForm: React.FC<MemberFormProps> = ({ 
  member, 
  isEditing = false 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Estado inicial do formulário
  const [formData, setFormData] = useState<Member>({
    name: "",
    age: 0,
    gender: "Masculino",
    phone: "",
    address: "",
    category: "Jovem",
    status: "Ativo",
    role: "Em Formação"
  });
  
  // Estados de validação e submissão
  const [errors, setErrors] = useState<Partial<Record<keyof Member, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Populando os dados no caso de edição
  useEffect(() => {
    if (member && isEditing) {
      setFormData(member);
    }
  }, [member, isEditing]);
  
  // Funções de manipulação do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Tratamento especial para o campo idade (convertendo para número)
    if (name === 'age') {
      setFormData({
        ...formData,
        [name]: value === '' ? 0 : parseInt(value, 10)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Limpar erro quando campo é alterado
    if (errors[name as keyof Member]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };
  
  // Validação de dados
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Member, string>> = {};
    let isValid = true;
    
    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
      isValid = false;
    }
    
    if (formData.age <= 0) {
      newErrors.age = "Idade deve ser maior que 0";
      isValid = false;
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório";
      isValid = false;
    }
    
    if (!formData.address.trim()) {
      newErrors.address = "Morada é obrigatória";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (isEditing && member?.id) {
        // Salvando no Supabase - atualizando membro existente
        const { error } = await supabase
          .from('membros')
          .update({
            nome: formData.name,
            idade: formData.age,
            genero: formData.gender,
            telefone: formData.phone,
            endereco: formData.address,
            categoria: formData.category,
            status: formData.status,
            funcao: formData.role,
            atualizado_em: new Date()
          })
          .eq('id', member.id);
          
        if (error) throw error;
        
        toast({
          title: "Membro atualizado",
          description: "As informações do membro foram atualizadas com sucesso",
          variant: "default"
        });
      } else {
        // Salvando no Supabase - criando novo membro
        const { error } = await supabase
          .from('membros')
          .insert({
            nome: formData.name,
            idade: formData.age,
            genero: formData.gender,
            telefone: formData.phone,
            endereco: formData.address,
            categoria: formData.category,
            status: formData.status,
            funcao: formData.role,
            data_entrada: new Date().toISOString().split('T')[0]
          });
          
        if (error) throw error;
        
        toast({
          title: "Membro cadastrado",
          description: "Novo membro cadastrado com sucesso",
          variant: "default"
        });
      }
      
      // Redirecionando após sucesso
      setTimeout(() => {
        navigate('/members');
      }, 1500);
      
    } catch (error) {
      console.error("Erro ao salvar membro:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar os dados do membro. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Campos de formulário */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome completo */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nome completo *
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name}</p>
            )}
          </div>
          
          {/* Idade */}
          <div className="space-y-2">
            <Label htmlFor="age" className="text-sm font-medium text-gray-700">
              Idade *
            </Label>
            <Input
              type="number"
              id="age"
              name="age"
              value={formData.age || ''}
              onChange={handleChange}
              className={errors.age ? 'border-red-500' : ''}
            />
            {errors.age && (
              <p className="text-red-500 text-xs">{errors.age}</p>
            )}
          </div>
          
          {/* Gênero */}
          <div className="space-y-2">
            <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
              Gênero *
            </Label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-500"
            >
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          
          {/* Telefone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Telefone *
            </Label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs">{errors.phone}</p>
            )}
          </div>
          
          {/* Morada (Endereço) */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address" className="text-sm font-medium text-gray-700">
              Morada (Endereço) *
            </Label>
            <Input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? 'border-red-500' : ''}
            />
            {errors.address && (
              <p className="text-red-500 text-xs">{errors.address}</p>
            )}
          </div>
          
          {/* Categoria */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium text-gray-700">
              Categoria *
            </Label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-500"
            >
              <option value="Jovem">Jovem</option>
              <option value="Mamã">Mamã</option>
              <option value="Papá">Papá</option>
              <option value="Visitante">Visitante</option>
            </select>
          </div>
          
          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium text-gray-700">
              Status *
            </Label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-500"
            >
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>
          
          {/* Função na igreja */}
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium text-gray-700">
              Função na igreja *
            </Label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-500"
            >
              <option value="Obreiro">Obreiro</option>
              <option value="Discípulo">Discípulo</option>
              <option value="Em Formação">Em Formação</option>
            </select>
          </div>
        </div>
        
        {/* Botões de ação */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/members')}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className={isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
          >
            {isSubmitting ? 'Salvando...' : isEditing ? 'Atualizar' : 'Cadastrar'}
          </Button>
        </div>
      </form>
    </div>
  );
};
