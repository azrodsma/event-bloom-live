export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-2xl bg-gradient-primary shadow-glow">
        <span className="absolute -left-2 -top-2 h-6 w-6 rounded-full bg-gold/60 blur-md" />
        <svg viewBox="0 0 24 24" className="relative h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" />
        </svg>
      </span>
      <span className="font-serif text-xl leading-none tracking-tight text-foreground">
        MaFeliza<span className="italic text-primary"> Live</span>
      </span>
    </span>
  );
}
