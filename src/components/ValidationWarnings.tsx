import { Lead } from "@/utils/leadScoring";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

interface ValidationWarningsProps {
  leads: Lead[];
}

export const ValidationWarnings = ({ leads }: ValidationWarningsProps) => {
  if (leads.length === 0) return null;

  // Data quality checks
  const missingEmails = leads.filter(l => !l.email || l.email.trim() === "");
  const missingLinkedIn = leads.filter(l => !l.linkedin || l.linkedin.trim() === "");
  const missingRevenue = leads.filter(l => !l.revenue_est || l.revenue_est.toString().trim() === "");
  const missingEmployees = leads.filter(l => !l.employees || l.employees.toString().trim() === "");
  const lowConfidence = leads.filter(l => l.confidence_level === "Low");
  const noFunding = leads.filter(l => !l.recent_funding || l.recent_funding.toLowerCase() === "no");
  const noHiring = leads.filter(l => !l.jobs_30d || (l.jobs_30d as number) === 0);
  
  // Calculate completeness score
  const totalFields = leads.length * 7; // 7 key fields per lead
  const completedFields = totalFields - 
    (missingEmails.length + missingLinkedIn.length + missingRevenue.length + 
     missingEmployees.length + noFunding.length + noHiring.length + (lowConfidence.length * 0.5));
  const completenessScore = Math.round((completedFields / totalFields) * 100);

  const hasWarnings = missingEmails.length > 0 || missingLinkedIn.length > 0 || 
                      missingRevenue.length > 0 || lowConfidence.length > 0;

  return (
    <Card className="shadow-card border-l-4 border-l-warning">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          Data Quality Assessment
        </CardTitle>
        <CardDescription>
          Completeness: <Badge variant={completenessScore >= 80 ? "default" : completenessScore >= 50 ? "secondary" : "destructive"} className="ml-2 font-mono">{completenessScore}%</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasWarnings ? (
          <>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Data Quality Issues Detected</AlertTitle>
              <AlertDescription className="text-sm">
                Review the following validation warnings to improve lead contactability and scoring accuracy.
              </AlertDescription>
            </Alert>

            <div className="grid gap-3">
              {missingEmails.length > 0 && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-medium">Missing Email Addresses</span>
                  </div>
                  <Badge variant="destructive" className="font-mono">{missingEmails.length}</Badge>
                </div>
              )}

              {missingLinkedIn.length > 0 && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10 border border-warning/20">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <span className="text-sm font-medium">Missing LinkedIn Profiles</span>
                  </div>
                  <Badge variant="outline" className="font-mono">{missingLinkedIn.length}</Badge>
                </div>
              )}

              {missingRevenue.length > 0 && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10 border border-warning/20">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <span className="text-sm font-medium">Missing Revenue Estimates</span>
                  </div>
                  <Badge variant="outline" className="font-mono">{missingRevenue.length}</Badge>
                </div>
              )}

              {missingEmployees.length > 0 && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10 border border-warning/20">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <span className="text-sm font-medium">Missing Employee Count</span>
                  </div>
                  <Badge variant="outline" className="font-mono">{missingEmployees.length}</Badge>
                </div>
              )}

              {lowConfidence.length > 0 && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted border">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Low Confidence Leads</span>
                  </div>
                  <Badge variant="outline" className="font-mono">{lowConfidence.length}</Badge>
                </div>
              )}
            </div>
          </>
        ) : (
          <Alert className="border-success bg-success/10">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <AlertTitle>Excellent Data Quality</AlertTitle>
            <AlertDescription>
              All leads have complete information for accurate scoring and outreach.
            </AlertDescription>
          </Alert>
        )}

        <div className="pt-4 border-t">
          <h4 className="text-sm font-semibold mb-2">Recommendations:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            {missingEmails.length > 0 && (
              <li>• Enrich {missingEmails.length} leads with email addresses for direct outreach</li>
            )}
            {missingLinkedIn.length > 0 && (
              <li>• Add LinkedIn profiles to {missingLinkedIn.length} leads for social selling</li>
            )}
            {lowConfidence.length > 0 && (
              <li>• Verify and complete data for {lowConfidence.length} low-confidence leads</li>
            )}
            {noHiring.length > 0 && (
              <li>• Monitor {noHiring.length} companies for hiring activity (expansion signal)</li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};