// js/multicondo.js
// Dados de exemplo utilizados pelos dashboards

window.multiCondo = {
  "Condom\u00ednio Exemplo": {
    dataInicio: "2024-01", // ano-m\u00eas inicial
    dataFinal: "2024-12",   // ano-m\u00eas final
    percInad: 5,            // percentual de inadimpl\u00eancia
    receitas: [             // receitas fixas mensais
      { men: 2000 }
    ],
    despesas: [             // despesas fixas mensais
      { men: 500, cat: "Manuten\u00e7\u00e3o" },
      { men: 300, cat: "Luz" }
    ],
    timeline: []            // eventos exibidos na aba de timeline
  }
};

// Condom\u00ednio exibido por padr\u00e3o
window.atual = "Condom\u00ednio Exemplo";

// Retorna lista de meses entre dataInicio e dataFinal no formato YYYY-MM
window.getPeriodoMeses = function(inicio, fim) {
  if (!inicio || !fim) return [];
  const meses = [];
  let d = new Date(inicio + "-01");
  const end = new Date(fim + "-01");
  while (d <= end) {
    meses.push(d.toISOString().slice(0, 7));
    d.setMonth(d.getMonth() + 1);
  }
  return meses;
};

// Salva o objeto multiCondo no localStorage
window.salvarMulti = function() {
  try {
    localStorage.setItem("multiCondoData", JSON.stringify(window.multiCondo));
  } catch (e) {}
};

// Recupera dados salvos anteriormente do localStorage
window.carregarMulti = function() {
  try {
    const dados = localStorage.getItem("multiCondoData");
    if (dados) {
      window.multiCondo = JSON.parse(dados);
    }
  } catch (e) {}
};

// Cria menu superior e controla a troca de abas
window.criarMenuAbas = function() {
  const definicoes = [
    { id: "dashboardGeral", label: "Geral", update: window.dashboardGeralUpdate },
    { id: "dashboardFluxo", label: "Fluxo", update: window.dashboardFluxoUpdate },
    { id: "dashboardHeatmap", label: "Heatmap", update: window.dashboardHeatmapUpdate },
    { id: "dashboardComparativo", label: "Comparativo", update: window.dashboardComparativoUpdate },
    { id: "dashboardTimeline", label: "Timeline", update: window.dashboardTimelineUpdate }
  ];
  const menu = document.getElementById("menuAbas");
  if (!menu) return;
  menu.innerHTML = definicoes
    .map((a, i) => `<button class="btnAbaPlug${i === 0 ? ' active' : ''}" data-aba="${a.id}">${a.label}</button>`)
    .join("");
  const botoes = menu.querySelectorAll("button");
  botoes.forEach(btn => btn.addEventListener("click", () => {
    botoes.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    definicoes.forEach(def => {
      const sec = document.getElementById(def.id);
      if (sec) sec.style.display = def.id === btn.dataset.aba ? "" : "none";
    });
    const def = definicoes.find(d => d.id === btn.dataset.aba);
    if (def && typeof def.update === "function") def.update();
  }));
  definicoes.forEach((def, i) => {
    const sec = document.getElementById(def.id);
    if (sec) sec.style.display = i === 0 ? "" : "none";
  });
};

// Ao carregar o documento, restaura dados e atualiza todos os dashboards
window.addEventListener("DOMContentLoaded", () => {
  window.carregarMulti();
  window.criarMenuAbas();
  if (typeof dashboardGeralUpdate === "function") dashboardGeralUpdate();
  if (typeof dashboardFluxoUpdate === "function") dashboardFluxoUpdate();
  if (typeof dashboardHeatmapUpdate === "function") dashboardHeatmapUpdate();
  if (typeof dashboardComparativoUpdate === "function") dashboardComparativoUpdate();
  if (typeof dashboardTimelineUpdate === "function") dashboardTimelineUpdate();
});
