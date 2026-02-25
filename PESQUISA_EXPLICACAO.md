# Pesquisa de produtos - explicacao simples

Este documento explica, de forma simples, como foi implementado o sistema de pesquisa no projeto.

## Objetivo

Permitir que, em qualquer pagina com barra de pesquisa no navbar, o utilizador:

- escreva o que procura;
- veja logo uma interface com resultados;
- clique no resultado para abrir a pagina do produto;
- receba mensagem quando nao houver resultados.

---

## 1) Ficheiro `js/products.js` (base de dados de produtos)

Foi criado um ficheiro com uma lista unica de produtos.

Cada produto tem, por exemplo:

- `id`
- `slug` (identificador para URL, por exemplo `sony-alpha-7-iii`)
- `name`
- `category`
- `price`
- `img`
- `shortDescription`
- `longDescription`

### Porque isto e importante?

Sem esta lista central, cada pagina podia ter dados diferentes.  
Com este ficheiro, a pesquisa e a pagina de produto usam exatamente os mesmos dados.

---

## 2) Ficheiro `js/search.js` (interface de pesquisa)

Este ficheiro faz a logica da pesquisa no frontend.

### O que ele faz:

1. Procura as barras de pesquisa do navbar na pagina.
2. Cria um painel de resultados por baixo do input.
3. Enquanto o utilizador escreve:
   - filtra produtos por nome/categoria;
   - mostra resultados clicaveis.
4. Se nao existir nenhum resultado:
   - mostra a mensagem: **"Nao foi encontrado nenhum produto."**
5. Ao clicar num resultado:
   - abre `single.html?product=<slug-do-produto>`.

### Extra:

- Tecla `Enter` abre o primeiro resultado.
- Tecla `Esc` fecha o painel.
- Clicar fora fecha o painel.

---

## 3) Pagina de produto `single.html`

A `single.html` foi preparada para ler o parametro `product` na URL:

- Exemplo: `single.html?product=sony-alpha-7-iii`

Com esse valor, a pagina vai buscar os dados ao `js/products.js` e atualiza:

- nome;
- categoria;
- preco;
- descricao;
- imagem.

Assim, os resultados da pesquisa ja abrem o produto correto.

---

## 4) Inclusao dos scripts em todas as paginas

Nas paginas com navbar de pesquisa, foram incluidos:

- `js/products.js`
- `js/search.js`

Desta forma, a pesquisa funciona em qualquer pagina onde exista a barra.

---

## 5) Como testar rapidamente

1. Abrir qualquer pagina do site.
2. Escrever algo na pesquisa (ex.: `sony`, `samsung`, `monitor`, `teclado`).
3. Confirmar que aparecem resultados.
4. Clicar num resultado e verificar se abre a pagina correta.
5. Escrever algo que nao exista (ex.: `banana`) e verificar a mensagem de nao encontrado.

---

## Resumo final

- `products.js` = dados centralizados dos produtos.
- `search.js` = interface + logica de pesquisa no navbar.
- `single.html?product=...` = abre o produto certo.
- Resultado: pesquisa funcional e consistente em todas as paginas com barra de pesquisa.

