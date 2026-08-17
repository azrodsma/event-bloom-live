-- Seed demo content so every event's modules show real numbers

-- Tables (seating) for all events
INSERT INTO public.tables_seating (event_id, table_number, label, capacity)
SELECT e.id, t.n, t.lbl, t.cap
FROM public.events e
CROSS JOIN (VALUES
  (1, 'Table des mariés', 6),
  (2, 'Famille', 8),
  (3, 'Amis d''enfance', 8),
  (4, 'Collègues', 8),
  (5, 'Enfants', 6),
  (6, 'Voisins & cousins', 8)
) AS t(n, lbl, cap)
WHERE NOT EXISTS (SELECT 1 FROM public.tables_seating s WHERE s.event_id = e.id);

-- Gift registry for all events
INSERT INTO public.gift_registry_items (event_id, title, description, price, is_reserved)
SELECT e.id, g.title, g.descr, g.price, g.res
FROM public.events e
CROSS JOIN (VALUES
  ('Participation voyage de noces', 'Une nuit d''hôtel offerte', 150, false),
  ('Service de table en porcelaine', '12 couverts, blanc & or', 220, false),
  ('Robot pâtissier', 'Pour les futurs gâteaux maison', 380, true),
  ('Album photo relié', 'Souvenirs imprimés du grand jour', 90, false),
  ('Coffret dégustation', 'Vins & fromages de la région', 75, false)
) AS g(title, descr, price, res)
WHERE NOT EXISTS (SELECT 1 FROM public.gift_registry_items i WHERE i.event_id = e.id);

-- Guests for all events
INSERT INTO public.guests (event_id, full_name, rsvp, plus_ones, table_number)
SELECT e.id, gu.name, gu.st::rsvp_status, gu.po, gu.tb
FROM public.events e
CROSS JOIN (VALUES
  ('Emma Laurent', 'confirmed', 1, 2),
  ('Julien Petit', 'confirmed', 0, 2),
  ('Sofia Mercier', 'confirmed', 1, 3),
  ('Karim Benali', 'pending', 0, 4),
  ('Alice Dubois', 'confirmed', 2, 3),
  ('Thomas Roux', 'declined', 0, NULL),
  ('Chloé Marchand', 'confirmed', 0, 5),
  ('Hugo Fabre', 'pending', 1, 6)
) AS gu(name, st, po, tb)
WHERE NOT EXISTS (SELECT 1 FROM public.guests x WHERE x.event_id = e.id);

-- Checklist for events without one
INSERT INTO public.checklist_items (event_id, title, category, is_done, position)
SELECT e.id, c.title, c.cat, c.done, c.pos
FROM public.events e
CROSS JOIN (VALUES
  ('Valider le lieu de réception', 'Lieu', true, 1),
  ('Envoyer les invitations', 'Invités', true, 2),
  ('Choisir le traiteur', 'Repas', false, 3),
  ('Finaliser la playlist', 'Musique', false, 4),
  ('Réserver le photographe', 'Prestataires', false, 5)
) AS c(title, cat, done, pos)
WHERE NOT EXISTS (SELECT 1 FROM public.checklist_items x WHERE x.event_id = e.id);

-- Playlist for events without one
INSERT INTO public.playlist_songs (event_id, title, artist, suggested_by_name, votes, moment)
SELECT e.id, p.title, p.artist, p.by, p.votes, p.moment
FROM public.events e
CROSS JOIN (VALUES
  ('September', 'Earth, Wind & Fire', 'Emma L.', 12, 'Soirée'),
  ('At Last', 'Etta James', 'Julien P.', 9, 'Première danse'),
  ('Levitating', 'Dua Lipa', 'Sofia M.', 7, 'Soirée'),
  ('La Vie en rose', 'Édith Piaf', 'Alice D.', 5, 'Cocktail')
) AS p(title, artist, by, votes, moment)
WHERE NOT EXISTS (SELECT 1 FROM public.playlist_songs x WHERE x.event_id = e.id);

-- Budget for events without one
INSERT INTO public.budget_items (event_id, label, category, estimated, actual, paid)
SELECT e.id, b.label, b.cat, b.est, b.act, b.paid
FROM public.events e
CROSS JOIN (VALUES
  ('Location du lieu', 'Lieu', 3500, 3500, true),
  ('Traiteur', 'Repas', 4200, 3950, false),
  ('Photographe', 'Prestataires', 1800, 1800, true),
  ('Fleurs & décoration', 'Décoration', 900, 750, false),
  ('DJ', 'Musique', 800, 800, true)
) AS b(label, cat, est, act, paid)
WHERE NOT EXISTS (SELECT 1 FROM public.budget_items x WHERE x.event_id = e.id);

-- Timeline for events without one
INSERT INTO public.timeline_items (event_id, time_label, title, description, location, position)
SELECT e.id, t.tl, t.title, t.descr, t.loc, t.pos
FROM public.events e
CROSS JOIN (VALUES
  ('15:00', 'Accueil des invités', 'Cocktail de bienvenue', 'Jardin', 1),
  ('16:00', 'Cérémonie', 'Moment officiel', 'Chapelle', 2),
  ('18:00', 'Photos de groupe', 'Tous ensemble', 'Parc', 3),
  ('20:00', 'Dîner', 'Menu du traiteur', 'Grande salle', 4),
  ('23:00', 'Ouverture du bal', 'Première danse', 'Salle de bal', 5)
) AS t(tl, title, descr, loc, pos)
WHERE NOT EXISTS (SELECT 1 FROM public.timeline_items x WHERE x.event_id = e.id);
