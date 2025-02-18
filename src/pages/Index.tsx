
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <Badge className="w-fit" variant="secondary">Welcome</Badge>
          <h1 className="text-3xl font-bold text-gray-900">Care Management System</h1>
          <p className="text-gray-600 max-w-2xl">
            A comprehensive solution for healthcare professionals, patient management,
            and record monitoring.
          </p>
        </div>

        <div className="medical-grid">
          <Card className="vital-sign-card">
            <h3 className="text-lg font-semibold mb-2 text-primary-700">Master Administrator</h3>
            <p className="text-gray-600 mb-4">
              Manage staff, patients, and system settings
            </p>
            <Button variant="outline" className="w-full">Access Admin Area</Button>
          </Card>

          <Card className="vital-sign-card">
            <h3 className="text-lg font-semibold mb-2 text-primary-700">Nursing Staff</h3>
            <p className="text-gray-600 mb-4">
              Access patient records and time clock
            </p>
            <Button variant="outline" className="w-full">Staff Portal</Button>
          </Card>

          <Card className="vital-sign-card">
            <h3 className="text-lg font-semibold mb-2 text-primary-700">Client Area</h3>
            <p className="text-gray-600 mb-4">
              Monitor patient progress and communicate with caregivers
            </p>
            <Button variant="outline" className="w-full">Client Portal</Button>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
