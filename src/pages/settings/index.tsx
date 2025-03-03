
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { User, Lock, Users, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  const settingsCards = [
    {
      title: "Profile",
      description: "Manage your personal information, email, and profile picture",
      icon: User,
      action: () => navigate("/settings/profile")
    },
    {
      title: "Security",
      description: "Configure security settings and two-factor authentication",
      icon: Lock,
      action: () => navigate("/settings/security")
    },
    {
      title: "Subscription",
      description: "View and manage your subscription plan and billing",
      icon: CreditCard,
      action: () => navigate("/settings/subscription")
    },
    {
      title: "User Management",
      description: "Manage users and their permissions (Admin only)",
      icon: Users,
      action: () => navigate("/admin/permissions")
    },
  ];

  return (
    <AppLayout>
      <div className="container py-6 max-w-5xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Configure your account and system settings</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {settingsCards.map((card, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <card.icon className="h-5 w-5 text-primary" />
                  <CardTitle>{card.title}</CardTitle>
                </div>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={card.action}>
                  Manage {card.title}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
