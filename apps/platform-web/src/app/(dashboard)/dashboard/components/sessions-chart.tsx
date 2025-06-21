"use client";

import { useMemo } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMockSessionsWeekly } from "@/lib/hooks/use-mock-sessions";

export function SessionsChart() {
  const { weeklyData } = useMockSessionsWeekly();

  const formattedData = useMemo(() => {
    return weeklyData.map(item => ({
      ...item,
      name: item.weekOf.substring(0, 5) // Truncate date for better display
    }));
  }, [weeklyData]);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          margin={{
            top: 5,
            right: 10,
            left: 0,
            bottom: 5,
          }}
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
          <Line
            type="monotone"
            strokeWidth={2}
            dataKey="sessions"
            activeDot={{
              r: 6,
              style: { fill: "var(--primary)", opacity: 0.25 },
            }}
            style={{
              stroke: "var(--primary)",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
