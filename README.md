# Painel Condominial

Este repositório fornece uma página HTML simples que exibe diversos dashboards financeiros para múltiplos condomínios. O objetivo é demonstrar de forma rápida como o faturamento, as despesas e outros indicadores podem ser apresentados utilizando apenas JavaScript no navegador.

## Estrutura de pastas

- `index.html` – página principal que monta o painel de visualização.
- `cs/` – contém o arquivo `style.css.txt` com todo o estilo utilizado pela página.
- `js/` – guarda os scripts JavaScript utilizados pelo projeto:
  - `chart.min.js.js` – biblioteca [Chart.js](https://www.chartjs.org/) já compactada.
  - `multicondo.js.js` – onde devem ser definidos os dados de cada condomínio.
  - `dashboards.js.txt` – funções responsáveis por renderizar os gráficos e cards exibidos na tela.

## Abrindo a página

1. Clone ou baixe este repositório em seu computador.
2. Abra o arquivo `index.html` diretamente no navegador (duplo clique) ou execute um servidor local (por exemplo `python3 -m http.server`) e acesse `http://localhost:8000/index.html`.

Assim que a página for carregada, os dashboards serão montados usando os dados definidos no JavaScript.

## Editando os dados dos dashboards

O objeto `window.multiCondo` deve ser criado dentro de `js/multicondo.js.js`. Nele são informadas as receitas, despesas, período de análise e taxa de inadimplência de cada condomínio. A estrutura esperada é a seguinte:

```javascript
window.multiCondo = {
  "Condomínio Exemplo": {
    dataInicio: "2024-01", // ano-mês inicial
    dataFinal: "2024-12", // ano-mês final
    percInad: 5,           // percentual de inadimplência
    receitas: [            // receitas fixas mensais
      { men: 2000 }
    ],
    despesas: [            // despesas fixas mensais
      { men: 500, cat: "Manutenção" },
      { men: 300, cat: "Luz" }
    ],
    timeline: []           // eventos exibidos na aba de timeline
  }
};

// Condomínio exibido por padrão
window.atual = "Condomínio Exemplo";
```

Basta editar ou adicionar novos itens nesse objeto e recarregar a página. O JavaScript utiliza o objeto acima para montar todos os gráficos exibidos nas abas.
