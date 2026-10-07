import {chromium} from 'playwright-core'
import AxeBuilder from '@axe-core/playwright'
import assert from 'node:assert/strict'
import {mkdir,writeFile} from 'node:fs/promises'

const base=process.env.AUDIT_URL||'http://127.0.0.1:4173'
const browser=await chromium.launch({...(process.env.AUDIT_BROWSER_PATH?{executablePath:process.env.AUDIT_BROWSER_PATH}:{channel:process.env.AUDIT_BROWSER||'msedge'}),headless:true})
const results=[]
try {
  const context=await browser.newContext()
  if (process.env.VERCEL_OIDC_TOKEN && base.startsWith('https://')) {
    await context.route(new URL(base).origin+'/**',route=>route.continue({headers:{...route.request().headers(),'x-vercel-trusted-oidc-idp-token':process.env.VERCEL_OIDC_TOKEN}}))
  }
  const page=await context.newPage()
  const consoleErrors=[]
  page.on('pageerror',error=>consoleErrors.push(error.message))
  page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text())})
  async function audit(state,width) {
    await page.evaluate(()=>document.fonts.ready)
    const report=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']).analyze()
    results.push({url:page.url(),state,width,violations:report.violations,incomplete:report.incomplete,passes:report.passes.length})
    assert.deepEqual(report.violations,[],`${state} (${width}px): violações de acessibilidade`)
  }
  for(const width of [320,390,768,1440]) {
    await page.setViewportSize({width,height:1000})
    for(const route of ['login','cadastro']) {
      await page.goto(base+'/'+route)
      await page.getByRole('heading',{level:1}).waitFor()
      await audit(route+'-normal',width)
      await page.getByRole('button',{name:route==='login'?'Entrar':'Criar minha conta',exact:true}).click()
      await audit(route+'-erros',width)
      assert.ok(await page.locator('[aria-invalid="true"]').count()>0)
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true)
    }
  }
  await page.goto(base+'/cadastro')
  await page.getByLabel('Nome',{exact:true}).fill('Pessoa Teste')
  await page.getByLabel('E-mail',{exact:true}).fill('pessoa-audit@example.com')
  await page.getByLabel('Senha',{exact:true}).fill('Senha-ficticia-123')
  await page.getByLabel('Confirmar senha',{exact:true}).fill('Senha-ficticia-123')
  await page.getByRole('button',{name:'Mostrar senha',exact:true}).click()
  await audit('cadastro-senha-visivel',1440)
  await page.getByRole('button',{name:'Criar minha conta'}).click()
  await page.getByText('Conta criada neste navegador. Agora é só entrar!').waitFor()
  await audit('cadastro-concluido',1440)
  await page.reload()
  await page.getByLabel('E-mail',{exact:true}).fill('pessoa-audit@example.com')
  await page.getByLabel('Senha',{exact:true}).fill('Senha-ficticia-123')
  await page.getByRole('button',{name:'Entrar',exact:true}).click()
  await page.getByRole('heading',{name:'Boas-vindas, Pessoa!'}).waitFor()
  await audit('boas-vindas',1440)
  await page.goto(base+'/caminho-inexistente')
  await page.getByRole('heading',{name:'Esse caminho ainda não existe.'}).waitFor()
  await audit('recuperacao-404',1440)
  // Reflow e aumento de texto complementam a varredura automática.
  await page.setViewportSize({width:390,height:1000})
  await page.goto(base+'/cadastro')
  await page.evaluate(()=>{document.documentElement.style.fontSize='200%'})
  await audit('cadastro-texto-200-porcento',390)
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true)
  assert.deepEqual(consoleErrors,[],'Erros de console/hidratação')
  console.log(JSON.stringify({checks:results.length,violations:0,consoleErrors},null,2))
} finally {
  await mkdir('artifacts/accessibility',{recursive:true})
  await writeFile('artifacts/accessibility/report.json',JSON.stringify({base,checkedAt:new Date().toISOString(),results},null,2))
  await browser.close()
}
