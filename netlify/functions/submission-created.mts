/**
 * Déclenché à la réception d'une soumission Netlify Forms.
 *
 * Netlify recommande désormais le handler typé `formSubmitted`
 * (événement plateforme `submission_created`). Le nom de fichier
 * `submission-created` reste supporté en convention héritée.
 *
 * @see https://docs.netlify.com/functions/trigger-on-events/
 */

type FormData = {
  nom?: string;
  entreprise?: string;
  courriel?: string;
  telephone?: string;
  sujet?: string;
  message?: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function textOrDash(value: string | undefined): string {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : "-";
}

function buildEmailShell(options: {
  title: string;
  preheader: string;
  logoUrl: string | null;
  bodyHtml: string;
}): string {
  const { title, preheader, logoUrl, bodyHtml } = options;
  const logoBlock = logoUrl
    ? `<tr>
        <td align="center" style="padding:0 0 24px;">
          <img src="${escapeHtml(logoUrl)}" width="140" alt="APDM" style="display:block;width:140px;height:auto;border:0;" />
        </td>
      </tr>`
    : `<tr>
        <td align="center" style="padding:0 0 24px;font-family:Georgia,'Times New Roman',serif;font-size:28px;color:#3F3D56;">
          APDM
        </td>
      </tr>`;

  return `<!DOCTYPE html>
<html lang="fr-CA">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#EBE7F5;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    ${escapeHtml(preheader)}
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#EBE7F5;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background-color:#FFFBFE;border:3px solid #3F3D56;">
          <tr>
            <td style="padding:32px 28px;font-family:Arial,Helvetica,sans-serif;color:#3F3D56;">
              ${logoBlock}
              ${bodyHtml}
            </td>
          </tr>
        </table>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
          <tr>
            <td align="center" style="padding:18px 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#3F3D56;">
              APDM · Montréal, Québec · <a href="mailto:info@apdmdistribution.com" style="color:#8F84B8;">info@apdmdistribution.com</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildNotificationEmail(data: FormData, logoUrl: string | null) {
  const nom = textOrDash(data.nom);
  const entreprise = textOrDash(data.entreprise);
  const courriel = textOrDash(data.courriel);
  const telephone = textOrDash(data.telephone);
  const sujet = textOrDash(data.sujet);
  const message = textOrDash(data.message);

  const rows = [
    ["Nom", nom],
    ["Entreprise", entreprise],
    ["Courriel", courriel],
    ["Téléphone", telephone],
    ["Sujet", sujet],
  ]
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #3F3D5640;font-size:13px;font-weight:700;width:120px;vertical-align:top;">${escapeHtml(label)}</td>
        <td style="padding:8px 0;border-bottom:1px solid #3F3D5640;font-size:14px;vertical-align:top;">${escapeHtml(value)}</td>
      </tr>`,
    )
    .join("");

  const html = buildEmailShell({
    title: `Nouvelle demande - ${sujet}`,
    preheader: `Message de ${nom} : ${sujet}`,
    logoUrl,
    bodyHtml: `
      <h1 style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:400;color:#3F3D56;line-height:1.15;">
        Nouvelle demande de contact
      </h1>
      <p style="margin:0 0 22px;font-size:14px;line-height:1.5;">
        Une personne a rempli le formulaire sur le site APDM.
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        ${rows}
      </table>
      <p style="margin:22px 0 8px;font-size:13px;font-weight:700;">Message</p>
      <div style="padding:14px 16px;border:2px solid #3F3D56;border-radius:8px;background:#FFFFFF;font-size:14px;line-height:1.55;white-space:pre-wrap;">
${escapeHtml(message)}
      </div>
      <p style="margin:22px 0 0;font-size:13px;">
        Répondez directement à ce courriel pour joindre
        <a href="mailto:${escapeHtml(courriel)}" style="color:#8F84B8;">${escapeHtml(courriel)}</a>.
      </p>
    `,
  });

  const text = [
    "Nouvelle demande de contact - APDM",
    "",
    `Nom : ${nom}`,
    `Entreprise : ${entreprise}`,
    `Courriel : ${courriel}`,
    `Téléphone : ${telephone}`,
    `Sujet : ${sujet}`,
    "",
    "Message :",
    message,
  ].join("\n");

  return { html, text, subject: `[APDM] ${sujet} - ${nom}` };
}

function buildConfirmationEmail(data: FormData, logoUrl: string | null) {
  const nom = textOrDash(data.nom);
  const sujet = textOrDash(data.sujet);
  const message = textOrDash(data.message);
  const greetingName = data.nom?.trim() || "bonjour";

  const html = buildEmailShell({
    title: "Merci, on a bien reçu votre message",
    preheader: "Merci, on a bien reçu votre message. On vous revient sous 48 h.",
    logoUrl,
    bodyHtml: `
      <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#8F84B8;">
        Message reçu
      </p>
      <h1 style="margin:0 0 12px;font-family:Georgia,'Times New Roman',serif;font-size:30px;font-weight:400;color:#3F3D56;line-height:1.15;">
        Merci, on a bien reçu votre message
      </h1>
      <p style="margin:0 0 18px;font-size:15px;line-height:1.55;">
        Bonjour ${escapeHtml(greetingName)}, merci de nous avoir écrit. Notre équipe vous revient sous 48 h.
      </p>
      <p style="margin:0 0 8px;font-size:13px;font-weight:700;">Rappel de votre demande</p>
      <p style="margin:0 0 6px;font-size:14px;"><strong>Sujet :</strong> ${escapeHtml(sujet)}</p>
      <div style="padding:14px 16px;border:2px solid #3F3D56;border-radius:8px;background:#FFFFFF;font-size:14px;line-height:1.55;white-space:pre-wrap;">
${escapeHtml(message)}
      </div>
      <p style="margin:22px 0 0;font-size:14px;line-height:1.5;">
        À bientôt,<br />
        <strong style="color:#8F84B8;">L'équipe APDM</strong>
      </p>
    `,
  });

  const text = [
    "Merci, on a bien reçu votre message",
    "",
    `Bonjour ${greetingName},`,
    "",
    "Merci de nous avoir écrit. Notre équipe vous revient sous 48 h.",
    "",
    `Sujet : ${sujet}`,
    "",
    "Votre message :",
    message,
    "",
    "À bientôt,",
    "L'équipe APDM",
  ].join("\n");

  return {
    html,
    text,
    subject: "Merci, on a bien reçu votre message - APDM",
  };
}

async function sendResendEmail(options: {
  apiKey: string;
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
}) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${options.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: options.from,
      to: [options.to],
      reply_to: options.replyTo || undefined,
      subject: options.subject,
      html: options.html,
      text: options.text,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Resend ${response.status}: ${details}`);
  }
}

export default {
  async formSubmitted(event: { data: FormData }) {
    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL;
    const fromEmail = process.env.CONTACT_FROM_EMAIL;
    const siteUrl = process.env.SITE_URL?.replace(/\/$/, "") || "";
    const logoUrl = siteUrl ? `${siteUrl}/apdm-logo.png` : null;

    if (!apiKey || !toEmail || !fromEmail) {
      throw new Error(
        "Variables manquantes : RESEND_API_KEY, CONTACT_TO_EMAIL et CONTACT_FROM_EMAIL sont requis.",
      );
    }

    const data = event.data || {};
    const visitorEmail = data.courriel?.trim();

    const notification = buildNotificationEmail(data, logoUrl);
    await sendResendEmail({
      apiKey,
      from: fromEmail,
      to: toEmail,
      replyTo: visitorEmail || undefined,
      subject: notification.subject,
      html: notification.html,
      text: notification.text,
    });

    if (visitorEmail) {
      const confirmation = buildConfirmationEmail(data, logoUrl);
      await sendResendEmail({
        apiKey,
        from: fromEmail,
        to: visitorEmail,
        subject: confirmation.subject,
        html: confirmation.html,
        text: confirmation.text,
      });
    }
  },
};
