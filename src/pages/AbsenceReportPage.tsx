
import React from "react";
import { AbsenceReport } from "@/components/reports/AbsenceReport";

const AbsenceReportPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Relatório de Faltas</h1>
        <p className="text-gray-500 mt-1">Monitoramento de faltas dos membros</p>
      </div>
      
      <AbsenceReport />
    </div>
  );
};

export default AbsenceReportPage;
