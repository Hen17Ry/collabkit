import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  components: [{ path: '~/components', pathPrefix: false }],
  vite: { plugins: [tailwindcss()] },

  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      title: 'Ton Media Kit · Prêt en dix minutes, sans page blanche',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#6D071A' },
        { name: 'description', content: "Le media kit qu'une marque te réclame, prêt en dix minutes. Une initiative de Lys Sama, prolongement de la série Du Lab à la Collab." }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/brand/lab.png' }
      ]
    }
  },

  runtimeConfig: {
    kkiapayPrivateKey: '',
    kkiapaySecretKey: '',
    kkiapayWebhookSecret: '',
    // envoi des emails par SMTP (Gmail : smtp.gmail.com, port 465, mot de passe d'application)
    smtpHost: '',
    smtpPort: 465,
    smtpUser: '',
    smtpPass: '',
    mailFrom: '',
    public: {
      siteUrl: 'http://localhost:3000',
      // prix normal, et prix de lancement valable jusqu'à promoUntil (heure de Cotonou)
      priceFcfa: 5000,
      promoPriceFcfa: 3500,
      promoUntil: '2027-01-01T00:00:00+01:00',
      kkiapayPublicKey: '',
      kkiapaySandbox: true,
      // Paiement simulé : uniquement en développement, ignoré en production.
      fakePayment: false,
      brand: {
        nom: 'Lys Sama',
        serie: 'Du Lab à la Collab',
        wa: 'https://wa.me/message/3DGSJLQTTUPTA1',
        ig: 'https://www.instagram.com/lys__sama/'
      }
    }
  },

  nitro: {
    // fichiers locaux par défaut ; Upstash Redis branché au démarrage si configuré (server/plugins/storage.ts)
    storage: { db: { driver: 'fs', base: './.data/db' } },
    serverAssets: [{ baseName: 'studio', dir: './studio' }]
  }
})
