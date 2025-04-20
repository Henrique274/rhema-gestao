
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Member } from "@/types";
import { firebaseDB } from "@/lib/firebase";

interface MemberFormProps {
  member?: Member;
  isEditing?: boolean;
}

export const MemberForm: React.FC<MemberFormProps> = ({ 
  member, 
  isEditing = false 
}) => {
  const navigate = useNavigate();
  
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
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
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
        // Atualizando membro existente
        await firebaseDB.update('members', member.id, {
          ...formData,
          updatedAt: new Date()
        });
      } else {
        // Criando novo membro
        await firebaseDB.add('members', {
          ...formData,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      setSubmitSuccess(true);
      
      // Redirecionando após sucesso
      setTimeout(() => {
        navigate('/members');
      }, 1500);
      
    } catch (error) {
      console.error("Erro ao salvar membro:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mensagem de sucesso */}
        {submitSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Sucesso! </strong>
            <span className="block sm:inline">
              {isEditing 
                ? "Membro atualizado com sucesso." 
                : "Novo membro cadastrado com sucesso."}
            </span>
          </div>
        )}
        
        {/* Campos de formulário */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome completo */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome completo *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-church-500`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name}</p>
            )}
          </div>
          
          {/* Idade */}
          <div className="space-y-2">
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">
              Idade *
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.age ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-church-500`}
            />
            {errors.age && (
              <p className="text-red-500 text-xs">{errors.age}</p>
            )}
          </div>
          
          {/* Gênero */}
          <div className="space-y-2">
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
              Gênero *
            </label>
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
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Telefone *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-church-500`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs">{errors.phone}</p>
            )}
          </div>
          
          {/* Morada (Endereço) */}
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Morada (Endereço) *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-church-500`}
            />
            {errors.address && (
              <p className="text-red-500 text-xs">{errors.address}</p>
            )}
          </div>
          
          {/* Categoria */}
          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Categoria *
            </label>
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
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status *
            </label>
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
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Função na igreja *
            </label>
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
          <button
            type="button"
            onClick={() => navigate('/members')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-church-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-church-600 hover:bg-church-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-church-500 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Salvando...' : isEditing ? 'Atualizar' : 'Cadastrar'}
          </button>
        </div>
      </form>
    </div>
  );
};
