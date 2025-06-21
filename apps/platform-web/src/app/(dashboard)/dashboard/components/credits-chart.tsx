"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CreditsSummary } from "@/lib/types/credits";

interface CreditsChartProps {
  credits: CreditsSummary;
}

export function CreditsChart({ credits }: CreditsChartProps) {
  const data = [
    {
      name: "Credits Status",
      used: credits.used,
      available: credits.available,
    }
  ];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
          barGap={0}
          barCategoryGap="30%"
        >
          <XAxis 
            dataKey="name" 
            stroke="#888888" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip />
          <Bar 
            dataKey="used" 
            name="Credits Used" 
            fill="hsl(var(--primary))" 
            radius={[4, 4, 0, 0]} 
            stackId="stack"
          />
          <Bar 
            dataKey="available" 
            name="Credits Available" 
            fill="hsl(var(--muted))" 
            radius={[4, 4, 0, 0]} 
            stackId="stack" 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
