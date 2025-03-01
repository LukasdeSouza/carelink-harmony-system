
import React from "react";
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Type definitions
type ChartData = {
  data: Record<string, any>[];
  categories?: string[];
  index?: string;
  colors?: string[];
  valueFormatter?: (value: number) => string;
};

// Bar Chart Component
export function BarChart({
  data,
  categories = [],
  colors = ["#3b82f6", "#10b981", "#f97316", "#8b5cf6"],
  valueFormatter = (value: number) => value.toString(),
}: ChartData) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={valueFormatter}
        />
        <Tooltip
          formatter={(value: number) => [valueFormatter(value), ""]}
          labelStyle={{ fontWeight: "bold", fontSize: 14 }}
          contentStyle={{ borderRadius: 8, padding: 10, border: "1px solid #e2e8f0" }}
        />
        <Legend
          formatter={(value) => <span className="text-sm capitalize">{value}</span>}
        />
        {categories.map((category, index) => (
          <Bar
            key={category}
            name={category}
            dataKey={category}
            fill={colors[index % colors.length]}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

// Line Chart Component
export function LineChart({
  data,
  index = "name",
  categories = [],
  colors = ["#3b82f6", "#10b981", "#f97316", "#8b5cf6"],
  valueFormatter = (value: number) => value.toString(),
}: ChartData) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey={index}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={valueFormatter}
        />
        <Tooltip
          formatter={(value: number) => [valueFormatter(value), ""]}
          labelStyle={{ fontWeight: "bold", fontSize: 14 }}
          contentStyle={{ borderRadius: 8, padding: 10, border: "1px solid #e2e8f0" }}
        />
        <Legend
          formatter={(value) => <span className="text-sm capitalize">{value}</span>}
        />
        {categories.map((category, index) => (
          <Line
            key={category}
            name={category}
            type="monotone"
            dataKey={category}
            stroke={colors[index % colors.length]}
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
