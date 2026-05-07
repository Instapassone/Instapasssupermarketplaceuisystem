import { Search } from 'lucide-react';
import { OrganizerSidebar } from '../../components/OrganizerSidebar';
import { Card } from '../../components/Card';

const attendees = [
  { id: '1', name: 'John Doe', email: 'john@example.com', event: 'Summer Music Festival', tickets: 2 },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', event: 'Tech Conference', tickets: 1 },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', event: 'Charity Gala', tickets: 4 },
];

export function Attendees() {
  return (
    <div className="min-h-screen bg-[#060D1B]" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      <OrganizerSidebar />

      <div className="ml-[260px]">
        <div className="border-b border-border bg-card">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold">Attendees</h1>
            <p className="text-muted-foreground mt-1">
              View and manage event attendees
            </p>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search attendees..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-input-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <Card variant="bordered" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold">Name</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold">Email</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold">Event</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold">Tickets</th>
                  </tr>
                </thead>
                <tbody>
                  {attendees.map((attendee) => (
                    <tr
                      key={attendee.id}
                      className="border-t border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold">{attendee.name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{attendee.email}</td>
                      <td className="px-6 py-4 text-sm">{attendee.event}</td>
                      <td className="px-6 py-4 font-semibold">{attendee.tickets}</td>
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