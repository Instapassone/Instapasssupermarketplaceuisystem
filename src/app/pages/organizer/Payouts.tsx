import { Download } from 'lucide-react';
import { OrganizerSidebar } from '../../components/OrganizerSidebar';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

const payouts = [
  { id: '1', date: 'Feb 20, 2026', amount: 45200, status: 'Completed' },
  { id: '2', date: 'Feb 13, 2026', amount: 32800, status: 'Completed' },
  { id: '3', date: 'Feb 6, 2026', amount: 28400, status: 'Completed' },
  { id: '4', date: 'Pending', amount: 15600, status: 'Pending' },
];

export function Payouts() {
  return (
    <div className="min-h-screen bg-[#060D1B]" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      <OrganizerSidebar />

      <div className="ml-[260px]">
        <div className="border-b border-border bg-card">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold">Payouts</h1>
            <p className="text-muted-foreground mt-1">
              Track your earnings and payout history
            </p>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card variant="bordered" className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Available Balance</div>
              <div className="text-3xl font-bold text-[#E52324]">$15,600</div>
            </Card>
            <Card variant="bordered" className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Total Paid Out</div>
              <div className="text-3xl font-bold">$106,400</div>
            </Card>
            <Card variant="bordered" className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Pending</div>
              <div className="text-3xl font-bold">$15,600</div>
            </Card>
          </div>

          <Card variant="bordered" className="overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold">Payout History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold">Date</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold">Amount</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold">Status</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold"></th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((payout) => (
                    <tr
                      key={payout.id}
                      className="border-t border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4">{payout.date}</td>
                      <td className="px-6 py-4 font-bold">${payout.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            payout.status === 'Completed'
                              ? 'bg-[#E52324]/10 text-[#E52324]'
                              : 'bg-yellow-500/10 text-yellow-500'
                          }`}
                        >
                          {payout.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {payout.status === 'Completed' && (
                          <Button size="sm" variant="ghost">
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}