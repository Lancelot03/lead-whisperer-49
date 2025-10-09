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
  breakdown?: {
    firmographic: number;
    intent: number;
    contactability: number;
    enrichment: number;
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

const calculateFirmographicFit = (lead: Lead): number => {
  let score = 0;
  const employees = parseNumber(lead.employees);
  const revenue = parseNumber(lead.revenue_est);

  // Employee count scoring (0-30)
  if (employees >= 50 && employees <= 500) {
    score += 30; // Sweet spot for mid-market
  } else if (employees >= 500 && employees <= 5000) {
    score += 25; // Enterprise
  } else if (employees > 5000) {
    score += 15; // Large enterprise (harder to penetrate)
  } else if (employees >= 10) {
    score += 20; // Small business
  }

  // Revenue scoring (0-20)
  if (revenue >= 1000000 && revenue <= 50000000) {
    score += 20; // Good revenue range
  } else if (revenue > 50000000) {
    score += 15;
  } else if (revenue >= 100000) {
    score += 10;
  }

  return Math.min(score, 50);
};

const calculateIntentSignals = (lead: Lead): number => {
  let score = 0;
  const jobs = parseNumber(lead.jobs_30d);
  const hasFunding = lead.recent_funding && lead.recent_funding.toLowerCase() !== "no";

  // Job postings (0-25)
  if (jobs >= 5) {
    score += 25; // High hiring = growth
  } else if (jobs >= 2) {
    score += 20;
  } else if (jobs >= 1) {
    score += 15;
  }

  // Recent funding (0-15)
  if (hasFunding) {
    score += 15;
  }

  return Math.min(score, 40);
};

const calculateContactability = (lead: Lead): number => {
  let score = 0;

  // Email (0-10)
  if (lead.email && lead.email.includes("@")) {
    score += 10;
  }

  // LinkedIn (0-5)
  if (lead.linkedin && lead.linkedin.includes("linkedin.com")) {
    score += 5;
  }

  // Domain (0-5)
  if (lead.domain) {
    score += 5;
  }

  return Math.min(score, 20);
};

const calculateEnrichmentEfficiency = (lead: Lead): number => {
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
  return Math.round((filledFields / fields.length) * 10);
};

export const scoreLead = (lead: Lead): Lead => {
  const breakdown = {
    firmographic: calculateFirmographicFit(lead),
    intent: calculateIntentSignals(lead),
    contactability: calculateContactability(lead),
    enrichment: calculateEnrichmentEfficiency(lead),
  };

  const lead_score = Math.round(
    breakdown.firmographic * 0.3 +
      breakdown.intent * 0.4 +
      breakdown.contactability * 0.2 +
      breakdown.enrichment * 0.1
  );

  let confidence_level: "Low" | "Medium" | "High" = "Low";
  if (breakdown.enrichment >= 7) confidence_level = "High";
  else if (breakdown.enrichment >= 5) confidence_level = "Medium";

  // Generate explanation
  const explanations: string[] = [];
  
  if (breakdown.intent >= 20) {
    explanations.push(`+Intent: High (${parseNumber(lead.jobs_30d)} jobs posted)`);
  } else if (breakdown.intent >= 10) {
    explanations.push(`+Intent: Medium`);
  }

  if (breakdown.firmographic >= 35) {
    explanations.push(`+Fit: High (Strong firmographics)`);
  } else if (breakdown.firmographic >= 20) {
    explanations.push(`+Fit: Medium`);
  }

  if (breakdown.contactability >= 15) {
    explanations.push(`+Contact: Strong (Email & LinkedIn found)`);
  } else if (breakdown.contactability >= 10) {
    explanations.push(`+Contact: Good (Email found)`);
  }

  const explanation = explanations.join(", ");

  return {
    ...lead,
    lead_score,
    confidence_level,
    explanation,
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
