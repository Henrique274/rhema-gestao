
import React from "react";
import { AttendanceForm } from "@/components/attendance/AttendanceForm";

const AttendancePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Registro de Presenças</h1>
        <p className="text-gray-500 mt-1">Controle as presenças de membros por culto</p>
      </div>
      
      <AttendanceForm />
    </div>
  );
};

export default AttendancePage;
