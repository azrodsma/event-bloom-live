import markAsset from "@/assets/mafeliza-mark.png.asset.json";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <img
        src={markAsset.url}
        alt="Logo MaFeliza"
        className="h-9 w-9 shrink-0 object-contain"
        loading="eager"
      />
      <span className="font-serif text-xl leading-none tracking-tight text-foreground">
        MaFeliza
      </span>
    </span>
  );
}
