import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Pie,
  Cell,
  PieChart,
} from "recharts";

const barData = [
  { name: "Jan", value: 30 },
  { name: "Feb", value: 50 },
  { name: "Mar", value: 40 },
  { name: "Apr", value: 70 },
  { name: "May", value: 60 },
  { name: "Jun", value: 80 },
];

const pieData = [
  { name: 'Complete', value: 65 },
  { name: 'Remaining', value: 35 }
];

const COLORS = ['#A9DFD8', '#E5E7EB'];

interface EarningChartProps {
  percentage: number;
}

const EarningChart: React.FC<EarningChartProps> = ({ percentage }) => {
  const completed = Math.min(Math.max(percentage, 0), 100);
  const remaining = 100 - completed;

  const pieData = [
    { name: 'Completed', value: completed },
    { name: 'Remaining', value: remaining },
  ];

  return (
    <div className="flex items-center justify-center pt-4">
      <PieChart width={300} height={100}>
        <Pie
          cx={150}
          cy={70}
          startAngle={180}
          endAngle={0}
          data={pieData}
          innerRadius={50}
          outerRadius={70}
          paddingAngle={2}
          dataKey="value"
          stroke="none"
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        {/* Centered text */}
        <text
          x={150}
          y={55}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#ffffff"
          fontSize={20}
          fontWeight="bold"
        >
          {percentage}%
        </text>
      </PieChart>
    </div>
  );
};

const SubSection: React.FC = () => {
  return (
    <div className="sub w-[15rem] flex flex-col gap-4">
      {/* 1. Bar Chart Card */}
      <div className="bg-dark-blue rounded-xl shadow p-4 h-48">
        <h3 className="text-white font-semibold mb-2">Level</h3>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart
            data={barData}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            barGap={15}
          >
            <XAxis dataKey="name" tick={false} axisLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: "#1e293b", borderColor: "#A9DFD8" }}
              itemStyle={{ color: "#A9DFD8" }}
            />
            <Bar dataKey="value" fill="#A9DFD8" radius={[4, 4, 0, 0]} barSize={15} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 2. Simple card */}
      <div className="bg-dark-blue rounded-xl shadow p-4 h-48 flex items-center justify-center text-white">
        Square Card 2
      </div>

      {/* 3. Semi-circle chart card */}
      <div className="bg-dark-blue rounded-xl shadow p-4 h-auto">
        <div className="earning-header flex flex-col justify-start items-start w-[80%]">
          <h3 className="text-white font-semibold mb-1">Earnings</h3>
          <p className="text-gray-400 text-sm mb-2">Total Expense</p>
          <p className="text-light-cyan text-2xl font-bold">#12,345</p>
          <p className="text-gray-500 text-sm">Profit is {}% more than last month</p>
        </div>
        <div className="chart-con flex flex-col items-center justify-center">
          <EarningChart percentage={73} /> 
        </div>
      </div>
    </div>
  );
};

export default SubSection;
