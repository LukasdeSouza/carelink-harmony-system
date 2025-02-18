
import { AppLayout } from "@/components/layout/AppLayout";

const Records = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
        <p className="text-gray-600">Access and manage patient medical records here.</p>
      </div>
    </AppLayout>
  );
};

export default Records;
