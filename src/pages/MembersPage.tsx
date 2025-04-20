
import React from "react";
import { MemberList } from "@/components/members/MemberList";

const MembersPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Membros</h1>
        <p className="text-gray-500 mt-1">Visualize e gerencie todos os membros da igreja</p>
      </div>
      
      <MemberList />
    </div>
  );
};

export default MembersPage;
