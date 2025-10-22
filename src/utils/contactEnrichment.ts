import { Lead } from "./leadScoring";
import { supabase } from "@/integrations/supabase/client";

export const enrichLeadContacts = async (leads: Lead[]): Promise<Lead[]> => {
  const enrichedLeads = await Promise.all(
    leads.map(async (lead) => {
      // Skip if already has contact info
      if (lead.email && lead.linkedin) {
        return lead;
      }

      try {
        const { data, error } = await supabase.functions.invoke('enrich-contacts', {
          body: {
            companyName: lead.company_name,
            domain: lead.domain,
          },
        });

        if (error) {
          console.error(`Failed to enrich ${lead.company_name}:`, error);
          return lead;
        }
        
        if (data?.success && data?.data) {
          return {
            ...lead,
            email: lead.email || data.data.email,
            linkedin: lead.linkedin || data.data.linkedin,
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
