# Imagem social — Acesso

Correção de 08/10/2026: o HTML publicado tinha título e descrição Open Graph, mas não indicava imagem. A capa compartilhada agora é `public/social/acesso-broto-v1.png`, PNG opaco de **1200 × 630 px**, com 118.810 bytes na geração desta etapa.

A composição usa a identidade aprovada: fundo claro, painel branco, tons verdes, Plus Jakarta Sans e Inter locais, marca Acesso e a arte original `public/broto/idle.webp`. Texto: “Login e cadastro. Com o Broto.” A arte não foi redesenhada; nenhuma imagem nova foi gerada por IA.

`scripts/social-image.html` guarda a composição editável em HTML/CSS. `scripts/generate-social-image.mjs` incorpora arte, logo e fontes como dados locais e renderiza a capa com Playwright/Chromium, sem requisições externas. Execute `npm run social:image` para regenerar; Edge deve estar instalado ou um executável Chromium informado em `AUDIT_BROWSER_PATH`. O PNG pronto é versionado, e o deploy não precisa instalar ou executar um navegador.

`index.html` indica uma URL HTTPS absoluta de produção em `og:image` e `twitter:image`, com texto alternativo, tipo e dimensões da imagem. A raiz tem os metadados iniciais; o build de login/cadastro preserva a mesma capa e gera títulos, descrições e `og:url` próprios, sem duplicar tags. A capa não é carregada pela interface normal e não adiciona JavaScript ao aplicativo.

Referência: [protocolo Open Graph — propriedades de imagem](https://ogp.me/#structured). Também incluídas tags Twitter Cards com `summary_large_image` para os consumidores desse formato.

Validação: imagem renderizada e revisada visualmente, dimensões/assinatura PNG e tags únicas no HTML gerado. Em prévia, a URL da imagem é conferida na origem da prévia; as tags continuam apontando para o domínio de produção. O endereço público só passará a servir a capa após o merge e deploy. A atualização de prévias já armazenadas por cada plataforma depende do cache externo; não foi realizado envio de links para contas ou serviços de terceiros.
