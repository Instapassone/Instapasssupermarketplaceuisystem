import { OrganizerSidebar } from '../../components/OrganizerSidebar';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

export function Settings() {
  return (
    <div className="min-h-screen bg-[#060D1B]" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      <OrganizerSidebar />

      <div className="ml-[260px]">
        <div className="border-b border-border bg-card">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your account and preferences
            </p>
          </div>
        </div>

        <div className="p-8 max-w-3xl">
          <Card variant="bordered" className="p-8 mb-6">
            <h2 className="text-xl font-bold mb-6">Profile Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" defaultValue="John" />
                <Input label="Last Name" defaultValue="Doe" />
              </div>
              <Input label="Email" type="email" defaultValue="john@example.com" />
              <Input label="Phone" type="tel" defaultValue="+1 (555) 000-0000" />
            </div>
            <div className="flex justify-end mt-6">
              <Button>Save Changes</Button>
            </div>
          </Card>

          <Card variant="bordered" className="p-8 mb-6">
            <h2 className="text-xl font-bold mb-6">Payout Settings</h2>
            <div className="space-y-4">
              <Input label="Bank Account" defaultValue="•••• •••• •••• 4321" />
              <Input label="Routing Number" defaultValue="•••••••21" />
            </div>
            <div className="flex justify-end mt-6">
              <Button>Update Payout Info</Button>
            </div>
          </Card>

          <Card variant="bordered" className="p-8">
            <h2 className="text-xl font-bold mb-6">Password</h2>
            <div className="space-y-4">
              <Input label="Current Password" type="password" />
              <Input label="New Password" type="password" />
              <Input label="Confirm New Password" type="password" />
            </div>
            <div className="flex justify-end mt-6">
              <Button>Change Password</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}