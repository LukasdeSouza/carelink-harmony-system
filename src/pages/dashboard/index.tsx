
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";

const Dashboard = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-2">Total Patients</h3>
            <p className="text-3xl font-bold text-primary-600">124</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-2">Active Staff</h3>
            <p className="text-3xl font-bold text-primary-600">45</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-2">Today's Appointments</h3>
            <p className="text-3xl font-bold text-primary-600">28</p>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
