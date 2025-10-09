import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FilterPanelProps {
  minScore: number;
  onMinScoreChange: (value: number) => void;
  emailOnly: boolean;
  onEmailOnlyChange: (value: boolean) => void;
  highIntentOnly: boolean;
  onHighIntentOnlyChange: (value: boolean) => void;
}

export const FilterPanel = ({
  minScore,
  onMinScoreChange,
  emailOnly,
  onEmailOnlyChange,
  highIntentOnly,
  onHighIntentOnlyChange,
}: FilterPanelProps) => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label htmlFor="min-score">Minimum Score</Label>
            <span className="text-sm font-bold text-primary">{minScore}</span>
          </div>
          <Slider
            id="min-score"
            min={0}
            max={100}
            step={5}
            value={[minScore]}
            onValueChange={(values) => onMinScoreChange(values[0])}
            className="w-full"
          />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="email-only" className="flex flex-col gap-1">
            <span>Email Required</span>
            <span className="font-normal text-xs text-muted-foreground">
              Show only contactable leads
            </span>
          </Label>
          <Switch
            id="email-only"
            checked={emailOnly}
            onCheckedChange={onEmailOnlyChange}
          />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="high-intent" className="flex flex-col gap-1">
            <span>High Intent</span>
            <span className="font-normal text-xs text-muted-foreground">
              Active hiring signals
            </span>
          </Label>
          <Switch
            id="high-intent"
            checked={highIntentOnly}
            onCheckedChange={onHighIntentOnlyChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};
