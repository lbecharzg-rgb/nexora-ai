// ============================================================
// NEXORA AI — Script 1 : PROSPECTION AUTOMATIQUE
// Envoie les cold emails + gère les relances automatiquement
// Déclencheur : chaque jour à 9h
// ============================================================

const CONFIG = {
  SENDER_NAME: "Nexora AI",
  REPLY_TO: "lbecharzg@gmail.com",
  SHEET_NAME: "Prospects",  // Nom de l'onglet dans Google Sheets
};

// Liste des prospects (à compléter dans Google Sheets)
// Colonnes : Email | Nom | Entreprise | Niche | Ville | Langue | Statut | Date_Envoi | Nb_Relances
function sendColdEmails() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    const [email, nom, entreprise, niche, ville, langue, statut, dateEnvoi, nbRelances] = data[i];

    // Email 1 — Premier contact
    if (statut === "NOUVEAU") {
      const email1 = buildEmail1(nom, entreprise, niche, ville, langue);
      GmailApp.sendEmail(email, email1.subject, "", {
        htmlBody: email1.body,
        name: CONFIG.SENDER_NAME,
        replyTo: CONFIG.REPLY_TO
      });
      sheet.getRange(i + 1, 7).setValue("EMAIL_1_ENVOYÉ");
      sheet.getRange(i + 1, 8).setValue(new Date());
      Utilities.sleep(3000); // Pause 3s entre chaque envoi
    }

    // Relance 1 — Jour 4 sans réponse
    if (statut === "EMAIL_1_ENVOYÉ") {
      const daysSince = (new Date() - new Date(dateEnvoi)) / (1000 * 60 * 60 * 24);
      if (daysSince >= 4 && !hasReplied(email)) {
        const email2 = buildEmail2(nom, entreprise, niche, ville, langue);
        GmailApp.sendEmail(email, email2.subject, "", {
          htmlBody: email2.body,
          name: CONFIG.SENDER_NAME,
          replyTo: CONFIG.REPLY_TO
        });
        sheet.getRange(i + 1, 7).setValue("RELANCE_1_ENVOYÉE");
        sheet.getRange(i + 1, 8).setValue(new Date());
        sheet.getRange(i + 1, 9).setValue(1);
        Utilities.sleep(3000);
      }
    }

    // Relance 2 — Jour 9 sans réponse
    if (statut === "RELANCE_1_ENVOYÉE") {
      const daysSince = (new Date() - new Date(dateEnvoi)) / (1000 * 60 * 60 * 24);
      if (daysSince >= 9 && !hasReplied(email)) {
        const email3 = buildEmail3(nom, entreprise, niche, ville, langue);
        GmailApp.sendEmail(email, email3.subject, "", {
          htmlBody: email3.body,
          name: CONFIG.SENDER_NAME,
          replyTo: CONFIG.REPLY_TO
        });
        sheet.getRange(i + 1, 7).setValue("RELANCE_2_ENVOYÉE");
        sheet.getRange(i + 1, 8).setValue(new Date());
        sheet.getRange(i + 1, 9).setValue(2);
        Utilities.sleep(3000);
      }
    }

    // Email de rupture — Jour 16
    if (statut === "RELANCE_2_ENVOYÉE") {
      const daysSince = (new Date() - new Date(dateEnvoi)) / (1000 * 60 * 60 * 24);
      if (daysSince >= 16 && !hasReplied(email)) {
        const email4 = buildEmailRupture(nom, entreprise, niche, ville, langue);
        GmailApp.sendEmail(email, email4.subject, "", {
          htmlBody: email4.body,
          name: CONFIG.SENDER_NAME,
          replyTo: CONFIG.REPLY_TO
        });
        sheet.getRange(i + 1, 7).setValue("SÉQUENCE_TERMINÉE");
        sheet.getRange(i + 1, 8).setValue(new Date());
        Utilities.sleep(3000);
      }
    }

    // Marquer comme RÉPONDU si le prospect a répondu
    if (statut !== "RÉPONDU" && statut !== "CLIENT" && statut !== "SÉQUENCE_TERMINÉE") {
      if (hasReplied(email)) {
        sheet.getRange(i + 1, 7).setValue("RÉPONDU");
        notifyReply(email, nom, entreprise);
      }
    }
  }

  Logger.log("✅ Prospection terminée — " + new Date());
}

// Vérifie si le prospect a répondu dans Gmail
function hasReplied(prospectEmail) {
  const threads = GmailApp.search('from:' + prospectEmail + ' newer_than:30d');
  return threads.length > 0;
}

// Notification quand un prospect répond
function notifyReply(email, nom, entreprise) {
  GmailApp.sendEmail(CONFIG.REPLY_TO,
    "🔥 RÉPONSE PROSPECT — " + entreprise,
    nom + " de " + entreprise + " a répondu ! Email : " + email + "\n\nConnecte-toi à Gmail maintenant pour répondre.",
    { name: "NEXORA AI Bot" }
  );
}

// ---- TEMPLATES EMAIL PAR NICHE ----

function buildEmail1(nom, entreprise, niche, ville, langue) {
  if (langue === "EN") {
    return {
      subject: nom + ", your competitors are getting clients while you sleep",
      body: `<p>Hi ${nom},</p>
<p>I looked at <strong>${entreprise}</strong>'s online presence — great reputation, but when someone in ${ville} searches for a ${niche} at 10PM, nobody answers their questions on your site.</p>
<p>They call the next business in the morning.</p>
<p>At <strong>NEXORA AI</strong>, we install an AI system that responds to your prospects 24/7, qualifies them automatically, and books appointments directly in your calendar — no extra staff needed.</p>
<p>Our clients average <strong>+34% new customers in the first 60 days</strong>.</p>
<p>Worth 20 minutes this week to see a live demo?</p>
<p>— Nexora AI Team<br>contact@nexora-ai.com</p>`
    };
  }
  return {
    subject: nom + ", vos concurrents captent vos clients pendant que vous dormez",
    body: `<p>Bonjour ${nom},</p>
<p>J'ai analysé la présence en ligne de <strong>${entreprise}</strong> à ${ville} — excellente réputation, mais vos prospects qui vous cherchent à 22h ne trouvent personne pour répondre à leurs questions.</p>
<p>Résultat : ils contactent votre concurrent le lendemain matin.</p>
<p>Chez <strong>NEXORA AI</strong>, nous installons un agent IA qui répond 24h/24, qualifie vos prospects automatiquement et prend des rendez-vous dans votre agenda — sans recruter.</p>
<p>Nos clients voient en moyenne <strong>+34% de nouveaux clients dans les 60 premiers jours</strong>.</p>
<p>20 minutes cette semaine pour une démo en direct ?</p>
<p>— L'équipe Nexora AI<br>contact@nexora-ai.com</p>`
  };
}

function buildEmail2(nom, entreprise, niche, ville, langue) {
  if (langue === "EN") {
    return {
      subject: "Re: quick question " + nom,
      body: `<p>Hi ${nom},</p>
<p>I know you're busy — that's exactly what I solve.</p>
<p>Direct question: how many prospects contact ${entreprise} outside business hours and never get a response?</p>
<p>A similar business in ${ville} signed <strong>8 new clients in 30 days</strong> using our system — without hiring.</p>
<p>Want me to send a 3-minute video demo instead of a call?</p>
<p>— Nexora AI Team</p>`
    };
  }
  return {
    subject: "Re : une question rapide " + nom,
    body: `<p>Bonjour ${nom},</p>
<p>Je sais que vous êtes occupé — c'est exactement ce que je règle.</p>
<p>Question directe : combien de prospects contactent ${entreprise} en dehors des heures de bureau sans recevoir de réponse ?</p>
<p>Un business similaire au vôtre à ${ville} a signé <strong>8 nouveaux clients en 30 jours</strong> grâce à notre système — sans recruter.</p>
<p>Je vous envoie une vidéo de 3 minutes si vous préférez éviter un appel ?</p>
<p>— L'équipe Nexora AI</p>`
  };
}

function buildEmail3(nom, entreprise, niche, ville, langue) {
  if (langue === "EN") {
    return {
      subject: "What AI does for " + niche + "s in 2026 (concrete)",
      body: `<p>Hi ${nom},</p>
<p>Here's what we deploy for businesses like ${entreprise}:</p>
<ul>
  <li>AI agent answering clients 24/7</li>
  <li>Automatic appointment booking</li>
  <li>Weekly social media content generated automatically</li>
  <li>Weekly performance report sent to you automatically</li>
</ul>
<p>Starting at <strong>€997/month</strong>. Free audit — no commitment.</p>
<p>Available Thursday or Friday this week?</p>
<p>— Nexora AI Team</p>`
    };
  }
  return {
    subject: "Ce que l'IA fait pour votre secteur en 2026 (concret)",
    body: `<p>Bonjour ${nom},</p>
<p>Voici ce qu'on déploie concrètement pour des businesses comme ${entreprise} :</p>
<ul>
  <li>Agent IA qui répond à vos clients 24h/24</li>
  <li>Prise de rendez-vous automatique dans votre agenda</li>
  <li>Contenu réseaux sociaux généré automatiquement chaque semaine</li>
  <li>Rapport de performance envoyé automatiquement chaque semaine</li>
</ul>
<p>À partir de <strong>€997/mois</strong>. Audit gratuit — sans engagement.</p>
<p>Disponible jeudi ou vendredi cette semaine ?</p>
<p>— L'équipe Nexora AI</p>`
  };
}

function buildEmailRupture(nom, entreprise, niche, ville, langue) {
  if (langue === "EN") {
    return {
      subject: "Closing your file, " + nom,
      body: `<p>Hi ${nom},</p>
<p>I won't reach out again after this.</p>
<p>But in the time I've been writing to you, prospects searched for a ${niche} in ${ville} at night and found no one responding.</p>
<p>If you ever change your mind: contact@nexora-ai.com</p>
<p>All the best,<br>Nexora AI Team</p>`
    };
  }
  return {
    subject: "Je ferme votre dossier, " + nom,
    body: `<p>Bonjour ${nom},</p>
<p>Je ne vous contacte plus après ce message.</p>
<p>Mais pendant que je vous écrivais, des prospects cherchaient un ${niche} à ${ville} la nuit et ne trouvaient personne pour répondre.</p>
<p>Si vous changez d'avis un jour : contact@nexora-ai.com</p>
<p>Bonne continuation,<br>L'équipe Nexora AI</p>`
  };
}
