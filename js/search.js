(function () {
  "use strict";

  function ensureStyles() {
    if (document.getElementById("nb-search-styles")) return;
    var style = document.createElement("style");
    style.id = "nb-search-styles";
    style.textContent = ""
      + ".nb-search-panel{position:absolute;left:0;right:0;top:calc(100% + 8px);z-index:2500;background:#fff;border:1px solid #e6e6e6;border-radius:12px;box-shadow:0 10px 25px rgba(0,0,0,.08);max-height:320px;overflow:auto;}"
      + ".nb-search-panel.d-none{display:none;}"
      + ".nb-search-result{display:flex;align-items:center;gap:12px;padding:10px 12px;text-decoration:none;border-bottom:1px solid #f1f1f1;}"
      + ".nb-search-result:last-child{border-bottom:none;}"
      + ".nb-search-result:hover{background:#f8f9fa;}"
      + ".nb-search-result img{width:42px;height:42px;object-fit:cover;border-radius:8px;flex:0 0 42px;}"
      + ".nb-search-result-title{font-weight:600;color:#212529;line-height:1.2;}"
      + ".nb-search-result-meta{font-size:12px;color:#6c757d;line-height:1.1;}"
      + ".nb-search-empty{padding:14px 12px;color:#6c757d;font-size:14px;}";
    document.head.appendChild(style);
  }

  function createResultItem(product) {
    var link = document.createElement("a");
    link.className = "nb-search-result";
    link.href = "single.html?product=" + encodeURIComponent(product.slug);
    link.innerHTML =
      "<img src=\"" + product.img + "\" alt=\"" + product.name + "\">"
      + "<div>"
      + "<div class=\"nb-search-result-title\">" + product.name + "</div>"
      + "<div class=\"nb-search-result-meta\">" + product.category + " - " + product.price + "</div>"
      + "</div>";
    return link;
  }

  function mountSearchInterface(container) {
    var input = container.querySelector("input.form-control");
    var button = container.querySelector("button.btn.btn-primary");
    if (!input || !button) return;
    if (container.getAttribute("data-nb-search-ready") === "1") return;

    container.setAttribute("data-nb-search-ready", "1");
    container.style.position = "relative";

    var panel = document.createElement("div");
    panel.className = "nb-search-panel d-none";
    container.appendChild(panel);

    function hidePanel() {
      panel.classList.add("d-none");
      panel.innerHTML = "";
    }

    function renderResults() {
      var query = (input.value || "").trim();
      if (!query) {
        hidePanel();
        return;
      }
      var api = window.NextByteProducts;
      if (!api || typeof api.search !== "function") return;
      var results = api.search(query, 8);

      panel.innerHTML = "";
      if (!results.length) {
        panel.innerHTML = "<div class=\"nb-search-empty\">Não foi encontrado nenhum produto.</div>";
      } else {
        results.forEach(function (product) {
          panel.appendChild(createResultItem(product));
        });
      }
      panel.classList.remove("d-none");
    }

    input.addEventListener("input", renderResults);
    input.addEventListener("focus", renderResults);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        hidePanel();
        return;
      }
      if (e.key === "Enter") {
        var first = panel.querySelector(".nb-search-result");
        if (first) {
          e.preventDefault();
          window.location.href = first.href;
        } else {
          e.preventDefault();
          renderResults();
        }
      }
    });

    button.addEventListener("click", function (e) {
      e.preventDefault();
      renderResults();
      input.focus();
    });

    document.addEventListener("click", function (e) {
      if (!container.contains(e.target)) hidePanel();
    });
  }

  function initSearch() {
    if (!window.NextByteProducts) return;
    ensureStyles();
    var containers = document.querySelectorAll(".container-fluid.px-5.py-4 .position-relative.ps-4");
    containers.forEach(mountSearchInterface);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSearch);
  } else {
    initSearch();
  }
})();
