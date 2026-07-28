import QRCode from "qrcode";
import { useEffect, useState } from "react";

export function QrCodeSvg({ value, size = 180, dark = "#0F0F10", light = "#FFF8F4" }: { value: string; size?: number; dark?: string; light?: string }) {
  const [svg, setSvg] = useState<string>("");
  useEffect(() => {
    let cancelled = false;
    QRCode.toString(value, { type: "svg", margin: 1, width: size, color: { dark, light } })
      .then((s) => { if (!cancelled) setSvg(s); })
      .catch(() => { if (!cancelled) setSvg(""); });
    return () => { cancelled = true; };
  }, [value, size, dark, light]);
  return (
    <div
      className="overflow-hidden rounded-2xl border-4 border-foreground bg-background p-2"
      style={{ width: size + 16, height: size + 16 }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
