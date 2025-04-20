
import React from "react";
import { Card } from "@/components/ui/card";

const CalendarPage: React.FC = () => {
  // Dados de exemplo para o calendário
  const services = [
    { 
      day: "Quarta-feira", 
      time: "19h00", 
      name: "Culto de Ensino",
      description: "Estudos bíblicos e doutrina"
    },
    { 
      day: "Sexta-feira", 
      time: "19h30", 
      name: "Culto de Libertação",
      description: "Oração e intercessão"
    },
    { 
      day: "Domingo", 
      time: "9h00", 
      name: "Escola Dominical",
      description: "Ensino bíblico para todas as idades"
    },
    { 
      day: "Domingo", 
      time: "18h00", 
      name: "Culto de Celebração",
      description: "Adoração e pregação"
    }
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Calendário</h1>
        <p className="text-gray-500 mt-1">Programação regular de cultos e eventos</p>
      </div>
      
      <Card className="overflow-hidden">
        <div className="p-6 bg-white">
          <h2 className="text-xl font-semibold mb-4">Programação Semanal</h2>
          
          <div className="space-y-6">
            {services.map((service, index) => (
              <div 
                key={index}
                className="flex flex-col md:flex-row md:items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="md:w-1/4">
                  <h3 className="text-lg font-medium text-gray-900">{service.day}</h3>
                  <p className="text-lg text-church-700 font-bold">{service.time}</p>
                </div>
                
                <div className="md:w-3/4 mt-2 md:mt-0">
                  <h4 className="text-lg font-medium">{service.name}</h4>
                  <p className="text-gray-600 mt-1">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 border border-church-200 bg-church-50 rounded-lg">
            <h3 className="font-medium text-church-900 mb-2">Informações Adicionais:</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Retiros e eventos especiais serão anunciados com antecedência.</li>
              <li>• Treinamentos de discipulado ocorrem aos sábados (verificar datas).</li>
              <li>• Para eventos de células e pequenos grupos, consulte seu líder.</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CalendarPage;
