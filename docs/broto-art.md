# Artes do Broto — acesso

Conjunto criado em 07/10/2026 com o **imagegen integrado**, uma geração por expressão, usando a identidade canônica do Broto como referência. Referência local consultada: `canonical-base.png`, em `C:\Users\felip\Documents\Codex\2026-09-30\pets-plugin-work-pets-openai-curated\work\broto\references\`. A arte `sobre.webp` do Portfólio também foi consultada visualmente. Nenhuma dessas referências foi modificada.

## Arquivos finais e uso

Todos em `public/broto/`, WebP RGBA de 512 × 512 px, fundo transparente. A conversão com Sharp apenas redimensionou e comprimiu as gerações, sem redesenhar o personagem.

| Arquivo | Reação | Tamanho |
| --- | --- | --- |
| `idle.webp` | Olhar frontal, sem interação | 36.628 bytes |
| `looking.webp` | E-mail em foco, olhar para o card à direita | 36.058 bytes |
| `looking-down.webp` | E-mail em foco até 800 px, olhar para o card abaixo | 35.954 bytes |
| `covered.webp` | Senha oculta em foco, dois olhos cobertos | 44.490 bytes |
| `peeking.webp` | Senha visível em foco, um olho espiando | 39.178 bytes |
| `confused.webp` | Falha de login, expressão de dúvida | 36.114 bytes |
| `happy.webp` | Login confirmado, expressão alegre | 36.774 bytes |

O olhar é responsivo porque o card muda de posição. Nome e e-mail em foco usam esse olhar. Senhas reagem apenas durante interação com o campo, sem alterar a expressão por preenchimento automático fora de foco. Cadastro inválido também usa a expressão de dúvida; sua conclusão retorna ao login sem reação de sucesso. Textos e mensagens comunicam o resultado independentemente da arte decorativa.

## Prompts efetivamente utilizados

Cada uma das seis primeiras gerações recebeu a referência canônica e o prefixo abaixo, seguido pela expressão correspondente.

```text
Use case: stylized-concept. Asset type: transparent interactive login mascot face. Reference image is Broto's character identity and style reference ONLY; do not preserve its magenta background. Generate ONE standalone head portrait of the exact same Broto, green rounded android with cream face screen, dark green oval eyes with small cream highlights, green round side ear modules, single green leaf antenna, crisp dark green outlines and smooth clean cartoon shading. HEAD ONLY, no torso, legs, neck, clothes, text or props; hands are allowed ONLY if the expression below requires covering eyes. Square canvas, centered head, complete ears and leaf visible, same camera straight-on, consistent proportions across expressions, head occupies about 75% canvas width, leave clear margin. Genuine transparent alpha background, no white sticker border, no ground, no shadow cast on background, no magenta. Face expression:
```

`idle`:

```text
Looking straight at viewer, both oval eyes open, calm tiny friendly curved smile. No hands.
```

`looking`:

```text
Looking toward SCREEN-RIGHT toward the login card, both dark oval eyes shifted clearly toward the right side of the cream face. Head stays nearly frontal. Friendly tiny smile, no hands.
```

`covered`:

```text
Both eyes fully covered by two small green mitten-like robot hands held over the face, one over each eye, playful privacy gesture. Entire two hands visible, no arms extending to body, no torso. Small smile below hands.
```

`peeking`:

```text
Both small green robot hands raised over eyes. One eye stays fully covered; the OTHER eye on SCREEN-RIGHT is clearly exposed and open, peeking through a gap created by lowering that hand slightly. Mischievous tiny smile. Only head and two hands, no torso.
```

`confused`:

```text
A clearly puzzled but gentle expression: one eyebrow raised, the other lowered, asymmetric questioning oval eyes, tiny off-center uncertain curved mouth. No question marks or symbols, no hands.
```

`happy`:

```text
A joyful successful-login smile: wide happy open smiling mouth, eyes curved upward in a cheerful squint, warm delighted expression. No hands, no extra props.
```

`looking-down` usou como referência a geração `idle` e este prompt completo:

```text
Use case: character-reference. Create the responsive mobile gaze variant of this exact Broto head image. Preserve the exact character, green palette, outline weight, shading, head/leaf/ear shape, placement and scale, cream screen and small smile. Change ONLY the gaze: both eyes move visibly DOWNWARD toward the bottom of the cream face, as if looking at a form directly below the head. A slight downward head inclination is fine, but no torso, no hands, no props or extra marks. Same square framing and clear margins, genuine transparent alpha background preserved. No text, no logo, no sticker border.
```

## Revisão

Inspecionadas as sete gerações e sua aplicação no layout. Verificados recorte de rosto, orelhas/folha completas, ausência de corpo/texto/fundo e gestos de cobrir/espiar. Há pequenas variações de desenho entre expressões, próprias de gerações separadas; a troca usa uma transição curta de opacidade. A preferência por movimento reduzido desativa essa transição.

Os PNGs originais de 1254 × 1254 px permanecem no diretório local de gerações do Codex; apenas os WebPs finais fazem parte do repositório. O manifesto local `artifacts/broto-assets.json` identifica cada original e a conversão; não é enviado ao deploy.

## Otimização responsiva — auditoria de 07/10/2026

Os sete arquivos de 512 px foram preservados. Derivadas seis versões de 256 px, por redimensionamento proporcional com Sharp, WebP qualidade 85 e alphaQuality 100: idle, looking-down, covered, peeking, confused e happy. Não houve geração de novas artes ou redesenho. O conjunto mobile tem 80.326 bytes; idle ocupa 12.910 bytes. `picture/source` seleciona essas variantes até 800 px; desktop mantém 512 px.

A expressão idle recebe preload responsivo e prioridade alta. As demais são aquecidas com prioridade baixa após load e dois frames, ou carregadas quando solicitadas antes disso. Enquanto uma expressão não termina de carregar, idle permanece visível para evitar um quadro vazio. As reações e transições foram verificadas novamente no build, incluindo o olhar para baixo em telas menores.
