import { Card, CardContent } from '@/components/ui/card';

export function PersonalLetter() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4 text-[15px] leading-relaxed text-foreground">
          <p>Assalamualaikum Hairul,</p>

          <p>
            I want to begin by saying thank you — genuinely and deeply — for your
            extraordinary patience over these past 20 months. You trusted me with
            your car when I needed it most, and I have not lived up to my end of
            the arrangement. That is entirely on me.
          </p>

          <p>
            I know you have a paying customer waiting for the Bezza. I know every
            month that passes without payment is money out of your pocket — the
            rental income you could have been earning. You have absorbed all of
            this without once raising your voice or threatening me. That kind of
            patience and character is rare, and I do not take it for granted.
          </p>

          <p>
            I am not writing this to make excuses. I am writing this to show you
            a concrete plan — with real numbers, real timelines, and real
            accountability — for how I intend to make this right.
          </p>

          <p>
            What follows is a full accounting of what I owe you, the income
            sources that will fund repayment, and a 6-month schedule to clear the
            entire debt — plus a 15% premium as a gesture of gratitude for your
            patience.
          </p>

          <p className="font-medium">
            You deserve better than promises. You deserve a plan.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
