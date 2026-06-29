// ============================================================
// NEXORA AI — Script 0 : CRÉATION AUTOMATIQUE DU SHEET
// Lance ce script UNE SEULE FOIS pour tout configurer
// ============================================================

function setupNexoraSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // ---- ONGLET PROSPECTS ----
  let prospects = ss.getSheetByName("Prospects");
  if (!prospects) prospects = ss.insertSheet("Prospects");
  prospects.clearContents();

  // En-têtes
  const prospectHeaders = ["Email", "Nom", "Entreprise", "Niche", "Ville", "Langue", "Statut", "Date_Envoi", "Nb_Relances"];
  prospects.getRange(1, 1, 1, prospectHeaders.length).setValues([prospectHeaders]);
  prospects.getRange(1, 1, 1, prospectHeaders.length)
    .setBackground("#1e1b4b").setFontColor("#ffffff").setFontWeight("bold");

  // 7 Prospects réels déjà trouvés
  const prospectData = [
    ["info@sokoloff.ca",                                    "",        "Sokoloff Lawyers",                      "Avocat",     "Toronto",  "EN", "NOUVEAU", "", ""],
    ["marc.spivak@devrylaw.ca",                             "Marc",    "Devry Smith Frank LLP",                 "Avocat",     "Toronto",  "EN", "NOUVEAU", "", ""],
    ["contact.paris12@dentego.fr",                          "",        "Dentego Paris 12",                      "Dentiste",   "Paris",    "FR", "NOUVEAU", "", ""],
    ["contact@cabinetdechirurgiedentaireduparclyon6.fr",    "",        "Cabinet Dentaire du Parc Lyon 6",       "Dentiste",   "Lyon",     "FR", "NOUVEAU", "", ""],
    ["contact@leggett-immobilier.fr",                       "",        "Leggett Immobilier",                    "Immobilier", "France",   "FR", "NOUVEAU", "", ""],
    ["info@trevi.be",                                       "",        "TREVI",                                 "Immobilier", "Bruxelles","EN", "NOUVEAU", "", ""],
    ["contact@immobilieredefrance.com",                     "",        "Immobilière de France",                 "Immobilier", "France",   "FR", "NOUVEAU", "", ""],
  ];
  prospects.getRange(2, 1, prospectData.length, 9).setValues(prospectData);

  // Style colonnes
  prospects.setColumnWidth(1, 320);
  prospects.setColumnWidth(3, 220);
  prospects.setColumnWidth(7, 160);
  prospects.setFrozenRows(1);

  // Validation statut
  const statutRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["NOUVEAU","EMAIL_1_ENVOYÉ","RELANCE_1_ENVOYÉE","RELANCE_2_ENVOYÉE","RÉPONDU","CLIENT","SÉQUENCE_TERMINÉE"])
    .build();
  prospects.getRange("G2:G1000").setDataValidation(statutRule);

  // Colorer les lignes par statut
  prospects.getRange(2, 1, prospectData.length, 9).setBackground("#f0fdf4");

  // ---- ONGLET CLIENTS ----
  let clients = ss.getSheetByName("Clients");
  if (!clients) clients = ss.insertSheet("Clients");
  clients.clearContents();

  const clientHeaders = ["Nom", "Entreprise", "Secteur", "Cible", "Ton", "Email_Client", "Actif", "Pack", "Date_Debut"];
  clients.getRange(1, 1, 1, clientHeaders.length).setValues([clientHeaders]);
  clients.getRange(1, 1, 1, clientHeaders.length)
    .setBackground("#14532d").setFontColor("#ffffff").setFontWeight("bold");

  clients.setColumnWidth(2, 200);
  clients.setColumnWidth(4, 250);
  clients.setColumnWidth(6, 220);
  clients.setFrozenRows(1);

  // Exemple client (à remplacer par tes vrais clients)
  clients.getRange(2, 1, 1, 9).setValues([[
    "Jean", "Cabinet Exemple", "Avocat", "Particuliers victimes d'accidents", "Professionnel et formel",
    "client@exemple.com", "NON", "Full IA - €4997/mois", ""
  ]]);

  // ---- ONGLET DASHBOARD ----
  let dashboard = ss.getSheetByName("Dashboard");
  if (!dashboard) dashboard = ss.insertSheet("Dashboard");
  dashboard.clearContents();

  dashboard.getRange("A1").setValue("🚀 NEXORA AI — Dashboard").setFontSize(18).setFontWeight("bold").setFontColor("#4c1d95");
  dashboard.getRange("A2").setValue("Mis à jour automatiquement").setFontColor("#6b7280");

  dashboard.getRange("A4").setValue("PROSPECTS").setFontWeight("bold").setBackground("#ede9fe");
  dashboard.getRange("A5").setValue("Total prospects").setFontColor("#374151");
  dashboard.getRange("B5").setFormula("=COUNTA(Prospects!A2:A1000)");
  dashboard.getRange("A6").setValue("Nouveaux").setFontColor("#374151");
  dashboard.getRange("B6").setFormula("=COUNTIF(Prospects!G2:G1000,\"NOUVEAU\")");
  dashboard.getRange("A7").setValue("Ont répondu").setFontColor("#374151");
  dashboard.getRange("B7").setFormula("=COUNTIF(Prospects!G2:G1000,\"RÉPONDU\")");
  dashboard.getRange("A8").setValue("Devenus clients").setFontColor("#374151");
  dashboard.getRange("B8").setFormula("=COUNTIF(Prospects!G2:G1000,\"CLIENT\")");
  dashboard.getRange("A10").setValue("CLIENTS ACTIFS").setFontWeight("bold").setBackground("#dcfce7");
  dashboard.getRange("A11").setValue("Nombre clients").setFontColor("#374151");
  dashboard.getRange("B11").setFormula("=COUNTIF(Clients!G2:G1000,\"OUI\")");
  dashboard.getRange("A12").setValue("Revenus mensuels estimés").setFontColor("#374151");
  dashboard.getRange("B12").setFormula("=COUNTIF(Clients!G2:G1000,\"OUI\")*2497").setNumberFormat("€#,##0");

  dashboard.setColumnWidth(1, 220);
  dashboard.setColumnWidth(2, 150);

  // ---- SUPPRIMER onglet vide "Feuille 1" ----
  try {
    const feuille1 = ss.getSheetByName("Feuille 1") || ss.getSheetByName("Sheet1");
    if (feuille1 && ss.getSheets().length > 3) ss.deleteSheet(feuille1);
  } catch(e) {}

  // ---- MESSAGE FINAL ----
  SpreadsheetApp.getUi().alert(
    "✅ NEXORA AI — Setup terminé !\n\n" +
    "3 onglets créés :\n" +
    "• Prospects — 7 vrais prospects déjà ajoutés\n" +
    "• Clients — prêt pour tes premiers clients\n" +
    "• Dashboard — stats en temps réel\n\n" +
    "Prochaine étape : colle les scripts 1, 2 et 3\npuis configure les déclencheurs automatiques."
  );

  Logger.log("✅ Sheet NEXORA AI configuré — " + new Date());
}
