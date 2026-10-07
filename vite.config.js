import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), {
    name: 'public-pages-preview',
    configurePreviewServer(server) {
      server.middlewares.use((request, _response, next) => {
        const url = new URL(request.url, 'http://localhost')
        if (['/login', '/cadastro'].includes(url.pathname)) request.url = `${url.pathname}/index.html${url.search}`
        next()
      })
    },
  }, {
    name: 'inline-small-styles',
    apply: (config, { command }) => command === 'build' && !config.build?.ssr,
    generateBundle: {
      order: 'post',
      handler(_options, bundle) {
        const html = bundle['index.html']
        if (!html || html.type !== 'asset') throw new Error('HTML de entrada não encontrado')
        html.source = String(html.source).replace(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g, (_tag, href) => {
          const asset = bundle[href.replace(/^\//, '')]
          if (!asset || asset.type !== 'asset') throw new Error(`CSS não encontrado: ${href}`)
          return `<style>${String(asset.source)}</style>`
        })
      },
    },
  }],
})
