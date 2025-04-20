
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ChartPie } from 'lucide-react';

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface MembershipChartProps {
  data: CategoryData[];
  loading?: boolean;
}

export const MembershipChart = ({ data, loading = false }: MembershipChartProps) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              Distribuição de Membros
            </CardTitle>
            <ChartPie className="h-5 w-5 text-gray-500" />
          </div>
          <CardDescription>
            Carregando dados de membros...
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="animate-pulse flex space-x-4">
            <div className="h-48 w-48 bg-gray-200 rounded-full"></div>
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
            Distribuição de Membros
          </CardTitle>
          <ChartPie className="h-5 w-5 text-gray-500" />
        </div>
        <CardDescription>
          Membros por categoria
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
