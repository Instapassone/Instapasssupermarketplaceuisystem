import { OrganizerSidebar } from '../../components/OrganizerSidebar';
import { Card } from '../../components/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const salesData = [
  { month: 'Jan', sales: 12450 },
  { month: 'Feb', sales: 18200 },
  { month: 'Mar', sales: 23100 },
  { month: 'Apr', sales: 19800 },
  { month: 'May', sales: 28500 },
  { month: 'Jun', sales: 35200 },
];

export function Sales() {
  return (
    <div className="min-h-screen bg-[#060D1B]" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      <OrganizerSidebar />

      <div className="ml-[260px]">
        <div className="border-b border-border bg-card">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold">Sales Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Track your ticket sales and revenue
            </p>
          </div>
        </div>

        <div className="p-8">
          <Card variant="bordered" className="p-6">
            <h2 className="text-xl font-bold mb-6">Revenue Overview</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="sales" fill="#E52324" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );
}