export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <title>MaFeliza — cette page n'a pas pu se charger</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      :root { color-scheme: light; }
      body { font: 15px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif; background: #FFF8F4; color: #1c1517; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { position: relative; max-width: 30rem; width: 100%; text-align: center; padding: 3rem 2rem; background: rgba(255,255,255,0.75); border: 1px solid rgba(232,93,142,0.15); border-radius: 1.75rem; box-shadow: 0 24px 60px -30px rgba(232,93,142,0.45); }
      .code { font-family: Georgia, "Times New Roman", serif; font-size: 4rem; line-height: 1; color: #E85D8E; margin: 0; }
      h1 { font-size: 1.15rem; margin: 1.25rem 0 0.5rem; }
      p { color: #6b6065; margin: 0 0 1.75rem; font-size: 0.9rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.65rem 1.4rem; border-radius: 999px; font: inherit; font-size: 0.875rem; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #E85D8E; color: #fff; }
      .primary:hover { background: #B23262; }
      .secondary { background: #fff; color: #1c1517; border-color: #e7dcd6; }
    </style>
  </head>
  <body>
    <div class="card">
      <p class="code">500</p>
      <h1>Cette page n'a pas pu se charger</h1>
      <p>Une erreur est survenue de notre côté. Réessayez dans un instant ou revenez à l'accueil.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Réessayer</button>
        <a class="secondary" href="/">Accueil</a>
      </div>
    </div>
  </body>
</html>`;
}
