# Jeu des Allumettes

Un jeu de stratégie classique implémenté en HTML, CSS et JavaScript vanilla, développé dans le cadre du cours **MSCI (Maturité Spécialisée Communication-Information)** à l'ERACOM.

## Règles du jeu

Le Jeu des Allumettes (aussi connu sous le nom de "Nim") est un jeu de stratégie pour deux joueurs :

1. Une pile d'allumettes est placée sur la table (21 par défaut)
2. À tour de rôle, chaque joueur retire **1, 2 ou 3 allumettes**
3. Le joueur qui prend la **dernière allumette perd** la partie

## Fonctionnalités

- **Deux modes de jeu** : Humain vs Humain ou Humain vs Robot
- **Robot intelligent** : utilise la stratégie gagnante mathématique
- **Personnalisation** : noms des joueurs et nombre d'allumettes (5-50)
- **Animations** : effets visuels de flammes et tombes
- **Historique** : visualisation de tous les coups joués
- **Rejouabilité** : rejouer avec les mêmes joueurs ou nouvelle configuration
- **Mode sans CSS** : désactivable pour des fins pédagogiques

## Structure du projet

```
heig-vd-msci-matches-webapp/
├── index.html      # Page principale (structure HTML)
├── style.css       # Styles et animations
├── script.js       # Logique du jeu
├── config.js       # Configuration (activer/désactiver CSS)
├── .github/
│   └── workflows/
│       └── deploy.yml   # CI/CD GitHub Pages
└── README.md       # Ce fichier
```

## Jouer localement

Aucune installation requise. Ouvrez simplement `index.html` dans un navigateur web.

```bash
# Cloner le projet
git clone https://github.com/heig-vd-msci-course/heig-vd-msci-matches-webapp.git
cd heig-vd-msci-matches-webapp

# Ouvrir dans le navigateur (macOS)
open index.html

# Ou avec un serveur local (optionnel)
python -m http.server 8000
# Puis ouvrir http://localhost:8000
```

## Configuration

Le fichier `config.js` permet de personnaliser le comportement du jeu :

```javascript
const CONFIG = {
    USE_CSS: true  // false = affichage brut sans styles
};
```

**Mode sans CSS** : Utile pour les exercices pédagogiques où les étudiants doivent écrire leur propre CSS.

## Stratégie gagnante du robot

Le robot utilise la stratégie mathématique optimale basée sur le **théorème de Sprague-Grundy** :

1. Toujours laisser un multiple de 4 allumettes à l'adversaire
2. Si impossible (déjà un multiple de 4), jouer aléatoirement

Exemple avec 21 allumettes :
- Robot retire 1 → reste 20 (multiple de 4)
- Adversaire retire 1-3 → reste 17-19
- Robot ajuste pour laisser 16, puis 12, 8, 4...
- Adversaire prend forcément la dernière

## Déploiement

### GitHub Pages (automatique)

Le projet inclut un workflow CI/CD qui déploie automatiquement sur GitHub Pages lors de la création d'un tag de version.

**Prérequis** : Activer GitHub Pages dans les paramètres du repo (Settings → Pages → Source: GitHub Actions)

```bash
# Créer et pousser un tag de version
git tag v1.0.0
git push origin v1.0.0
```

Le jeu sera accessible à : `https://heig-vd-msci-course.github.io/heig-vd-msci-matches-webapp/`

### Autres plateformes

Le projet étant 100% statique, il peut être déployé sur n'importe quel hébergeur :
- **Netlify** : Glisser-déposer le dossier
- **Vercel** : Connecter le repo GitHub
- **Serveur web** : Copier les fichiers sur Apache/Nginx

## Contexte pédagogique

Ce projet sert de **fil rouge** pendant la semaine MSCI :

| Jour | Utilisation |
|------|-------------|
| Lundi | Découverte des règles, stratégie gagnante sur papier |
| Mardi | Création de l'interface HTML/CSS |
| Jeudi | Version physique avec micro:bit |
| Vendredi | Personnalisation et intégration |

## Technologies

- **HTML5** : Structure sémantique
- **CSS3** : Flexbox, animations, transitions
- **JavaScript ES6** : Vanilla JS, manipulation DOM
- **GitHub Actions** : CI/CD automatisé

## Licence

Projet open source développé par la HEIG-VD pour le cours MSCI à l'ERACOM.
