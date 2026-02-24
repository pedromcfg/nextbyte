/**
 * Sistema de Registo e Login com LocalStorage - NextByte
 * Chave dos utilizadores: nextbyte_users (array de objetos {email, password, nome})
 * Utilizador em sessão: nextbyte_user (objeto {email, nome} ou null)
 */

(function () {
  'use strict';

  var STORAGE_USERS = 'nextbyte_users';
  var STORAGE_CURRENT = 'nextbyte_user';

  /** Devolve todos os utilizadores guardados (array). */
  function getUsers() {
    var json = localStorage.getItem(STORAGE_USERS);
    if (!json) return [];
    try {
      return JSON.parse(json);
    } catch (e) {
      return [];
    }
  }

  /** Guarda o array de utilizadores no LocalStorage. */
  function setUsers(users) {
    localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
  }

  /** Regista um novo utilizador. email e password e nome são obrigatórios. */
  function registar(nome, email, password) {
    var users = getUsers();
    var existe = users.some(function (u) { return u.email.toLowerCase() === email.toLowerCase(); });
    if (existe) return { ok: false, msg: 'Já existe uma conta com este email.' };
    users.push({
      nome: nome,
      email: email.toLowerCase(),
      password: password
    });
    setUsers(users);
    return { ok: true };
  }

  /** Faz login. Devolve { ok: true, user: { nome, email } } ou { ok: false, msg: '...' }. */
  function login(email, password) {
    var users = getUsers();
    var user = users.find(function (u) {
      return u.email.toLowerCase() === email.toLowerCase() && u.password === password;
    });
    if (!user) return { ok: false, msg: 'Email ou palavra-passe incorretos.' };
    var sessao = { nome: user.nome, email: user.email };
    localStorage.setItem(STORAGE_CURRENT, JSON.stringify(sessao));
    return { ok: true, user: sessao };
  }

  /** Termina a sessão (remove utilizador atual). */
  function logout() {
    localStorage.removeItem(STORAGE_CURRENT);
  }

  /** Devolve o utilizador atualmente logado ou null. */
  function getCurrentUser() {
    var json = localStorage.getItem(STORAGE_CURRENT);
    if (!json) return null;
    try {
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  }

  /** Atualiza o menu Conta em todas as páginas: mostrar "Entrar" / "Registar" ou "Olá, Nome" e "Sair". */
  function updateAccountMenu() {
    var user = getCurrentUser();
    var dropdown = document.querySelector('.dropdown .dropdown-toggle.text-muted.ms-2');
    if (!dropdown) return;
    var menu = dropdown.nextElementSibling;
    if (!menu || !menu.classList.contains('dropdown-menu')) return;

    if (user) {
      dropdown.innerHTML = '<small><i class="fa fa-user me-2"></i> ' + escapeHtml(user.nome) + '</small>';
      menu.innerHTML =
        '<a href="cart.html" class="dropdown-item">Carrinho</a>' +
        '<a href="#" class="dropdown-item" id="auth-logout">Sair</a>';
      var logoutBtn = document.getElementById('auth-logout');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
          e.preventDefault();
          logout();
          window.location.reload();
        });
      }
    } else {
      dropdown.innerHTML = '<small><i class="fa fa-home me-2"></i> Conta</small>';
      menu.innerHTML =
        '<a href="login.html" class="dropdown-item">Entrar</a>' +
        '<a href="registo.html" class="dropdown-item">Registar</a>' +
        '<a href="cart.html" class="dropdown-item">Carrinho</a>';
    }
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // API pública para as páginas
  window.NextByteAuth = {
    getUsers: getUsers,
    registar: registar,
    login: login,
    logout: logout,
    getCurrentUser: getCurrentUser,
    updateAccountMenu: updateAccountMenu
  };

  // Atualizar menu quando o script carrega (em todas as páginas)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateAccountMenu);
  } else {
    updateAccountMenu();
  }
})();
