import Image from 'next/image';

export function PortalHeader({ creditorName }: { creditorName: string }) {
  return (
    <header className="border-b border-border bg-card px-4 py-6">
      <div className="mx-auto flex max-w-3xl items-center gap-3">
        <Image
          src="/gailfinancemanager.png"
          alt="Gail"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div>
          <p className="text-sm text-muted-foreground">Creditor Portal</p>
          <h1 className="text-xl font-semibold text-foreground">{creditorName}</h1>
        </div>
      </div>
    </header>
  );
}
