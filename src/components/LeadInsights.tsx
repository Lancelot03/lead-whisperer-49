import { Lead } from "@/utils/leadScoring";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Award } from "lucide-react";

interface LeadInsightsProps {
  leads: Lead[];
}

export const LeadInsights = ({ leads }: LeadInsightsProps) => {
  if (leads.length === 0) return null;

  // Top 10 companies
  const top10 = leads.slice(0, 10);

  // Average score by category
  const categoryStats = leads.reduce((acc, lead) => {
    const cat = lead.lead_category || "Unknown";
    if (!acc[cat]) acc[cat] = { total: 0, count: 0 };
    acc[cat].total += lead.lead_score || 0;
    acc[cat].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const categoryAverages = Object.entries(categoryStats).map(([category, stats]) => ({
    category,
    average: Math.round(stats.total / stats.count),
    count: stats.count,
  }));

  // Confidence brackets
  const confidenceBrackets = leads.reduce((acc, lead) => {
    const conf = lead.confidence_level || "Low";
    acc[conf] = (acc[conf] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Key insights
  const highPotentialCount = leads.filter(l => l.ai_potential === "High").length;
  const fundedCount = leads.filter(l => l.recent_funding && l.recent_funding.toLowerCase() !== "no").length;
  const activeHiringCount = leads.filter(l => (l.jobs_30d as number) >= 2).length;

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Key Insights
          </CardTitle>
          <CardDescription>Overall lead quality summary</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>
                <strong>{highPotentialCount}</strong> companies ({Math.round(highPotentialCount / leads.length * 100)}%) 
                classified as <Badge variant="default" className="mx-1">High AI Potential</Badge> 
                based on funding, hiring momentum, and company size
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">•</span>
              <span>
                <strong>{fundedCount}</strong> companies have recent funding rounds, 
                indicating <strong>strong growth capital</strong> for AI adoption
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success font-bold">•</span>
              <span>
                <strong>{activeHiringCount}</strong> companies show active hiring (≥2 jobs), 
                suggesting <strong>expansion and operational readiness</strong>
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-accent" />
              Average Score by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoryAverages.map(({ category, average, count }) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{category}</Badge>
                    <span className="text-sm text-muted-foreground">({count} leads)</span>
                  </div>
                  <span className="font-mono font-bold text-lg">{average}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="h-5 w-5 text-success" />
              Confidence Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(confidenceBrackets).map(([level, count]) => (
                <div key={level} className="flex items-center justify-between">
                  <Badge 
                    variant={level === "High" ? "default" : level === "Medium" ? "secondary" : "outline"}
                  >
                    {level} Confidence
                  </Badge>
                  <span className="font-mono font-bold text-lg">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Top 10 Prioritized Leads</CardTitle>
          <CardDescription>Highest scoring companies for immediate outreach</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {top10.map((lead, idx) => (
              <div 
                key={lead.id} 
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-muted-foreground w-6">#{idx + 1}</span>
                  <div>
                    <p className="font-semibold">{lead.company_name}</p>
                    <p className="text-xs text-muted-foreground">{lead.explanation}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={lead.ai_potential === "High" ? "default" : "secondary"} className="text-xs">
                    {lead.ai_potential}
                  </Badge>
                  <Badge variant="outline" className="font-mono font-bold">
                    {lead.lead_score}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
