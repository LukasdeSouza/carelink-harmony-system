
import { AppLayout } from "@/components/layout/AppLayout";

const Patients = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
        <p className="text-gray-600">View and manage patient records here.</p>
      </div>
    </AppLayout>
  );
};

export default Patients;
