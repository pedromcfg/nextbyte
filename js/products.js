(function () {
  "use strict";

  var products = [
    {
      id: "1",
      slug: "acer-chromebook-314",
      name: "Acer Chromebook 314",
      category: "Computadores",
      price: "219,99€",
      img: "img/Fotografias/1.jpg",
      shortDescription: "Portatil leve e rapido para estudo, navegacao e tarefas do dia a dia.",
      longDescription: "O Acer Chromebook 314 e uma opcao pratica para quem procura autonomia, simplicidade e rapidez para trabalho escolar e tarefas diarias."
    },
    {
      id: "2",
      slug: "sony-alpha-7-iii",
      name: "Sony Alpha 7 III",
      category: "Camara",
      price: "1.549,99€",
      img: "img/Fotografias/2.jpg",
      shortDescription: "Camara full-frame com excelente qualidade de imagem e desempenho em baixa luz.",
      longDescription: "A Sony Alpha 7 III oferece qualidade profissional com sensor full-frame, boa performance em pouca luz e gravacao de video 4K para foto e video avancado."
    },
    {
      id: "3",
      slug: "samsung-galaxy-s25",
      name: "SAMSUNG Galaxy S25",
      category: "Telemovel",
      price: "600,00€",
      img: "img/Fotografias/3.jpg",
      shortDescription: "Smartphone premium com desempenho rapido e cameras avancadas.",
      longDescription: "O SAMSUNG Galaxy S25 combina desempenho, autonomia e qualidade de imagem para uso diario, redes sociais, produtividade e entretenimento."
    },
    {
      id: "4",
      slug: "razer-viper-v3-pro",
      name: "Razer Viper V3 Pro",
      category: "Gaming",
      price: "169,99€",
      img: "img/Fotografias/4.jpg",
      shortDescription: "Rato gaming leve e preciso, pensado para competicao.",
      longDescription: "O Razer Viper V3 Pro destaca-se pelo baixo peso, sensor de alta precisao e resposta rapida, ideal para jogadores exigentes."
    },
    {
      id: "5",
      slug: "denon-ah-gc25nc",
      name: "Denon Ah-Gc25Nc",
      category: "Audio",
      price: "299,99€",
      img: "img/Fotografias/5.jpg",
      shortDescription: "Auscultadores com conforto e qualidade de som premium.",
      longDescription: "Os Denon Ah-Gc25Nc oferecem boa qualidade sonora, conforto para uso prolongado e uma experiencia audio equilibrada."
    },
    {
      id: "6",
      slug: "monitor-curvo-samsung",
      name: "Monitor Curvo SAMSUNG",
      category: "Monitores",
      price: "449,99€",
      img: "img/Fotografias/6.jpg",
      shortDescription: "Monitor curvo com boa imersao para trabalho e gaming.",
      longDescription: "O Monitor Curvo SAMSUNG foi pensado para uma visualizacao mais envolvente, com bom tamanho e qualidade para produtividade e lazer."
    },
    {
      id: "7",
      slug: "cadeira-gaming-dr35",
      name: "Cadeira Gaming DR35",
      category: "Gaming",
      price: "109,99€",
      img: "img/Fotografias/7.jpg",
      shortDescription: "Cadeira ergonomica para conforto em sessoes longas.",
      longDescription: "A Cadeira Gaming DR35 oferece suporte e conforto para longas horas de jogo, estudo ou trabalho."
    },
    {
      id: "8",
      slug: "teclado-steelseries",
      name: "Teclado SteelSeries",
      category: "Gaming",
      price: "249,99€",
      img: "img/Fotografias/8.jpg",
      shortDescription: "Teclado mecanico gaming com resposta rapida e durabilidade.",
      longDescription: "O Teclado SteelSeries foi desenhado para desempenho e consistencia, com foco em rapidez e conforto na escrita e no jogo."
    },
    {
      id: "9",
      slug: "tapete-rgb",
      name: "Tapete RGB",
      category: "Gaming",
      price: "15,00€",
      img: "img/Fotografias/9.jpg",
      shortDescription: "Tapete de rato com iluminacao RGB e superficie estavel.",
      longDescription: "O Tapete RGB melhora o controlo do rato e adiciona um toque visual ao setup com iluminacao personalizavel."
    },
    {
      id: "10",
      slug: "microfone-trust",
      name: "Microfone Trust",
      category: "Audio",
      price: "40,00€",
      img: "img/Fotografias/10.jpg",
      shortDescription: "Microfone pratico para chamadas, streaming e gravacoes.",
      longDescription: "O Microfone Trust e uma opcao acessivel para comunicacao clara em chamadas, aulas online, gaming e criacao de conteudo."
    }
  ];

  function normalizeText(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function getBySlug(slug) {
    var target = normalizeText(slug);
    return products.find(function (p) { return p.slug === target; }) || null;
  }

  function search(query, maxResults) {
    var q = normalizeText(query);
    if (!q) return [];
    var ranked = products
      .map(function (p) {
        var name = normalizeText(p.name);
        var category = normalizeText(p.category);
        var score = 0;
        if (name === q) score += 100;
        else if (name.indexOf(q) !== -1) score += 50;
        if (category.indexOf(q) !== -1) score += 25;
        return { product: p, score: score };
      })
      .filter(function (entry) { return entry.score > 0; })
      .sort(function (a, b) { return b.score - a.score; })
      .map(function (entry) { return entry.product; });

    return ranked.slice(0, maxResults || 8);
  }

  window.NextByteProducts = {
    all: products,
    getBySlug: getBySlug,
    search: search
  };
})();
