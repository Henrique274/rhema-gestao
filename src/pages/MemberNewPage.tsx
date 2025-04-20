
import React from "react";
import { MemberForm } from "@/components/members/MemberForm";

const MemberNewPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Cadastrar Novo Membro</h1>
        <p className="text-gray-500 mt-1">Preencha o formulário com os dados do novo membro</p>
      </div>
      
      <MemberForm />
    </div>
  );
};

export default MemberNewPage;
