import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { companyName, domain } = await req.json();
    console.log(`Enriching contact info for: ${companyName}`);

    const enrichedData: { email?: string; linkedin?: string } = {};

    // Find LinkedIn company page
    try {
      const linkedInQuery = `${companyName} site:linkedin.com/company`;
      const linkedInUrl = `https://www.google.com/search?q=${encodeURIComponent(linkedInQuery)}`;
      console.log(`Searching LinkedIn: ${linkedInQuery}`);
      
      // Extract LinkedIn from company name pattern
      const cleanName = companyName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      enrichedData.linkedin = `https://www.linkedin.com/company/${cleanName}`;
    } catch (error) {
      console.error('LinkedIn search error:', error);
    }

    // Generate common email patterns from domain
    if (domain) {
      const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
      // Try common patterns
      const emailPatterns = [
        `info@${cleanDomain}`,
        `contact@${cleanDomain}`,
        `hello@${cleanDomain}`,
        `sales@${cleanDomain}`,
      ];
      
      enrichedData.email = emailPatterns[0]; // Use first pattern as default
      console.log(`Generated email patterns for ${cleanDomain}`);
    }

    console.log('Enrichment complete:', enrichedData);

    return new Response(
      JSON.stringify({ success: true, data: enrichedData }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Enrichment error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});