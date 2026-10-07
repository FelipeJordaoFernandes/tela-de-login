# Acesso — Login e cadastro com Broto

Interface de login e registro para o portfólio front-end de Felipe Jordão Fernandes, construída com Vite, React, JavaScript e CSS Modules. Broto acompanha o preenchimento e reage ao resultado do login.

**Demonstração local:** os cadastros ficam no navegador e podem ser alterados ou apagados pelo próprio usuário. Use dados fictícios. Não há backend ou autorização para acessar recursos privados.

## Publicação e revisão

- Produção: [tela-de-login-jet-seven.vercel.app](https://tela-de-login-jet-seven.vercel.app/).
- Repositório privado: [FelipeJordaoFernandes/tela-de-login](https://github.com/FelipeJordaoFernandes/tela-de-login).
- Vercel: projeto `tela-de-login`, integrado ao GitHub no time `felipejordaofernandes-projects`, produção configurada para `main`.
- Base inicial na [PR #1](https://github.com/FelipeJordaoFernandes/tela-de-login/pull/1), ainda sem merge. A produção inicial foi publicada manualmente a partir dessa base.
- Broto e acesso local na [PR #2](https://github.com/FelipeJordaoFernandes/tela-de-login/pull/2), sobre a base inicial. Correções atuais na branch `Ada/correcoes-broto-formulario`, derivada de `Ada/broto-login-local`, enviadas por PR com essa branch como base. Deploys de prévia são separados da produção; merge depende de aprovação explícita.

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

Cadastros permanecem após recarregar, mas a tela de boas-vindas fica apenas na memória: recarregar ou clicar em Sair retorna ao login. Sair preserva os cadastros. Para removê-los, limpe os dados deste site no navegador. Produção, prévias e localhost possuem armazenamentos independentes por origem, conforme a [documentação de localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

Falhas de leitura/escrita e dados com formato inválido recebem mensagens compreensíveis; o código não sobrescreve cadastros inválidos silenciosamente. O hash reduz a exposição da senha original, mas não torna o armazenamento local uma autenticação de servidor: scripts da mesma origem podem ler esses registros, e o usuário controla os dados e o código do navegador.

## Tecnologias

Vite, React, JavaScript, CSS Modules, React Router, Motion, Lucide React, Inter e Plus Jakarta Sans via Fontsource. ESLint e testes com `node:test`. Versões resolvidas no `package-lock.json`; novas dependências diretas instaladas com versões exatas.

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
  App.jsx           # Rotas e metadados
  index.css         # Fontes, tokens, reset e regras globais
  main.jsx          # Entrada React
public/broto/       # Sete artes WebP transparentes
docs/broto-art.md   # Referências, prompts e decisões das artes
tests/localAuth.test.js
vercel.json         # Vite e fallback SPA
```

## Direção visual e artes

Verde, fundos sólidos, espaçamento generoso, cantos arredondados e elevação discreta. A paleta do portfólio foi consultada como referência; os tons desta interface são decisões locais. Plus Jakarta Sans nos títulos e Inter nos campos continuam como combinação candidata, sem transformá-la em padrão pessoal aprovado. “acesso” identifica esta demonstração.

Artes de rosto criadas com o imagegen a partir da referência canônica do Broto, com fundo transparente, e otimizadas em WebP de 512 × 512 px. O conjunto tem cerca de 265 KB. Consulte [referências e prompts](docs/broto-art.md). Nenhuma arte do Portfólio foi alterada.

## Verificações desta etapa

Em 07/10/2026: lint, seis testes automatizados de armazenamento/credenciais, build e `git diff --check`. O roteiro local Playwright no Edge/Chromium verifica cadastro → redirecionamento → reload → login incorreto/correto → boas-vindas → Sair, cadastro duplicado, dados inválidos, armazenamento bloqueado, expressões do Broto e animações de posição/altura.

Login e cadastro conferidos em **320, 390, 768, 1024 e 1440 px**, com abertura direta/reload, teclado, foco, movimento reduzido, imagens carregadas e ausência de transbordamento horizontal. Nenhum erro de console ou envio de credenciais observado no roteiro. Evidências locais em `artifacts/`, ignoradas pelo Git e pelo deploy.

Correções posteriores verificadas também com preenchimento automático simulado sem foco, foco/edição de Nome, falhas de cadastro e alturas de viewport 844/1180/1366 px para comparar a distância entre mascote e card. Conferidos títulos de login, cadastro, boas-vindas e página não encontrada, sem nome pessoal.

Essas verificações não equivalem a uma auditoria WCAG completa, teste com leitores de tela ou cobertura de todos os navegadores. O fluxo do build é validado localmente; eventuais restrições de acesso às prévias remotas devem ser registradas separadamente.

## Limites e continuidade

Não há backend, banco remoto, sessão persistente, recuperação de senha ou provedores sociais. Autenticação real exige escopo e arquitetura próprios. A interface local serve à demonstração de front-end.

O HTML usa `noindex, nofollow`; canonical e sitemap não se aplicam nesta etapa. A recuperação de caminho desconhecido ocorre no cliente e o fallback SPA pode responder HTTP 200.

Próximo passo: revisão visual e das PRs; após autorização de merge, sincronizar `main` e validar a produção atualizada.
