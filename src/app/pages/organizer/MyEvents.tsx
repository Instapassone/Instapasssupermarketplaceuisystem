import { Search, MoreVertical, Plus } from 'lucide-react';
import { Link } from 'react-router';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { OrganizerSidebar } from '../../components/OrganizerSidebar';
import { organizerEvents } from '../../data/mockData';

export function MyEvents() {
  return (
    <div className="min-h-screen bg-[#060D1B]" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      <OrganizerSidebar />

      <div className="ml-[260px]">
        <div className="border-b border-border bg-card">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">My Events</h1>
                <p className="text-muted-foreground mt-1">
                  Manage all your events in one place
                </p>
              </div>
              <Link to="/organizer/create-event">
                <Button>
                  <Plus className="w-5 h-5" />
                  Create Event
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search events..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-input-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <Card variant="bordered" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold">Event Name</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold">Date</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold">Status</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold">Sold</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold">Revenue</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold"></th>
                  </tr>
                </thead>
                <tbody>
                  {organizerEvents.map((event) => (
                    <tr
                      key={event.id}
                      className="border-t border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold">{event.name}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {event.date}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            event.status === 'Published'
                              ? 'bg-[#E52324]/10 text-[#E52324]'
                              : 'bg-yellow-500/10 text-yellow-500'
                          }`}
                        >
                          {event.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold">{event.sold}</td>
                      <td className="px-6 py-4 font-semibold">
                        ${event.revenue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
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