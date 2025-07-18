(function(){
  // Carrega dados existentes ou define exemplo
  window.multiCondo = JSON.parse(localStorage.getItem('multiCondo')||'{}');
  if(Object.keys(window.multiCondo).length===0){
    window.multiCondo = {
      "Condom\u00ednio Alfa": {
        dataInicio: "2025-01",
        dataFinal: "2025-12",
        percInad: 5,
        receitas: [
          {desc:"Taxa Condominial",men:12000},
          {desc:"Aluguel",men:1000}
        ],
        despesas: [
          {cat:"Manuten\u00e7\u00e3o",men:3500},
          {cat:"Pessoal",men:4500}
        ],
        timeline: []
      },
      "Condom\u00ednio Beta": {
        dataInicio: "2025-01",
        dataFinal: "2025-12",
        percInad: 8,
        receitas: [
          {desc:"Taxa Condominial",men:9000}
        ],
        despesas: [
          {cat:"Servi\u00e7os",men:3000},
          {cat:"Pessoal",men:2500}
        ],
        timeline: []
      }
    };
    salvarMulti();
  }
  window.atual = Object.keys(window.multiCondo)[0];

  // Salva dados no localStorage
  window.salvarMulti = function(){
    localStorage.setItem('multiCondo', JSON.stringify(window.multiCondo));
  };

  // Retorna array de meses no formato YYYY-MM entre inicio e fim (inclusivos)
  window.getPeriodoMeses = function(inicio,fim){
    if(!inicio || !fim) return [];
    let [yi,mi] = inicio.split('-').map(Number);
    let [yf,mf] = fim.split('-').map(Number);
    if(!(yi&&mi&&yf&&mf)) return [];
    let d = new Date(yi,mi-1,1);
    let end = new Date(yf,mf-1,1);
    let meses = [];
    while(d <= end){
      let y = d.getFullYear();
      let m = String(d.getMonth()+1).padStart(2,'0');
      meses.push(`${y}-${m}`);
      d.setMonth(d.getMonth()+1);
    }
    return meses;
  };

  function renderMenu(){
    let nav = document.getElementById('menuAbas');
    nav.innerHTML = `
      <select id="selCondo" style="margin-right:12px;"></select>
      <button class="btnAbaPlug active" data-aba="dashboardGeral">Geral</button>
      <button class="btnAbaPlug" data-aba="dashboardFluxo">Fluxo</button>
      <button class="btnAbaPlug" data-aba="dashboardHeatmap">Heatmap</button>
      <button class="btnAbaPlug" data-aba="dashboardComparativo">Comparativo</button>
      <button class="btnAbaPlug" data-aba="dashboardTimeline">Timeline</button>`;
    let sel = document.getElementById('selCondo');
    Object.keys(window.multiCondo).forEach(n=>{
      sel.innerHTML += `<option value="${n}">${n}</option>`;
    });
    sel.value = window.atual;
    sel.onchange = ()=>{ window.atual = sel.value; atualizar(); };

    nav.querySelectorAll('.btnAbaPlug').forEach(btn=>{
      btn.onclick = ()=>{
        nav.querySelectorAll('.btnAbaPlug').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.abaPlugavel').forEach(s=>s.style.display='none');
        document.getElementById(btn.getAttribute('data-aba')).style.display='';
        atualizar();
      };
    });
  }

  function atualizar(){
    let aba = document.querySelector('.btnAbaPlug.active').getAttribute('data-aba');
    switch(aba){
      case 'dashboardGeral': window.dashboardGeralUpdate(); break;
      case 'dashboardFluxo': window.dashboardFluxoUpdate(); break;
      case 'dashboardHeatmap': window.dashboardHeatmapUpdate(); break;
      case 'dashboardComparativo': window.dashboardComparativoUpdate(); break;
      case 'dashboardTimeline': window.dashboardTimelineUpdate(); break;
    }
  }

  document.addEventListener('DOMContentLoaded',()=>{
    renderMenu();
    atualizar();
  });
})();
