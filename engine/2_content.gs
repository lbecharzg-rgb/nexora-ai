// ============================================================
// NEXORA AI — Script 2 : GÉNÉRATEUR DE CONTENU RÉSEAUX SOCIAUX
// Génère 7 posts/semaine pour chaque client et les envoie par email
// Déclencheur : chaque lundi à 8h
// ============================================================

function generateWeeklyContent() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Clients");
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    const [nom, entreprise, secteur, cible, ton, emailClient, actif] = data[i];
    if (actif !== "OUI") continue;

    const posts = generatePosts(entreprise, secteur, cible, ton);
    sendContentEmail(emailClient, entreprise, posts);

    Utilities.sleep(2000);
  }

  Logger.log("✅ Contenu hebdomadaire généré — " + new Date());
}

function generatePosts(entreprise, secteur, cible, ton) {
  const week = getWeekNumber();
  const templates = getTemplates(secteur);
  const posts = [];

  for (let day = 1; day <= 7; day++) {
    const template = templates[(week * 7 + day) % templates.length];
    const post = template
      .replace("{ENTREPRISE}", entreprise)
      .replace("{SECTEUR}", secteur)
      .replace("{CIBLE}", cible)
      .replace("{JOUR}", getDayName(day));

    posts.push({ day: getDayName(day), content: post, hashtags: getHashtags(secteur) });
  }

  return posts;
}

function getTemplates(secteur) {
  const base = [
    // Posts éducatifs
    "💡 Le saviez-vous ? 80% des clients choisissent le premier {SECTEUR} qui répond à leur demande. Chez {ENTREPRISE}, on répond en moins de 30 secondes, 7j/7. 🕐 Contactez-nous aujourd'hui !",
    "📊 Chiffre de la semaine : les entreprises qui automatisent leur service client voient +34% de nouveaux clients en 60 jours. {ENTREPRISE} a déjà franchi le cap. Et vous ? ✅",
    "🔥 Question du jour : votre business fonctionne-t-il pendant que vous dormez ? Chez {ENTREPRISE}, nos systèmes IA travaillent 24h/24 pour ne manquer aucune opportunité. 💼",
    "✅ 3 raisons de choisir {ENTREPRISE} :\n1️⃣ Réponse en moins de 30 secondes\n2️⃣ Disponible 24h/24, 7j/7\n3️⃣ Résultats mesurables dès le 1er mois",
    "💬 Témoignage client : « Depuis qu'on travaille avec {ENTREPRISE}, on ne perd plus aucun prospect. Nos revenus ont augmenté de 28% en 2 mois. » — Client satisfait ⭐⭐⭐⭐⭐",
    "🚀 Nouveauté cette semaine chez {ENTREPRISE} ! Nous venons d'améliorer notre système de prise de rendez-vous automatique. Encore plus rapide, encore plus simple pour vous. 📅",
    "🎯 Votre objectif pour cette semaine : ne manquer aucun client potentiel. Le nôtre : y veiller à votre place, 24h/24. {ENTREPRISE} — L'excellence au service de votre croissance.",
    // Posts engagement
    "❓ Sondage : Qu'est-ce qui vous prend le plus de temps dans votre business chaque semaine ?\nA) Répondre aux clients\nB) Trouver de nouveaux prospects\nC) Gérer l'administratif\nDites-nous en commentaire 👇",
    "🌟 Bonne semaine à tous ! Rappel : chaque prospect non contacté rapidement est un client perdu. {ENTREPRISE} s'assure qu'il n'y en ait plus aucun. 💪",
    "📱 Astuce du jour : vos clients vous cherchent le soir et le week-end. Êtes-vous disponible ? Avec {ENTREPRISE}, la réponse est toujours OUI. ✅",
  ];

  return base;
}

function getHashtags(secteur) {
  const tags = {
    "Immobilier": "#Immobilier #AgentImmobilier #AchatVente #InvestissementImmobilier #IA #Automatisation",
    "Santé / Médical": "#Santé #Médecin #Cabinet #RendezVous #IA #Automatisation",
    "Dentiste": "#Dentiste #SantéBuccale #Cabinet #IA #NouveauxPatients",
    "Avocat / Juridique": "#Avocat #Cabinet #DroitDesBusiness #IA #LegalTech",
    "Artisan / BTP": "#Artisan #BTP #Travaux #Renovation #IA #Devis",
    "Restauration / Hôtellerie": "#Restaurant #Gastronomie #ReservationEnLigne #IA",
    "E-commerce": "#Ecommerce #Boutique #Vente #Marketing #IA #Automation",
    "Coach / Formateur": "#Coaching #Formation #Entrepreneur #IA #Business",
  };
  return tags[secteur] || "#Business #IA #Croissance #Automatisation #Marketing";
}

function getDayName(day) {
  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  return days[day - 1];
}

function getWeekNumber() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  const week1 = new Date(d.getFullYear(), 0, 4);
  return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

function sendContentEmail(emailClient, entreprise, posts) {
  let html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#1e1b4b,#4c1d95);padding:24px;border-radius:12px 12px 0 0">
        <h2 style="color:white;margin:0">📱 Contenu Réseaux Sociaux — Semaine du ${getMonday()}</h2>
        <p style="color:#c4b5fd;margin:6px 0 0">7 posts prêts à publier pour ${entreprise}</p>
      </div>
      <div style="background:#f8faff;padding:20px">
  `;

  posts.forEach(post => {
    html += `
      <div style="background:white;border-radius:10px;padding:16px;margin-bottom:12px;border:1px solid #e5e7eb">
        <div style="font-weight:800;color:#4c1d95;margin-bottom:8px">📅 ${post.day}</div>
        <div style="font-size:14px;color:#374151;line-height:1.6;white-space:pre-line">${post.content}</div>
        <div style="margin-top:8px;font-size:11px;color:#7c3aed">${post.hashtags}</div>
      </div>
    `;
  });

  html += `
      <div style="background:#1e1b4b;border-radius:10px;padding:14px;text-align:center;margin-top:16px">
        <p style="color:#86efac;font-weight:700;margin:0">✅ Copiez-collez ces posts sur vos réseaux sociaux chaque jour</p>
        <p style="color:#a78bfa;font-size:12px;margin:6px 0 0">Généré automatiquement par NEXORA AI</p>
      </div>
      </div>
    </div>
  `;

  GmailApp.sendEmail(emailClient,
    "📱 Vos 7 posts réseaux sociaux — Semaine du " + getMonday() + " | " + entreprise,
    "Vos posts de la semaine sont prêts. Consultez la version HTML.",
    { htmlBody: html, name: "NEXORA AI — Content Bot" }
  );
}

function getMonday() {
  const d = new Date();
  const day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return monday.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}
