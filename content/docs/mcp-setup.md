---
title: Configuration du MCP pour Claude Desktop
slug: mcp-setup
description: Guide complet pour integrer Spons Easy avec Claude Desktop via le protocole MCP
section: integration
order: 1
icon: 🤖
status: published
updatedAt: 2024-11-30T00:00:00.000Z
---

# Configuration du MCP pour Claude Desktop

Le **Model Context Protocol (MCP)** permet a Claude Desktop d'interagir directement avec votre compte Spons Easy. Vous pouvez creer, modifier et gerer vos propositions de sponsoring directement depuis l'interface de Claude.

## Prerequis

Avant de commencer, assurez-vous d'avoir :

- **Claude Desktop** installe sur votre machine
- Un compte **Spons Easy** actif
- **Node.js** version 18 ou superieure

## Installation

### 1. Installer le package NPM

Installez le client MCP Spons Easy globalement :

```bash
npm install -g spons-easy-mcp
```

Ou avec pnpm :

```bash
pnpm add -g spons-easy-mcp
```

### 2. Generer une cle API

1. Connectez-vous a votre compte Spons Easy
2. Allez dans **Parametres** > **Cles API**
3. Cliquez sur **Creer une nouvelle cle**
4. Donnez un nom a votre cle (ex: "Claude Desktop")
5. Copiez la cle generee (elle ne sera plus visible apres)

### 3. Configurer Claude Desktop

Ouvrez le fichier de configuration de Claude Desktop :

**macOS** :
```bash
code ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

**Windows** :
```bash
code %APPDATA%\Claude\claude_desktop_config.json
```

**Linux** :
```bash
code ~/.config/Claude/claude_desktop_config.json
```

Ajoutez la configuration suivante :

```json
{
  "mcpServers": {
    "spons-easy": {
      "command": "npx",
      "args": ["spons-easy-mcp"],
      "env": {
        "SPONS_EASY_API_KEY": "votre-cle-api-ici"
      }
    }
  }
}
```

### 4. Redemarrer Claude Desktop

Fermez completement Claude Desktop et relancez-le pour appliquer la configuration.

## Outils disponibles

Une fois configure, vous aurez acces aux outils suivants dans Claude :

### list_proposals

Liste toutes vos propositions de sponsoring.

**Exemple d'utilisation** :
> "Montre-moi toutes mes propositions"

### get_proposal

Recupere les details d'une proposition specifique.

**Parametres** :
- `id` : Identifiant de la proposition

**Exemple d'utilisation** :
> "Affiche les details de ma proposition #123"

### create_proposal

Cree une nouvelle proposition de sponsoring.

**Parametres** :
- `title` : Titre de la proposition
- `description` : Description detaillee
- `targetAmount` : Montant cible du sponsoring
- `eventName` : Nom de l'evenement (optionnel)
- `eventDate` : Date de l'evenement (optionnel)

**Exemple d'utilisation** :
> "Cree une nouvelle proposition pour mon evenement Tech Talks avec un objectif de 5000 euros"

### update_proposal

Met a jour une proposition existante.

**Parametres** :
- `id` : Identifiant de la proposition
- Tous les champs modifiables de la proposition

**Exemple d'utilisation** :
> "Modifie le titre de ma proposition #123 en 'Conference Tech 2025'"

### delete_proposal

Supprime une proposition.

**Parametres** :
- `id` : Identifiant de la proposition

**Exemple d'utilisation** :
> "Supprime ma proposition #123"

### get_limits

Affiche les limites de votre plan actuel.

**Exemple d'utilisation** :
> "Quelles sont mes limites de creation de propositions ?"

## Limites par plan

| Plan | Propositions | Acces MCP |
|------|-------------|-----------|
| Free | 2 | Oui |
| Pro | 50 | Oui |
| Enterprise | Illimite | Oui |

Le MCP est accessible a **tous les plans**, sans limite de requetes.

## Depannage

### Le serveur MCP ne demarre pas

1. Verifiez que Node.js est installe : `node --version`
2. Reinstallez le package : `npm install -g spons-easy-mcp`
3. Verifiez les logs de Claude Desktop

### Erreur d'authentification

1. Verifiez que votre cle API est valide
2. Assurez-vous que la cle n'a pas ete revoquee
3. Regenerez une nouvelle cle si necessaire

### Les outils n'apparaissent pas

1. Redemarrez completement Claude Desktop
2. Verifiez la syntaxe de votre fichier de configuration JSON
3. Assurez-vous que le chemin vers `npx` est correct

## Support

Si vous rencontrez des problemes :

- Consultez notre [FAQ](/docs/faq)
- Contactez le support : support@sponseasy.com
- Rejoignez notre communaute Discord

## Prochaines etapes

- [Creer votre premiere proposition](/docs/first-proposal)
- [Personnaliser votre page de proposition](/docs/customize-proposal)
- [Publier et partager](/docs/publish-share)
