import { useState } from "react";
import { Lead } from "@/utils/leadScoring";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Phone, Star, Clock, TrendingUp, Sparkles } from "lucide-react";
import { enrichLeadContacts } from "@/utils/contactEnrichment";
import { useToast } from "@/hooks/use-toast";

interface ContactRecommendationsProps {
  leads: Lead[];
  onLeadsUpdated?: (leads: Lead[]) => void;
}

export const ContactRecommendations = ({ leads, onLeadsUpdated }: ContactRecommendationsProps) => {
  const [isEnriching, setIsEnriching] = useState(false);
  const { toast } = useToast();

  if (leads.length === 0) return null;

  const handleEnrichContacts = async () => {
    setIsEnriching(true);
    toast({
      title: "Enriching contacts...",
      description: "Fetching email and LinkedIn information from company websites",
    });

    try {
      const enrichedLeads = await enrichLeadContacts(leads);
      
      const enrichedCount = enrichedLeads.filter((lead, idx) => 
        (lead.email !== leads[idx].email) || (lead.linkedin !== leads[idx].linkedin)
      ).length;

      if (onLeadsUpdated) {
        onLeadsUpdated(enrichedLeads);
      }

      toast({
        title: "Enrichment complete!",
        description: `Updated contact info for ${enrichedCount} companies`,
      });
    } catch (error) {
      toast({
        title: "Enrichment failed",
        description: "Could not fetch contact information",
        variant: "destructive",
      });
    } finally {
      setIsEnriching(false);
    }
  };

  // Priority tiers for contact
  const immediateContact = leads.filter(l => 
    (l.lead_score || 0) >= 85 && 
    l.ai_potential === "High" && 
    l.email && 
    l.confidence_level !== "Low"
  ).slice(0, 5);

  const nextWeek = leads.filter(l => 
    (l.lead_score || 0) >= 70 && 
    (l.lead_score || 0) < 85 &&
    l.confidence_level !== "Low"
  ).slice(0, 5);

  const nurture = leads.filter(l => 
    (l.lead_score || 0) >= 50 && 
    (l.lead_score || 0) < 70
  ).slice(0, 5);

  const getContactMethods = (lead: Lead) => {
    const methods = [];
    if (lead.email) methods.push("email");
    if (lead.linkedin) methods.push("linkedin");
    return methods;
  };

  const ContactCard = ({ lead, priority }: { lead: Lead; priority: "immediate" | "next-week" | "nurture" }) => {
    const methods = getContactMethods(lead);
    const priorityConfig = {
      immediate: { label: "Contact Now", variant: "default" as const, icon: Star },
      "next-week": { label: "This Week", variant: "secondary" as const, icon: Clock },
      nurture: { label: "Nurture", variant: "outline" as const, icon: TrendingUp },
    };
    const config = priorityConfig[priority];
    const Icon = config.icon;

    return (
      <div className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-sm mb-1">{lead.company_name}</h4>
            <p className="text-xs text-muted-foreground line-clamp-2">{lead.explanation}</p>
          </div>
          <Badge variant={config.variant} className="ml-2 text-xs whitespace-nowrap">
            <Icon className="h-3 w-3 mr-1" />
            {config.label}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="text-xs font-mono">{lead.lead_score}</Badge>
          <Badge variant={lead.ai_potential === "High" ? "default" : "secondary"} className="text-xs">
            {lead.ai_potential} AI Potential
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {methods.includes("email") && (
            <Button size="sm" variant="outline" className="h-7 text-xs">
              <Mail className="h-3 w-3 mr-1" />
              Email
            </Button>
          )}
          {methods.includes("linkedin") && (
            <Button size="sm" variant="outline" className="h-7 text-xs">
              <Linkedin className="h-3 w-3 mr-1" />
              LinkedIn
            </Button>
          )}
          {methods.length === 0 && (
            <span className="text-xs text-muted-foreground">No contact info</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Contact Recommendations
              </CardTitle>
              <CardDescription>Prioritized outreach strategy based on lead quality and readiness</CardDescription>
            </div>
            <Button 
              onClick={handleEnrichContacts}
              disabled={isEnriching}
              size="sm"
              variant="outline"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isEnriching ? "Enriching..." : "Fetch Contact Info"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {immediateContact.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  Immediate Priority ({immediateContact.length})
                </h3>
                <span className="text-xs text-muted-foreground">Contact within 24 hours</span>
              </div>
              <div className="space-y-3">
                {immediateContact.map(lead => (
                  <ContactCard key={lead.id} lead={lead} priority="immediate" />
                ))}
              </div>
            </div>
          )}

          {nextWeek.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-accent" />
                  This Week ({nextWeek.length})
                </h3>
                <span className="text-xs text-muted-foreground">Contact within 7 days</span>
              </div>
              <div className="space-y-3">
                {nextWeek.map(lead => (
                  <ContactCard key={lead.id} lead={lead} priority="next-week" />
                ))}
              </div>
            </div>
          )}

          {nurture.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  Nurture Campaign ({nurture.length})
                </h3>
                <span className="text-xs text-muted-foreground">Add to drip campaign</span>
              </div>
              <div className="space-y-3">
                {nurture.map(lead => (
                  <ContactCard key={lead.id} lead={lead} priority="nurture" />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};