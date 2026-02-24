import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const opportunities = [
  {
    name: 'NinjaOne — SE Asia Channel Partner Manager',
    description:
      'Interview with hiring manager on 25 February 2026 for their first South East Asia Channel Partner Manager role. Referred by a close mutual friend who worked with both of us. Full-time position with stable salary.',
    status: 'Interview scheduled',
    variant: 'warning' as const,
  },
  {
    name: 'Saidi Canada Project',
    description:
      'Web development project. Estimated value ~USD 9,000 (~RM40,500). In active development.',
    closeDate: 'Expected close: week of 2 March 2026',
    status: 'In progress',
    variant: 'success' as const,
  },
  {
    name: 'FlowForge Education Platform',
    description:
      'Education technology platform. Estimated value ~USD 10,000 (~RM45,000). Development ongoing.',
    closeDate: 'Expected close: mid-March 2026',
    status: 'In progress',
    variant: 'success' as const,
  },
  {
    name: 'NovaVoice AI',
    description:
      'AI-powered voice assistant actively pursuing new business in North America through our Calgary, Alberta-based sales agent Jeff Zimmer. Jeff brings a long list of existing clients from similar industry verticals that NovaVoice targets. In active sell mode for the past week with two new opportunities currently in discussion.',
    link: 'https://novavoice.innovaas.co/bizplan',
    accessToken: '1bb379f3-e340-4ca5-a7b5-72b407027ad9',
    status: 'Active sales',
    variant: 'success' as const,
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
              {'closeDate' in opp && opp.closeDate && (
                <p className="mt-1.5 inline-block rounded bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                  {opp.closeDate}
                </p>
              )}
              {'link' in opp && opp.link && (
                <div className="mt-2 space-y-1.5">
                  <a
                    href={opp.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-sm font-medium text-primary underline underline-offset-2"
                  >
                    View Business Plan
                  </a>
                  {'accessToken' in opp && opp.accessToken && (
                    <p className="text-xs text-muted-foreground">
                      Access token:{' '}
                      <code className="select-all rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
                        {opp.accessToken}
                      </code>
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
