import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const opportunities = [
  {
    name: 'NinjaOne Partnership',
    description:
      'MSP/RMM platform partnership meeting scheduled for 25 February 2026. Recurring revenue from managed IT services.',
    status: 'Meeting scheduled',
    variant: 'warning' as const,
  },
  {
    name: 'Saidi Canada Project',
    description:
      'Web development project. Estimated value ~USD 9,000 (~RM40,500). In active development.',
    status: 'In progress',
    variant: 'success' as const,
  },
  {
    name: 'FlowForge Education Platform',
    description:
      'Education technology platform. Estimated value ~USD 10,000 (~RM45,000). Development ongoing.',
    status: 'In progress',
    variant: 'success' as const,
  },
  {
    name: 'NovaVoice AI',
    description:
      'AI-powered voice assistant product with completed business plan. Seeking seed investment.',
    status: 'Fundraising',
    variant: 'secondary' as const,
  },
  {
    name: 'Employment Search',
    description:
      'Actively pursuing full-time employment opportunities in IT/software engineering to provide stable base income.',
    status: 'Active',
    variant: 'default' as const,
  },
];

export function IncomePipeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Income Pipeline</CardTitle>
        <p className="text-sm text-muted-foreground">
          These are the income sources that will fund your repayment.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {opportunities.map((opp) => (
            <div
              key={opp.name}
              className="rounded-lg border border-border p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-medium text-foreground">
                  {opp.name}
                </h4>
                <Badge variant={opp.variant} className="shrink-0">
                  {opp.status}
                </Badge>
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {opp.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
