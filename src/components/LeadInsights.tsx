import { Lead } from "@/utils/leadScoring";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Award, BarChart3, PieChart } from "lucide-react";

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

  // Score distribution for chart
  const scoreRanges = {
    "0-20": leads.filter(l => (l.lead_score || 0) < 20).length,
    "20-40": leads.filter(l => (l.lead_score || 0) >= 20 && (l.lead_score || 0) < 40).length,
    "40-60": leads.filter(l => (l.lead_score || 0) >= 40 && (l.lead_score || 0) < 60).length,
    "60-80": leads.filter(l => (l.lead_score || 0) >= 60 && (l.lead_score || 0) < 80).length,
    "80-100": leads.filter(l => (l.lead_score || 0) >= 80).length,
  };

  // AI Potential distribution
  const aiPotentialDist = {
    High: leads.filter(l => l.ai_potential === "High").length,
    Medium: leads.filter(l => l.ai_potential === "Medium").length,
    Low: leads.filter(l => l.ai_potential === "Low").length,
  };

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

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-primary" />
              Score Distribution
            </CardTitle>
            <CardDescription>Lead count by score range</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(scoreRanges).map(([range, count]) => {
                const maxCount = Math.max(...Object.values(scoreRanges));
                const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                return (
                  <div key={range}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{range}</span>
                      <span className="text-sm font-mono">{count}</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-primary transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <PieChart className="h-5 w-5 text-accent" />
              AI Potential Breakdown
            </CardTitle>
            <CardDescription>Classification by AI readiness</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(aiPotentialDist).map(([level, count]) => {
                const percentage = Math.round((count / leads.length) * 100);
                return (
                  <div key={level}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={level === "High" ? "default" : level === "Medium" ? "secondary" : "outline"}
                          className="text-xs"
                        >
                          {level}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{percentage}%</span>
                      </div>
                      <span className="text-sm font-mono font-bold">{count}</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          level === "High" 
                            ? "bg-gradient-primary" 
                            : level === "Medium" 
                            ? "bg-accent" 
                            : "bg-muted-foreground"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
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
