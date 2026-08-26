# Plano de Estoque Estratégico

Gera uma planilha de planejamento de estoque a partir do arquivo de origem
`Estoque_Claude.xlsx`, calculando **demanda** (direta, indireta e total),
**Safety Stock** e **Ponto de Reposição (Reorder Point)**.

## Como rodar

```bash
pip install openpyxl
python3 gerar_plano_estoque.py caminho/Estoque_Claude.xlsx Plano_Estoque_Estrategico.xlsx
```

Saída: `Plano_Estoque_Estrategico.xlsx` (aqui neste diretório há uma versão já
gerada).

## Abas de origem lidas

| Aba | Colunas usadas |
|-----|----------------|
| `Vendas` | `Produto` (F), `Descricao do Produto` (G), `Quantidade` (H), `DT Emissao` (N) |
| `Estruturas` (BOM) | `Codigo`=pai (A), `Componente` (B), `Quantidade` (E) |
| `1-Cadastro de Produtos` | `Codigo` (A), `Descricao` (B), `Tipo` (C), `Unidade` (D), `Dias Entrega`=lead time (E) |

## Metodologia

**Demanda** (série mensal na janela observada nas vendas):

- **Direta** — vendas do próprio item, agregadas por mês pela `DT Emissao`.
- **Indireta** — consumo do item como componente: para cada estrutura
  `pai → componente × qtd`, o consumo do componente acompanha as vendas do
  produto-pai multiplicadas pela quantidade da estrutura.
- **Total** = Direta + Indireta.

**Indicadores** (formulação estatística clássica):

```
Lead Time (meses) = Dias Entrega / 30
μ  = média da demanda mensal total
σ  = desvio padrão amostral da demanda mensal total
Safety Stock       = Z × σ × √(Lead Time em meses)
Ponto de Reposição = (μ × Lead Time em meses) + Safety Stock
```

O **Z-Score** default é 1,645 (nível de serviço 95%) e fica editável na aba
`Parâmetros` — as colunas de Safety Stock e Ponto de Reposição são fórmulas
vivas e recalculam ao alterar o parâmetro.

## Abas geradas

- **Leia-me** — metodologia e fórmulas.
- **Parâmetros** — nível de serviço / Z-Score / dias por mês (editáveis).
- **Análise de Demanda** — ranking + demanda direta/indireta/total, médias mensal e semestral.
- **Indicadores de Estoque** — Safety Stock e Ponto de Reposição por item.
- **Demanda Mensal (D+I)** — matriz item × mês da demanda total.
- **Demanda Semestral** — demanda total por semestre.
- **Ranking Top 50** — itens mais demandados, com gráfico.
- **Uso em Estruturas (BOM)** — estruturas em que cada item é componente.
- **Base Vendas / Base Cadastro / Base BOM** — dados de origem para auditoria.

## Notas sobre os dados de exemplo

- A aba `Estruturas` do arquivo enviado contém apenas 1 componente
  (`AG00107.059`, em 155 estruturas). A lógica de demanda indireta é geral:
  ao colar o BOM completo, todos os componentes passam a ser cobertos.
- A aba `JHG` (modelo de referência) usava buckets trimestrais e um pivô
  externo (`[1]Resumo Vendas`) que não acompanha o arquivo. Este gerador
  substitui aquele modelo pela série mensal completa e pela fórmula
  estatística de Safety Stock/Reorder Point solicitada.
