# Notificacoes do carrinho (sem alert do browser)

Este documento explica, de forma simples, como foi removido o `alert()` do browser ao adicionar produtos ao carrinho e como foi substituido por uma notificacao visual mais adequada ao site.

---

## Objetivo

Antes, quando o utilizador adicionava um produto ao carrinho, aparecia a janela default do browser (`alert`), que e pouco moderna e interrompe a experiencia.

Agora foi implementado um sistema de **toast** (mini-notificacao) no canto superior direito:

- aparece de forma suave;
- informa que o produto foi adicionado;
- desaparece automaticamente;
- segue o estilo do site.

---

## Onde foi implementado

### 1) `js/cart.js`

Foram adicionadas funcoes novas:

- `ensureToastStyles()`  
  Injeta o CSS do toast na pagina (uma vez so).

- `ensureToastWrap()`  
  Cria o contentor das notificacoes no `body` (uma vez so).

- `showToast(message, title)`  
  Mostra a notificacao com animacao e remove apos alguns segundos.

Tambem foi exposto globalmente:

- `window.showToast = showToast`

Assim, qualquer pagina pode usar a mesma notificacao.

---

### 2) Uso no fluxo de adicionar ao carrinho

No proprio `cart.js`, na funcao que liga os botoes "Adicionar ao carrinho":

- foi removido o fallback com `alert(...)`;
- passou a usar diretamente:

```js
showToast("Produto adicionado ao carrinho!", "NextByte");
```

Resultado: em `index.html`, `shop.html`, `bestseller.html` e outras paginas com cards de produto, o feedback agora e visual e consistente.

---

### 3) `single.html` (pagina de produto)

No botao "Adicionar ao carrinho" da pagina de produto:

- o `alert("Produto adicionado...")` foi substituido por `showToast(...)`;
- a mensagem de erro "Carrinho indisponivel" tambem foi trocada para `showToast(...)`.

Assim, esta pagina tambem ficou sem janelas default do browser.

---

## Como funciona o toast (resumo tecnico)

1. O utilizador clica em adicionar ao carrinho.
2. O produto e guardado no `localStorage` como ja acontecia antes.
3. Chama-se `showToast(...)`.
4. O toast aparece com transicao (`opacity + translateY`).
5. Passado ~2 segundos, desaparece e e removido do DOM.

---

## Vantagens para o utilizador

- Interface mais profissional.
- Sem bloqueios da navegacao (como acontece com `alert`).
- Feedback rapido e discreto.
- Comportamento igual em varias paginas do site.

---

## Como testar

1. Abrir uma pagina com produtos (ex.: `index.html`, `shop.html`, `single.html`).
2. Clicar em **Adicionar ao carrinho**.
3. Confirmar que:
   - nao aparece popup default do browser;
   - aparece uma mini-notificacao no canto superior direito;
   - o valor do carrinho e atualizado.

