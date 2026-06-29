# NEXORA AI — Installation du moteur (10 minutes)

## Ce que tu vas installer
3 scripts Google Apps Script qui tournent automatiquement :
- Script 1 : Prospection & relances automatiques (chaque jour 9h)
- Script 2 : Génération contenu réseaux sociaux (chaque lundi 8h)
- Script 3 : Rapport hebdomadaire client (chaque vendredi 17h)

## Étapes

### 1. Crée le Google Sheet (2 min)
1. Va sur sheets.new (nouveau Google Sheet)
2. Renomme l'onglet 1 → "Prospects"
3. Ajoute ces colonnes en ligne 1 :
   Email | Nom | Entreprise | Niche | Ville | Langue | Statut | Date_Envoi | Nb_Relances

4. Crée un 2ème onglet → "Clients"
5. Colonnes ligne 1 :
   Nom | Entreprise | Secteur | Cible | Ton | Email_Client | Actif | Pack | Date_Debut

### 2. Ouvre Apps Script (1 min)
1. Dans le Google Sheet → Extensions → Apps Script
2. Supprime le code vide

### 3. Colle les scripts (3 min)
1. Fichier → Nouveau script → nomme "Prospecting" → colle 1_prospecting.gs
2. Fichier → Nouveau script → nomme "Content" → colle 2_content.gs
3. Fichier → Nouveau script → nomme "Reporting" → colle 3_reporting.gs

### 4. Configure les déclencheurs automatiques (3 min)
1. Apps Script → Déclencheurs (icône horloge gauche)
2. Ajouter déclencheur :
   - Fonction : sendColdEmails | Déclencheur basé sur le temps | Quotidien | 9h-10h
3. Ajouter déclencheur :
   - Fonction : generateWeeklyContent | Hebdomadaire | Lundi | 8h-9h
4. Ajouter déclencheur :
   - Fonction : sendWeeklyReports | Hebdomadaire | Vendredi | 17h-18h

### 5. Ajoute tes premiers prospects
Dans l'onglet "Prospects", ajoute ligne 2 :
info@sokoloff.ca | (vide) | Sokoloff Lawyers | Avocat | Toronto | EN | NOUVEAU | | 

### C'est tout. Le moteur tourne.
