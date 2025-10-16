import { Lead } from "./leadScoring";

export const enrichLeadContacts = async (leads: Lead[]): Promise<Lead[]> => {
  const enrichedLeads = await Promise.all(
    leads.map(async (lead) => {
      // Skip if already has contact info
      if (lead.email && lead.linkedin) {
        return lead;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/enrich-contacts`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              companyName: lead.company_name,
              domain: lead.domain,
            }),
          }
        );

        if (!response.ok) {
          console.error(`Failed to enrich ${lead.company_name}`);
          return lead;
        }

        const result = await response.json();
        
        if (result.success && result.data) {
          return {
            ...lead,
            email: lead.email || result.data.email,
            linkedin: lead.linkedin || result.data.linkedin,
          };
        }

        return lead;
      } catch (error) {
        console.error(`Error enriching ${lead.company_name}:`, error);
        return lead;
      }
    })
  );

  return enrichedLeads;
};
