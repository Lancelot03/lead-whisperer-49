import { useState, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Download, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Lead } from "@/utils/leadScoring";
import { useToast } from "@/hooks/use-toast";

interface LeadTableProps {
  leads: Lead[];
}

type SortField = "lead_score" | "company_name" | "employees" | "jobs_30d";
type SortDirection = "asc" | "desc";

export const LeadTable = ({ leads }: LeadTableProps) => {
  const [sortField, setSortField] = useState<SortField>("lead_score");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const { toast } = useToast();

  const sortedLeads = useMemo(() => {
    return [...leads].sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();

      if (sortDirection === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }, [leads, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getScoreBadgeVariant = (score?: number) => {
    if (!score) return "secondary";
    if (score >= 80) return "default";
    if (score >= 50) return "secondary";
    return "destructive";
  };

  const getScoreLabel = (score?: number) => {
    if (!score) return "Unknown";
    if (score >= 80) return "High Priority";
    if (score >= 50) return "Medium Priority";
    return "Low Priority";
  };

  const exportToCSV = () => {
    const headers = [
      "Company",
      "Domain",
      "Employees",
      "Revenue Est",
      "Jobs (30d)",
      "Recent Funding",
      "Score (Adjusted)",
      "Confidence",
      "AI Potential",
      "Lead Category",
      "Email",
      "LinkedIn",
      "Explanation",
    ];

    const rows = sortedLeads.map((lead) => [
      lead.company_name || "",
      lead.domain || "",
      lead.employees || "",
      lead.revenue_est || "",
      lead.jobs_30d || "",
      lead.recent_funding || "",
      lead.lead_score || "",
      lead.confidence_level || "",
      lead.ai_potential || "",
      lead.lead_category || "",
      lead.email || "",
      lead.linkedin || "",
      lead.explanation || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `refined_prioritized_leads_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: "Refined leads exported to CSV",
    });
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Prioritized Leads</h2>
          <p className="text-sm text-muted-foreground">
            {sortedLeads.length} leads sorted by priority
          </p>
        </div>
        <Button onClick={exportToCSV} variant="default">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="rounded-lg border bg-card shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead
                className="cursor-pointer font-semibold"
                onClick={() => handleSort("lead_score")}
              >
                Score
                <SortIcon field="lead_score" />
              </TableHead>
              <TableHead
                className="cursor-pointer font-semibold"
                onClick={() => handleSort("company_name")}
              >
                Company
                <SortIcon field="company_name" />
              </TableHead>
              <TableHead
                className="cursor-pointer font-semibold"
                onClick={() => handleSort("employees")}
              >
                Employees
                <SortIcon field="employees" />
              </TableHead>
              <TableHead
                className="cursor-pointer font-semibold"
                onClick={() => handleSort("jobs_30d")}
              >
                Jobs (30d)
                <SortIcon field="jobs_30d" />
              </TableHead>
              <TableHead className="font-semibold">AI Potential</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold">Confidence</TableHead>
              <TableHead className="font-semibold">Explanation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedLeads.map((lead) => (
              <TableRow key={lead.id} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  <Badge
                    variant={
                      (lead.lead_score || 0) >= 80
                        ? "default"
                        : (lead.lead_score || 0) >= 50
                        ? "secondary"
                        : "outline"
                    }
                    className="font-mono font-bold"
                  >
                    {lead.lead_score}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">
                  {lead.company_name}
                </TableCell>
                <TableCell>{lead.employees || "—"}</TableCell>
                <TableCell>
                  {lead.jobs_30d ? (
                    <span className="font-semibold text-accent">
                      {lead.jobs_30d}
                    </span>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      lead.ai_potential === "High"
                        ? "default"
                        : lead.ai_potential === "Medium"
                        ? "secondary"
                        : "outline"
                    }
                    className="text-xs font-semibold"
                  >
                    {lead.ai_potential}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {lead.lead_category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      lead.confidence_level === "High"
                        ? "default"
                        : lead.confidence_level === "Medium"
                        ? "secondary"
                        : "outline"
                    }
                    className="text-xs"
                  >
                    {lead.confidence_level}
                  </Badge>
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-2 cursor-help">
                          <span className="text-sm truncate max-w-xs">
                            {lead.explanation}
                          </span>
                          <Info className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <div className="space-y-2">
                          <p className="font-semibold">Score Breakdown:</p>
                          <ul className="text-xs space-y-1">
                            <li>Recent Funding: {lead.breakdown?.funding}/100 (35%)</li>
                            <li>Hiring Activity: {lead.breakdown?.hiring}/100 (25%)</li>
                            <li>Revenue: {lead.breakdown?.revenue}/100 (20%)</li>
                            <li>Company Size: {lead.breakdown?.size}/100 (10%)</li>
                            <li>Data Quality: {Math.round(lead.breakdown?.confidence || 0)}/100 (10%)</li>
                          </ul>
                          <p className="text-xs italic mt-2 pt-2 border-t">
                            {lead.explanation}
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
