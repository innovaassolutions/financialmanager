import { Card, CardContent } from '@/components/ui/card';

export function CommitmentStatement() {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground">
          My Commitment to You
        </h3>

        <div className="mt-4 border-l-4 border-primary pl-4">
          <div className="space-y-3 text-[15px] leading-relaxed text-foreground">
            <p>
              <strong>First payment by 26 March 2026.</strong> If I fail to make
              the first payment by this date, you have every right to reclaim the
              car immediately — no questions, no excuses. I will cooperate fully
              with the handover.
            </p>

            <p>
              <strong>Road tax renewal.</strong> I commit to ensuring the road
              tax is renewed on time when it next falls due, at my expense. You
              should never have to absorb this cost again.
            </p>

            <p>
              <strong>Transparent tracking.</strong> This portal will be updated
              with every payment made. You can check progress at any time —
              no need to chase me for updates.
            </p>

            <p>
              <strong>Open communication.</strong> If anything changes with my
              income timeline, I will tell you proactively — not after the fact.
              You have been too patient for me to disrespect that with silence.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3 text-[15px] leading-relaxed text-foreground">
          <p>
            Hairul, I understand if trust is thin right now. I would feel the
            same way. But I am asking for one more chance — not with words, but
            with this plan and the actions that will follow.
          </p>

          <p>InsyaAllah, I will make this right.</p>

          <div className="mt-6 text-sm text-muted-foreground">
            <p>With respect and gratitude,</p>
            <p className="mt-1 font-medium text-foreground">Todd Abraham</p>
            <p>24 February 2026</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
