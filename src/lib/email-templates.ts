/**
 * Branded HTML email templates for Memento Live.
 * Design: rose #E85D8E, cream #FFF8F4, dark #1A1A1A, gold #D9A441
 * Fonts: Playfair Display (headings), Inter (body) — loaded via Google Fonts CDN with system fallback.
 */

const BRAND = {
  primary: "#E85D8E",
  gold: "#D9A441",
  cream: "#FFF8F4",
  ink: "#1A1A1A",
  muted: "#6B6B6B",
  border: "#F0E6DE",
};

function shell(opts: { preview: string; title: string; intro: string; cta?: { label: string; url: string }; body?: string; footer?: string }) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${escape(opts.title)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.cream};font-family:'Inter',Arial,Helvetica,sans-serif;color:${BRAND.ink};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escape(opts.preview)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.cream};padding:32px 16px;">
  <tr><td align="center">
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 32px rgba(232,93,142,0.08);">
      <tr><td style="padding:40px 40px 24px 40px;text-align:center;background:linear-gradient(135deg,#FFF8F4 0%,#FDEEF3 100%);">
        <div style="font-family:'Playfair Display',Georgia,serif;font-size:28px;font-weight:600;color:${BRAND.ink};letter-spacing:-0.5px;">
          Memento <span style="color:${BRAND.primary};font-style:italic;">Live</span>
        </div>
        <div style="width:40px;height:2px;background:${BRAND.gold};margin:12px auto 0;"></div>
      </td></tr>
      <tr><td style="padding:40px;">
        <h1 style="margin:0 0 16px 0;font-family:'Playfair Display',Georgia,serif;font-size:26px;font-weight:600;line-height:1.25;color:${BRAND.ink};">
          ${escape(opts.title)}
        </h1>
        <p style="margin:0 0 24px 0;font-size:15px;line-height:1.6;color:${BRAND.ink};">${opts.intro}</p>
        ${opts.body ?? ""}
        ${opts.cta
          ? `<div style="margin:32px 0;text-align:center;">
              <a href="${escape(opts.cta.url)}" style="display:inline-block;background:${BRAND.primary};color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:999px;font-weight:600;font-size:15px;box-shadow:0 4px 12px rgba(232,93,142,0.35);">${escape(opts.cta.label)}</a>
            </div>
            <p style="margin:0 0 8px 0;font-size:12px;color:${BRAND.muted};">Ou copiez ce lien dans votre navigateur :</p>
            <p style="margin:0;font-size:12px;color:${BRAND.primary};word-break:break-all;"><a href="${escape(opts.cta.url)}" style="color:${BRAND.primary};text-decoration:underline;">${escape(opts.cta.url)}</a></p>`
          : ""}
        ${opts.footer ? `<div style="margin-top:32px;padding-top:24px;border-top:1px solid ${BRAND.border};font-size:13px;color:${BRAND.muted};line-height:1.6;">${opts.footer}</div>` : ""}
      </td></tr>
      <tr><td style="padding:24px 40px 32px;text-align:center;background:${BRAND.cream};">
        <p style="margin:0 0 8px 0;font-family:'Playfair Display',Georgia,serif;font-style:italic;font-size:14px;color:${BRAND.muted};">
          Vos plus beaux moments, précieusement préservés.
        </p>
        <p style="margin:0;font-size:11px;color:${BRAND.muted};">
          © ${new Date().getFullYear()} Memento Live · <a href="mailto:mariage@bold-lab-agency.com" style="color:${BRAND.muted};">mariage@bold-lab-agency.com</a>
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function escape(s: string) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

export function welcomeEmail(input: { displayName?: string; appUrl: string }) {
  const name = input.displayName?.trim() || "vous";
  return {
    subject: "Bienvenue sur Memento Live ✨",
    html: shell({
      preview: "Votre compte Memento Live est prêt.",
      title: `Bienvenue, ${name} !`,
      intro: `Votre compte Memento Live est prêt. Vous pouvez dès maintenant créer vos événements, inviter vos proches et rassembler vos plus beaux souvenirs en un seul endroit.`,
      cta: { label: "Accéder à mon espace", url: input.appUrl },
      footer: `<strong>Prochaine étape</strong> — Créez votre premier événement ou rejoignez-en un avec un code d'invitation. Chaque moment devient un souvenir partagé.`,
    }),
  };
}

export function passwordResetEmail(input: { resetUrl: string }) {
  return {
    subject: "Réinitialisez votre mot de passe Memento Live",
    html: shell({
      preview: "Un lien sécurisé pour choisir un nouveau mot de passe.",
      title: "Mot de passe oublié ?",
      intro: `Nous avons reçu une demande de réinitialisation de votre mot de passe. Cliquez ci-dessous pour en choisir un nouveau. Ce lien est valable <strong>1 heure</strong>.`,
      cta: { label: "Choisir un nouveau mot de passe", url: input.resetUrl },
      footer: `Vous n'êtes pas à l'origine de cette demande ? Vous pouvez ignorer cet email en toute sécurité — votre mot de passe restera inchangé.`,
    }),
  };
}

export function confirmSignupEmail(input: { confirmUrl: string; displayName?: string }) {
  const name = input.displayName?.trim() || "vous";
  return {
    subject: "Confirmez votre inscription à Memento Live",
    html: shell({
      preview: "Une dernière étape pour activer votre compte.",
      title: `Ravi de vous accueillir, ${name}`,
      intro: `Confirmez votre adresse email pour activer votre compte Memento Live et accéder à tous vos événements.`,
      cta: { label: "Confirmer mon adresse", url: input.confirmUrl },
      footer: `Si vous n'avez pas créé de compte Memento Live, ignorez simplement cet email.`,
    }),
  };
}

export function magicLinkEmail(input: { magicUrl: string }) {
  return {
    subject: "Votre lien de connexion Memento Live",
    html: shell({
      preview: "Connectez-vous en un clic.",
      title: "Votre lien magique",
      intro: `Cliquez sur le bouton ci-dessous pour vous connecter à Memento Live. Ce lien est valable <strong>1 heure</strong> et à usage unique.`,
      cta: { label: "Me connecter", url: input.magicUrl },
      footer: `Vous n'avez pas demandé ce lien ? Ignorez cet email — votre compte reste en sécurité.`,
    }),
  };
}
