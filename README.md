# Acesso — Login e cadastro com Broto

Interface de login e registro para o portfólio front-end de Felipe Jordão Fernandes, construída com Vite, React, JavaScript e CSS Modules. Broto acompanha o preenchimento e reage ao resultado do login.

**Demonstração local:** os cadastros ficam no navegador e podem ser alterados ou apagados pelo próprio usuário. Use dados fictícios. Não há backend ou autorização para acessar recursos privados.

## Publicação e revisão

- Produção: [tela-de-login-jet-seven.vercel.app](https://tela-de-login-jet-seven.vercel.app/).
- Repositório privado: [FelipeJordaoFernandes/tela-de-login](https://github.com/FelipeJordaoFernandes/tela-de-login).
- Vercel: projeto `tela-de-login`, integrado ao GitHub no time `felipejordaofernandes-projects`, produção configurada para `main`.
- Base inicial na [PR #1](https://github.com/FelipeJordaoFernandes/tela-de-login/pull/1), ainda sem merge. A produção inicial foi publicada manualmente a partir dessa base.
- Broto e acesso local na [PR #2](https://github.com/FelipeJordaoFernandes/tela-de-login/pull/2), correções na [PR #3](https://github.com/FelipeJordaoFernandes/tela-de-login/pull/3). Auditoria de qualidade na branch `Ada/auditoria-lighthouse`, derivada de `Ada/correcoes-broto-formulario`, enviada por PR com essa branch como base. Deploys de prévia são separados da produção; merge depende de aprovação explícita.

## Funcionalidades presentes

- `/login` e `/cadastro`, navegação sem recarregar, histórico, redirecionamento de `/` e recuperação de caminhos desconhecidos.
- Cadastro com nome, e-mail, senha de pelo menos 8 caracteres e confirmação; e-mail normalizado e bloqueio de cadastro duplicado.
- Cadastro salvo em `localStorage`; ao concluir, redirecionamento para login com e-mail preenchido e mensagem de confirmação.
- Login validado contra os cadastros locais. Credenciais incorretas exibem erro; credenciais corretas substituem o formulário por boas-vindas e botão Sair.
- Broto em seis expressões: padrão, olhando para o formulário, olhos cobertos, espiando, dúvida e alegria. Em telas menores, o olhar aponta para baixo, onde fica o card.
- Nome e e-mail em foco fazem Broto olhar para o card; cadastro inválido também provoca dúvida. Preenchimento automático fora de foco preserva a expressão atual, e a abertura da tela mantém o olhar padrão.
- Em celular/tablet com layout empilhado, a distância entre Broto e card é constante entre login e cadastro, inclusive em telas altas. Títulos das páginas usam apenas o nome Acesso.
- Troca de formulários com deslizamento horizontal, altura animada do card e transição para boas-vindas. Respeita a preferência por movimento reduzido.
- Mostrar/ocultar senha, labels, autocomplete, erros associados aos campos, foco no primeiro erro, envio por teclado e foco após navegação.
- Layout responsivo, link para pular ao conteúdo, fontes locais, títulos por tela, `pt-BR`, descrição, Open Graph e favicon próprio.
- Cabeçalho simplificado, sem o botão “Voltar ao portfólio”.

## Contrato do armazenamento

`src/lib/localAuth.js` usa a chave **`acesso.accounts.v1`** com o formato `{ version: 1, users: [...] }`. Cada cadastro guarda `id`, `name`, `email`, `salt`, `passwordHash` e `iterations`.

A senha não é salva em texto puro: o código deriva um hash de 256 bits usando PBKDF2/HMAC-SHA-256, 600.000 iterações e salt aleatório de 16 bytes via Web Crypto. Essa API exige HTTPS ou localhost. Referências: [MDN deriveBits](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveBits) e [OWASP Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html).

Cadastros permanecem após recarregar, mas a tela de boas-vindas fica apenas na memória: recarregar ou clicar em Sair retorna ao login. O aviso de cadastro concluído e o e-mail preenchido também são transitórios e desaparecem no reload. Sair preserva os cadastros. Para removê-los, limpe os dados deste site no navegador. Produção, prévias e localhost possuem armazenamentos independentes por origem, conforme a [documentação de localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

Falhas de leitura/escrita e dados com formato inválido recebem mensagens compreensíveis; o código não sobrescreve cadastros inválidos silenciosamente. O hash reduz a exposição da senha original, mas não torna o armazenamento local uma autenticação de servidor: scripts da mesma origem podem ler esses registros, e o usuário controla os dados e o código do navegador.

## Tecnologias

Vite, React, JavaScript, CSS Modules, React Router, Motion com carregamento assíncrono, Lucide React, Inter variável e Plus Jakarta Sans locais via Fontsource. ESLint, testes com `node:test`, Lighthouse e axe via Playwright. Versões resolvidas no `package-lock.json`; novas dependências diretas instaladas com versões exatas.

## Executar localmente

Node.js 24 LTS e npm, usados nesta etapa:

```sh
npm ci
npm run dev
```

Verificar e servir o build:

```sh
npm run lint
npm run test
npm run build
npm run preview
```

`preview` serve `dist`; execute o build antes. Não são necessárias variáveis de ambiente ou chaves.

O build gera HTML estático de `/login` e `/cadastro` com `StaticRouter` e `renderToString`, reutilizando os componentes React. O navegador hidrata essas páginas e mantém a navegação SPA. A Vercel e o preview local servem os HTMLs correspondentes; nenhuma função de servidor é publicada. O HTML contém apenas o formulário público vazio, sem cadastros ou dados do navegador. Os campos e o envio permanecem desabilitados até o React carregar; sem JavaScript, uma mensagem explica como habilitar o fluxo local. O CSS pequeno é incorporado ao HTML para antecipar a primeira renderização.

Para reproduzir as auditorias, com o preview aberto e Microsoft Edge instalado:

```sh
npm run audit:lighthouse
npm run audit:a11y
npm audit
```

Lighthouse executa três medições por rota e dispositivo, usando os perfis padrão mobile/desktop. `AUDIT_URL`, `AUDIT_PHASE`, `AUDIT_RUNS`, `AUDIT_ROUTES` e `AUDIT_MODES` permitem selecionar o alvo e as repetições; os valores padrão estão em `scripts/audit-lighthouse.mjs`. Para outro Chromium instalado, use `AUDIT_BROWSER` ou `AUDIT_BROWSER_PATH`. Não é feito download automático de navegadores. Resultados HTML/JSON ficam em `artifacts/`, ignorados no Git/deploy. Consulte o [relatório e os limites](docs/auditoria-lighthouse.md).

## Estrutura

```text
src/
  components/
    AnimatedCard/   # Deslizamento, medição e animação de altura
    AuthLayout/     # Cabeçalho, Broto, card e rodapé
    AuthForm/       # Login, cadastro e boas-vindas
    Broto/          # Expressões e olhar responsivo
    FormField/      # Campo, label, erro e visibilidade de senha
  lib/
    localAuth.js    # Persistência e verificação local das credenciais
    validation.js   # Validação dos campos
    motionFeatures.js # Recursos de animação carregados sob demanda
  App.jsx           # Rotas e metadados
  entry-server.jsx  # Renderização das páginas públicas durante o build
  index.css         # Fontes, tokens, reset e regras globais
  main.jsx          # Entrada React
public/broto/       # Sete artes WebP e seis variantes mobile
public/robots.txt
public/sitemap.xml
scripts/           # Build estático e auditorias reproduzíveis
docs/broto-art.md   # Referências, prompts e decisões das artes
docs/auditoria-lighthouse.md
tests/localAuth.test.js
vercel.json         # Páginas públicas estáticas e fallback SPA
```

## Direção visual e artes

Verde, fundos sólidos, espaçamento generoso, cantos arredondados e elevação discreta. A paleta do portfólio foi consultada como referência; os tons desta interface são decisões locais. Plus Jakarta Sans nos títulos e Inter nos campos continuam como combinação candidata, sem transformá-la em padrão pessoal aprovado. “acesso” identifica esta demonstração.

Artes de rosto criadas com o imagegen a partir da referência canônica do Broto, com fundo transparente. Os sete WebPs de 512 × 512 px (cerca de 265 KB) foram preservados; seis variantes de 256 × 256 px atendem o layout mobile/tablet. A expressão padrão tem prioridade, e as demais são carregadas depois da página ou ao serem solicitadas. Consulte [referências e prompts](docs/broto-art.md). Nenhuma arte do Portfólio foi alterada.

## Verificações desta etapa

Em 07/10/2026: lint, seis testes automatizados de armazenamento/credenciais, build e `git diff --check`. O roteiro local Playwright no Edge/Chromium verifica cadastro → redirecionamento → reload → login incorreto/correto → boas-vindas → Sair, cadastro duplicado, dados inválidos, armazenamento bloqueado, expressões do Broto e animações de posição/altura.

Login e cadastro conferidos em **320, 390, 768, 1024 e 1440 px**, com abertura direta/reload, teclado, foco, movimento reduzido, imagens carregadas e ausência de transbordamento horizontal. Nenhum erro de console ou envio de credenciais observado no roteiro. Evidências locais em `artifacts/`, ignoradas pelo Git e pelo deploy.

Correções posteriores verificadas também com preenchimento automático simulado sem foco, foco/edição de Nome, falhas de cadastro e alturas de viewport 844/1180/1366 px para comparar a distância entre mascote e card. Conferidos títulos de login, cadastro, boas-vindas e página não encontrada, sem nome pessoal.

Essas verificações não equivalem a uma auditoria WCAG completa, teste com leitores de tela ou cobertura de todos os navegadores. O fluxo do build é validado localmente; eventuais restrições de acesso às prévias remotas devem ser registradas separadamente.

Auditoria de 07/10/2026 com Lighthouse 13.5.0, build local e três medições por rota/perfil: **performance mobile 98 em todas as repetições, desktop 100; acessibilidade, boas práticas e SEO 100 nas duas telas/perfis**. Antes das correções, mobile tinha 86 em performance e SEO 54. Axe 4.13.0: 21 verificações de telas/estados, sem violações automáticas; contraste da seta decorativa da recuperação 404 conferido separadamente. Detalhes, métricas, pendências e condições de medição no [relatório](docs/auditoria-lighthouse.md).

## Limites e continuidade

Não há backend, banco remoto, sessão persistente, recuperação de senha ou provedores sociais. Autenticação real exige escopo e arquitetura próprios. A interface local serve à demonstração de front-end.

Por escolha explícita do usuário, a demonstração pública permite indexação: `/login` e `/cadastro` têm canonical de produção, títulos/descrições próprios no HTML, robots válido e sitemap. A indexação efetiva depende dos buscadores. A recuperação de caminho desconhecido usa `noindex` no cliente e o fallback SPA pode responder HTTP 200. Prévias da Vercel podem continuar protegidas e fora de indexação por configuração da hospedagem.

Próximo passo: revisão visual e das PRs; após autorização de merge, sincronizar `main` e validar a produção atualizada.
