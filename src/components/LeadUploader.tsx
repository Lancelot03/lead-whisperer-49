import { useState, useCallback } from "react";
import { Upload, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface LeadUploaderProps {
  onLeadsUploaded: (leads: any[]) => void;
}

export const LeadUploader = ({ onLeadsUploaded }: LeadUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const parseCSV = (text: string) => {
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",").map(h => h.trim());
    
    const leads = lines.slice(1).map((line, index) => {
      const values = line.split(",").map(v => v.trim());
      const lead: any = { id: `lead-${index}` };
      
      headers.forEach((header, i) => {
        lead[header] = values[i] || "";
      });
      
      return lead;
    });
    
    return leads;
  };

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.json')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV or JSON file",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        let leads;
        
        if (file.name.endsWith('.json')) {
          leads = JSON.parse(text);
        } else {
          leads = parseCSV(text);
        }
        
        onLeadsUploaded(Array.isArray(leads) ? leads : []);
        toast({
          title: "Success!",
          description: `Loaded ${leads.length} leads`,
        });
      } catch (error) {
        toast({
          title: "Parse error",
          description: "Could not parse the file",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  }, [onLeadsUploaded, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-all ${
        isDragging
          ? "border-primary bg-primary/5 scale-[1.02]"
          : "border-border hover:border-primary/50 hover:bg-muted/30"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept=".csv,.json"
        onChange={handleFileInput}
        className="hidden"
        id="file-upload"
      />
      
      <div className="flex flex-col items-center gap-4">
        <div className="p-4 rounded-full bg-gradient-primary">
          <Upload className="w-8 h-8 text-primary-foreground" />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Upload Lead Data</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop your CSV or JSON file here, or click to browse
          </p>
        </div>
        
        <Button asChild variant="default" size="lg">
          <label htmlFor="file-upload" className="cursor-pointer">
            <FileUp className="mr-2 h-4 w-4" />
            Choose File
          </label>
        </Button>
        
        <p className="text-xs text-muted-foreground">
          Expected columns: company_name, domain, employees, revenue_est, email, linkedin, jobs_30d, recent_funding
        </p>
      </div>
    </div>
  );
};
