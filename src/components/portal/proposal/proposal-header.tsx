export function ProposalHeader({ creditorName }: { creditorName: string }) {
  return (
    <header className="border-b border-border bg-card px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm text-muted-foreground">Special Creditor Proposal</p>
        <h1 className="mt-1 text-2xl font-semibold text-foreground">
          A Message for {creditorName}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          24 February 2026
        </p>
      </div>
    </header>
  );
}
