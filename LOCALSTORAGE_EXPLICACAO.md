# LocalStorage no site NextByte – Explicação para alunos

Este documento explica, de forma simples, o que é o **LocalStorage** e como foi usado no projeto para o **registo/login** e para o **carrinho e compra**.

---

## O que é o LocalStorage?

O **LocalStorage** é uma memória do browser (Chrome, Firefox, Edge, etc.) que permite guardar dados **no computador do utilizador**, associados ao site que está a ser visitado.

- Os dados ficam guardados **mesmo depois de fechar o browser** e desligar o PC.
- São guardados **por site** (por “origem”): o que guardas no site da NextByte não aparece noutros sites.
- Só guarda **texto** (strings). Para guardar objetos ou listas (arrays), usamos **JSON**: convertemos o objeto em texto com `JSON.stringify()` e, para ler, convertemos de volta com `JSON.parse()`.
- Tem um limite de tamanho (normalmente cerca de 5 MB por site), suficiente para listas de utilizadores e carrinho.

### Como se usa (resumo)

```javascript
// Guardar um valor
localStorage.setItem('minha_chave', 'meu valor');

// Ler um valor
var valor = localStorage.getItem('minha_chave');

// Remover um valor
localStorage.removeItem('minha_chave');
```

---

## 1. Registo e Login com LocalStorage

### O que foi feito

- **Registo**: ao criar conta (nome, email, palavra-passe), os dados são guardados numa lista no LocalStorage.
- **Login**: ao “Entrar”, o programa compara o email e a palavra-passe com os utilizadores guardados; se estiver certo, guarda quem está logado noutra chave.
- **Sessão**: em todas as páginas, o menu “Conta” mostra “Entrar” / “Registar” ou “Olá, [Nome]” e “Sair”, consoante exista ou não alguém logado.

### Onde está guardado (chaves)

| Chave no LocalStorage   | O que guarda |
|-------------------------|--------------|
| `nextbyte_users`        | Lista de todos os utilizadores registados. Cada utilizador tem: nome, email, password. |
| `nextbyte_user`         | Utilizador que está atualmente logado (nome e email). Se não estiver ninguém logado, esta chave não existe ou está vazia. |

### Como funciona (ideia geral)

1. **Registo** (`registo.html` + `js/auth.js`):
   - O utilizador preenche nome, email e palavra-passe e clica em “Criar conta”.
   - O JavaScript lê a lista `nextbyte_users` do LocalStorage (se não existir, usa uma lista vazia).
   - Verifica se já existe um utilizador com esse email; se existir, mostra erro.
   - Adiciona o novo utilizador à lista e guarda de novo com `localStorage.setItem('nextbyte_users', JSON.stringify(users))`.
   - Redireciona para a página de login.

2. **Login** (`login.html` + `js/auth.js`):
   - O utilizador escreve email e palavra-passe e clica em “Entrar”.
   - O JavaScript lê `nextbyte_users` e procura um utilizador com esse email e palavra-passe.
   - Se encontrar, guarda na chave `nextbyte_user` os dados da sessão (nome e email) com `localStorage.setItem('nextbyte_user', JSON.stringify(sessao))`.
   - Redireciona para a página principal.

3. **Sair**:
   - Remove a chave `nextbyte_user` com `localStorage.removeItem('nextbyte_user')`, ou seja, “esquece” quem está logado.

4. **Menu Conta** (em todas as páginas):
   - O ficheiro `auth.js` corre em todas as páginas que o incluem.
   - Ao carregar a página, lê `nextbyte_user`. Se existir, o menu mostra “Olá, [Nome]” e opção “Sair”; se não existir, mostra “Entrar” e “Registar”.

Assim, **toda a informação de utilizadores e de sessão vive no LocalStorage**, sem base de dados no servidor (é um projeto de front-end apenas).

---

## 2. Carrinho e compra com LocalStorage

### O que foi feito

- **Carrinho**: ao clicar em “Adicionar ao carrinho” num produto, esse produto (id, nome, preço, imagem, quantidade) é guardado no LocalStorage. O valor total no header é atualizado.
- **Página do carrinho** (`cart.html`): a tabela é preenchida a partir do que está guardado no LocalStorage; é possível alterar quantidades e remover itens.
- **Checkout** (`cheackout.html`): a tabela de resumo da encomenda é preenchida com o carrinho do LocalStorage; ao clicar em “Efetuar Pagamento”, os dados da fatura são guardados como “pedido”, o carrinho é limpo e o utilizador é redirecionado para a página principal (com mensagem de sucesso, se quiseres).

### Onde está guardado (chaves)

| Chave no LocalStorage   | O que guarda |
|------------------------|--------------|
| `nextbyte_cart`        | Lista (array) dos produtos no carrinho. Cada item tem: id, name, price, img, qty. |
| `nextbyte_orders`      | Lista de pedidos já efetuados (histórico). Cada pedido tem: data, itens, total, fatura (nome, morada, etc.). |

### Como funciona (ideia geral)

1. **Adicionar ao carrinho** (`index.html` / `shop.html` + `js/cart.js`):
   - Cada produto tem atributos `data-product-id`, `data-product-name`, `data-product-price`, `data-product-img` (ou o script lê do próprio HTML).
   - Ao clicar em “Adicionar ao carrinho”, o JavaScript chama `NextByteCart.addToCart({ id, name, price, img })`.
   - `addToCart` lê o carrinho atual com `localStorage.getItem('nextbyte_cart')`, converte com `JSON.parse`, adiciona o produto (ou aumenta a quantidade se já existir), e guarda de novo com `localStorage.setItem('nextbyte_cart', JSON.stringify(cart))`.
   - O total no header é atualizado (lendo o carrinho e somando preço × quantidade de cada item).

2. **Página do carrinho** (`cart.html`):
   - Ao carregar, o `cart.js` lê `nextbyte_cart` e desenha as linhas da tabela (nome, modelo/id, preço, quantidade, total, botão remover).
   - Os botões de +/- e “remover” alteram o array do carrinho e voltam a guardar no LocalStorage e a atualizar a tabela e o total.
   - “Efetuar Pagamento” leva o utilizador a `cheackout.html`.

3. **Checkout** (`cheackout.html`):
   - Ao carregar, um script lê o carrinho do LocalStorage (via `NextByteCart.getCart()`) e preenche a tabela de resumo (itens, subtotal, total).
   - O utilizador preenche o formulário (nome, morada, cidade, país, código postal, email, etc.).
   - Ao clicar em “Efetuar Pagamento”:
     - O script recolhe os dados do formulário (fatura).
     - Chama `NextByteCart.saveOrder(fatura)`, que:
       - Lê a lista `nextbyte_orders` do LocalStorage (ou cria uma vazia).
       - Adiciona um novo pedido (data, itens do carrinho, total, dados da fatura).
       - Guarda a lista em `nextbyte_orders`.
       - Limpa o carrinho (guarda `nextbyte_cart` como lista vazia).
     - Redireciona para `index.html?order=ok` (e podes mostrar uma mensagem “Encomenda efetuada com sucesso!” quando existir `?order=ok` na URL).

Assim, **o carrinho e o histórico de pedidos vivem no LocalStorage**, e todo o fluxo de compra (adicionar, alterar quantidade, remover, checkout, guardar encomenda) é feito no browser com estes dados.

---

## Resumo

- **LocalStorage** = memória do browser por site, que guarda texto (e, em JSON, listas e objetos) de forma persistente.
- **Registo/Login**: utilizadores em `nextbyte_users`, sessão em `nextbyte_user`; o menu “Conta” é atualizado a partir destes dados.
- **Carrinho e compra**: carrinho em `nextbyte_cart`, pedidos em `nextbyte_orders`; adicionar/remover/alterar quantidade e “Efetuar Pagamento” leem e escrevem sempre no LocalStorage.

Se quiseres ver o código concreto, abre os ficheiros `js/auth.js` e `js/cart.js` e segue as funções com os nomes referidos neste texto.
