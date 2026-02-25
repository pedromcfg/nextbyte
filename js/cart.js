/**
 * Carrinho e compra com LocalStorage - NextByte
 * Chave do carrinho: nextbyte_cart (array de { id, name, price, img, qty })
 * Chave dos pedidos (histórico): nextbyte_orders (array de pedidos)
 */

(function () {
  'use strict';

  var STORAGE_CART = 'nextbyte_cart';
  var STORAGE_ORDERS = 'nextbyte_orders';

  function getCart() {
    var json = localStorage.getItem(STORAGE_CART);
    if (!json) return [];
    try {
      return JSON.parse(json);
    } catch (e) {
      return [];
    }
  }

  function setCart(cart) {
    localStorage.setItem(STORAGE_CART, JSON.stringify(cart));
    updateHeaderTotal();
  }

  /** Adiciona ou incrementa um produto no carrinho. */
  function addToCart(product) {
    var unitPrice = parsePrice(product.price);
    var cart = getCart();
    var item = cart.find(function (p) { return p.id === product.id; });
    if (item) {
      item.qty = (item.qty || 1) + 1;
      item.price = unitPrice;
      if (product.name) item.name = product.name;
      if (product.img) item.img = product.img;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: unitPrice,
        img: product.img || '',
        qty: 1
      });
    }
    setCart(cart);
    return cart;
  }

  function removeFromCart(id) {
    var cart = getCart().filter(function (p) { return p.id !== id; });
    setCart(cart);
    return cart;
  }

  function updateQuantity(id, qty) {
    if (qty < 1) return removeFromCart(id);
    var cart = getCart();
    var item = cart.find(function (p) { return p.id === id; });
    if (item) {
      item.qty = qty;
      setCart(cart);
    }
    return cart;
  }

  /** Preço total do carrinho (número). */
  function getCartTotal() {
    return getCart().reduce(function (sum, p) {
      return sum + parsePrice(p.price) * (p.qty || 1);
    }, 0);
  }

  function getCartCount() {
    return getCart().reduce(function (sum, p) { return sum + (p.qty || 1); }, 0);
  }

  /** Atualiza o valor do carrinho no header (elemento com id "cart-total" ou .cart-total). */
  function updateHeaderTotal() {
    var el = document.getElementById('cart-total') || document.querySelector('.cart-total');
    if (el) {
      var total = getCartTotal();
      el.textContent = total.toFixed(2).replace('.', ',') + ' €';
    }
    var countEl = document.getElementById('cart-count') || document.querySelector('.cart-count');
    if (countEl) countEl.textContent = getCartCount();
  }

  /** Desenha a tabela do carrinho na página (cart.html). */
  function renderCartPage() {
    var tbody = document.querySelector('.container-fluid.py-5 .table tbody');
    var totalBlock = document.querySelector('.bg-light.rounded .d-flex.justify-content-between.mb-4');
    var totalFinalEl = document.querySelector('.cart-total-final') || document.querySelector('.bg-light.rounded .border-top.border-bottom .mb-0.pe-4');
    var btnPagamento = document.getElementById('btn-efetuar-pagamento') || document.querySelector('.btn-primary.rounded-pill.px-4.py-3.text-uppercase');
    var cart = getCart();

    if (!tbody) return;

    if (cart.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center py-5">O carrinho está vazio. <a href="shop.html">Ir à loja</a></td></tr>';
      if (totalFinalEl) totalFinalEl.textContent = '0,00 €';
      if (btnPagamento) btnPagamento.disabled = true;
      return;
    }

    var html = '';
    cart.forEach(function (p) {
      var preco = parsePrice(p.price);
      var total = preco * (p.qty || 1);
      html +=
        '<tr data-cart-id="' + escapeHtml(p.id) + '">' +
        '<th scope="row"><p class="mb-0 py-4">' + escapeHtml(p.name) + '</p></th>' +
        '<td><p class="mb-0 py-4">' + escapeHtml(p.id) + '</p></td>' +
        '<td><p class="mb-0 py-4 cart-item-price">' + formatPrice(preco) + '</p></td>' +
        '<td><div class="input-group quantity py-4" style="width: 100px;">' +
        '<button type="button" class="btn btn-sm btn-minus rounded-circle bg-light border"><i class="fa fa-minus"></i></button>' +
        '<input type="number" class="form-control form-control-sm text-center border-0 cart-qty" value="' + (p.qty || 1) + '" min="1">' +
        '<button type="button" class="btn btn-sm btn-plus rounded-circle bg-light border"><i class="fa fa-plus"></i></button>' +
        '</div></td>' +
        '<td><p class="mb-0 py-4 cart-item-total">' + formatPrice(total) + '</p></td>' +
        '<td class="py-4"><button type="button" class="btn btn-md rounded-circle bg-light border btn-remove-cart"><i class="fa fa-times text-danger"></i></button></td>' +
        '</tr>';
    });
    tbody.innerHTML = html;

    if (totalFinalEl) totalFinalEl.textContent = formatPrice(getCartTotal());
    if (btnPagamento) {
      btnPagamento.disabled = false;
      btnPagamento.onclick = function () { window.location.href = 'cheackout.html'; };
    }

    // Eventos: +/- e remover
    tbody.querySelectorAll('.btn-minus').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var row = btn.closest('tr');
        var id = row.getAttribute('data-cart-id');
        var input = row.querySelector('.cart-qty');
        var qty = Math.max(1, parseInt(input.value, 10) - 1);
        input.value = qty;
        updateQuantity(id, qty);
        refreshCartRow(row);
        totalFinalEl.textContent = formatPrice(getCartTotal());
      });
    });
    tbody.querySelectorAll('.btn-plus').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var row = btn.closest('tr');
        var id = row.getAttribute('data-cart-id');
        var input = row.querySelector('.cart-qty');
        var qty = parseInt(input.value, 10) + 1;
        input.value = qty;
        updateQuantity(id, qty);
        refreshCartRow(row);
        totalFinalEl.textContent = formatPrice(getCartTotal());
      });
    });
    tbody.querySelectorAll('.cart-qty').forEach(function (input) {
      input.addEventListener('change', function () {
        var row = input.closest('tr');
        var id = row.getAttribute('data-cart-id');
        var qty = Math.max(1, parseInt(input.value, 10) || 1);
        input.value = qty;
        updateQuantity(id, qty);
        refreshCartRow(row);
        totalFinalEl.textContent = formatPrice(getCartTotal());
      });
    });
    tbody.querySelectorAll('.btn-remove-cart').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var row = btn.closest('tr');
        var id = row.getAttribute('data-cart-id');
        removeFromCart(id);
        row.remove();
        if (getCart().length === 0) {
          tbody.innerHTML = '<tr><td colspan="6" class="text-center py-5">O carrinho está vazio. <a href="shop.html">Ir à loja</a></td></tr>';
          if (btnPagamento) btnPagamento.disabled = true;
        }
        totalFinalEl.textContent = formatPrice(getCartTotal());
      });
    });
  }

  function refreshCartRow(row) {
    var id = row.getAttribute('data-cart-id');
    var cart = getCart();
    var p = cart.find(function (x) { return x.id === id; });
    if (!p) return;
    var preco = parsePrice(p.price);
    var total = preco * (p.qty || 1);
    row.querySelector('.cart-item-total').textContent = formatPrice(total);
  }

  /**
   * Converte formatos de preço comuns do HTML:
   *  - "1.549,99€" -> 1549.99
   *  - "1549,99"   -> 1549.99
   *  - "1,549.99"  -> 1549.99
   *  - 40          -> 40
   */
  function parsePrice(value) {
    if (typeof value === 'number') return value;
    var raw = String(value || '').trim();
    if (!raw) return 0;
    var cleaned = raw.replace(/[^\d,.\-]/g, '');
    var lastComma = cleaned.lastIndexOf(',');
    var lastDot = cleaned.lastIndexOf('.');
    if (lastComma > -1 && lastDot > -1) {
      if (lastComma > lastDot) {
        cleaned = cleaned.replace(/\./g, '').replace(',', '.');
      } else {
        cleaned = cleaned.replace(/,/g, '');
      }
    } else if (lastComma > -1) {
      cleaned = cleaned.replace(',', '.');
    }
    var parsed = parseFloat(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function formatPrice(n) {
    return n.toFixed(2).replace('.', ',') + ' €';
  }

  function ensureToastStyles() {
    if (document.getElementById('nb-toast-style')) return;
    var style = document.createElement('style');
    style.id = 'nb-toast-style';
    style.textContent =
      '.nb-toast-wrap{position:fixed;top:20px;right:20px;z-index:5000;display:flex;flex-direction:column;gap:10px;}' +
      '.nb-toast{background:#ffffff;border:1px solid #e9ecef;border-left:4px solid #0d6efd;color:#212529;border-radius:10px;min-width:260px;max-width:360px;padding:12px 14px;box-shadow:0 8px 24px rgba(0,0,0,.12);opacity:0;transform:translateY(-8px);transition:all .25s ease;}' +
      '.nb-toast.show{opacity:1;transform:translateY(0);}' +
      '.nb-toast-title{font-weight:700;font-size:14px;line-height:1.2;margin-bottom:3px;}' +
      '.nb-toast-msg{font-size:13px;line-height:1.3;color:#495057;}';
    document.head.appendChild(style);
  }

  function ensureToastWrap() {
    ensureToastStyles();
    var wrap = document.getElementById('nb-toast-wrap');
    if (wrap) return wrap;
    wrap = document.createElement('div');
    wrap.id = 'nb-toast-wrap';
    wrap.className = 'nb-toast-wrap';
    document.body.appendChild(wrap);
    return wrap;
  }

  /** Notificação visual discreta para feedback de ações. */
  function showToast(message, title) {
    if (typeof document === 'undefined' || !document.body) return;
    var wrap = ensureToastWrap();
    var toast = document.createElement('div');
    toast.className = 'nb-toast';
    toast.innerHTML =
      '<div class="nb-toast-title">' + escapeHtml(title || 'Carrinho') + '</div>' +
      '<div class="nb-toast-msg">' + escapeHtml(message || '') + '</div>';
    wrap.appendChild(toast);

    requestAnimationFrame(function () {
      toast.classList.add('show');
    });

    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 250);
    }, 2200);
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /** Guarda um pedido (após checkout) e limpa o carrinho. */
  function saveOrder(detalhesFatura) {
    var cart = getCart();
    if (cart.length === 0) return false;
    var orders = [];
    try {
      var j = localStorage.getItem(STORAGE_ORDERS);
      if (j) orders = JSON.parse(j);
    } catch (e) {}
    orders.push({
      data: new Date().toISOString(),
      itens: cart.slice(),
      total: getCartTotal(),
      fatura: detalhesFatura || {}
    });
    localStorage.setItem(STORAGE_ORDERS, JSON.stringify(orders));
    setCart([]);
    return true;
  }

  window.NextByteCart = {
    getCart: getCart,
    setCart: setCart,
    addToCart: addToCart,
    removeFromCart: removeFromCart,
    updateQuantity: updateQuantity,
    getCartTotal: getCartTotal,
    getCartCount: getCartCount,
    updateHeaderTotal: updateHeaderTotal,
    renderCartPage: renderCartPage,
    saveOrder: saveOrder,
    formatPrice: formatPrice,
    showToast: showToast,
    bindAddToCartButtons: bindAddToCartButtons,
    bindViewProductLinks: bindViewProductLinks
  };
  window.showToast = showToast;

  /** Liga os botões "Adicionar ao carrinho" nos cards de produto (index/shop). */
  function bindAddToCartButtons() {
    document.querySelectorAll('.product-item').forEach(function (item) {
      var btn = item.querySelector('.product-item-add a.btn, .product-item-add .btn-primary');
      if (!btn || !btn.closest('.product-item-add')) return;
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var imgEl = item.querySelector('.product-item-inner img');
        var nameEl = item.querySelector('.text-center.rounded-bottom .d-block.h4, .text-center.rounded-bottom a.d-block.h4');
        var priceEl = item.querySelector('.text-primary.fs-5');
        var id = item.getAttribute('data-product-id');
        var name = item.getAttribute('data-product-name') || (nameEl ? nameEl.textContent.trim() : 'Produto');
        var priceRaw = priceEl ? priceEl.textContent.trim() : item.getAttribute('data-product-price');
        var img = item.getAttribute('data-product-img') || (imgEl ? imgEl.src : '');
        if (!id) {
          var m = img && img.match(/(\d+)\.jpg/);
          id = m ? m[1] : name.toLowerCase().replace(/\s+/g, '-');
        }
        addToCart({ id: id, name: name, price: parsePrice(priceRaw), img: img });
        updateHeaderTotal();
        showToast('Produto adicionado ao carrinho!', 'NextByte');
      });
    });
  }

  /** Garante que o ícone de "ver produto" abre a página correta. */
  function bindViewProductLinks() {
    var productsApi = window.NextByteProducts;
    var allProducts = productsApi && Array.isArray(productsApi.all) ? productsApi.all : [];

    function normalizeName(value) {
      return String(value || '')
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();
    }

    function resolveSlugFromItem(item) {
      var id = item.getAttribute('data-product-id');
      if (id && allProducts.length) {
        var byId = allProducts.find(function (p) { return String(p.id) === String(id); });
        if (byId) return byId.slug;
      }

      var nameEl = item.querySelector('.text-center.rounded-bottom .d-block.h4, .text-center.rounded-bottom a.d-block.h4, .products-mini-content .d-block.h4');
      var nameText = normalizeName(nameEl ? nameEl.textContent : '');
      if (nameText && allProducts.length) {
        var byName = allProducts.find(function (p) { return normalizeName(p.name) === nameText; });
        if (byName) return byName.slug;
      }

      var imgEl = item.querySelector('img');
      var imgSrc = imgEl ? (imgEl.getAttribute('src') || '') : '';
      var photoMatch = imgSrc.match(/Fotografias\/(\d+)\.jpg/i);
      if (photoMatch && allProducts.length) {
        var byPhotoId = allProducts.find(function (p) { return String(p.id) === String(photoMatch[1]); });
        if (byPhotoId) return byPhotoId.slug;
      }

      if (nameText.indexOf('apple ipad mini') !== -1) return 'apple-ipad-mini-g2356';
      if (/img\/product-\d+\.png/i.test(imgSrc)) return 'apple-ipad-mini-g2356';
      return null;
    }

    document.querySelectorAll('a').forEach(function (eyeLink) {
      if (!eyeLink.querySelector('i.fa-eye')) return;
      var href = (eyeLink.getAttribute('href') || '').trim();
      if (href && href !== '#') return;

      var item = eyeLink.closest('.product-item, .products-mini-item');
      if (!item) return;

      var slug = resolveSlugFromItem(item);
      if (!slug) return;
      eyeLink.setAttribute('href', 'single.html?product=' + encodeURIComponent(slug));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      updateHeaderTotal();
      if (document.querySelector('.container-fluid.py-5 .table tbody')) renderCartPage();
      bindAddToCartButtons();
      bindViewProductLinks();
    });
  } else {
    updateHeaderTotal();
    if (document.querySelector('.container-fluid.py-5 .table tbody')) renderCartPage();
    bindAddToCartButtons();
    bindViewProductLinks();
  }
})();
