export default function ProposalNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted">
      <h2 className="text-xl font-semibold text-foreground">Invalid link</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        This proposal link is invalid or has expired.
      </p>
    </div>
  );
}
