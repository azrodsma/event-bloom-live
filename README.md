# Memento Live

Memento Live.

Pourquoi ce nom :
Memento évoque le souvenir, les moments importants, les événements de vie. Live explique immédiatement la partie diffusion en direct. C’est plus large que le mariage, donc utilisable pour baptêmes, anniversaires, baby showers, remises de diplôme, soirées privées, etc.

Autres noms possibles :

NomPositionnementMemento LiveSouvenir + live, élégant et universelEventoryEvent + story, très réseau socialMomentiaMoments précieux, son premiumLiveMomentSimple, direct, compréhensibleMemoraSouvenir, doux, haut de gammeVowlyPlus orienté mariageEverMomentSouvenir durable, événementielLuviaCourt, moderne, émotionnelStoryVowMariage + storiesCérémoniaÉlégant, mais plus cérémoniel

Pour moi, le meilleur choix est :

Memento Live

Baseline possible :

“Vos événements, en direct, en souvenirs.”

ou

“Le réseau social privé de vos plus beaux moments.”

Cahier des charges complet Lovable — Memento Live

1. Présentation générale du projet

Créer une plateforme complète nommée Memento Live, disponible en site web responsive puis adaptable en application mobile iOS et Android, permettant aux utilisateurs de créer, partager, suivre et revivre des événements privés ou publics.

La plateforme doit fonctionner comme un réseau social événementiel, inspiré de l’expérience utilisateur d’Instagram, TikTok et Twitch, mais spécialisée dans les moments familiaux et privés.

Les utilisateurs doivent pouvoir créer des événements tels que :

mariages ;

baptêmes ;

anniversaires ;

baby showers ;

communions ;

fiançailles ;

remises de diplôme ;

départs à la retraite ;

naissances ;

soirées privées ;

événements familiaux ;

autres événements personnalisés.

Chaque événement doit disposer d’une page dédiée avec :

fil d’actualité ;

stories ;

live intégré via YouTube Live ou Twitch ;

cagnotte externe type Leetchi ;

livre d’or multimédia ;

album photo collaboratif ;

interactions payantes ;

espace caméraman ;

codes d’accès invités ;

code d’accès caméraman ;

compte à rebours ;

faire-part digital ;

profil organisateur ;

statistiques de base.

L’objectif est de proposer une expérience fluide, émotionnelle, moderne, sociale et sécurisée.

2. Objectif produit

Créer une plateforme permettant aux personnes éloignées de participer à un événement même à distance.

La plateforme ne doit pas simplement afficher un live. Elle doit créer une expérience complète autour de l’événement :

avant l’événement : invitation, compte à rebours, stories, cagnotte, présentation ;

pendant l’événement : live, chat, réactions, cadeaux, messages, photos, interactions ;

après l’événement : livre d’or, album, replay externe, souvenirs, export.

Le produit doit être pensé comme un Instagram/TikTok privé pour événements familiaux, avec une forte dimension souvenir et émotion.

3. Contraintes importantes

3.1 Cagnotte externe obligatoire

La plateforme ne doit pas collecter directement l’argent destiné aux mariés ou organisateurs.

La cagnotte doit être externe.

L’organisateur renseigne un lien vers une plateforme tierce :

Leetchi ;

Lydia ;

OnParticipe ;

Tribee ;

CotizUp ;

PayPal ;

autre lien externe.

La plateforme affiche :

le lien de participation ;

le montant actuel si renseigné manuellement ;

l’objectif ;

la barre de progression ;

le bouton “Participer à la cagnotte” ;

un message de transparence.

Important : Memento Live ne conserve pas l’argent de la cagnotte, ne reverse pas les fonds, ne gère pas les remboursements et n’agit pas comme intermédiaire financier.

3.2 Live externe obligatoire

La plateforme ne doit pas héberger directement la vidéo live dans la première version.

Le live doit être intégré via :

YouTube Live ;

Twitch ;

Vimeo Live en option ;

Facebook Live en option ;

Amazon IVS ou Mux en version premium future.

L’objectif est d’éviter les problèmes de bande passante, de transcodage, de surcharge serveur et de coût vidéo.

L’application doit intégrer le player externe dans une interface personnalisée Memento Live.

Autour du player, il faut garder :

chat interne ;

réactions ;

interactions payantes ;

cagnotte ;

photos invités ;

boutons de partage ;

livre d’or ;

compteur spectateurs interne ;

onglets caméras si plusieurs liens live.

4. Identité visuelle

4.1 Style général

Le design doit être :

moderne ;

premium ;

doux ;

émotionnel ;

inspiré d’Instagram pour le feed et les stories ;

inspiré de TikTok pour le live plein écran ;

inspiré des applications de mariage pour l’élégance ;

très mobile-first ;

fluide ;

clair ;

rassurant.

Le design doit éviter l’effet trop corporate. Il doit évoquer :

l’amour ;

les souvenirs ;

la fête ;

la famille ;

les moments précieux ;

la simplicité.

4.2 Palette de couleurs

Utiliser une palette élégante rose, crème, noir doux et doré.

:root {
  --primary: #E85D8E;
  --primary-dark: #C93F70;
  --primary-light: #FFE4EE;

  --secondary: #F7B2C4;
  --secondary-light: #FFF1F5;

  --gold: #D9A441;
  --gold-light: #FFF4D8;

  --background: #FFF8F4;
  --background-alt: #FFFFFF;
  --surface: #FFFFFF;

  --text: #231820;
  --text-muted: #7A6670;

  --border: #F0D9E2;
  --success: #32B77A;
  --danger: #EF476F;
  --warning: #F5A524;

  --live: #FF2D55;
  --dark: #171117;
}


4.3 Couleurs par usage

UsageCouleurBouton principal#E85D8EBouton principal hover#C93F70Fond général#FFF8F4Cartes#FFFFFFTexte principal#231820Texte secondaire#7A6670Badge live#FF2D55Cagnotte / premium#D9A441Succès paiement#32B77AErreur#EF476F

4.4 Typographies

Utiliser une typographie moderne, lisible et premium.

Recommandation :

--font-title: "Playfair Display", Georgia, serif;
--font-body: "Inter", system-ui, sans-serif;


Utilisation :

titres émotionnels : Playfair Display ;

interface, boutons, formulaires : Inter ;

montants, compteurs, badges : Inter bold.

4.5 Arrondis et ombres

--radius-sm: 12px;
--radius-md: 18px;
--radius-lg: 28px;
--radius-xl: 36px;

--shadow-card: 0 12px 40px rgba(84, 40, 63, 0.08);
--shadow-modal: 0 24px 70px rgba(84, 40, 63, 0.18);


4.6 Style des composants

Les composants doivent avoir :

grandes cartes arrondies ;

boutons pill ;

badges colorés ;

stories rondes avec bordure dégradée ;

icônes fines ;

animations douces ;

transitions fluides ;

skeleton loaders ;

micro-interactions au clic ;

design mobile-first.

5. Structure globale de l’application

5.1 Navigation principale mobile

Créer une navigation basse fixe avec 5 entrées :

OngletIcôneFonctionAccueilMaisonFil principalExplorerLoupeRecherche et découverteCréerPlus centralCréer événement ou contenuFavorisCœurÉvénements sauvegardésProfilUtilisateurCompte utilisateur

Le bouton central “Créer” doit être plus visible, dans un cercle rose ou dégradé.

5.2 Navigation live

Pendant un live, afficher une navigation spécifique :

OngletFonctionChatMessages en directRéactionsRéactions gratuites et payantesCadeauxInteractions premiumCagnotteLien vers la cagnotte externePhotosPhotos des invitésCamérasChoix caméra / lien live

5.3 Rôles utilisateurs

Prévoir les rôles suivants :

RôleDroitsVisiteurVoir page publique, entrer un codeInvitéAccéder à un événement privé, commenter, liker, envoyer médiasOrganisateurCréer et gérer ses événementsCaméramanAccéder à ses missions, renseigner live, ajouter médiasModérateurValider ou supprimer contenusAdminGérer toute la plateforme

6. Pages à créer

6.1 Page d’accueil marketing

Créer une landing page publique présentant le concept.

Sections :

Hero principal ;

Démo d’interface mobile ;

Explication “Avant / Pendant / Après” ;

Fonctionnalités principales ;

Types d’événements ;

Live via YouTube/Twitch ;

Cagnotte externe ;

Livre d’or multimédia ;

Espace caméraman ;

Tarifs ;

FAQ ;

CTA créer un événement.

Texte hero :

“Le réseau social privé de vos plus beaux événements.”

Sous-texte :

“Créez un événement, partagez votre live, recevez des messages, centralisez vos souvenirs et laissez vos proches participer, même à distance.”

Boutons :

Créer un événement ;

J’ai reçu une invitation.

6.2 Page connexion / inscription

Fonctionnalités :

inscription email ;

connexion email ;

connexion Google ;

connexion Apple ;

connexion Facebook en option ;

mot de passe oublié ;

accès invité par code ;

bouton “J’ai reçu une invitation”.

Champs :

prénom ;

nom ;

email ;

mot de passe ;

confirmation mot de passe ;

acceptation CGU ;

acceptation politique de confidentialité.

6.3 Page entrée par code

Page simple permettant d’entrer :

code invité ;

code caméraman ;

lien privé ;

QR code scanné.

États :

code valide ;

code invalide ;

événement expiré ;

événement privé ;

demande de connexion.

6.4 Accueil connecté

Créer un écran d’accueil type Instagram.

Sections :

header avec logo Memento Live ;

icône notifications ;

icône messages ;

bouton création rapide ;

stories horizontales ;

onglets Pour vous / En direct / À venir / Favoris ;

fil d’actualité ;

événements en direct ;

événements à venir.

Chaque carte événement doit afficher :

image ;

titre ;

type ;

ville ;

date ;

badge LIVE ou J-X ;

nombre de spectateurs ;

bouton favori ;

bouton rejoindre ;

bouton cagnotte si active.

6.5 Explorer / Recherche

Créer une page de recherche avec :

barre de recherche ;

filtres ;

événements populaires ;

lives en cours ;

événements publics ;

catégories ;

recherche par code ;

recherche par ville ;

recherche par type d’événement.

Filtres :

mariage ;

baptême ;

anniversaire ;

baby shower ;

communion ;

remise de diplôme ;

retraite ;

naissance ;

public ;

live ;

à venir.

6.6 Création d’événement

Créer un tunnel multi-étapes.

Étape 1 : Type d’événement

Cartes à afficher :

Mariage ;

Baptême ;

Anniversaire ;

Fiançailles ;

Baby Shower ;

Communion ;

Naissance ;

Remise de diplôme ;

Retraite ;

Soirée privée ;

Autre.

Chaque carte avec icône, couleur douce et court descriptif.

Étape 2 : Informations générales

Champs :

nom de l’événement ;

nom des organisateurs ;

date ;

heure ;

date de fin en option ;

lieu ;

ville ;

pays ;

description ;

photo de couverture ;

vidéo de couverture en option.

Étape 3 : Confidentialité

Options :

public ;

privé par code ;

privé par lien ;

visible uniquement aux invités.

Toggles :

autoriser commentaires ;

autoriser photos invités ;

autoriser vidéos invités ;

autoriser messages vocaux ;

activer livre d’or ;

activer cagnotte ;

activer live ;

activer interactions payantes ;

publier dans Explorer.

Étape 4 : Cagnotte externe

Champs :

activer cagnotte oui/non ;

plateforme choisie ;

lien de cagnotte ;

objectif ;

montant actuel manuel ;

devise ;

titre de la cagnotte ;

texte d’explication.

Message obligatoire :

“La cagnotte est gérée par une plateforme externe. Memento Live ne collecte pas et ne conserve pas les fonds.”

Étape 5 : Live externe

Champs :

activer live oui/non ;

plateforme : YouTube, Twitch, Vimeo, autre ;

URL du live ;

code embed en option ;

URL de secours ;

miniature ;

heure de début ;

replay disponible oui/non ;

lien replay.

Prévoir plusieurs caméras :

caméra principale ;

caméra salle ;

caméra DJ ;

caméra drone ;

autre lien.

Chaque caméra = nom + URL + statut.

Étape 6 : Faire-part digital

Proposer 3 modèles :

Classique ;

Moderne ;

Élégant.

Chaque faire-part doit afficher :

noms ;

date ;

lieu ;

compte à rebours ;

bouton rejoindre ;

bouton créer un compte ;

bouton participer à la cagnotte ;

aperçu stories.

Options personnalisation :

couleur principale ;

photo ;

texte d’invitation ;

police ;

affichage cagnotte oui/non ;

affichage live oui/non.

Étape 7 : Codes et partage

Générer automatiquement :

code invité ;

code caméraman ;

lien privé ;

QR code invité ;

QR code caméraman ;

QR code cagnotte ;

QR code livre d’or.

Boutons :

copier lien ;

partager WhatsApp ;

partager Instagram ;

partager Facebook ;

envoyer par email ;

télécharger QR code.

Étape 8 : Confirmation

Afficher :

“Événement créé avec succès” ;

résumé ;

boutons :

voir événement ;

partager ;

ouvrir faire-part ;

accéder au tableau de bord.

7. Page événement

Créer une page événement complète.

7.1 Header événement

Afficher :

photo ou vidéo de couverture ;

badge LIVE si actif ;

type d’événement ;

nom ;

lieu ;

date ;

bouton favori ;

bouton partager ;

menu options.

7.2 Bloc compte à rebours

Afficher :

jours ;

heures ;

minutes ;

secondes.

Si événement terminé :

afficher “Événement terminé” ;

bouton voir les souvenirs.

7.3 Bloc cagnotte

Afficher :

titre cagnotte ;

montant actuel ;

objectif ;

pourcentage ;

barre de progression ;

bouton participer ;

message “cagnotte externe”.

Le bouton doit ouvrir le lien externe dans un nouvel onglet ou une webview.

7.4 Bloc live

Afficher :

statut prévu/en cours/terminé ;

miniature ;

bouton rejoindre live ;

nombre spectateurs internes ;

lien replay si disponible.

7.5 Bloc lieu

Afficher :

nom du lieu ;

adresse ;

ville ;

bouton voir sur carte ;

bouton itinéraire.

7.6 Bloc livre d’or

Afficher :

nombre de messages ;

aperçu des derniers messages ;

bouton écrire un message ;

bouton ouvrir livre d’or.

7.7 Bloc album

Afficher :

nombre de photos ;

aperçu galerie ;

bouton ajouter photo ;

bouton voir album.

7.8 Bloc espace caméraman

Afficher uniquement si utilisateur organisateur ou caméraman :

code caméraman ;

bouton accéder ;

statut live ;

missions.

8. Live

Créer une interface live immersive mobile-first.

8.1 Structure visuelle

Live plein écran avec :

player YouTube/Twitch intégré ;

overlay sombre léger ;

badge LIVE ;

compteur spectateurs ;

nom événement ;

bouton fermer ;

bouton partager ;

menu options.

8.2 Chat live

Fonctionnalités :

messages en temps réel ;

avatars ;

prénom ;

horodatage ;

modération ;

suppression message ;

signalement ;

champ écrire un message ;

bouton envoyer.

8.3 Réactions

Réactions gratuites :

j’aime ;

cœur ;

applaudir simple.

Réactions payantes préparées :

applaudir premium 1 € ;

cœur animé 2 € ;

message mis en avant 3 € ;

feu d’artifice 5 € ;

champagne virtuel 10 €.

Dans MVP, prévoir simulation ou structure prête à connecter à Stripe/achats intégrés.

8.4 Cagnotte pendant live

Afficher un widget flottant :

montant actuel ;

objectif ;

bouton participer ;

progression ;

indication lien externe.

8.5 Caméras

Afficher liste des caméras :

Caméra 1 ;

Caméra 2 ;

Drone ;

DJ ;

Salle ;

Autre.

Chaque caméra correspond à un lien live externe différent.

8.6 Photos live

Afficher :

dernières photos ajoutées ;

bouton ajouter ;

compteur ;

accès galerie.

9. Livre d’or multimédia

Créer une page livre d’or dédiée.

9.1 Header

Afficher :

nom événement ;

date ;

lieu ;

nombre de messages ;

bouton retour ;

bouton partager.

9.2 Écriture message

Permettre :

message texte ;

ajout photo ;

ajout vidéo courte ;

ajout vocal ;

visibilité public/invités ;

bouton envoyer.

9.3 Feed livre d’or

Chaque message affiche :

avatar ;

prénom ;

rôle ;

date ;

texte ;

média ;

likes ;

réponses ;

favori ;

signaler.

9.4 Filtres

Filtres :

Tous ;

Photos ;

Vidéos ;

Vocaux ;

Favoris ;

Les plus aimés.

9.5 Détail message

Afficher :

message complet ;

média plein écran ;

likes ;

avatars des personnes ayant aimé ;

réponses ;

champ répondre.

9.6 Après événement

Prévoir bouton :

exporter livre d’or ;

générer souvenir ;

télécharger album ;

page souvenir.

10. Album collaboratif

Créer un module album.

Fonctionnalités :

grille photos ;

vidéos courtes ;

ajout média ;

filtres ;

favoris ;

likes ;

commentaires ;

signalement ;

modération ;

téléchargement par organisateur ;

tri par date ;

tri par popularité.

Restrictions uploads :

taille maximale ;

formats autorisés ;

compression ;

scan sécurité ;

modération possible.

11. Stories

Créer un système de stories événementielles.

11.1 Stories d’accueil

Afficher stories horizontales :

photo ronde ;

bordure rose/dorée ;

badge LIVE ;

badge J-X ;

favoris.

11.2 Types de stories

stories organisateur ;

stories invités ;

stories avant événement ;

stories pendant événement ;

stories après événement.

11.3 Contenus story

photo ;

vidéo ;

texte ;

stickers ;

bouton cagnotte ;

bouton live ;

bouton livre d’or.

11.4 Confidentialité

Stories visibles selon :

événement public ;

invité connecté ;

code valide ;

organisateur ;

caméraman.

12. Profil utilisateur

Créer une page profil.

Afficher :

avatar ;

nom ;

rôle ;

statistiques ;

événements suivis ;

événements créés ;

messages publiés ;

cadeaux envoyés ;

vidéos ;

favoris ;

paramètres ;

aide/contact ;

déconnexion.

Statistiques :

nombre événements ;

nombre messages ;

nombre médias ;

nombre favoris.

13. Espace organisateur

Créer un dashboard organisateur.

Fonctionnalités :

voir ses événements ;

modifier événement ;

gérer cagnotte externe ;

gérer live ;

gérer livre d’or ;

gérer album ;

gérer invités ;

voir codes ;

télécharger QR codes ;

gérer confidentialité ;

voir statistiques ;

modérer contenus.

Statistiques :

vues événement ;

clics cagnotte ;

messages livre d’or ;

photos ajoutées ;

spectateurs live ;

interactions ;

partages ;

favoris.

14. Espace caméraman

Créer un espace caméraman accessible par code.

Fonctionnalités :

liste des missions ;

détail mission ;

renseigner lien YouTube/Twitch ;

modifier statut live ;

ajouter photos ;

ajouter vidéos ;

voir demandes photo ;

voir messages importants ;

voir horaires ;

voir lieu ;

bouton itinéraire ;

matériel recommandé.

Profil caméraman :

nom ;

studio ;

avatar/logo ;

note ;

avis ;

missions actives ;

missions passées.

15. Notifications

Prévoir système de notifications.

Types :

événement bientôt en live ;

nouveau message livre d’or ;

nouvelle photo ajoutée ;

cagnotte mise à jour ;

nouvel invité ;

live démarré ;

interaction reçue ;

réponse à un message ;

événement terminé ;

souvenir disponible.

Canaux :

notifications web ;

notifications push mobile plus tard ;

email plus tard.

16. Messagerie

Prévoir une messagerie simple.

Fonctionnalités :

boîte de réception ;

conversations ;

messages événement ;

messages organisateur ;

messages caméraman ;

notifications non lues.

MVP : interface préparée, logique simplifiée.

17. Administration globale

Créer un espace admin de base.

Fonctionnalités :

liste utilisateurs ;

liste événements ;

événements publics/privés ;

contenus signalés ;

messages livre d’or ;

médias ;

cagnottes externes renseignées ;

liens live ;

suppression contenu ;

blocage utilisateur ;

consultation logs simples.

18. Sécurité

Le projet doit être sécurisé dès la base.

Prévoir :

authentification sécurisée ;

mots de passe hashés ;

JWT ou sessions sécurisées ;

refresh token ;

validation formulaires ;

protection XSS ;

protection CSRF si nécessaire ;

rate limiting ;

limitation uploads ;

contrôle MIME type ;

scan fichiers ;

liens externes vérifiés ;

rôles et permissions ;

événements privés non accessibles sans code ;

codes uniques ;

logs d’activité ;

protection anti-spam ;

signalement contenus ;

modération.

19. Base de données

Créer une structure de base de données claire.

Tables principales :

users
events
event_members
event_invites
event_cameras
event_livestreams
event_money_pots
event_posts
event_stories
guestbook_messages
guestbook_replies
media_assets
reactions
paid_interactions
favorites
comments
notifications
camera_profiles
reports
admin_logs


19.1 Table users

Champs :

id
first_name
last_name
email
password_hash
avatar_url
role
created_at
updated_at
last_login_at


19.2 Table events

Champs :

id
creator_id
title
event_type
description
cover_image_url
cover_video_url
start_date
start_time
end_date
venue_name
address
city
country
visibility
invite_code
camera_code
is_public
allow_comments
allow_guest_posts
allow_guest_media
allow_guestbook
allow_money_pot
allow_live
created_at
updated_at


19.3 Table event_money_pots

Champs :

id
event_id
platform_name
external_url
title
description
current_amount
target_amount
currency
is_active
created_at
updated_at


19.4 Table event_livestreams

Champs :

id
event_id
platform
stream_url
embed_url
fallback_url
thumbnail_url
camera_name
status
starts_at
ended_at
replay_url
created_at
updated_at


19.5 Table guestbook_messages

Champs :

id
event_id
user_id
author_name
message
media_type
media_url
visibility
likes_count
is_featured
is_reported
created_at
updated_at


19.6 Table paid_interactions

Champs :

id
event_id
user_id
interaction_type
label
amount
currency
payment_status
provider
metadata
created_at


20. API à prévoir

Prévoir une API propre.

Auth

POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/forgot-password
POST /auth/social-login
GET /auth/me


Événements

GET /events
GET /events/:id
POST /events
PATCH /events/:id
DELETE /events/:id
POST /events/join-code
GET /events/:id/dashboard


Cagnotte

GET /events/:id/money-pot
POST /events/:id/money-pot
PATCH /money-pots/:id
POST /money-pots/:id/click


Live

GET /events/:id/live
POST /events/:id/live
PATCH /live/:id
POST /live/:id/viewer
POST /live/:id/chat
GET /live/:id/chat


Livre d’or

GET /events/:id/guestbook
POST /events/:id/guestbook
GET /guestbook/:id
POST /guestbook/:id/like
POST /guestbook/:id/reply
DELETE /guestbook/:id


Médias

POST /media/upload
GET /events/:id/media
POST /media/:id/like
POST /media/:id/report
DELETE /media/:id


Stories

GET /stories
GET /events/:id/stories
POST /events/:id/stories
DELETE /stories/:id


Interactions

GET /events/:id/interactions
POST /events/:id/interactions
POST /interactions/payment-intent


Admin

GET /admin/events
GET /admin/users
GET /admin/reports
PATCH /admin/reports/:id
DELETE /admin/content/:id


21. Intégrations externes

21.1 Live

Intégrer :

YouTube embed ;

Twitch embed ;

URL iframe sécurisée ;

fallback si live indisponible.

Prévoir détection automatique si URL YouTube ou Twitch.

21.2 Cagnotte

Redirection externe vers :

Leetchi ;

Lydia ;

OnParticipe ;

Tribee ;

PayPal ;

URL personnalisée.

21.3 Paiement interactions

Prévoir architecture compatible :

Stripe ;

Apple Pay ;

Google Pay ;

achats intégrés mobile en phase future.

Dans MVP, paiement peut être simulé ou préparé.

21.4 Cartographie

Prévoir :

Google Maps ;

Mapbox ;

OpenStreetMap.

MVP : lien externe Google Maps possible.

21.5 Notifications

Prévoir :

Firebase Cloud Messaging ;

Web Push ;

email transactionnel futur.

22. Pages d’erreur et états vides

Créer des écrans propres pour :

événement introuvable ;

code invalide ;

événement privé ;

live indisponible ;

cagnotte non activée ;

aucun message livre d’or ;

aucun média ;

aucune story ;

chargement ;

erreur serveur ;

accès refusé.

23. UX et micro-interactions

Prévoir :

animations de cœur ;

pluie de cœurs ;

confettis ;

feu d’artifice virtuel ;

toast de confirmation ;

loaders ;

skeleton cards ;

transitions entre stories ;

modal paiement ;

modal partage ;

modal code invité ;

modal QR code ;

bottom sheets mobile.

24. Responsive design

Le projet doit être parfaitement responsive.

Breakpoints :

mobile: 0 - 640px
tablet: 641px - 1024px
desktop: 1025px+


Priorité : mobile-first.

Sur desktop :

centrer le contenu ;

afficher une largeur type mobile pour certaines vues sociales ;

afficher sidebars pour dashboard ;

améliorer la page événement avec grille.

25. Stack technique souhaitée

Lovable doit générer un projet moderne, maintenable et scalable.

Recommandation :

Frontend : React + Vite ou Next.js
UI : Tailwind CSS
Backend : Supabase ou Node.js API
Base de données : PostgreSQL
Auth : Supabase Auth ou JWT
Realtime : Supabase Realtime / WebSocket
Storage : Supabase Storage / S3 / Cloudflare R2
Paiement : Stripe en option
Mobile futur : React Native ou Capacitor


Pour Lovable, privilégier :

React ;

TypeScript ;

Tailwind CSS ;

Supabase ;

composants propres ;

architecture claire ;

fausses données de démonstration si backend non finalisé.

26. Données de démonstration à créer

Créer plusieurs événements fictifs :

Mariage

Sarah & Thomas
Mariage
Bordeaux, France
Live actif
Cagnotte : 4 250 € / 7 000 €
Spectateurs : 2 546
Messages livre d’or : 128
Photos : 548


Baptême

Baptême de Gabriel
Toulouse, France
À venir dans 6 jours
Cagnotte : 850 € / 1 500 €


Anniversaire

Anniversaire de Clara
Paris, France
Live actif
Spectateurs : 856


Baby Shower

Baby Shower Emma
Lyon, France
À venir dans 12 jours


Créer aussi :

faux utilisateurs ;

faux messages ;

faux commentaires ;

fausses photos ;

fausses interactions ;

fausses notifications ;

faux profils caméraman.

27. Textes principaux à intégrer

Hero

Le réseau social privé de vos plus beaux événements.


Sous-texte

Créez votre événement, partagez votre live, recevez des messages, centralisez vos souvenirs et laissez vos proches participer, même à distance.


CTA

Créer un événement gratuitement


J’ai reçu une invitation


Cagnotte

Cette cagnotte est gérée par une plateforme externe. Memento Live ne collecte pas et ne conserve pas les fonds.


Live

Le live est diffusé via une plateforme externe pour garantir une meilleure stabilité, même en cas de forte affluence.


Livre d’or

Laissez un message, une photo, une vidéo ou un vocal pour créer un souvenir inoubliable.


28. Écrans prioritaires MVP

Lovable doit créer en priorité :

Landing page ;

Auth / accès par code ;

Accueil connecté ;

Explorer ;

Création événement ;

Page événement ;

Interface live ;

Livre d’or ;

Album ;

Profil ;

Dashboard organisateur ;

Espace caméraman ;

Admin simple.

29. Prompt final à coller dans Lovable

Créer une application web responsive complète nommée Memento Live.

Memento Live est un réseau social événementiel privé inspiré d’Instagram, TikTok et Twitch, destiné aux mariages, baptêmes, anniversaires, baby showers, communions, remises de diplôme, naissances, retraites et soirées privées.

L’application doit permettre aux utilisateurs de créer un événement, générer une page événement, partager un faire-part digital, utiliser un code invité, intégrer un live YouTube/Twitch, afficher une cagnotte externe type Leetchi, créer un livre d’or multimédia, ajouter des photos/vidéos/vocaux, afficher des stories, consulter un fil d’actualité, interagir pendant le live, gérer un espace caméraman et accéder à un dashboard organisateur.

Design :
Créer un design mobile-first premium, émotionnel et moderne, inspiré d’Instagram pour le feed et les stories, TikTok pour le live plein écran et des applications de mariage pour l’élégance.

Nom : Memento Live
Baseline : Vos événements, en direct, en souvenirs.

Palette :
primary #E85D8E
primary-dark #C93F70
primary-light #FFE4EE
secondary #F7B2C4
secondary-light #FFF1F5
gold #D9A441
gold-light #FFF4D8
background #FFF8F4
surface #FFFFFF
text #231820
text-muted #7A6670
border #F0D9E2
success #32B77A
danger #EF476F
live #FF2D55
dark #171117

Typographies :
Titres : Playfair Display
Interface : Inter

Créer les pages suivantes :
1. Landing page marketing
2. Connexion / inscription
3. Accès par code invité
4. Accueil connecté type Instagram
5. Explorer / recherche
6. Création événement multi-étapes
7. Page détail événement
8. Interface live immersive
9. Livre d’or multimédia
10. Album collaboratif
11. Stories
12. Profil utilisateur
13. Dashboard organisateur
14. Espace caméraman
15. Administration simple

Navigation mobile :
Accueil, Explorer, Créer, Favoris, Profil.
Le bouton Créer doit être central et visuellement mis en avant.

Fonctionnalités accueil :
Header avec logo, notifications, messages, bouton créer.
Stories horizontales avec bordure rose/dorée.
Onglets : Pour vous, En direct, À venir, Favoris.
Cartes événement avec image, titre, type, ville, date, badge LIVE ou J-X, spectateurs, favori, rejoindre, cagnotte.

Création événement :
Étape 1 : type événement.
Étape 2 : informations générales.
Étape 3 : confidentialité.
Étape 4 : cagnotte externe.
Étape 5 : live externe.
Étape 6 : faire-part digital.
Étape 7 : codes et partage.
Étape 8 : confirmation.

Types événements :
Mariage, Baptême, Anniversaire, Fiançailles, Baby Shower, Communion, Naissance, Remise de diplôme, Retraite, Soirée privée, Autre.

Cagnotte :
La cagnotte est externe. L’utilisateur renseigne un lien Leetchi, Lydia, OnParticipe, Tribee, PayPal ou autre.
Afficher titre, lien, objectif, montant actuel manuel, devise, barre de progression, bouton Participer.
Afficher obligatoirement : “Cette cagnotte est gérée par une plateforme externe. Memento Live ne collecte pas et ne conserve pas les fonds.”

Live :
Le live doit être intégré via YouTube Live ou Twitch. Ne pas héberger la vidéo.
Prévoir URL live principale, URL de secours, miniature, statut, heure de début, replay.
Créer une interface live avec player intégré, badge LIVE, compteur spectateurs, chat interne, réactions, interactions payantes préparées, widget cagnotte, photos invités, boutons de partage et choix caméra.

Interactions :
Gratuit : j’aime.
Payant préparé : applaudir 1 €, cœur animé 2 €, message mis en avant 3 €, feu d’artifice 5 €, champagne virtuel 10 €.
Prévoir simulation de paiement ou structure prête à connecter à Stripe.

Livre d’or :
Permettre messages texte, photos, vidéos courtes, vocaux, likes, réponses, favoris, filtres Tous/Photos/Vidéos/Vocaux/Favoris, recherche, mise en avant des meilleurs messages.

Album :
Galerie collaborative avec photos et vidéos des invités, ajout média, likes, commentaires, favoris, signalement, modération prévue.

Stories :
Stories d’événement avant/pendant/après avec photos, vidéos, texte, bouton live, bouton cagnotte, bouton livre d’or.

Page événement :
Afficher couverture, nom, type, lieu, date, compte à rebours, badge LIVE, cagnotte, bouton participer, live, livre d’or, album, espace caméraman, likes, commentaires, favoris, partage.

Dashboard organisateur :
Voir événements créés, modifier événement, gérer cagnotte externe, gérer live, gérer livre d’or, gérer album, gérer codes, télécharger QR codes, voir statistiques, modérer contenus.

Espace caméraman :
Accès par code caméraman, liste des missions, détail mission, renseigner lien YouTube/Twitch, modifier statut live, ajouter photos/vidéos, voir demandes photo, voir horaires et lieu.

Admin :
Liste utilisateurs, liste événements, contenus signalés, suppression message/média, blocage utilisateur, consultation logs simples.

Sécurité :
Prévoir rôles invité/organisateur/caméraman/admin.
Protéger les événements privés par code.
Valider les formulaires.
Limiter les uploads.
Prévoir signalement, modération, anti-spam, validation des liens externes.
Architecture propre et scalable.

Créer des données de démonstration :
Sarah & Thomas, mariage à Bordeaux, live actif, cagnotte 4 250 € / 7 000 €, 2 546 spectateurs, 128 messages, 548 photos.
Baptême de Gabriel à Toulouse, à venir J-6.
Anniversaire de Clara à Paris, live actif.
Baby Shower Emma à Lyon, à venir J-12.

Créer une interface très propre, fluide, premium, mobile-first, avec cartes arrondies, boutons pill, badges, animations douces, stories avec bordures dégradées, live immersif et expérience utilisateur proche d’Instagram/TikTok.


30. Ce que Lovable doit éviter

Préciser dans Lovable :

Ne pas créer une simple landing page.
Ne pas créer une application trop corporate.
Ne pas héberger directement le live vidéo.
Ne pas créer de cagnotte interne qui collecte l’argent.
Ne pas oublier la logique mobile-first.
Ne pas oublier les rôles utilisateur.
Ne pas oublier l’espace caméraman.
Ne pas oublier le livre d’or multimédia.
Ne pas oublier les stories et le feed.
Ne pas oublier la séparation cagnotte externe / interactions payantes.


31. Version courte du concept à afficher dans l’app

Memento Live est le réseau social privé de vos événements.
Créez une page pour votre mariage, baptême ou anniversaire, partagez votre live, ajoutez une cagnotte externe, recevez des messages de vos proches et conservez tous vos souvenirs dans un livre d’or multimédia.


32. Priorité de développement MVP

Pour une première version réaliste, développer dans cet ordre :

PrioritéModule1Authentification / accès par code2Création événement3Page événement4Cagnotte externe5Live YouTube/Twitch intégré6Livre d’or7Album collaboratif8Feed social9Stories10Espace caméraman11Dashboard organisateur12Admin simple13Interactions payantes14Notifications15Application mobile stores

33. Résumé final

Memento Live doit être une plateforme événementielle sociale complète, mobile-first, élégante et scalable. Le cœur du projet repose sur trois piliers :

PilierDescriptionSocialFeed, stories, profils, likes, commentaires, favorisLiveIntégration YouTube/Twitch, chat, réactions, camérasSouvenirLivre d’or, album collaboratif, messages, photos, vidéos, vocaux

La cagnotte reste externe pour éviter les contraintes financières, et le live reste externe pour éviter les problèmes de bande passante. La plateforme se concentre donc sur l’expérience utilisateur, l’émotion, l’interaction et la centralisation des souvenirs.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://event-bloom-live.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9b6e1cca-72dc-43d0-884b-90ecc70896a7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
