
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartColumnBig } from 'lucide-react';

interface AttendanceData {
  culto: string;
  presentes: number;
  ausentes: number;
}

interface AttendanceChartProps {
  data: AttendanceData[];
  loading?: boolean;
}

export const AttendanceChart = ({ data, loading = false }: AttendanceChartProps) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              Frequência por Culto
            </CardTitle>
            <ChartColumnBig className="h-5 w-5 text-gray-500" />
          </div>
          <CardDescription>
            Carregando dados de frequência...
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="animate-pulse flex space-x-4">
            <div className="h-48 w-full bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Frequência por Culto
          </CardTitle>
          <ChartColumnBig className="h-5 w-5 text-gray-500" />
        </div>
        <CardDescription>
          Análise de presença nos últimos cultos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="culto" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="presentes" name="Presentes" fill="#22c55e" />
              <Bar dataKey="ausentes" name="Ausentes" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
