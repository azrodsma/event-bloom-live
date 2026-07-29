import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { getGuestByToken, updateRsvpByToken } from "@/lib/rsvp.functions";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";

export const Route = createFileRoute("/i/$token")({
  head: () => ({
    meta: [
      { title: "Invitation personnelle — Memento Live" },
      { name: "description", content: "Répondez à votre invitation personnelle." },
      { name: "robots", content: "noindex" },
    ],
  }),
  loader: async ({ params }) => {
    const g = await getGuestByToken({ data: { token: params.token } });
    return { guest: g };
  },
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-md px-6 py-16 text-center">
      <p className="font-serif text-2xl">Invitation introuvable</p>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
  component: PersonalRsvp,
});

function PersonalRsvp() {
  const { guest } = Route.useLoaderData();
  const { token } = useParams({ from: "/i/$token" });
  const ev = guest.events;
  const update = useServerFn(updateRsvpByToken);

  const [status, setStatus] = useState<"confirmed" | "declined" | "maybe">(
    guest.rsvp === "declined" || guest.rsvp === "maybe" ? guest.rsvp : "confirmed",
  );
  const [fullName, setFullName] = useState(guest.full_name);
  const [email, setEmail] = useState(guest.email ?? "");
  const [phone, setPhone] = useState(guest.phone ?? "");
  const [plusOnes, setPlusOnes] = useState(guest.plus_ones ?? 0);
  const [dietary, setDietary] = useState(guest.dietary ?? "");
  const [notes, setNotes] = useState(guest.notes ?? "");
  const [done, setDone] = useState(false);

  const mut = useMutation({
    mutationFn: () => update({
      data: {
        token,
        full_name: fullName,
        email,
        phone: phone || null,
        rsvp: status,
        plus_ones: plusOnes,
        dietary: dietary || null,
        notes: notes || null,
      },
    }),
    onSuccess: () => { setDone(true); toast.success("Merci ! Votre réponse est mise à jour."); },
    onError: (e: Error) => toast.error(e.message),
  });

  const dateStr = ev.event_date
    ? new Date(ev.event_date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "";

  if (done) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-md px-5 py-12 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success text-3xl text-white">✓</div>
          <h1 className="mt-4 font-serif text-3xl">Réponse enregistrée</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Merci {fullName.split(" ")[0]} ! Vous pouvez rouvrir ce lien à tout moment pour modifier votre réponse.
          </p>
          <button onClick={() => setDone(false)} className="mt-6 inline-block rounded-full bg-gradient-primary px-5 py-3 text-sm font-semibold text-white shadow-glow">
            Modifier ma réponse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="module-page">
      <header className="relative h-56">
        {ev.cover_url && <img src={ev.cover_url} alt="" className="h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/70" />
        <Link to="/" className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-background/80 backdrop-blur">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="absolute inset-x-0 bottom-4 px-5 text-white">
          <p className="text-[10px] font-semibold uppercase tracking-widest opacity-90">Invitation personnelle</p>
          <h1 className="mt-1 font-serif text-3xl leading-tight">{ev.title}</h1>
          <p className="text-xs opacity-90">{dateStr}{ev.location ? ` · ${ev.location}` : ""}</p>
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-5 px-5 py-6">
        <div className="rounded-2xl border border-gold/40 bg-gold-light/40 p-4 text-sm">
          Bonjour <strong>{guest.full_name}</strong>, cette invitation vous est personnellement adressée. Vous pouvez modifier votre réponse à tout moment en revenant sur ce lien.
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Votre réponse</p>
          <div className="grid grid-cols-3 gap-2">
            {([
              { k: "confirmed", label: "Je viens", emoji: "🎉" },
              { k: "maybe", label: "Peut-être", emoji: "🤔" },
              { k: "declined", label: "Absent", emoji: "😔" },
            ] as const).map((o) => (
              <button key={o.k} onClick={() => setStatus(o.k)}
                className={`rounded-2xl border-2 p-3 text-center text-xs font-semibold transition ${status === o.k ? "border-primary bg-primary-light" : "border-border bg-background"}`}>
                <div className="text-xl">{o.emoji}</div>
                <div className="mt-1">{o.label}</div>
              </button>
            ))}
          </div>
        </div>

        <Field label="Nom complet *" value={fullName} onChange={setFullName} />
        <Field label="Email *" type="email" value={email} onChange={setEmail} />
        <Field label="Téléphone" type="tel" value={phone} onChange={setPhone} />

        {status === "confirmed" && (
          <>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Accompagnants</label>
              <div className="mt-2 flex items-center gap-3">
                <button onClick={() => setPlusOnes(Math.max(0, plusOnes - 1))} className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-lg">−</button>
                <span className="min-w-[3ch] text-center font-serif text-xl">{plusOnes}</span>
                <button onClick={() => setPlusOnes(Math.min(10, plusOnes + 1))} className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-lg">+</button>
              </div>
            </div>
            <Field label="Régime alimentaire" value={dietary} onChange={setDietary} placeholder="Végé, allergies..." />
          </>
        )}

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Un mot pour les hôtes</label>
          <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
        </div>

        <button
          disabled={mut.isPending || !fullName || !email}
          onClick={() => mut.mutate()}
          className="w-full rounded-full bg-gradient-primary py-4 text-sm font-bold text-white shadow-glow disabled:opacity-50"
        >
          {mut.isPending ? "Envoi..." : "Enregistrer ma réponse"}
        </button>
      </main>
    </div>
  );
}

function Field({ label, value, onChange, ...rest }: { label: string; value: string; onChange: (v: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      <input {...rest} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
    </div>
  );
}
