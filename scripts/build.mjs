import { build } from 'vite'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

process.env.NODE_ENV = 'production'
await build()
await build({ build: { ssr: 'src/entry-server.jsx', outDir: 'artifacts/prerender', emptyOutDir: true } })
const { render } = await import(pathToFileURL(resolve('artifacts/prerender/entry-server.js')).href)
const template = await readFile('dist/index.html', 'utf8')
if (!template.includes('<div id="root"></div>')) throw new Error('Contêiner React não encontrado no HTML')
for (const route of ['login', 'cadastro']) {
  const title = route === 'login' ? 'Entrar' : 'Criar conta'
  const description = route === 'login'
    ? 'Entre na demonstração Acesso com seu cadastro local. Uma experiência de front-end com React e o mascote Broto.'
    : 'Crie uma conta local na demonstração Acesso e conheça as reações do Broto. Projeto de front-end com React.'
  const canonical = `https://tela-de-login-jet-seven.vercel.app/${route}`
  const page = template
    .replace('<div id="root"></div>', `<div id="root">${render('/' + route)}</div>`)
    .replace(/<title>[^<]*<\/title>/, `<title>${title} | Acesso</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, '$1' + description)
    .replace(/(<link rel="canonical" href=")[^"]*/, '$1' + canonical)
    .replace(/(<meta property="og:title" content=")[^"]*/, '$1' + title + ' | Acesso')
    .replace(/(<meta property="og:description" content=")[^"]*/, '$1' + description)
    .replace(/(<meta property="og:url" content=")[^"]*/, '$1' + canonical)
    .replace(/(<meta name="twitter:title" content=")[^"]*/, '$1' + title + ' | Acesso')
    .replace(/(<meta name="twitter:description" content=")[^"]*/, '$1' + description)
  await mkdir(`dist/${route}`, { recursive: true })
  await writeFile(`dist/${route}/index.html`, page)
}
console.log('HTML público de /login e /cadastro gerado; nenhum servidor necessário em produção.')
