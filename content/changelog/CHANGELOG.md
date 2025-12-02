# Changelog

Toutes les modifications notables de Spons Easy sont documentées ici.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/),
et ce projet adhère au [Versionnement Sémantique](https://semver.org/lang/fr/).

## [1.0.0] - 2024-11-30

### Ajouté

- Système de création de propositions de sponsoring
- Builder visuel pour personnaliser les pages de proposition
- Gestion des paliers de sponsoring avec bénéfices
- Publication et partage via URL unique
- Tableau de bord administrateur avec métriques
- Système de paiement avec Lemon Squeezy et Stripe
- Système d'email avec Resend et SMTP
- API MCP pour intégration avec Claude Desktop
- Package NPM `spons-easy-mcp` publié
- Système de limitations par plan (free: 2 proposals, pro: 50, enterprise: illimité)
- Gestion des clés API pour l'accès MCP

### Sécurité

- Authentification par session sécurisée
- Hachage SHA-256 des clés API
- Validation des entrées avec VineJS
