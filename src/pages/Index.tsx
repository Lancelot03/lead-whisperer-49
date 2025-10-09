import { useState, useMemo } from "react";
import { Sparkles } from "lucide-react";
import { LeadUploader } from "@/components/LeadUploader";
import { LeadTable } from "@/components/LeadTable";
import { StatsCards } from "@/components/StatsCards";
import { FilterPanel } from "@/components/FilterPanel";
import { LeadInsights } from "@/components/LeadInsights";
import { Lead, scoreAndDeduplicateLeads } from "@/utils/leadScoring";

const Index = () => {
  const [rawLeads, setRawLeads] = useState<Lead[]>([]);
  const [minScore, setMinScore] = useState(0);
  const [emailOnly, setEmailOnly] = useState(false);
  const [highIntentOnly, setHighIntentOnly] = useState(false);

  const scoredLeads = useMemo(() => {
    if (rawLeads.length === 0) return [];
    return scoreAndDeduplicateLeads(rawLeads);
  }, [rawLeads]);

  const filteredLeads = useMemo(() => {
    return scoredLeads.filter((lead) => {
      if ((lead.lead_score || 0) < minScore) return false;
      if (emailOnly && !lead.email) return false;
      if (highIntentOnly && (lead.breakdown?.hiring || 0) < 60) return false;
      return true;
    });
  }, [scoredLeads, minScore, emailOnly, highIntentOnly]);

  const handleLeadsUploaded = (leads: Lead[]) => {
    setRawLeads(leads);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Smart Lead Prioritizer
              </h1>
              <p className="text-sm text-muted-foreground">
                AI-powered lead scoring and ranking
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 space-y-8">
        {scoredLeads.length === 0 ? (
          <div className="max-w-3xl mx-auto">
            <LeadUploader onLeadsUploaded={handleLeadsUploaded} />
            
            <div className="mt-12 text-center">
              <h2 className="text-xl font-semibold mb-4">How it works</h2>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="p-6 rounded-lg bg-card shadow-card">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary font-bold text-lg">
                    1
                  </div>
                  <h3 className="font-semibold mb-2">Upload Your Data</h3>
                  <p className="text-sm text-muted-foreground">
                    Drop in your CSV or JSON file with lead information
                  </p>
                </div>
                <div className="p-6 rounded-lg bg-card shadow-card">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 text-accent font-bold text-lg">
                    2
                  </div>
                  <h3 className="font-semibold mb-2">AI Analyzes & Scores</h3>
                  <p className="text-sm text-muted-foreground">
                    Our algorithm evaluates firmographics, intent, and contactability
                  </p>
                </div>
                <div className="p-6 rounded-lg bg-card shadow-card">
                  <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-4 text-success font-bold text-lg">
                    3
                  </div>
                  <h3 className="font-semibold mb-2">Get Prioritized List</h3>
                  <p className="text-sm text-muted-foreground">
                    Export ranked leads with explanations for your sales team
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <StatsCards leads={filteredLeads} />
            
            <LeadInsights leads={filteredLeads} />

            <div className="grid lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <FilterPanel
                  minScore={minScore}
                  onMinScoreChange={setMinScore}
                  emailOnly={emailOnly}
                  onEmailOnlyChange={setEmailOnly}
                  highIntentOnly={highIntentOnly}
                  onHighIntentOnlyChange={setHighIntentOnly}
                />
              </div>

              <div className="lg:col-span-3">
                <LeadTable leads={filteredLeads} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
