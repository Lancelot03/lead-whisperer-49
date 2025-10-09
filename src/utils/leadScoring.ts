export interface Lead {
  id: string;
  company_name: string;
  domain?: string;
  employees?: string | number;
  revenue_est?: string | number;
  email?: string;
  linkedin?: string;
  jobs_30d?: string | number;
  recent_funding?: string;
  lead_score?: number;
  confidence_level?: "Low" | "Medium" | "High";
  explanation?: string;
  ai_potential?: "High" | "Medium" | "Low";
  lead_category?: "Enterprise" | "Growth" | "Startup";
  breakdown?: {
    funding: number;
    hiring: number;
    revenue: number;
    size: number;
    confidence: number;
  };
}

const parseNumber = (value: any): number => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/[^0-9.-]/g, "");
    return parseFloat(cleaned) || 0;
  }
  return 0;
};

// Business-driven scoring components
const calculateFundingScore = (lead: Lead): number => {
  const hasFunding = lead.recent_funding && lead.recent_funding.toLowerCase() !== "no";
  return hasFunding ? 100 : 0;
};

const calculateHiringScore = (lead: Lead): number => {
  const jobs = parseNumber(lead.jobs_30d);
  if (jobs >= 10) return 100;
  if (jobs >= 5) return 80;
  if (jobs >= 2) return 60;
  if (jobs >= 1) return 40;
  return 0;
};

const calculateRevenueScore = (lead: Lead): number => {
  const revenue = parseNumber(lead.revenue_est);
  if (revenue >= 50000000) return 100; // $50M+
  if (revenue >= 10000000) return 85;  // $10M-$50M
  if (revenue >= 5000000) return 70;   // $5M-$10M
  if (revenue >= 1000000) return 55;   // $1M-$5M
  if (revenue >= 100000) return 30;    // $100K-$1M
  return 10;
};

const calculateSizeScore = (lead: Lead): number => {
  const employees = parseNumber(lead.employees);
  if (employees >= 1000) return 100; // Enterprise
  if (employees >= 250) return 85;   // Large mid-market
  if (employees >= 50) return 70;    // Mid-market
  if (employees >= 10) return 50;    // Small business
  return 25;
};

const calculateConfidenceScore = (lead: Lead): number => {
  const fields = [
    lead.company_name,
    lead.domain,
    lead.employees,
    lead.revenue_est,
    lead.email,
    lead.linkedin,
    lead.jobs_30d,
    lead.recent_funding,
  ];
  const filledFields = fields.filter((f) => f && f !== "").length;
  return (filledFields / fields.length) * 100;
};

const determineAIPotential = (lead: Lead, breakdown: any): "High" | "Medium" | "Low" => {
  const fundingScore = breakdown.funding;
  const hiringScore = breakdown.hiring;
  const sizeScore = breakdown.size;
  
  const combinedScore = (fundingScore * 0.4) + (hiringScore * 0.35) + (sizeScore * 0.25);
  
  if (combinedScore >= 75) return "High";
  if (combinedScore >= 45) return "Medium";
  return "Low";
};

const determineLeadCategory = (lead: Lead): "Enterprise" | "Growth" | "Startup" => {
  const employees = parseNumber(lead.employees);
  const revenue = parseNumber(lead.revenue_est);
  const jobs = parseNumber(lead.jobs_30d);
  
  if (employees >= 500 || revenue >= 50000000) return "Enterprise";
  if (employees >= 50 || revenue >= 5000000 || jobs >= 3) return "Growth";
  return "Startup";
};

export const scoreLead = (lead: Lead): Lead => {
  // Calculate individual component scores (0-100 scale)
  const breakdown = {
    funding: calculateFundingScore(lead),
    hiring: calculateHiringScore(lead),
    revenue: calculateRevenueScore(lead),
    size: calculateSizeScore(lead),
    confidence: calculateConfidenceScore(lead),
  };

  // Weighted business-driven score (0-100)
  const lead_score = Math.round(
    breakdown.funding * 0.35 +
    breakdown.hiring * 0.25 +
    breakdown.revenue * 0.20 +
    breakdown.size * 0.10 +
    breakdown.confidence * 0.10
  );

  // Confidence based on data completeness
  let confidence_level: "Low" | "Medium" | "High" = "Low";
  if (breakdown.confidence >= 75) confidence_level = "High";
  else if (breakdown.confidence >= 50) confidence_level = "Medium";

  // Enrichment fields
  const ai_potential = determineAIPotential(lead, breakdown);
  const lead_category = determineLeadCategory(lead);

  // Generate explanation
  const explanations: string[] = [];
  const jobs = parseNumber(lead.jobs_30d);
  const revenue = parseNumber(lead.revenue_est);
  const hasFunding = lead.recent_funding && lead.recent_funding.toLowerCase() !== "no";
  
  if (hasFunding) {
    explanations.push("Recent funding round");
  }
  
  if (jobs >= 5) {
    explanations.push(`High hiring momentum (${jobs} jobs)`);
  } else if (jobs >= 2) {
    explanations.push(`Active hiring (${jobs} jobs)`);
  }
  
  if (revenue >= 10000000) {
    explanations.push("Strong revenue base");
  }

  if (!explanations.length) {
    explanations.push("Baseline fit");
  }

  const explanation = explanations.join(" • ");

  return {
    ...lead,
    lead_score,
    confidence_level,
    explanation,
    ai_potential,
    lead_category,
    breakdown,
  };
};

// Fuzzy deduplication using simple string similarity
const calculateSimilarity = (str1: string, str2: string): number => {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  
  if (s1 === s2) return 1.0;
  
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  
  if (longer.length === 0) return 1.0;
  
  let matches = 0;
  for (let i = 0; i < shorter.length; i++) {
    if (longer.includes(shorter[i])) matches++;
  }
  
  return matches / longer.length;
};

export const deduplicateLeads = (leads: Lead[]): Lead[] => {
  const unique: Lead[] = [];
  const seen = new Set<string>();

  for (const lead of leads) {
    const name = lead.company_name?.toLowerCase().trim() || "";
    
    let isDuplicate = false;
    for (const existingName of seen) {
      if (calculateSimilarity(name, existingName) > 0.85) {
        isDuplicate = true;
        break;
      }
    }
    
    if (!isDuplicate && name) {
      unique.push(lead);
      seen.add(name);
    }
  }

  return unique;
};

export const scoreAndDeduplicateLeads = (leads: Lead[]): Lead[] => {
  const deduplicated = deduplicateLeads(leads);
  return deduplicated.map(scoreLead).sort((a, b) => (b.lead_score || 0) - (a.lead_score || 0));
};
