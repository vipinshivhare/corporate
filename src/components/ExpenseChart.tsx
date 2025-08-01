import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface ExpenseChartProps {
  currency: "INR" | "USD";
}

const data = [
  { name: "Jan", amount: 500 },
  { name: "Feb", amount: 300 },
  { name: "Mar", amount: 450 },
  { name: "Apr", amount: 600 },
  { name: "May", amount: 350 },
  { name: "Jun", amount: 400 },
  { name: "Jul", amount: 550 },
  { name: "Aug", amount: 480 },
  { name: "Sep", amount: 620 },
  { name: "Oct", amount: 700 },
  { name: "Nov", amount: 530 },
  { name: "Dec", amount: 610 },
];

const ExpenseChart: React.FC<ExpenseChartProps> = ({ currency }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip
          formatter={(value: number) =>
            currency === "INR" ? `₹${value}` : `$${(value / 86.58).toFixed(2)}`
          }
        />
        <Line
          type="monotone"
          dataKey="amount"
          stroke="#3182CE"
          strokeWidth={3}
          dot={{ r: 5 }}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ExpenseChart;
