
import { AppLayout } from "@/components/layout/AppLayout";

const TimeClock = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Time Clock</h1>
        <p className="text-gray-600">Manage attendance and time tracking here.</p>
      </div>
    </AppLayout>
  );
};

export default TimeClock;
