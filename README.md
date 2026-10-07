# Acesso — Login e cadastro

Interface de login e registro para o portfólio front-end de Felipe Jordão Fernandes. Uma base simples, responsiva e organizada para evoluir o projeto, construída com Vite, React, JavaScript e CSS Modules.

**Esta versão é demonstrativa.** Os formulários validam os campos e apresentam feedback, mas não criam contas, autenticam usuários, enviam e-mails ou salvam credenciais. Use dados fictícios ao experimentar.

## Publicação e revisão

- Aplicação: [tela-de-login-jet-seven.vercel.app](https://tela-de-login-jet-seven.vercel.app/).
- Repositório privado: [FelipeJordaoFernandes/tela-de-login](https://github.com/FelipeJordaoFernandes/tela-de-login).
- Vercel: projeto `tela-de-login`, integrado ao GitHub no time `felipejordaofernandes-projects`.
- Branch desta etapa: `Ada/base-login-registro`. Mudanças seguem por PR; o merge depende de aprovação explícita.
- A publicação inicial de produção usa a branch desta etapa, sem mesclar a PR. A integração Git está conectada à `main` para atualizações após o merge. Deploys da branch de trabalho são prévias separadas.

## Funcionalidades presentes

- Rotas `/login` e `/cadastro`, com navegação sem recarregar a página e suporte ao histórico do navegador.
- `/` redireciona para `/login`; caminhos desconhecidos exibem uma tela de recuperação.
- Cadastro com nome, e-mail, senha de pelo menos 8 caracteres e confirmação de senha.
- Login com validação de preenchimento e formato do e-mail.
- Erros associados aos campos, foco no primeiro campo inválido e atualização das mensagens durante a correção.
- Mostrar/ocultar senha, rótulos explícitos, autocomplete e envio pelo teclado.
- Feedback de conclusão demonstrativa, com limpeza dos campos após envio válido.
- Layout para celular, tablet e desktop, foco visível, link para pular ao conteúdo e respeito a movimento reduzido.
- Títulos por rota, descrição, idioma `pt-BR`, metadados Open Graph e favicon próprio.
- Fontes locais, sem chamadas a serviços externos de tipografia.

## Tecnologias

Vite, React, JavaScript, CSS Modules, React Router, Lucide React, Inter e Plus Jakarta Sans via Fontsource. ESLint para verificação estática. Versões resolvidas estão no `package-lock.json`; as novas dependências diretas foram instaladas com versões exatas.

## Executar localmente

Recomendado: Node.js 24 LTS e npm, usados na criação desta base.

```sh
npm ci
npm run dev
```

Acesse o endereço informado pelo Vite. Para verificar e gerar o build:

```sh
npm run lint
npm run build
npm run preview
```

`preview` serve o build em `dist`; execute o build antes. Não são necessárias variáveis de ambiente ou chaves para esta demonstração.

## Estrutura

```text
src/
  components/
    AuthLayout/     # Composição, introdução, cabeçalho e rodapé
    AuthForm/       # Formulários compartilhados de login e cadastro
    FormField/      # Campo, rótulo, ajuda, erros e visibilidade da senha
  lib/
    validation.js   # Regras de validação da demonstração
  App.jsx           # Rotas, títulos e foco após navegação
  App.module.css    # Estilos da página não encontrada
  index.css         # Fontes, tokens, reset e regras globais
  main.jsx          # Entrada React
public/
  favicon.svg
vercel.json         # Framework e fallback das rotas SPA
```

Os estilos de componentes ficam nos respectivos arquivos `.module.css`. As regras globais ficam em `index.css`.

## Direção visual

Verde, fundos sólidos, espaçamento generoso, cantos arredondados e elevação discreta. A paleta do portfólio foi consultada como referência; tons claros e o verde de ação são decisões locais desta interface. Plus Jakarta Sans nos títulos e Inter nos campos são uma combinação candidata em experimentação, não um padrão pessoal aprovado. O nome visual “acesso” identifica esta demonstração.

## Verificações desta base

Em 07/10/2026, lint, build e `git diff --check` aprovados. Verificação funcional no Edge/Chromium com Playwright: login/cadastro vazios, e-mail inválido, senha curta, confirmação divergente, envio válido, mostrar/ocultar senha, foco nos erros e nas mudanças de rota, navegação por teclado, histórico, abertura direta, reload e recuperação de rota desconhecida.

As duas rotas foram conferidas em **320, 390, 768, 1024 e 1440 px**, sem transbordamento horizontal ou erros de console no roteiro. Também foram conferidos movimento reduzido, ausência de requisição de credenciais e ausência de persistência em `localStorage`/`sessionStorage`. As evidências locais ficam em `artifacts/`, ignoradas pelo Git e pelo deploy.

Essas verificações não equivalem a uma auditoria integral WCAG, teste com leitores de tela ou cobertura de todos os navegadores. O projeto ainda não possui uma suíte automatizada versionada; `lint` e `build` são as verificações disponíveis no npm.

## Limites e continuidade

A interface não possui backend, banco de dados, sessão, recuperação de senha ou provedores sociais. Autenticação real precisa de escopo e arquitetura próprios antes da implementação; validação no navegador não substitui validação no servidor.

O HTML usa `noindex, nofollow` por se tratar de uma demonstração de acesso, sem conteúdo público para indexar. Canonical e sitemap não são necessários nesta etapa. A página de caminho desconhecido é uma recuperação no cliente; o fallback da SPA pode responder HTTP 200.

Próximo passo desta etapa: revisar o visual e a PR; após aprovação e merge, sincronizar `main` e conferir novamente a produção.
