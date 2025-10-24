import { Lead } from "@/utils/leadScoring";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  TrendingUp, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Activity,
  Database,
  Globe,
  Mail
} from "lucide-react";

interface AdvancedFeaturesProps {
  leads: Lead[];
}

export const AdvancedFeatures = ({ leads }: AdvancedFeaturesProps) => {
  if (leads.length === 0) return null;

  // Calculate advanced metrics
  const freshDataCount = leads.filter(l => l.data_freshness === "Fresh").length;
  const validEmailCount = leads.filter(l => l.email_validation === "Valid").length;
  const activeDomainCount = leads.filter(l => l.domain_status === "Active").length;
  const highVelocityCount = leads.filter(l => l.growth_velocity === "High").length;
  
  // Average data quality score
  const avgDataQuality = Math.round(
    leads.reduce((sum, lead) => sum + (lead.data_quality_score || 0), 0) / leads.length
  );

  // Company signals breakdown
  const allSignals = leads.flatMap(l => l.company_signals || []);
  const signalCounts = allSignals.reduce((acc, signal) => {
    acc[signal] = (acc[signal] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topSignals = Object.entries(signalCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Technology trends
  const allTech = leads.flatMap(l => l.tech_stack || []);
  const techCounts = allTech.reduce((acc, tech) => {
    acc[tech] = (acc[tech] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topTech = Object.entries(techCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  // Data freshness distribution
  const freshnessDistribution = {
    Fresh: leads.filter(l => l.data_freshness === "Fresh").length,
    Moderate: leads.filter(l => l.data_freshness === "Moderate").length,
    Stale: leads.filter(l => l.data_freshness === "Stale").length,
  };

  // Growth velocity distribution
  const velocityDistribution = {
    High: leads.filter(l => l.growth_velocity === "High").length,
    Medium: leads.filter(l => l.growth_velocity === "Medium").length,
    Low: leads.filter(l => l.growth_velocity === "Low").length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-primary">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Advanced Intelligence
          </h2>
          <p className="text-sm text-muted-foreground">
            Real-time data quality, validation, and growth signals
          </p>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-card hover:shadow-glow transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Database className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{avgDataQuality}%</p>
                <p className="text-xs text-muted-foreground">Data Quality</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{freshDataCount}</p>
                <p className="text-xs text-muted-foreground">Fresh Data</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Mail className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{validEmailCount}</p>
                <p className="text-xs text-muted-foreground">Verified Emails</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <TrendingUp className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{highVelocityCount}</p>
                <p className="text-xs text-muted-foreground">High Growth</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Company Signals */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-accent" />
              Company Growth Signals
            </CardTitle>
            <CardDescription>
              Real-time indicators of company momentum and readiness
            </CardDescription>
          </CardHeader>
          <CardContent>
            {topSignals.length > 0 ? (
              <div className="space-y-3">
                {topSignals.map(([signal, count]) => (
                  <div key={signal} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-warning animate-pulse" />
                      <span className="text-sm">{signal}</span>
                    </div>
                    <Badge variant="secondary" className="font-mono">
                      {count} {count === 1 ? 'lead' : 'leads'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No signals detected yet. Enrich your leads to discover growth indicators.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Technology Stack */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Technology Trends
            </CardTitle>
            <CardDescription>
              Common tech stacks across your lead database
            </CardDescription>
          </CardHeader>
          <CardContent>
            {topTech.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {topTech.map(([tech, count]) => (
                  <Badge 
                    key={tech} 
                    variant="outline" 
                    className="hover:bg-primary/10 transition-colors cursor-pointer"
                  >
                    {tech} ({count})
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Technology data not available. This feature detects common tools and platforms.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Data Freshness */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-success" />
              Data Freshness Monitor
            </CardTitle>
            <CardDescription>
              Track how recent your lead data is
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(freshnessDistribution).map(([level, count]) => {
                const percentage = Math.round((count / leads.length) * 100);
                const Icon = level === "Fresh" ? CheckCircle : level === "Moderate" ? Clock : AlertCircle;
                const color = level === "Fresh" ? "text-success" : level === "Moderate" ? "text-warning" : "text-destructive";
                
                return (
                  <div key={level}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${color}`} />
                        <span className="text-sm font-medium">{level}</span>
                        <span className="text-xs text-muted-foreground">({percentage}%)</span>
                      </div>
                      <span className="text-sm font-mono font-bold">{count}</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          level === "Fresh" 
                            ? "bg-success" 
                            : level === "Moderate" 
                            ? "bg-warning" 
                            : "bg-destructive"
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

        {/* Growth Velocity */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-warning" />
              Growth Velocity Analysis
            </CardTitle>
            <CardDescription>
              Companies ranked by expansion speed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(velocityDistribution).map(([level, count]) => {
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
                        <span className="text-xs text-muted-foreground">{percentage}%</span>
                      </div>
                      <span className="text-sm font-mono font-bold">{count}</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          level === "High" 
                            ? "bg-gradient-primary" 
                            : level === "Medium" 
                            ? "bg-gradient-secondary" 
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

      {/* Data Quality Summary */}
      <Card className="shadow-elegant border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            Data Quality & Validation Summary
          </CardTitle>
          <CardDescription>
            Comprehensive health check of your lead database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">Email Validation</span>
              </div>
              <p className="text-2xl font-bold">{validEmailCount}/{leads.length}</p>
              <p className="text-xs text-muted-foreground">
                {Math.round((validEmailCount / leads.length) * 100)}% emails verified
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Domain Status</span>
              </div>
              <p className="text-2xl font-bold">{activeDomainCount}/{leads.length}</p>
              <p className="text-xs text-muted-foreground">
                {Math.round((activeDomainCount / leads.length) * 100)}% domains active
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-success" />
                <span className="text-sm font-medium">Overall Quality</span>
              </div>
              <p className="text-2xl font-bold">{avgDataQuality}%</p>
              <p className="text-xs text-muted-foreground">
                Average data completeness score
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};