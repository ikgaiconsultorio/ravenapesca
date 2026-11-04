# Ravena Pescaria RPG — V3

Protótipo independente, para publicar em GitHub Pages. Não contém o servidor completo da Ravena.

## Testar no GitHub Pages
1. Coloque a pasta `pesca-rpg` (com `index.html`, `css/`, `js/`) na raiz do seu repositório.
2. Ative GitHub Pages em Settings → Pages → Deploy from a branch → main.
3. Abra `https://SEU-USUARIO.github.io/SEU-REPOSITORIO/pesca-rpg/`.

## Controles
- PC: WASD ou setas, E para interagir.
- Celular: joystick à esquerda e botão E à direita.
- A pesca funciona nas margens do lago, não apenas no píer.
- Inventário, loja, mercado e ranking são demonstrações locais.
- Moedas, iscas e peixes ficam salvos apenas no navegador (localStorage).
- Não há multiplayer nem vendas reais: para isso é necessário backend com autenticação e transações seguras.

## V3
- Lago e mapa ampliados, trilha circular e mais áreas para pescar.
- Estátua estilizada da Ravena no centro do lago com aura, runas e pétalas.
- Loja, mercado e ranking redesenhados como construções da vila.
- Mantidos os controles da V2.1, com correção para evitar duplo acionamento em botões do painel.

## Integração futura
Conecte as operações de compra, venda, inventário e pesca a endpoints autenticados no backend Java. Não confie em moedas/preços informados pelo navegador.
