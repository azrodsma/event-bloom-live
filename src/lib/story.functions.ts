import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const Input = z.object({
  eventType: z.string().min(1).max(60),
  eventName: z.string().min(1).max(120),
  tone: z.enum(["romantique", "drôle", "sobre", "poétique", "cinématique"]),
  moments: z.string().min(10).max(4000),
  language: z.enum(["fr", "en"]).default("fr"),
});

export const composeStory = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3.6-flash");

    const system = `Tu es le narrateur officiel de MaFeliza, une plateforme d'événements haut de gamme (mariages, baptêmes, anniversaires). Ton style : premium, doux, sensoriel, jamais kitsch. Écris en ${data.language === "fr" ? "français" : "anglais"}.

Tu vas produire, à partir de la liste de moments fournie par l'utilisateur, un pack complet pour un highlight reel vidéo :

1. TITRE — un titre court et évocateur (max 6 mots).
2. STORYBOARD — 6 scènes numérotées. Pour chacune : durée en secondes (total ~90s), plan caméra suggéré, ambiance musicale, phrase de voix off.
3. LEGENDES — 8 légendes prêtes à poster (Instagram/MaFeliza), variées, entre 40 et 160 caractères, avec 2-3 hashtags pertinents.
4. INVITATION_STORY — un message de 3 lignes pour partager le film aux invités.

Rends la réponse en Markdown structuré avec les titres ## exacts : ## Titre / ## Storyboard / ## Légendes / ## Invitation.

Respecte scrupuleusement le ton demandé.`;

    const prompt = `Événement : ${data.eventType} — « ${data.eventName} »
Ton souhaité : ${data.tone}

Moments capturés (photos, clips, notes vocales) :
${data.moments}`;

    const { text } = await generateText({
      model,
      system,
      prompt,
    });
    return { markdown: text };
  });
