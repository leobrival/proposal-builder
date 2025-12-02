# Onboarding Strategy - Spons Easy

**Version**: 1.0.0
**Date de creation**: 2025-11-30
**Status**: Ready for Implementation
**Framework**: Moments of Truth (MOT)
**Base**: customer-success-playbook.md, email-sequences.md, personas.md

---

## Executive Summary

Ce document definit la strategie d'onboarding de Spons Easy basee sur le framework **Moments of Truth (MOT)** du marketing. Chaque interaction critique avec l'utilisateur est mappee pour maximiser la conversion, l'activation et la retention.

**Objectif principal**: Premiere proposition publiee en moins de 5 minutes.

**KPIs cibles**:

- Taux d'activation (proposition publiee): 40%
- Time-to-Value: < 5 minutes
- NPS a J+30: > 30
- Churn mensuel: < 8%

---

## 1. Framework des Moments of Truth

Le framework MOT identifie les moments critiques ou l'utilisateur forme une impression de la marque. Pour Spons Easy, nous avons adapte ce framework au parcours SaaS.

### Vue d'ensemble des MOT

```
<ZMOT ──> ZMOT ──> FMOT ──> IMOT ──> SMOT ──> UMOT
   |        |        |        |        |        |
Declencheur Recherche Premier   Attente  Usage   Partage
            en ligne  contact           reel    experience
```

### Les 6 Moments of Truth de Spons Easy

| MOT   | Nom             | Moment                                | Enjeu                      |
| ----- | --------------- | ------------------------------------- | -------------------------- |
| <ZMOT | Less Than Zero  | Prise de conscience du besoin         | Creer le desir             |
| ZMOT  | Zero Moment     | Recherche et comparaison              | Convaincre                 |
| FMOT  | First Moment    | Premier contact avec le produit       | Seduire                    |
| IMOT  | Interim Moment  | De l'inscription a la premiere action | Ne pas perdre              |
| SMOT  | Second Moment   | Usage reel du produit                 | Satisfaire                 |
| UMOT  | Ultimate Moment | Partage de l'experience               | Transformer en ambassadeur |

---

## 2. <ZMOT - Less Than Zero Moment of Truth

### Definition

Le moment ou l'utilisateur prend conscience qu'il a un probleme a resoudre. Il n'a pas encore commence a chercher de solution.

### Declencheurs pour nos personas

**Clara (Creatrice de contenu)**:

- Recoit un email de marque demandant ses tarifs
- Voit un collegue createur avec un sponsor
- Son audience grandit et elle veut monetiser
- Frustration avec les DM Instagram non professionnels

**Alice (Association)**:

- Le club a besoin de fonds pour un evenement
- Voir une autre association avec des sponsors
- Pression du bureau pour trouver des partenaires
- Budget serré pour la saison

**Eric (Organisateur d'evenements)**:

- Nouveau projet d'evenement a financer
- Echec des sponsorings precedents (pas de reponses)
- Manque de temps pour creer des decks
- Besoin de professionnaliser l'approche

### Actions marketing <ZMOT

| Action            | Canal                 | Message cle                                   |
| ----------------- | --------------------- | --------------------------------------------- |
| Content marketing | Blog, SEO             | "Comment trouver des sponsors pour [X]"       |
| Presence sociale  | LinkedIn, Instagram   | Temoignages de succes                         |
| Partenariats      | Newsletters createurs | "L'outil que j'utilise pour mes sponsors"     |
| Publicite         | Meta, Google          | Ciblage par interet (createurs, associations) |

### Metriques <ZMOT

- Trafic organique (blog)
- Impressions publicitaires
- Mentions de marque
- Recherches de marque

---

## 3. ZMOT - Zero Moment of Truth

### Definition

Le moment ou l'utilisateur recherche activement une solution. Il compare, lit des avis, visite des sites. **88% des decisions d'achat commencent par une recherche en ligne** (Google).

### Parcours de recherche type

```
1. Recherche Google "creer proposition sponsoring"
2. Decouvre plusieurs solutions
3. Visite le site Spons Easy
4. Lit la landing page
5. Cherche des avis/temoignages
6. Compare avec alternatives (Canva, Google Docs)
7. Decision d'essayer ou non
```

### Points de contact ZMOT

| Point de contact | Objectif                 | Element cle                        |
| ---------------- | ------------------------ | ---------------------------------- |
| Landing page     | Convaincre en 5 secondes | Headline claire + demo visuelle    |
| Page pricing     | Transparence             | Gratuit vs Pro clairement explique |
| Temoignages      | Preuve sociale           | Cas d'usage par persona            |
| Blog/Docs        | Credibilite              | Contenu educatif de qualite        |
| Reviews externes | Confiance                | G2, Capterra, Product Hunt         |

### Optimisations ZMOT

**Landing page**:

- Headline: "Creez des propositions de sponsoring professionnelles en 5 minutes"
- Sous-titre: "Sans competences en design. Gratuit pour commencer."
- CTA: "Creer ma premiere proposition" (pas "S'inscrire")
- Demo visuelle du builder en action
- 3 temoignages par persona

**SEO/Content**:

- Articles: "Guide complet du sponsoring pour [createurs/associations/evenements]"
- Templates: "Modele de proposition de sponsoring gratuit"
- Comparatifs: "Spons Easy vs Canva pour les propositions"

### Metriques ZMOT

- Taux de rebond landing page (cible: < 50%)
- Temps sur page (cible: > 2 min)
- CTR sur CTA principal (cible: > 5%)
- Taux de conversion visiteur -> inscription (cible: > 3%)

---

## 4. FMOT - First Moment of Truth

### Definition

Les **3-7 premieres secondes** ou l'utilisateur interagit avec le produit. C'est le moment de la premiere impression - on n'a qu'une chance.

### Le FMOT de Spons Easy: L'inscription

**Duree cible**: 30 secondes maximum

**Friction a eliminer**:

- Formulaire long (seulement 3 champs: nom, email, mot de passe)
- Verification email obligatoire (differer apres premiere action)
- Demande de carte bancaire (jamais pour le gratuit)
- Onboarding tutorial force (toujours skippable)

**Experience optimale**:

```
1. Clic sur "Creer ma premiere proposition" (landing)
2. Modal d'inscription (3 champs)
3. Clic "Creer mon compte"
4. Redirect immediat vers le dashboard
5. Dashboard avec CTA "Nouvelle proposition" en evidence
```

### Premier ecran (Dashboard vide)

Le dashboard vide est critique. Un ecran vide = abandon.

**Elements requis**:

- Message de bienvenue personnalise: "Bienvenue [Prenom]!"
- CTA principal enorme: "Creer ma premiere proposition"
- Etapes visuelles: 1. Creer → 2. Personnaliser → 3. Publier
- Exemple de proposition "avant/apres" cliquable
- Temps estime: "5 minutes pour votre premiere proposition"

### Metriques FMOT

- Taux de completion inscription (cible: > 80%)
- Temps entre inscription et premiere action (cible: < 60 sec)
- Taux d'abandon sur dashboard vide (cible: < 20%)
- Clic sur "Nouvelle proposition" (cible: > 60%)

---

## 5. IMOT - Interim Moment of Truth

### Definition

Le moment **entre l'action initiale et la realisation de la valeur**. Pour un e-commerce, c'est l'attente de livraison. Pour un SaaS, c'est le setup/onboarding.

### L'IMOT de Spons Easy: Creation de la premiere proposition

**Duree cible**: 2-3 minutes

**Parcours optimal**:

```
Clic "Nouvelle proposition"
        ↓
    [IMOT START]
        ↓
Etape 1: Informations de base (1 min)
- Nom du projet (pre-rempli si possible)
- Description courte (placeholder inspirant)
- Email de contact (pre-rempli avec email compte)
        ↓
Etape 2: Paliers de sponsoring (1 min)
- 3 paliers pre-configures (modifiables)
- Prix suggeres selon le type de projet
- Avantages en bullet points
        ↓
Etape 3: Apercu temps reel
- Split-screen: formulaire | preview
- Satisfaction immediate de voir le resultat
        ↓
    [IMOT END]
        ↓
Bouton "Publier" visible et engageant
```

### Reduire l'anxiete IMOT

| Anxiete                      | Solution                           |
| ---------------------------- | ---------------------------------- |
| "C'est complique"            | Barre de progression visible       |
| "Je ne sais pas quoi mettre" | Placeholders et exemples           |
| "Et si je me trompe?"        | Message "Modifiable a tout moment" |
| "Ca prend trop de temps"     | Timer "Temps ecoule: 2:34"         |

### Quick wins pendant l'IMOT

Chaque micro-accomplissement renforce l'engagement:

1. "Excellent! Votre projet a un nom"
2. "Parfait! Vos paliers sont configures"
3. "Superbe! Votre proposition prend forme"
4. "Pret a publier!"

### Metriques IMOT

- Taux de completion du builder (cible: > 70%)
- Temps moyen dans le builder (cible: < 4 min)
- Abandon par etape (identifier les points de friction)
- Satisfaction apercu temps reel (feedback implicite)

---

## 6. SMOT - Second Moment of Truth

### Definition

Le moment ou l'utilisateur **utilise reellement le produit** et ou ses attentes sont confirmees, depassees ou decues. C'est ici que se joue la retention.

### Le SMOT de Spons Easy: Publication et premiers resultats

**Moments SMOT critiques**:

#### SMOT #1: La publication

```
Clic "Publier"
      ↓
Animation de celebration (confetti subtils)
      ↓
Modal de succes:
"Votre proposition est en ligne!"
[Lien a copier]
[Bouton: Partager sur LinkedIn]
[Bouton: Voir ma proposition]
```

**Emotions a susciter**: Fierte, accomplissement, excitation

#### SMOT #2: Premiere visite sur la proposition publiee

L'utilisateur clique sur son lien pour voir le resultat final.

**Checklist qualite**:

- [ ] Chargement < 2 secondes
- [ ] Design professionnel et moderne
- [ ] Mobile-responsive parfait
- [ ] Formulaire de contact visible
- [ ] Aucun bug visuel

#### SMOT #3: Premier lead recu

Le moment magique ou un sponsor potentiel repond.

**Experience optimale**:

```
Notification email immediate:
"Un sponsor s'interesse a votre proposition!"

Dashboard mis a jour:
- Badge "1 nouveau lead" visible
- Detail du lead avec palier d'interet
- Boutons d'action: Contacter, Marquer comme traite
```

**Emotions a susciter**: Validation, motivation, confiance

#### SMOT #4: Usage continu

Apres la premiere semaine:

- Mise a jour de la proposition
- Gestion des leads
- Creation d'une deuxieme proposition (trigger upgrade)

### Depasser les attentes (SMOT+)

| Attente               | Comment la depasser                             |
| --------------------- | ----------------------------------------------- |
| "Ca marche"           | "C'est beau et professionnel"                   |
| "J'ai un lien"        | "Les sponsors peuvent me contacter directement" |
| "Je peux modifier"    | "Les modifications sont instantanees"           |
| "Support si probleme" | "L'assistant IA repond immediatement"           |

### Metriques SMOT

- Taux de publication (cible: > 50% des propositions creees)
- Temps avant premier partage (cible: < 24h)
- Taux de leads par proposition (benchmark a etablir)
- Retention J+7, J+30, J+90
- NPS score (cible: > 30)

---

## 7. UMOT - Ultimate Moment of Truth

### Definition

Le moment ou l'utilisateur **partage son experience** avec d'autres. Un client satisfait devient ambassadeur. Un client decu devient detracteur.

### Transformer les utilisateurs en ambassadeurs

#### Declencheurs UMOT positifs

| Moment                       | Action a encourager                             |
| ---------------------------- | ----------------------------------------------- |
| Premiere proposition publiee | "Partagez votre succes sur LinkedIn"            |
| Premier lead recu            | "Votre strategie fonctionne! Dites-le a un ami" |
| Premier sponsor signe        | "Felicitations! Partagez votre histoire"        |
| Upgrade vers Pro             | "Merci! Parrainez un ami et gagnez 1 mois"      |

#### Programme de referral

**Mecanisme simple**:

- Parrain: 1 mois de Pro gratuit par filleul converti
- Filleul: 20% de reduction sur le premier mois Pro
- Lien de parrainage unique dans le dashboard

#### Collecte de temoignages

**Moment optimal**: Apres un succes (lead recu, sponsor signe)

**Email automatique**:

```
Objet: Votre succes nous inspire!

Bonjour [Prenom],

Felicitations pour [le lead recu / le sponsor signe]!

Votre experience pourrait aider d'autres [createurs/associations/organisateurs].
Accepteriez-vous de partager un court temoignage?

[Bouton: Partager mon experience (2 min)]

En remerciement, vous recevrez [incentive].
```

#### Gestion des detracteurs

**Signaux de detracteur**:

- NPS 0-6
- Plainte support
- Churn
- Avis negatif externe

**Processus de recuperation**:

1. Contact personnel dans les 24h
2. Ecoute active du probleme
3. Solution concrete proposee
4. Suivi post-resolution
5. Demande de revision de l'avis si satisfait

### Metriques UMOT

- Taux de referral (cible: > 10% des utilisateurs actifs)
- NPS Promoteurs (9-10) (cible: > 40%)
- Nombre de temoignages collectes
- Mentions sociales positives
- Avis externes (G2, Capterra)

---

## 8. Parcours d'Onboarding par Persona

### Clara (Creatrice de contenu)

**Profil**: 25-35 ans, 10K-100K abonnes, Instagram/YouTube/TikTok

**Parcours MOT adapte**:

| MOT   | Adaptation Clara                        |
| ----- | --------------------------------------- |
| <ZMOT | Voir un post d'un createur avec sponsor |
| ZMOT  | Recherche "kit media createur"          |
| FMOT  | Landing avec temoignage createur        |
| IMOT  | Templates "createur" pre-configures     |
| SMOT  | Proposition avec stats audience         |
| UMOT  | Partage sur Instagram Stories           |

**Messages cles**:

- "Arretez d'envoyer des DM non professionnels"
- "Les marques vous prendront au serieux"
- "Rejoignez 500+ createurs qui utilisent Spons Easy"

**Emails adaptes** (Sequence Onboarding):

- J+0: "Bienvenue! Votre premiere proposition de createur"
- J+2: "Comment Marie (YouTubeuse) a signe 3 sponsors"
- J+4: "Le secret des createurs qui monetisent"

### Alice (Association)

**Profil**: 45-60 ans, presidente/tresoriere, club sportif/culturel

**Parcours MOT adapte**:

| MOT   | Adaptation Alice                         |
| ----- | ---------------------------------------- |
| <ZMOT | Reunion du bureau sur le budget          |
| ZMOT  | Recherche "trouver sponsors association" |
| FMOT  | Landing avec cas association sportive    |
| IMOT  | Templates "association" simplifies       |
| SMOT  | Proposition sobre et professionnelle     |
| UMOT  | Partage avec autres associations         |

**Messages cles**:

- "Pas besoin d'etre une entreprise"
- "D'autres associations comme la votre l'utilisent"
- "Simple comme envoyer un email"

**Emails adaptes** (Sequence Onboarding):

- J+0: "Bienvenue! Sponsoring accessible aux associations"
- J+2: "Comment le Tennis Club de Bordeaux a trouve 5 sponsors"
- J+4: "3 erreurs que font les associations (et comment les eviter)"

### Eric (Organisateur d'evenements)

**Profil**: 30-45 ans, organise 2-5 evenements/an, tech/culture

**Parcours MOT adapte**:

| MOT   | Adaptation Eric                          |
| ----- | ---------------------------------------- |
| <ZMOT | Nouveau projet d'evenement a financer    |
| ZMOT  | Recherche "dossier sponsoring evenement" |
| FMOT  | Landing avec cas conference tech         |
| IMOT  | Templates "evenement" avec dates         |
| SMOT  | Proposition avec programme et audience   |
| UMOT  | Recommandation a d'autres orgas          |

**Messages cles**:

- "Fini les decks PowerPoint de 2 semaines"
- "Une proposition par evenement en 10 minutes"
- "Gerez tous vos sponsors au meme endroit"

**Emails adaptes** (Sequence Onboarding):

- J+0: "Bienvenue! Votre premier dossier de sponsoring"
- J+2: "Comment TechConf a leve 50K en sponsors"
- J+4: "Le framework des evenements qui attirent les sponsors"

---

## 9. Sequences Email alignees sur les MOT

### Vue d'ensemble

```
        ZMOT          FMOT         IMOT          SMOT           UMOT
          |             |            |             |              |
    [Waitlist]    [Welcome]    [Tips J+2]    [Success]    [Referral]
                               [Guide J+4]   [Check-in]   [Testimony]
                               [Leads J+7]
```

### Sequence Waitlist (Pre-FMOT)

**Objectif**: Maintenir l'interet pendant le ZMOT prolonge

| Email | Jour | Contenu                | MOT       |
| ----- | ---- | ---------------------- | --------- |
| 1     | J+0  | Bienvenue + promesse   | ZMOT      |
| 2     | J+2  | Education + pain point | ZMOT      |
| 3     | J+4  | Preview produit        | ZMOT→FMOT |
| 4     | J+6  | Urgence + early access | ZMOT→FMOT |
| 5     | J+8  | Lancement              | FMOT      |

### Sequence Onboarding (FMOT→SMOT)

**Objectif**: Guider vers la publication et premiers resultats

| Email | Jour | Contenu             | MOT       |
| ----- | ---- | ------------------- | --------- |
| 1     | J+0  | Quick start 5 min   | FMOT→IMOT |
| 2     | J+2  | 3 tips propositions | IMOT      |
| 3     | J+4  | Guide publication   | IMOT→SMOT |
| 4     | J+7  | Gestion leads       | SMOT      |
| 5     | J+14 | Check-in + feedback | SMOT      |

### Sequence Re-engagement (SMOT recuperation)

**Objectif**: Reactiver les utilisateurs en perte de SMOT

| Email | Jour         | Contenu          | MOT  |
| ----- | ------------ | ---------------- | ---- |
| 1     | J+14 inactif | "On vous attend" | SMOT |
| 2     | J+17         | Best practices   | SMOT |
| 3     | J+21         | Nouveautes       | SMOT |

### Sequence Upgrade (SMOT→UMOT)

**Objectif**: Convertir les utilisateurs satisfaits en Pro

| Email | Jour    | Contenu       | MOT       |
| ----- | ------- | ------------- | --------- |
| 1     | Trigger | Valeur Pro    | SMOT      |
| 2     | +2j     | Social proof  | SMOT      |
| 3     | +5j     | Offre limitee | SMOT→UMOT |

### Sequence Advocacy (UMOT)

**Objectif**: Transformer en ambassadeurs

| Email | Trigger         | Contenu                 | MOT  |
| ----- | --------------- | ----------------------- | ---- |
| 1     | Premier lead    | "Partagez votre succes" | UMOT |
| 2     | NPS 9-10        | Demande temoignage      | UMOT |
| 3     | Premier sponsor | Programme referral      | UMOT |

---

## 10. Metriques et Dashboard

### KPIs par MOT

| MOT   | KPI Principal               | Cible    | Alerte |
| ----- | --------------------------- | -------- | ------ |
| <ZMOT | Trafic organique            | +10% MoM | -5%    |
| ZMOT  | Taux conversion landing     | > 3%     | < 2%   |
| FMOT  | Taux completion inscription | > 80%    | < 60%  |
| IMOT  | Taux creation proposition   | > 60%    | < 40%  |
| SMOT  | Taux publication            | > 50%    | < 30%  |
| UMOT  | NPS Promoteurs              | > 40%    | < 25%  |

### Funnel complet

```
Visiteurs (ZMOT)
    ↓ 3%
Inscrits (FMOT)
    ↓ 60%
Proposition creee (IMOT)
    ↓ 70%
Proposition publiee (SMOT)
    ↓ 40%
Lead recu (SMOT+)
    ↓ 20%
Sponsor signe (UMOT trigger)
    ↓ 30%
Referral fait (UMOT)
```

### Dashboard hebdomadaire

```
=== DASHBOARD MOT - Semaine du [DATE] ===

ACQUISITION (ZMOT)
- Visiteurs: [X] ([+/-]% vs S-1)
- Sources: Organic [X%], Paid [X%], Referral [X%]

ACTIVATION (FMOT/IMOT)
- Inscriptions: [X] (taux: [X%])
- Propositions creees: [X] (taux: [X%])
- Propositions publiees: [X] (taux: [X%])

RETENTION (SMOT)
- Utilisateurs actifs J+7: [X%]
- Leads generes: [X]
- Mises a jour propositions: [X]

REVENUE
- Nouveaux Pro: [X]
- MRR: [X] EUR
- Churn: [X%]

ADVOCACY (UMOT)
- NPS moyen: [X]
- Referrals: [X]
- Temoignages collectes: [X]

ALERTES:
[Liste des metriques sous le seuil d'alerte]
```

---

## 11. Implementation Technique

### Tracking des MOT

**Events a tracker** (PostHog/Analytics):

```javascript
// ZMOT
track('landing_page_view', { source, campaign })
track('pricing_page_view')
track('testimonial_click', { persona })

// FMOT
track('signup_started')
track('signup_completed', { method })
track('dashboard_first_view')

// IMOT
track('proposal_creation_started')
track('proposal_step_completed', { step })
track('proposal_preview_viewed')

// SMOT
track('proposal_published')
track('proposal_link_copied')
track('proposal_shared', { platform })
track('lead_received', { tier })
track('lead_status_updated', { status })

// UMOT
track('referral_link_generated')
track('referral_signup')
track('nps_submitted', { score })
track('testimonial_submitted')
```

### Automatisations

| Trigger                     | Action                 | Delai    |
| --------------------------- | ---------------------- | -------- |
| Inscription                 | Email bienvenue        | Immediat |
| Proposition non publiee J+2 | Email tips             | J+2      |
| Proposition publiee         | Celebration in-app     | Immediat |
| Premier lead                | Email + notification   | Immediat |
| Inactif J+14                | Sequence re-engagement | J+14     |
| NPS 9-10                    | Email temoignage       | J+1      |
| Trigger upgrade             | Sequence upgrade       | Immediat |

---

## Historique du Document

| Date       | Version | Auteur | Modifications                        |
| ---------- | ------- | ------ | ------------------------------------ |
| 2025-11-30 | 1.0.0   | -      | Creation initiale avec framework MOT |

---

## Sources

- [Moments of Truth in Marketing - Liferay](https://www.liferay.com/blog/customer-experience/what-are-the-five-moments-of-truth-in-marketing)
- [ZMOT, FMOT, SMOT, TMOT - Medium](https://medium.com/@OzairImranDigitalMarketer/what-is-zmot-fmot-smot-and-tmot-93d815ad87a9)
- [Moment of Truth Definition - TechTarget](https://www.techtarget.com/searchcustomerexperience/definition/moment-of-truth-marketing-MOT)

---

_Document cree pour Spons Easy_
_Framework: Moments of Truth (MOT)_
