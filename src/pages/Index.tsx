import { useState, useMemo } from "react";
import { Sparkles } from "lucide-react";
import { LeadUploader } from "@/components/LeadUploader";
import { LeadTable } from "@/components/LeadTable";
import { StatsCards } from "@/components/StatsCards";
import { FilterPanel } from "@/components/FilterPanel";
import { LeadInsights } from "@/components/LeadInsights";
import { ValidationWarnings } from "@/components/ValidationWarnings";
import { ContactRecommendations } from "@/components/ContactRecommendations";
import { Lead, scoreAndDeduplicateLeads } from "@/utils/leadScoring";

const EXAMPLE_LEADS: Lead[] = [
  {
    id: "1",
    company_name: "TechCorp Solutions",
    domain: "techcorp.com",
    employees: 450,
    revenue_est: 25000000,
    email: "contact@techcorp.com",
    linkedin: "linkedin.com/company/techcorp",
    jobs_30d: 12,
    recent_funding: "Series B - $15M",
  },
  {
    id: "2",
    company_name: "DataFlow Systems",
    domain: "dataflow.io",
    employees: 85,
    revenue_est: 8500000,
    email: "hello@dataflow.io",
    linkedin: "linkedin.com/company/dataflow",
    jobs_30d: 6,
    recent_funding: "Series A - $5M",
  },
  {
    id: "3",
    company_name: "CloudNext Inc",
    domain: "cloudnext.com",
    employees: 1200,
    revenue_est: 75000000,
    email: "",
    linkedin: "linkedin.com/company/cloudnext",
    jobs_30d: 18,
    recent_funding: "Series C - $40M",
  },
  {
    id: "4",
    company_name: "StartupHub",
    domain: "startuphub.co",
    employees: 15,
    revenue_est: 850000,
    email: "team@startuphub.co",
    linkedin: "",
    jobs_30d: 2,
    recent_funding: "Seed - $1M",
  },
  {
    id: "5",
    company_name: "AI Ventures",
    domain: "aiventures.ai",
    employees: 95,
    revenue_est: 12000000,
    email: "",
    linkedin: "linkedin.com/company/ai-ventures",
    jobs_30d: 8,
    recent_funding: "No",
  },
  {
    id: "6",
    company_name: "Enterprise Global",
    domain: "enterpriseglobal.com",
    employees: 3500,
    revenue_est: 150000000,
    email: "contact@enterpriseglobal.com",
    linkedin: "linkedin.com/company/enterprise-global",
    jobs_30d: 25,
    recent_funding: "IPO",
  },
  {
    id: "7",
    company_name: "Growth Labs",
    domain: "growthlabs.com",
    employees: 120,
    revenue_est: 15000000,
    email: "info@growthlabs.com",
    linkedin: "linkedin.com/company/growth-labs",
    jobs_30d: 4,
    recent_funding: "Series A - $8M",
  },
  {
    id: "8",
    company_name: "Micro Innovate",
    domain: "microinnovate.io",
    employees: 8,
    revenue_est: 450000,
    email: "",
    linkedin: "",
    jobs_30d: 0,
    recent_funding: "No",
  },
];

const Index = () => {
  const [rawLeads, setRawLeads] = useState<Lead[]>([]);
  const [minScore, setMinScore] = useState(0);
  const [emailOnly, setEmailOnly] = useState(false);
  const [highIntentOnly, setHighIntentOnly] = useState(false);

  const loadExampleData = () => {
    setRawLeads(EXAMPLE_LEADS);
  };

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

  const handleLeadsUpdated = (updatedLeads: Lead[]) => {
    setRawLeads(updatedLeads);
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
            
            <div className="mt-8 text-center">
              <div className="p-6 rounded-lg bg-card shadow-card border-2 border-dashed border-primary/20">
                <h3 className="text-lg font-semibold mb-2">Want to try it first?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Load example data to see how the lead prioritizer works
                </p>
                <button
                  onClick={loadExampleData}
                  className="px-6 py-2 bg-gradient-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Load Example Data
                </button>
              </div>
            </div>

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
            
            <ValidationWarnings leads={scoredLeads} />
            
            <LeadInsights leads={filteredLeads} />

            <div className="grid lg:grid-cols-2 gap-6">
              <FilterPanel
                minScore={minScore}
                onMinScoreChange={setMinScore}
                emailOnly={emailOnly}
                onEmailOnlyChange={setEmailOnly}
                highIntentOnly={highIntentOnly}
                onHighIntentOnlyChange={setHighIntentOnly}
              />
              <ContactRecommendations leads={filteredLeads} onLeadsUpdated={handleLeadsUpdated} />
            </div>

            <LeadTable leads={filteredLeads} />
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
