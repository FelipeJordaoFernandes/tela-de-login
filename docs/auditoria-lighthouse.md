# Auditoria de qualidade — 07/10/2026

Resultado no build local final: **98 em performance mobile e 100 em acessibilidade, boas práticas e SEO; desktop 100 nas quatro categorias**, nas duas rotas públicas. A demonstração permite indexação por decisão explícita do usuário nesta etapa.

## Método e evidências

Lighthouse **13.5.0**, Edge/Chromium **154.0.0.0**, Windows, execução headless sobre `http://127.0.0.1:4173`. Perfis oficiais: mobile 412 × 823, rede simulada de 1.638,4 Kbps/RTT 150 ms e CPU 4×; desktop conforme `desktop-config` do Lighthouse. Sem exclusão de auditorias, troca de pesos ou redução artificial da simulação. Cada medição abre um navegador novo; o lote final não concorreu com outros testes de navegador.

Baseline: uma medição por rota/perfil no commit `cfc6694016c08d4ecbbc2c901ef9ed404673ec58`. Final: três por rota/perfil, entre **18:18:06 e 18:19:19 UTC**, com mediana e intervalo abaixo. Arquivos locais completos: `artifacts/lighthouse/baseline/`, `artifacts/lighthouse/final/` e respectivos `summary.json`. Os arquivos brutos são ignorados no Git/deploy; este relatório preserva a síntese e os scripts versionados permitem repetir a medição.

| Rota / perfil | Performance antes → mediana final | Intervalo final | Acessibilidade | Boas práticas | SEO antes → final |
| --- | --- | --- | --- | --- | --- |
| Login / mobile | 86 → **98** | 98–98 | 100 | 100 | 54 → 100 |
| Cadastro / mobile | 86 → **98** | 98–98 | 100 | 100 | 54 → 100 |
| Login / desktop | 100 → **100** | 100–100 | 100 | 100 | 54 → 100 |
| Cadastro / desktop | 100 → **100** | 100–100 | 100 | 100 | 54 → 100 |

| Rota / perfil | FCP mediana | LCP mediana | TBT mediana | CLS |
| --- | --- | --- | --- | --- |
| Login / mobile | 1,28 s | 2,26 s | 0 ms | 0 |
| Cadastro / mobile | 1,28 s | 2,25 s | 0 ms | 0 |
| Login / desktop | 0,34 s | 0,52 s | 0 ms | 0 |
| Cadastro / desktop | 0,34 s | 0,49 s | 0 ms | 0 |

O LCP mobile da baseline era aproximadamente 3,91 s. Notas e tempos variam com máquina, versão, rede e hospedagem. São testes de laboratório do build candidato, não dados de usuários reais ou uma medição da produção atual, que ainda depende da integração das PRs.

## Correções realizadas

- Broto recebe fontes responsivas de 256 px no layout empilhado. Idle tem prioridade; expressões secundárias carregam após a página ou sob demanda, mantendo uma imagem visível durante a troca. As artes desktop foram preservadas.
- `LazyMotion` carrega os recursos de animação em um chunk separado. JavaScript inicial caiu de aproximadamente **404,48 KB para 323,26 KB**; gzip de **130,35 KB para 105,22 KB**. O chunk de recursos tem 37,77 KB (14,52 KB gzip); a transferência é adiada, não eliminada. Deslizamento e alturas intermediárias foram medidos novamente.
- Inter variável Latin substitui três arquivos estáticos: aproximadamente 48,25 KB em vez de 72,38 KB. Plus Jakarta Sans usa apenas o peso 600 necessário. Fontes locais com preload e CSS pequeno incorporado ao HTML.
- Build pré-renderiza os formulários públicos vazios, com hidratação React, metadados e canonical próprios. Não há servidor em produção, acesso a localStorage no build ou dados pessoais no HTML gerado. Campos/envio ficam desabilitados até a hidratação; sem JavaScript, há instrução visível, evitando envio convencional de credenciais. Aviso/e-mail após cadastro permanecem na navegação SPA e são descartados no reload para corresponder ao HTML público.
- `robots.txt` válido substitui a resposta HTML do antigo fallback, e `sitemap.xml` lista login/cadastro no domínio de produção. Removido `noindex` dessas páginas conforme escolha do usuário. Recuperação 404 continua fora de indexação após execução do cliente.
- Scripts de auditoria adicionados ao projeto; nenhuma regra do Lighthouse ou axe foi desativada para obter as notas.

## Acessibilidade e regressão

**Axe 4.13.0: 21 verificações, zero violações automáticas.** Login/cadastro normais e com erros em 320/390/768/1440 px; senha visível, confirmação de cadastro, boas-vindas, recuperação 404 e texto a 200%. O único item `incomplete` foi o contraste da seta decorativa `→` do link de retorno 404, que a ferramenta não interpreta como texto. Conferência das cores: `#2e6646` sobre `#ffffff`, razão **6,76:1**; seta oculta da árvore acessível, link com nome textual. Não houve alteração de cores para esconder o diagnóstico.

Playwright no build: cadastro → redirecionamento → reload → login incorreto/correto → boas-vindas → Sair; duplicata, dados inválidos, armazenamento bloqueado/corrompido, todas as expressões, navegação por teclado/foco, movimento reduzido, deslizamento horizontal e alturas intermediárias. Login/cadastro em 320/390/768/1024/1440 px, abertura direta/reload, imagens carregadas, sem overflow, erros de console/hidratação ou envio de credenciais observado. Capturas mobile, tablet e desktop revisadas visualmente.

ESLint, seis testes `node:test`, build, `git diff --check` aprovados. `npm audit` completo: **zero vulnerabilidades conhecidas** na consulta de 07/10/2026. Esse resultado é uma consulta de dependências, não auditoria de segurança da aplicação. A autenticação continua sendo demonstração local.

## Limites e diagnósticos restantes

- Nota 100 de acessibilidade não certifica WCAG integral. Leitores de tela, todos os navegadores e todas as combinações de tecnologias assistivas não foram cobertos.
- Lighthouse ainda estima aproximadamente 44 KiB de JavaScript não utilizado durante a abertura; React, Router e Motion também atendem interações posteriores. Mobile aponta cerca de 5 KiB de otimização de imagem; desktop cerca de 120 KiB no conjunto de expressões carregadas. As artes maiores preservam qualidade em telas de alta densidade.
- Persiste a recomendação de árvore de rede. O diagnóstico de bfcache identifica `BackForwardCacheDisabled` e `BackForwardCacheDisabledByCommandLine`, sinalizações do navegador lançado pela ferramenta; não foi atribuído ao código da aplicação. Uma conferência no navegador normal após integração complementará a observação.
- Não foi alterado o HTTP 200 do fallback SPA em caminhos desconhecidos. `noindex` do 404 depende do cliente. Indexação permitida não garante presença no Google, e prévias protegidas têm comportamento de indexação próprio da Vercel.
- Não há backend, autorização para recursos privados ou sessão persistente. As notas não mudam o contrato de localStorage ou tornam a demonstração autenticação de servidor.

## Reproduzir

Execute `npm ci`, `npm run build` e `npm run preview`. Em outro terminal: `npm run audit:lighthouse`, `npm run audit:a11y` e `npm audit`. Edge deve estar instalado; `AUDIT_BROWSER_PATH` aceita outro executável Chromium. Os scripts usam as dependências fixadas no lockfile e escrevem em `artifacts/`. Novas medições devem ser comparadas sob condições equivalentes.

Referências técnicas consultadas: [pontuação do Lighthouse](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring), [LCP](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-largest-contentful-paint), [Lighthouse CLI/configuração](https://github.com/GoogleChrome/lighthouse/blob/main/readme.md), [LazyMotion](https://motion.dev/docs/react-lazy-motion), [Vite SSR e pré-renderização](https://vite.dev/guide/ssr.html), [React hydrateRoot](https://react.dev/reference/react-dom/client/hydrateRoot), [renderToString](https://react.dev/reference/react-dom/server/renderToString), [StaticRouter](https://reactrouter.com/api/declarative-routers/StaticRouter) e [axe-core](https://www.deque.com/axe/axe-core/).
