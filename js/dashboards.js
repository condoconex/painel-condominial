// js/dashboards.js
// --- Dashboard Geral ---
window.dashboardGeralUpdate = function() {
  let el = document.getElementById("dashboardGeral");
  let c = window.multiCondo[window.atual];
  let meses = getPeriodoMeses(c.dataInicio,c.dataFinal);
  // Receita e despesa mensal para cada mês
  let receitaMes = meses.map(_=>c.receitas.reduce((a,b)=>a+Number(b.men||0),0));
  let despesaMes = meses.map(_=>c.despesas.reduce((a,b)=>a+Number(b.men||0),0));
  let inadPerc = Number(c.percInad)||0;
  let inadMes = receitaMes.map(v=>Math.round(v*inadPerc/100));
  let saldoMes = receitaMes.map((v,i)=>v-inadMes[i]-despesaMes[i]);
  let saldoAcum = saldoMes.reduce((arr,v,i)=>{arr[i]=v+(arr[i-1]||0);return arr;},[]);
  el.innerHTML = `
    <h2 style="color:#236ee8;">Dashboard Geral – ${window.atual}</h2>
    <canvas id="grafGeralBarras" height="185"></canvas>
    <div id="cardsResumoPlug" style="margin:24px 0"></div>
  `;
  if(window.grafGeralBarras)window.grafGeralBarras.destroy();
  window.grafGeralBarras = new Chart(document.getElementById('grafGeralBarras').getContext('2d'),{
    type:'bar',data:{
      labels: meses.map(m=>m.slice(5,7)+"/"+m.slice(2,4)),
      datasets:[
        {label:'Receita',data:receitaMes,backgroundColor:'#1565c0cc'},
        {label:'Despesa',data:despesaMes,backgroundColor:'#ef5350cc'},
        {label:'Inadimplido',data:inadMes,backgroundColor:'#fbc02dcc'}
      ]
    },options:{responsive:true,plugins:{legend:{position:'top'}},scales:{y:{beginAtZero:true}}}
  });
  document.getElementById('cardsResumoPlug').innerHTML = `
    <div style="background:#1976d211;border-radius:10px;padding:8px 10px;margin-bottom:9px">
      <b>Saldo final previsto:</b><br>
      <span style="font-size:1.3em;color:#1976d2;">R$ ${(saldoAcum[saldoAcum.length-1]||0).toLocaleString('pt-BR')}</span>
    </div>
    <div style="background:#ef535022;border-radius:10px;padding:8px 10px;">
      <b>Inadimplência total:</b><br>
      <span style="font-size:1.15em;color:#ef5350;">R$ ${(inadMes.reduce((a,b)=>a+b,0)).toLocaleString('pt-BR')}</span>
    </div>
  `;
};

// --- Dashboard Fluxo de Caixa ---
window.dashboardFluxoUpdate = function() {
  let el = document.getElementById("dashboardFluxo");
  let c = window.multiCondo[window.atual];
  let meses = getPeriodoMeses(c.dataInicio,c.dataFinal);
  let receitaMes = meses.map(_=>c.receitas.reduce((a,b)=>a+Number(b.men||0),0));
  let despesaMes = meses.map(_=>c.despesas.reduce((a,b)=>a+Number(b.men||0),0));
  let inadPerc = Number(c.percInad)||0;
  let inadMes = receitaMes.map(v=>Math.round(v*inadPerc/100));
  let saldoMes = receitaMes.map((v,i)=>v-inadMes[i]-despesaMes[i]);
  let saldoAcum = saldoMes.reduce((arr,v,i)=>{arr[i]=v+(arr[i-1]||0);return arr;},[]);
  el.innerHTML = `
    <h2 style="color:#388e3c;">Fluxo de Caixa – ${window.atual}</h2>
    <canvas id="grafFluxoLinha" height="190"></canvas>
    <div style="margin:22px 0 0 0;"><b>Saldo acumulado final:</b> <span style="color:#1976d2;font-weight:600;font-size:1.19em;">R$ ${(saldoAcum[saldoAcum.length-1]||0).toLocaleString('pt-BR')}</span></div>
  `;
  if(window.grafFluxoLinha)window.grafFluxoLinha.destroy();
  window.grafFluxoLinha = new Chart(document.getElementById('grafFluxoLinha').getContext('2d'),{
    type:'line',data:{
      labels: meses.map(m=>m.slice(5,7)+"/"+m.slice(2,4)),
      datasets:[
        {label:'Saldo Acumulado',data:saldoAcum,fill:true,backgroundColor:'#1976d233',borderColor:'#1976d2',tension:0.25}
      ]
    },
    options:{plugins:{legend:{position:'top'}},scales:{y:{beginAtZero:true}}}
  });
};

// --- Dashboard Heatmap de Despesas ---
window.dashboardHeatmapUpdate = function() {
  let el = document.getElementById("dashboardHeatmap");
  let c = window.multiCondo[window.atual];
  let meses = getPeriodoMeses(c.dataInicio,c.dataFinal);
  // Agrupa despesas por categoria
  let cats = c.despesas.map(l=>l.cat||"Outros");
  let totPorCat = c.despesas.map(l=>(Number(l.men)||0)*meses.length);
  el.innerHTML = `
    <h2 style="color:#e65100;">Heatmap de Despesas – ${window.atual}</h2>
    <canvas id="grafHeatmap" height="200"></canvas>
    <div style="margin:16px 0;color:#888;">Cores mais intensas = categorias com maior peso no período.</div>
  `;
  if(window.grafHeatmap)window.grafHeatmap.destroy();
  window.grafHeatmap = new Chart(document.getElementById('grafHeatmap').getContext('2d'),{
    type:'bar',
    data:{
      labels:cats,
      datasets:[{
        label:'Despesa Total',
        data:totPorCat,
        backgroundColor:totPorCat.map(v=>{
          let pct = Math.min(1,v/Math.max(...totPorCat));
          // De amarelo claro (baixo) até vermelho forte (alto)
          let c = `rgba(${230+Math.round(25*pct)},${165-Math.round(80*pct)},0,0.72)`;
          return c;
        })
      }]
    },
    options:{indexAxis:'y',plugins:{legend:{display:false}},scales:{x:{beginAtZero:true}}}
  });
};

// --- Dashboard Comparativo Multi-Condomínios ---
window.dashboardComparativoUpdate = function() {
  let el = document.getElementById("dashboardComparativo");
  let nomes = Object.keys(window.multiCondo);
  let periodoPadrao = window.multiCondo[window.atual].dataInicio && window.multiCondo[window.atual].dataFinal
    ? getPeriodoMeses(window.multiCondo[window.atual].dataInicio,window.multiCondo[window.atual].dataFinal).length
    : 12;
  let inadPerc = Number(window.multiCondo[window.atual].percInad)||0;
  let recs = nomes.map(n=>window.multiCondo[n].receitas.reduce((a,b)=>a+(Number(b.men)||0),0)*periodoPadrao);
  let desps = nomes.map(n=>window.multiCondo[n].despesas.reduce((a,b)=>a+(Number(b.men)||0),0)*periodoPadrao);
  let inad = recs.map(v=>Math.round(v*inadPerc/100));
  let saldo = recs.map((v,i)=>v-inad[i]-desps[i]);
  el.innerHTML = `
    <h2 style="color:#3949ab;">Comparativo Multi-Condomínios</h2>
    <canvas id="grafComparativo" height="180"></canvas>
    <div style="margin:22px 0 0 0;color:#888;">Comparação de Receita, Despesa, Saldo e Inadimplência entre condomínios.</div>
  `;
  if(window.grafComparativo)window.grafComparativo.destroy();
  window.grafComparativo = new Chart(document.getElementById('grafComparativo').getContext('2d'),{
    type:'bar',data:{
      labels:nomes,
      datasets:[
        {label:'Receita',data:recs,backgroundColor:'#1565c0cc'},
        {label:'Despesa',data:desps,backgroundColor:'#ef5350cc'},
        {label:'Inadimplido',data:inad,backgroundColor:'#fbc02dcc'},
        {label:'Saldo',data:saldo,backgroundColor:'#43a047cc'}
      ]
    },
    options:{responsive:true,plugins:{legend:{position:'top'}},scales:{y:{beginAtZero:true}}}
  });
};

// --- Dashboard Timeline de Eventos ---
window.dashboardTimelineUpdate = function() {
  let el = document.getElementById("dashboardTimeline");
  let c = window.multiCondo[window.atual];
  // Simples: permite registrar eventos manualmente (ou puxar futuros pagamentos)
  if(!c.timeline) c.timeline = [];
  el.innerHTML = `
    <h2 style="color:#00838f;">Timeline de Eventos – ${window.atual}</h2>
    <div style="margin-bottom:18px;">
      <input id="eventoNovo" placeholder="Descreva um evento ou marco" style="width:340px">
      <input id="dataEvento" type="date">
      <button onclick="addEventoTimeline()">Adicionar</button>
    </div>
    <ul id="listaTimeline" style="margin:0;padding:0;list-style:none;"></ul>
  `;
  function renderTimeline() {
    let lista = document.getElementById('listaTimeline');
    lista.innerHTML = c.timeline.length
      ? c.timeline.sort((a,b)=>a.data.localeCompare(b.data)).map(ev=>`<li style="background:#e0f7fa;margin-bottom:8px;padding:7px 10px;border-radius:6px;">
        <b>${ev.data}:</b> ${ev.texto} <button style="float:right" onclick="delEventoTimeline('${ev.data}','${ev.texto}')">🗑️</button>
      </li>`).join("")
      : `<li style="color:#888;">Nenhum evento ainda. Registre acima.</li>`;
  }
  window.addEventoTimeline = function(){
    let texto = document.getElementById('eventoNovo').value.trim();
    let data = document.getElementById('dataEvento').value;
    if(!texto || !data) return;
    c.timeline.push({data,texto});
    window.salvarMulti();
    renderTimeline();
    document.getElementById('eventoNovo').value = "";
    document.getElementById('dataEvento').value = "";
  };
  window.delEventoTimeline = function(data,texto){
    c.timeline = c.timeline.filter(ev=>ev.data!=data||ev.texto!=texto);
    window.salvarMulti();
    renderTimeline();
  };
  renderTimeline();
};
