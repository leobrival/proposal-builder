---
title: Automatiser vos propositions de sponsoring avec Claude Desktop et MCP
slug: integration-mcp-claude-desktop
description: Guide technique complet pour connecter Spons Easy à Claude Desktop via le Model Context Protocol et générer des propositions en langage naturel.
category: tutorial
funnelStage: bofu
author: Équipe Spons Easy
tags:
  - mcp
  - claude
  - integration
  - api
  - automation
  - avancé
status: published
featured: true
publishedAt: 2025-12-01T00:00:00.000Z
updatedAt: 2025-12-01T00:00:00.000Z
seo:
  title: Intégration MCP Spons Easy + Claude Desktop - Guide Complet
  description: Configurez l'intégration MCP pour générer des propositions de sponsoring avec Claude Desktop. Tutoriel technique avec exemples de code.
  keywords:
    - mcp spons easy
    - claude desktop integration
    - model context protocol
    - automation propositions sponsoring
    - api spons easy
---

# Automatiser vos propositions de sponsoring avec Claude Desktop et MCP

**Niveau** : Avancé | **Temps de lecture** : 15 min | **Prérequis** : Compte Pro, notions de CLI

---

## Introduction

Le **Model Context Protocol (MCP)** est une technologie développée par Anthropic qui permet à Claude Desktop de se connecter directement à des applications externes comme Spons Easy. Cette intégration ouvre des possibilités d'automatisation puissantes pour les utilisateurs Pro.

### Cas d'usage concrets

- **Génération en langage naturel** : "Crée-moi une proposition pour un podcast tech avec 3 paliers"
- **Gestion multi-propositions** : Créer et modifier plusieurs propositions en une seule conversation
- **Import de données** : Extraire des informations depuis des documents et générer automatiquement des propositions
- **A/B testing** : Créer des variantes de propositions pour tester différents prix ou descriptions

---

## Prérequis techniques

### Ce dont vous avez besoin

| Élément | Version minimale | Lien |
|---------|------------------|------|
| **Claude Desktop** | 0.7.0+ | [Télécharger](https://claude.ai/download) |
| **Compte Spons Easy Pro** | Plan actif | [Upgrader](https://app.sponseasy.com/billing) |
| **API Key Spons Easy** | Clé active | [Générer une clé](#générer-votre-api-key) |
| **Node.js** (optionnel) | 18+ | [nodejs.org](https://nodejs.org) |

---

## Étape 1 : Générer votre API Key

### Accéder à la page API Keys

1. Connectez-vous à votre compte Pro
2. Allez dans **Paramètres** > **API & Intégrations**
3. Cliquez sur **Générer une nouvelle clé**

### Configurer les scopes

Pour l'intégration MCP, nous recommandons ces permissions :

```
✅ proposals:read    - Lire vos propositions
✅ proposals:write   - Créer et modifier
✅ proposals:publish - Publier/dépublier
✅ user:read         - Lire vos informations
```

### Sauvegarder votre clé

⚠️ **Important** : Votre clé API commence par `sk_` et ne s'affiche qu'une seule fois. Copiez-la immédiatement dans un gestionnaire de mots de passe sécurisé.

```bash
# Format de la clé
sk_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcd
```

---

## Étape 2 : Installer le package MCP

### Via NPM (recommandé)

```bash
npm install -g @spons-easy/mcp-client
```

### Vérifier l'installation

```bash
spons-easy-mcp --version
# Output: @spons-easy/mcp-client v1.0.0
```

---

## Étape 3 : Configurer Claude Desktop

### Localiser le fichier de configuration

Le fichier `claude_desktop_config.json` se trouve à différents emplacements selon votre OS :

| OS | Chemin |
|----|--------|
| **macOS** | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| **Windows** | `%APPDATA%\Claude\claude_desktop_config.json` |
| **Linux** | `~/.config/Claude/claude_desktop_config.json` |

### Ajouter la configuration MCP

Ouvrez le fichier et ajoutez cette configuration :

```json
{
  "mcpServers": {
    "spons-easy": {
      "command": "npx",
      "args": [
        "-y",
        "@spons-easy/mcp-client"
      ],
      "env": {
        "SPONS_EASY_API_KEY": "sk_VOTRE_CLE_API_ICI",
        "SPONS_EASY_BASE_URL": "https://app.sponseasy.com"
      }
    }
  }
}
```

### Configuration avancée (optionnel)

Pour un environnement de développement ou staging :

```json
{
  "mcpServers": {
    "spons-easy-dev": {
      "command": "npx",
      "args": ["-y", "@spons-easy/mcp-client"],
      "env": {
        "SPONS_EASY_API_KEY": "sk_dev_...",
        "SPONS_EASY_BASE_URL": "http://localhost:3333",
        "SPONS_EASY_DEBUG": "true"
      }
    }
  }
}
```

---

## Étape 4 : Redémarrer Claude Desktop

1. **Quitter complètement** Claude Desktop (⌘Q sur Mac, Alt+F4 sur Windows)
2. **Relancer** l'application
3. Vérifier la connexion dans les **Settings** > **Developer** > **MCP Servers**

Vous devriez voir :

```
✅ spons-easy (Connected)
   - 11 tools available
   - Latency: ~50ms
```

---

## Étape 5 : Tester l'intégration

### Test simple : Lister vos propositions

Ouvrez une nouvelle conversation avec Claude et tapez :

```
Liste-moi toutes mes propositions de sponsoring
```

Claude devrait répondre avec la liste de vos propositions existantes.

### Test avancé : Créer une proposition

```
Crée-moi une proposition de sponsoring pour mon podcast tech "DevCafé" 
avec 3 paliers : Bronze (500€), Silver (1500€), Gold (3000€). 
Le podcast parle de développement web et a 5000 auditeurs mensuels.
```

Claude va :
1. Analyser votre demande
2. Appeler l'API Spons Easy via MCP
3. Créer la proposition avec les bonnes données structurées
4. Vous donner le lien vers la proposition créée

---

## Cas d'usage avancés

### 1. Import depuis un Google Doc

```
J'ai un Google Doc avec mes informations événement. 
Peux-tu extraire les données et créer une proposition de sponsoring ?

[Coller le contenu du document]
```

### 2. Modification en masse

```
J'ai 5 propositions pour des conférences tech. 
Peux-tu augmenter tous les paliers "Gold" de 20% et 
ajouter le bénéfice "Logo sur le site" à chaque palier ?
```

### 3. Génération de variantes

```
Génère 3 variantes de ma proposition "TechConf 2025" :
- Version aggressive (prix +30%)
- Version standard (prix actuels)
- Version accessible (prix -20%)

Compare les trois et recommande la meilleure.
```

### 4. Analyse et optimisation

```
Analyse toutes mes propositions publiées et donne-moi :
- Quels paliers se vendent le mieux ?
- Quels bénéfices sont les plus attractifs ?
- Recommandations pour améliorer mon taux de conversion
```

---

## Outils MCP disponibles

Voici la liste complète des outils que Claude peut utiliser :

| Outil | Description | Exemple |
|-------|-------------|---------|
| `list_proposals` | Liste vos propositions | "Montre mes propositions en cours" |
| `get_proposal` | Détails d'une proposition | "Donne les détails de ma proposition X" |
| `create_proposal` | Créer une nouvelle proposition | "Crée une proposition pour..." |
| `update_proposal` | Modifier une proposition | "Change le titre de la proposition Y" |
| `delete_proposal` | Supprimer une proposition | "Supprime la proposition de test" |
| `publish_proposal` | Publier une proposition | "Publie ma proposition podcast" |
| `unpublish_proposal` | Dépublier | "Dépublie temporairement X" |
| `get_limits` | Voir vos limites de plan | "Combien de propositions puis-je créer ?" |
| `get_user` | Vos informations | "Quel est mon plan actuel ?" |
| `list_docs` | Documentation Spons Easy | "Montre la doc sur les paliers" |
| `get_doc` | Contenu d'une doc | "Affiche le guide des paliers" |

---

## Sécurité et bonnes pratiques

### Protection de votre API Key

❌ **Ne jamais** :
- Partager votre clé API publiquement
- Commiter la clé dans un repository Git
- L'inclure dans des screenshots

✅ **Toujours** :
- Stocker la clé dans un gestionnaire de mots de passe
- Utiliser des variables d'environnement
- Régénérer la clé si elle est compromise

### Rotation des clés

Nous recommandons de régénérer vos clés API tous les 90 jours :

1. Allez dans **Paramètres** > **API & Intégrations**
2. Cliquez sur **Régénérer** à côté de votre clé
3. Mettez à jour la configuration Claude Desktop
4. Redémarrez Claude

### Monitoring

Surveillez l'utilisation de votre API dans le dashboard :

- **Appels API ce mois** : Voir votre consommation
- **Dernière activité** : Détecter des accès suspects
- **Logs d'erreurs** : Diagnostiquer les problèmes

---

## Résolution de problèmes

### ❌ "MCP Server not connected"

**Solution** :
1. Vérifiez que le package est installé : `npm list -g @spons-easy/mcp-client`
2. Vérifiez la syntaxe JSON du fichier config
3. Redémarrez Claude Desktop complètement

### ❌ "API Key invalid"

**Solution** :
1. Vérifiez que la clé commence bien par `sk_`
2. Assurez-vous qu'elle n'a pas expiré
3. Régénérez une nouvelle clé si nécessaire

### ❌ "Rate limit exceeded"

**Solution** :
Les comptes Pro ont une limite de 1000 appels API/jour. Si vous dépassez :
1. Attendez le reset (minuit UTC)
2. Optimisez vos requêtes (batch operations)
3. Contactez-nous pour une limite personnalisée

### ❌ "Tool execution failed"

**Solution** :
1. Activez le mode debug : `"SPONS_EASY_DEBUG": "true"`
2. Consultez les logs dans `~/Library/Logs/Claude/mcp.log`
3. Vérifiez vos permissions de clé API

---

## Aller plus loin

### Automatisation avec scripts

Vous pouvez aussi utiliser le package en Node.js :

```javascript
import { SponsEasyClient } from '@spons-easy/mcp-client'

const client = new SponsEasyClient({
  apiKey: process.env.SPONS_EASY_API_KEY,
  baseUrl: 'https://app.sponseasy.com'
})

// Créer une proposition
const proposal = await client.createProposal({
  title: 'TechConf 2025',
  projectName: 'Conférence Développeurs',
  contactEmail: 'sponsor@techconf.com'
})

console.log(`Proposition créée : ${proposal.slug}`)
```

### Webhooks et intégrations

Combinez MCP avec d'autres outils :

- **Zapier** : Déclencher des actions depuis vos propositions
- **Notion** : Synchroniser vos propositions avec votre CRM
- **Slack** : Recevoir des notifications de nouveaux leads

### Documentation complète

- [API Reference](https://docs.sponseasy.com/api)
- [MCP Protocol Spec](https://modelcontextprotocol.io)
- [GitHub - Package MCP](https://github.com/spons-easy/mcp-client)

---

## Conclusion

L'intégration MCP transforme Spons Easy en un assistant intelligent pour vos propositions de sponsoring. Vous pouvez maintenant :

✅ Créer des propositions en langage naturel
✅ Automatiser les tâches répétitives
✅ Gérer plusieurs propositions simultanément
✅ Analyser et optimiser vos performances

### Prochaines étapes

1. **Testez l'intégration** avec quelques commandes simples
2. **Explorez les cas d'usage** avancés
3. **Rejoignez la communauté** : [Discord Spons Easy](https://discord.gg/sponseasy)
4. **Partagez vos workflows** : Que faites-vous avec MCP ?

---

## Questions fréquentes

**Q : L'intégration MCP est-elle disponible sur mobile ?**
R : Non, MCP fonctionne uniquement avec Claude Desktop (Mac/Windows/Linux).

**Q : Puis-je utiliser MCP avec le plan gratuit ?**
R : Non, MCP nécessite un compte Pro pour générer des clés API.

**Q : Y a-t-il des limites de taux pour MCP ?**
R : Oui, 1000 appels/jour pour Pro, 5000/jour pour Enterprise.

**Q : Mes données sont-elles sécurisées ?**
R : Oui, toutes les communications sont chiffrées (HTTPS) et nous ne stockons jamais vos conversations avec Claude.

**Q : Puis-je révoquer l'accès MCP ?**
R : Oui, supprimez simplement la clé API dans vos paramètres.

---

**Besoin d'aide ?** Contactez notre support technique : [support@sponseasy.com](mailto:support@sponseasy.com)

**Compte Pro requis** - [Upgrader maintenant](https://app.sponseasy.com/billing) pour débloquer MCP et l'automatisation IA.
