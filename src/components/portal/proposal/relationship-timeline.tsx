import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const events = [
  {
    date: 'Jul 2023',
    title: 'First contact',
    description: 'Connected through mutual contact about car rental.',
  },
  {
    date: 'Sep 2023',
    title: 'Rental begins',
    description: 'Started renting Perodua Bezza at RM1,400/month. Payments made on time.',
  },
  {
    date: 'Jun 2024',
    title: 'Last payment made',
    description: 'Final rental payment. Financial difficulties begin.',
  },
  {
    date: 'Jul 2024',
    title: 'Arrears begin',
    description: 'First missed payment. Hairul continues to be patient.',
  },
  {
    date: 'Feb 2026',
    title: 'This proposal',
    description: 'Formal repayment plan presented with 15% patience premium.',
  },
];

export function RelationshipTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Our Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative ml-3">
          {/* Vertical line */}
          <div className="absolute left-0 top-2 h-[calc(100%-16px)] w-px bg-border" />

          <div className="space-y-6">
            {events.map((event, i) => (
              <div key={i} className="relative pl-6">
                {/* Dot */}
                <div
                  className={`absolute -left-[4px] top-1.5 h-[9px] w-[9px] rounded-full border-2 ${
                    i === events.length - 1
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground bg-card'
                  }`}
                />
                <p className="text-xs font-medium text-muted-foreground">
                  {event.date}
                </p>
                <p className="mt-0.5 text-sm font-medium text-foreground">
                  {event.title}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {event.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
