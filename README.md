# Lootopia Frontend

## Table des matières

- [Lootopia Frontend](#lootopia-frontend)
  - [Table des matières](#table-des-matières)
  - [Description](#description)
    - [Présentation](#présentation)
    - [Architecture](#architecture)
    - [Accès au projet](#accès-au-projet)
    - [Equipe](#equipe)
    - [Ressources](#ressources)
      - [Documentation](#documentation)
      - [Repositories](#repositories)
  - [Installation](#installation)
    - [Prérequis](#prérequis)
      - [NodeJS](#nodejs)
      - [Angular CLI](#angular-cli)
    - [Cloner le repository](#cloner-le-repository)
    - [Lancer le projet](#lancer-le-projet)
    - [Build le projet](#build-le-projet)

## Description

### Présentation

Lootopia est un projet de fin d'année Dev Fullstack en Mastère deuxième année chez Sup De Vinci.

Il s'agit d'une application de chasse aux trésors en ligne, où les utilisateurs peuvent créer des chasses aux trésors et les partager avec d'autres utilisateurs. L'application mobile aura des capacités de réalité augmentée et des fonctionalités de géolocalisation pour améliorer l'expérience utilisateur, ainsi qu'une implémentation blockchain pour la gestion des objets et récompenses.

Ce repository contient le code du frontend Angular.

### Architecture

Le projet est divisé en cinq parties :

- Frontend : Angular
- Backoffice : Angular
- Backend : Spring Boot
- Base de données : PostgreSQL
- Application mobile : Angulat Capacitor et AR.js

### Accès au projet

Le projet est hébergé sur un serveur dédié et est accessible en ligne.
Vous pourrez accéder au frontend en production à l'adresse suivante : `https://lootopia.mmorgat.com/`.
Vous pourrez accéder au frontend en staging à l'adresse suivante : `https://staging-lootopia.mmorgat.com/`.
Vous pourrez également accéder à l'API Swagger à l'adresse suivante : `https://backlootopia.mmorgat.com/swagger-ui/index.html`.

### Equipe

L'équipe est composée de trois membres :

- Marine DENIS
- Souria-Ranjinie VINGADASSAMY
- Mathieu MORGAT

### Ressources

#### Documentation

Toute la documentation du projet est disponible dans un lien google drive : [Lien Documentation](https://drive.google.com/drive/folders/1xVQSaZSVBe1W5JTZcPoeeWkb2J60bivi)
Le figma du projet est disponible ici : [Lien Figma](https://www.figma.com/design/Ys6iaz1fY7wc9lTWZg9ZFK/Desktop?node-id=0-1&p=f&t=I0IknLldpDfRH6vj-0)
Le Jira du projet est disponible ici : [Lien Jira](https://lootopiaa.atlassian.net/jira/software/projects/LOO/boards/1)

#### Repositories

- [Lootopia Backend](https://github.com/DenisMarine/lootopia)
- [Lootopia Frontend](https://github.com/Ranjinie-Souria/Lootopia-Front)
- [Lootopia Backoffice](https://github.com/Ranjinie-Souria/Lootopia-Backoffice)
- Lootopia Mobile (Pas encore disponible)
- Lootopia Unity (Pas encore disponible)

## Installation

### Prérequis

Veuillez vous assurer d'avoir installé les prérequis suivants :

#### NodeJS

Pour le bon fonctionnement du projet, il est nécessaire d'avoir installé NodeJS sur votre machine. Vous pouvez le télécharger à l'adresse suivante : [NodeJS](https://nodejs.org/en/download/).

#### Angular CLI

Assurez vous ensuite d'avoir installé globalement angular CLI :

```bash
npm install -g @angular/cli
```

### Cloner le repository

Pour cloner le repository, utilisez la commande suivante :

```bash
git clone git@github.com:Ranjinie-Souria/Lootopia-Front.git
```

Ensuite, rendez-vous dans le dossier du projet :

```bash
cd Lootopia-Front
```

Puis installez les dépendances du projet :

```bash
npm i
```

### Lancer le projet

Pour lancer le serveur de développement, veuillez utiliser la commande suivante :

```bash
npm run start
```

Le serveur sera disponible sur l'adresse `http://localhost:4200/`.

### Build le projet

Pour build le project, utiliser :

```bash
ng build
```

Cette commande compilera le projet et il sera accessible dans `dist/`.
