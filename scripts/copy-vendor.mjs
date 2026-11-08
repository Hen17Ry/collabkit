// Copie les bibliothèques d'export du studio dans public/ pour les servir nous-mêmes (pas de CDN).
import { copyFileSync, mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

const require = createRequire(import.meta.url)
const out = 'public/vendor'
mkdirSync(out, { recursive: true })

const files = [
  ['html2canvas', 'dist/html2canvas.min.js', 'html2canvas.min.js'],
  ['jspdf', 'dist/jspdf.umd.min.js', 'jspdf.umd.min.js']
]
for (const [pkg, rel, name] of files) {
  const root = dirname(require.resolve(pkg + '/package.json'))
  copyFileSync(join(root, rel), join(out, name))
}
console.log('vendor copié dans', out)
