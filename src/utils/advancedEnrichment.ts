import { Lead } from "./leadScoring";

/**
 * Advanced enrichment utilities for lead data
 * These functions simulate advanced features that would typically connect to external APIs
 */

// Simulate tech stack detection (in production, this would use BuiltWith, Wappalyzer, etc.)
export const detectTechStack = (domain?: string): string[] => {
  if (!domain) return [];
  
  // Simulated tech stacks based on domain patterns
  const techStacks: Record<string, string[]> = {
    ".ai": ["AI/ML", "Python", "TensorFlow", "AWS", "Docker"],
    ".io": ["Node.js", "React", "MongoDB", "Kubernetes"],
    ".com": ["JavaScript", "AWS", "PostgreSQL"],
    ".co": ["Ruby on Rails", "Redis", "Heroku"],
  };
  
  for (const [pattern, stack] of Object.entries(techStacks)) {
    if (domain.includes(pattern)) {
      return stack;
    }
  }
  
  return ["JavaScript", "Cloud Hosting"];
};

// Simulate email validation (in production, use NeverBounce, ZeroBounce, etc.)
export const validateEmail = (email?: string): "Valid" | "Invalid" | "Unknown" => {
  if (!email) return "Unknown";
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? "Valid" : "Invalid";
};

// Simulate domain status check (in production, use DNS/WHOIS APIs)
export const checkDomainStatus = (domain?: string): "Active" | "Inactive" | "Unknown" => {
  if (!domain) return "Unknown";
  
  // In production, this would ping the domain or check DNS records
  return "Active";
};

// Enrich a single lead with advanced features
export const enrichLeadAdvanced = (lead: Lead): Lead => {
  return {
    ...lead,
    tech_stack: detectTechStack(lead.domain),
    email_validation: validateEmail(lead.email),
    domain_status: checkDomainStatus(lead.domain),
  };
};

// Batch enrich multiple leads
export const batchEnrichLeads = async (leads: Lead[]): Promise<Lead[]> => {
  // In production, this would make batch API calls to enrichment services
  return leads.map(enrichLeadAdvanced);
};
