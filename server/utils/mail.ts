import { Resend } from 'resend'
import { mkdir, writeFile } from 'node:fs/promises'

type Attachment = { filename: string, content: Buffer }
type Mail = { to: string, subject: string, html: string, text: string, attachments?: Attachment[] }

/**
 * Envoie un email via Resend.
 * Sans clé Resend en développement, l'email est déposé dans .data/outbox pour pouvoir le relire.
 */
export async function sendMail(m: Mail) {
  const c = useRuntimeConfig()
  if (!c.resendApiKey) {
    if (!import.meta.dev) throw createError({ statusCode: 500, statusMessage: 'Envoi d\'email non configuré' })
    const dir = '.data/outbox'
    await mkdir(dir, { recursive: true })
    const stamp = new Date().toISOString().replace(/[:.]/g, '-')
    await writeFile(`${dir}/${stamp}.html`, `<!-- to: ${m.to} | ${m.subject} -->\n${m.html}`)
    for (const a of m.attachments || []) await writeFile(`${dir}/${stamp}-${a.filename}`, a.content)
    console.info(`[mail] (dev) « ${m.subject} » → ${m.to} · déposé dans ${dir}`)
    return { id: 'dev-' + stamp }
  }
  const resend = new Resend(c.resendApiKey)
  const { data, error } = await resend.emails.send({
    from: c.mailFrom,
    to: m.to,
    subject: m.subject,
    html: m.html,
    text: m.text,
    attachments: m.attachments?.map(a => ({ filename: a.filename, content: a.content }))
  })
  if (error) {
    console.error('[mail] Resend', error)
    throw createError({ statusCode: 502, statusMessage: 'L\'email n\'a pas pu partir' })
  }
  return data
}

const esc = (s: string) => s.replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]!))

/** Gabarit commun aux emails, aux couleurs de l'outil. */
function layout(o: { preheader: string, kicker: string, title: string, body: string, cta?: { href: string, label: string }, foot?: string }) {
  const site = useRuntimeConfig().public.siteUrl.replace(/\/$/, '')
  const brand = useRuntimeConfig().public.brand
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(o.title)}</title></head>
<body style="margin:0;background:#F7F5F3;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;color:#1E1B1C">
<span style="display:none!important;opacity:0;color:transparent;height:0;width:0;overflow:hidden">${esc(o.preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F5F3;padding:32px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
<tr><td style="padding:0 6px 18px"><img src="${site}/brand/lab.png" alt="Du Lab à la Collab" height="52" style="display:block;height:52px;width:auto"></td></tr>
<tr><td style="background:#ffffff;border-radius:6px 28px 28px 28px;padding:34px 30px;box-shadow:0 10px 30px rgba(28,34,74,.08)">
<p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#6D071A">${esc(o.kicker)}</p>
<h1 style="margin:0 0 16px;font-family:'Playfair Display',Georgia,serif;font-size:28px;line-height:1.15;color:#111111">${o.title}</h1>
<div style="font-size:15.5px;line-height:1.6;color:#3a3436">${o.body}</div>
${o.cta ? `<p style="margin:26px 0 6px"><a href="${o.cta.href}" style="display:inline-block;background:#6D071A;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 26px;border-radius:99px">${esc(o.cta.label)}</a></p>
<p style="margin:10px 0 0;font-size:12px;color:#7C7478;word-break:break-all">Ou copie ce lien : ${o.cta.href}</p>` : ''}
</td></tr>
<tr><td style="padding:20px 8px;font-size:12.5px;line-height:1.5;color:#7C7478">${o.foot || ''}
Collab Kit, le prolongement de la série « ${esc(brand.serie)} » de ${esc(brand.nom)}.<br>Une question ? Réponds simplement à cet email ou écris sur WhatsApp.</td></tr>
</table></td></tr></table></body></html>`
}

export function accessEmail(name: string, link: string) {
  const first = esc(name.split(' ')[0] || name)
  return {
    subject: 'Ton accès à Collab Kit',
    html: layout({
      preheader: 'Ton lien personnel pour créer et modifier ton media kit.',
      kicker: 'Paiement confirmé',
      title: `Bienvenue ${first}, ton studio t'attend.`,
      body: `<p style="margin:0 0 12px">Merci pour ta confiance. Ton paiement est bien reçu.</p>
<p style="margin:0">Voici ton lien personnel. Garde cet email : il te permet de revenir modifier ton media kit quand tu veux, depuis n'importe quel téléphone ou ordinateur.</p>`,
      cta: { href: link, label: 'Ouvrir mon studio' },
      foot: 'Ce lien est personnel, ne le partage pas.<br>'
    }),
    text: `Bienvenue ${name} ! Ton paiement est bien reçu.\n\nTon lien personnel pour créer et modifier ton media kit :\n${link}\n\nGarde cet email, il te permet de revenir quand tu veux.`
  }
}

export function kitEmail(name: string, link: string, filename: string) {
  const first = esc(name.split(' ')[0] || name)
  return {
    subject: 'Ton media kit est prêt',
    html: layout({
      preheader: 'Ton media kit en PDF, prêt à envoyer à une marque.',
      kicker: "C'est prêt",
      title: `${first}, ton media kit est en pièce jointe.`,
      body: `<p style="margin:0 0 12px">Tu trouveras <b>${esc(filename)}</b> joint à cet email. Les icônes et les liens restent cliquables dans le fichier.</p>
<p style="margin:0">Envoie-le en pièce jointe à la marque, ou dépose le lien du PDF dans ta bio. Pour le mettre à jour (nouveaux chiffres, nouvelle collab), reviens dans ton studio.</p>`,
      cta: { href: link, label: 'Modifier mon media kit' }
    }),
    text: `${name}, ton media kit est en pièce jointe (${filename}).\n\nPour le modifier : ${link}`
  }
}
