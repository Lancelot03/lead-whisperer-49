import { TrendingUp, Users, Target, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lead } from "@/utils/leadScoring";

interface StatsCardsProps {
  leads: Lead[];
}

export const StatsCards = ({ leads }: StatsCardsProps) => {
  const totalLeads = leads.length;
  const avgScore = Math.round(
    leads.reduce((sum, lead) => sum + (lead.lead_score || 0), 0) / totalLeads
  );
  const highPriority = leads.filter((l) => (l.lead_score || 0) >= 80).length;
  const withContact = leads.filter((l) => l.email).length;

  const stats = [
    {
      title: "Total Leads",
      value: totalLeads,
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Avg Score",
      value: avgScore,
      icon: TrendingUp,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      title: "High Priority",
      value: highPriority,
      icon: Target,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      title: "Contactable",
      value: withContact,
      icon: CheckCircle2,
      color: "text-warning",
      bg: "bg-warning/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="shadow-card hover:shadow-elegant transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
