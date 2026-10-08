import { readFile, mkdir, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'

const project = new URL('../', import.meta.url)
const dataUrl = async (path, type) => `data:${type};base64,${(await readFile(new URL(path, project))).toString('base64')}`
const assets = {
  inter: await dataUrl('node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2', 'font/woff2'),
  jakarta: await dataUrl('node_modules/@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-600-normal.woff2', 'font/woff2'),
  broto: await dataUrl('public/broto/idle.webp', 'image/webp'),
  logo: await readFile(new URL('public/favicon.svg', project), 'utf8'),
}
const template = await readFile(new URL('scripts/social-image.html', project), 'utf8')
const html = template.replace(/\{\{(\w+)\}\}/g, (_placeholder, key) => assets[key])
const destination = fileURLToPath(new URL('public/social/acesso-broto-v1.png', project))
await mkdir(new URL('public/social/', project), { recursive: true })
const browser = await chromium.launch({
  ...(process.env.AUDIT_BROWSER_PATH
    ? { executablePath: process.env.AUDIT_BROWSER_PATH }
    : { channel: process.env.AUDIT_BROWSER || 'msedge' }),
  headless: true,
})
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
  await page.setContent(html)
  await page.locator('body').evaluate(async (body) => {
    await body.ownerDocument.fonts.ready
    await Promise.all([...body.querySelectorAll('img')].map(image => image.decode()))
  })
  await page.screenshot({ path: destination, type: 'png' })
  console.log(`Capa social 1200 × 630: ${destination} (${(await stat(destination)).size} bytes)`)
} finally {
  await browser.close()
}
