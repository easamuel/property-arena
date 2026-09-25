import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const monthlyData = [
  { month: 'Jan', value: 300 },
  { month: 'Feb', value: 450 },
  { month: 'Mar', value: 280 },
  { month: 'Apr', value: 600 },
  { month: 'May', value: 350 },
  { month: 'Jun', value: 700 },
  { month: 'Jul', value: 550 },
  { month: 'Aug', value: 800 },
  { month: 'Sep', value: 650 },
  { month: 'Oct', value: 500 },
  { month: 'Nov', value: 400 },
  { month: 'Dec', value: 900 },
];

const GraphCard: React.FC = () => {
  return (
    <div className="bg-[#171821] p-6 rounded shadow h-64 text-white">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorMountain" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#A9DFD8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#E0FFFF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" stroke="#ccc" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
          <YAxis stroke="#ccc" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} width={30} ticks={[0, 100, 200, 300, 400, 500]} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#3b82f6' }}
            labelStyle={{ color: '#fff' }}
            itemStyle={{ color: '#3b82f6' }}
          />
          {/* <CartesianGrid stroke="#2c2f3a" strokeDasharray="3 3" /> */}
          {/* <CartesianGrid vertical={false} horizontal={false} /> */}
          <Area
            type="linear"
            dataKey="value"
            stroke="#A9DFD8"
            fillOpacity={1}
            fill="url(#colorMountain)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraphCard;
