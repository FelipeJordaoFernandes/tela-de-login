import fs from 'node:fs/promises'
import { createServer } from 'node:net'
import lighthouse from 'lighthouse'
import { chromium } from 'playwright-core'
import desktopConfig from 'lighthouse/core/config/desktop-config.js'

const base = (process.env.AUDIT_URL || 'http://127.0.0.1:4173').replace(/\/$/, '')
const phase = process.env.AUDIT_PHASE || 'final'
const repetitions = Number(process.env.AUDIT_RUNS || 3)
const routes = (process.env.AUDIT_ROUTES || 'login,cadastro').split(',')
const modes = (process.env.AUDIT_MODES || 'mobile,desktop').split(',')
if (!/^[a-z0-9-]+$/.test(phase)) throw new Error('AUDIT_PHASE deve conter letras minúsculas, números ou hifens.')
if (!Number.isInteger(repetitions) || repetitions < 1) throw new Error('AUDIT_RUNS deve ser um inteiro positivo.')
if (routes.some(route => !['login', 'cadastro'].includes(route))) throw new Error('Rotas aceitas: login,cadastro.')
if (modes.some(mode => !['mobile', 'desktop'].includes(mode))) throw new Error('Modos aceitos: mobile,desktop.')

const destination = `artifacts/lighthouse/${phase}`
await fs.mkdir(destination, { recursive: true })
const results = []
const metricNames = ['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift', 'speed-index']
const portServer = createServer()
await new Promise(resolve => portServer.listen(0, '127.0.0.1', resolve))
const debuggingPort = portServer.address().port
await new Promise(resolve => portServer.close(resolve))

for (const route of routes) {
  for (const mode of modes) {
    for (let run = 1; run <= repetitions; run++) {
      const chrome = await chromium.launch({
        ...(process.env.AUDIT_BROWSER_PATH
          ? { executablePath: process.env.AUDIT_BROWSER_PATH }
          : { channel: process.env.AUDIT_BROWSER || 'msedge' }),
        headless: true,
        args: [`--remote-debugging-port=${debuggingPort}`],
      })
      try {
        const { lhr, report } = await lighthouse(`${base}/${route}`, {
          port: debuggingPort,
          output: ['json', 'html'],
          logLevel: 'error',
          onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
          locale: 'pt-BR',
        }, mode === 'desktop' ? desktopConfig : undefined)
        if (lhr.runtimeError) throw new Error(JSON.stringify(lhr.runtimeError))

        const prefix = `${destination}/${route}-${mode}-${run}`
        await fs.writeFile(prefix + '.json', report[0])
        await fs.writeFile(prefix + '.html', report[1])
        const failures = Object.values(lhr.audits)
          .filter(audit => audit.score !== null && audit.score < 1 && audit.scoreDisplayMode !== 'informative')
          .map(audit => ({
            id: audit.id, title: audit.title, score: audit.score,
            display: audit.displayValue, description: audit.description, details: audit.details,
          }))
        const entry = {
          route, mode, run,
          scores: Object.fromEntries(Object.entries(lhr.categories).map(([key, value]) => [key, Math.round(value.score * 100)])),
          version: lhr.lighthouseVersion,
          checkedAt: lhr.fetchTime,
          metrics: Object.fromEntries(metricNames.map(key => [key, lhr.audits[key].numericValue])),
          failures,
        }
        results.push(entry)
        await fs.writeFile(`${destination}/summary.json`, JSON.stringify({ base, phase, results }, null, 2))
        console.log(JSON.stringify({ ...entry, failures: failures.map(({ id, title, display }) => ({ id, title, display })) }))
      } finally {
        await chrome.close()
      }
    }
  }
}
