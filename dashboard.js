/**
 * Dashboard Data Handler
 * Carrega dados JSON e popula os separadores do dashboard
 */

// Configuração de caminhos dos dados
const DATA_PATHS = {
  visao_geral: './data/visao_geral.json',
  eventos_infection_numbers: './data/eventos_infection_numbers.json',
  eventos_amostra_ips: './data/eventos_amostra_ips.json',
  eventos_infection_dst_ip: './data/eventos_infection_dst_ip.json',
  eventos_infection_dst_city: './data/eventos_infection_dst_city.json',
  eventos_dst_city_events: './data/eventos_dst_city_events.json',
  trafego_tipos: './data/trafego_tipos.json',
  trafego_por_semana: './data/trafego_por_semana.json',
  trafego_dia_pico: './data/trafego_dia_pico.json',
  trafego_categorias_evolucao: './data/trafego_categorias_evolucao.json',
  top_addresses: './data/top_addresses.json',
  sistemas_por_severidade: './data/sistemas_por_severidade.json',
  sistemas_detalhes: './data/sistemas_detalhes.json',
  ips_bloqueados: './data/ips_bloqueados.json',
  ipv4_vulnerabilidades: './data/ipv4_vulnerabilidades.json',
  ipv6_vulnerabilidades: './data/ipv6_vulnerabilidades.json',
  contas_comprometidas: './data/contas_comprometidas.json',
  phishing: './data/phishing.json',
  kaspersky: './data/kaspersky.json',
  kaspersky_threats: './data/kaspersky_threats.json',
  kaspersky_evolution: './data/kaspersky_evolution.json'
};

console.log('dashboard.js carregado');

// Cache de dados carregados
const dataCache = {};

/**
 * Carrega um ficheiro JSON
 */
async function loadJSON(path) {
  if (dataCache[path]) {
    return dataCache[path];
  }
  
  try {
    const response = await fetch(path);
    if (!response.ok) {
      console.warn(`Ficheiro não encontrado: ${path}`);
      return null;
    }
    const data = await response.json();
    dataCache[path] = data;
    return data;
  } catch (error) {
    console.error(`Erro ao carregar ${path}:`, error);
    return null;
  }
}

/**
 * Popula uma tabela HTML com dados
 */
function sanitizeValue(value) {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'number' && Number.isNaN(value)) return '-';
  return value;
}

function getFieldValue(row, keys) {
  for (const key of keys) {
    if (key in row) return sanitizeValue(row[key]);
    const matchedKey = Object.keys(row).find(k => k.toLowerCase() === key.toLowerCase());
    if (matchedKey) return sanitizeValue(row[matchedKey]);
  }
  return '-';
}

function populateTable(tableId, data, columns) {
  const table = document.getElementById(tableId);
  if (!table) return;
  
  const tbody = table.querySelector('tbody');
  tbody.innerHTML = '';
  
  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="' + columns.length + '" style="text-align:center; padding: 20px;">Sem dados disponíveis</td></tr>';
    return;
  }
  
  data.forEach(row => {
    const tr = document.createElement('tr');
    columns.forEach(col => {
      const td = document.createElement('td');
      const value = getFieldValue(row, [col]);
      td.textContent = value;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}


/**
 * Cria um gráfico de pizza com Chart.js
 */
function createPieChart(canvasId, labels, data, label = 'Distribuição') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: label,
        data: data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' }
      }
    }
  });
}

/**
 * Cria um gráfico de linha com Chart.js
 */
function createBarChart(canvasId, labels, data, label = 'Eventos') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: label,
        data: data,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
        title: { display: true, text: label }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

function createHorizontalBarChart(canvasId, labels, data, title) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: title,
        data: data,
        backgroundColor: 'rgba(153, 102, 255, 0.65)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: { display: true, text: title }
      },
      scales: {
        x: { beginAtZero: true },
        y: { ticks: { autoSkip: false, maxRotation: 0, minRotation: 0 } }
      }
    }
  });
}

/**
 * Cria um gr*/

function createLineChart(canvasId, labels, data, label = 'Dados') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'line',

    data: {
      labels: labels,
      datasets: [{
        label: label,
        data: data,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        tension: 0.1,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

/**
 * OPÇÃO 1: Visão Geral
 */
async function loadVisaoGeral() {
  console.log('Carregando Visão Geral...');
  const data = await loadJSON(DATA_PATHS.visao_geral);
  
  if (data && data.length > 0) {
    const labels = data.map(d => d.asninfo || d['ASN / Provedor'] || 'Desconhecido');
    const values = data.map(d => d.eventos || d['Total de Eventos'] || 0);
    createBarChart('asnBarChart', labels, values, 'Eventos Suspeitos');
  }
  
  // Carregar também a evolução das categorias, gráfico de ocorrências, top endereços e eventos por semana
  await loadCategoriesEvolution();
  await loadCategoriesOccurrencesBarChart();
  await loadTopAddresses();
  await loadWeeklyEventsChart();
}

/**
 * Carrega e renderiza gráfico de eventos por semana
 */
async function loadWeeklyEventsChart() {
  const porSemana = await loadJSON(DATA_PATHS.trafego_por_semana);
  if (porSemana && porSemana.length > 0) {
    const labels = porSemana.map(d => `Semana ${d.semana}/${d.ano}`);
    const values = porSemana.map(d => d.quantidade);
    createLineChart('weeklyEventsChart', labels, values, 'Eventos por Semana');
  }
}

/**
 * Carrega e renderiza gráfico de evolução temporal das categorias de tráfego
 */
async function loadCategoriesEvolution() {
  console.log('Carregando Evolução das Categorias...');
  const data = await loadJSON(DATA_PATHS.trafego_categorias_evolucao);
  
  if (data && data.length > 0) {
    // Agrupar dados por data e categoria
    const dataMap = {};
    const categories = new Set();
    
    data.forEach(item => {
      const date = item.data_curta || item.data || 'Desconhecido';
      const category = item.category || 'Desconhecido';
      const quantidade = item.quantidade || 0;
      
      categories.add(category);
      if (!dataMap[date]) {
        dataMap[date] = {};
      }
      dataMap[date][category] = quantidade;
    });
    
    const dates = Object.keys(dataMap).sort();
    const categoryArray = Array.from(categories);
    
    // Preparar datasets para gráfico de linha
    const colors = [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)',
      'rgba(199, 199, 199, 1)',
      'rgba(83, 102, 255, 1)'
    ];
    
    const datasets = categoryArray.map((category, index) => {
      return {
        label: category,
        data: dates.map(date => dataMap[date][category] || 0),
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length].replace('1)', '0.1)'),
        borderWidth: 2,
        tension: 0.1,
        fill: false
      };
    });
    
    const canvas = document.getElementById('categoryEvolutionChart');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: dates,
          datasets: datasets
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Evolução Temporal das Categorias' }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    }
  }
}

/**
 * Carrega e renderiza gráfico de barras: categorias vs número de ocorrências (quantidade total)
 */
async function loadCategoriesOccurrencesBarChart() {
  console.log('Carregando Categorias x Ocorrências...');
  const data = await loadJSON(DATA_PATHS.trafego_categorias_evolucao);

  if (data && data.length > 0) {
    // Somar quantidades por categoria
    const categoryTotals = {};

    data.forEach(item => {
      const category = item.category || 'Desconhecido';
      const quantidade = Number(item.quantidade ?? 0);
      categoryTotals[category] = (categoryTotals[category] || 0) + quantidade;
    });

    // Ordenar desc e pegar Top 10
    const sorted = Object.entries(categoryTotals)
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    const labels = sorted.map(d => d.category);
    const values = sorted.map(d => d.total);

    const canvas = document.getElementById('categoriesOccurrencesBarChart');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Ocorrências',
            data: values,
            backgroundColor: 'rgba(153, 102, 255, 0.7)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Top 10 Categorias (Ocorrências Totais)' }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    }
  }
}

/**
 * Carrega e renderiza gráfico horizontal dos top 10 endereços
 */
async function loadTopAddresses() {
  console.log('Carregando Top Endereços...');
  const data = await loadJSON(DATA_PATHS.top_addresses);
  if (data && data.length > 0) {
    // Garantir que é para mostrar 10 + "Outros" (se existir)
    const normalized = data
      .map(d => ({
        address: d.address || d.ip || 'Desconhecido',
        quantidade: Number(d.quantidade ?? d.count ?? 0)
      }))
      .slice(0, 11); // pode conter 10 + Outros

    const labels = normalized.map(d => d.address);
    const values = normalized.map(d => d.quantidade);

    // Prefixar o rótulo "Botnet" no eixo Y (gráfico horizontal: indexAxis 'y')
    labels.unshift('Botnet');
    values.unshift(0);

    const canvas = document.getElementById('topAddressesChart');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Eventos',
            data: values,
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Top 10 Endereços (com Outros)' }
          },
          scales: {
            x: { beginAtZero: true },
            y: { ticks: { autoSkip: false, maxRotation: 0, minRotation: 0 } }
          }
        }
      });
    }
  }
}


/**
 * OPÇÃO 2: Eventos Suspeitos
 */
async function loadEventosSuspeitos() {
  console.log('Carregando Eventos Suspeitos...');
  
  // Infecção, Total de Eventos e Percentagem
  const infectionNumbers = await loadJSON(DATA_PATHS.eventos_infection_numbers);
  console.log('eventos_infection_numbers loaded:', Array.isArray(infectionNumbers) ? infectionNumbers.length : infectionNumbers);

  if (infectionNumbers && infectionNumbers.length > 0) {
    console.log('eventos_infection_numbers sample:', infectionNumbers[0]);

    // Normalizar campos: JSON usa `infection` (sem acento) e `total`
    // (mantém fallback para `infecção` caso o JSON venha com outro nome).
    const normalized = infectionNumbers.map(d => ({
      ...d,
      infection: d.infection ?? d['infecção'] ?? d['infecao'] ?? 'Desconhecido',
      total: Number(d.total ?? d.total_ips_afetados ?? 0),
      percentagem: d.percentagem ?? d.percentagem_ips ?? 0
    }));

    const labels = normalized.map(d => d.infection || 'Desconhecido');
    const values = normalized.map(d => d.total || 0);

    console.log('malwarePieChart labels sample:', labels.slice(0, 5));
    console.log('malwarePieChart values sample:', values.slice(0, 5));
    console.log('malwarePieChart values sum:', values.reduce((a, b) => a + b, 0));

    populateTable('malwareFamiliesTable', normalized, ['infection', 'total', 'percentagem']);
    
    // Atualizar KPIs
    const totalEventos = normalized.reduce((sum, item) => sum + (item.total || 0), 0);
    document.getElementById('total-eventos').textContent = totalEventos.toLocaleString();
    document.getElementById('families-count').textContent = normalized.length;
    
    // Gráfico de pizza (infection -> labels, total -> valores)
    createPieChart('malwarePieChart', labels, values, 'Distribuição de Infecções');
  } else {
    console.warn('Nenhum dado para eventos_infection_numbers; gráfico não será renderizado.');
  }

  // Eventos por cidade destino (gráfico de pizza)
  const dstCityEvents = await loadJSON(DATA_PATHS.eventos_dst_city_events);
  if (dstCityEvents && dstCityEvents.length > 0) {
    const cityData = dstCityEvents.map(d => ({
      city: d.dst_city ?? d['dst_city'] ?? d.city ?? 'Desconhecido',
      total: Number(d.total_eventos ?? d.total ?? 0)
    })).filter(item => item.city && item.city !== 'Desconhecido' && item.total > 0);

    if (cityData.length > 0) {
      const labelsCities = cityData.map(item => item.city);
      const valuesCities = cityData.map(item => item.total);
      createPieChart('destinationCityEventsChart', labelsCities, valuesCities, 'Eventos por Cidade Destino');
    }
  } else {
    console.warn('Nenhum dado para eventos_dst_city_events; gráfico não será renderizado.');
  }
  
  // Amostra de 20 IPs
  const amostraIps = await loadJSON(DATA_PATHS.eventos_amostra_ips);
  if (amostraIps) {
    // Mapear colunas disponíveis no JSON para o que a tabela espera
    const mapped = amostraIps.map(d => ({
      'tipo_infecção': d.infection || 'N/A',
      'ip_destino': d.dst_ip || 'N/A',
      'ips_fonte': d.src_ip || 'N/A'
    }));
    populateTable('infectionSamplesTable', mapped, ['tipo_infecção', 'ip_destino', 'ips_fonte']);
  }
  
  // IP de destino
  const dstIp = await loadJSON(DATA_PATHS.eventos_infection_dst_ip);
  if (dstIp) {
    // Mapear colunas disponíveis
    const mapped = dstIp.map(d => ({
      'infecção': d.infection || 'N/A',
      'ip_destino': `${d.total_dst_ips} IPs`,
      'ips_fonte': `${d.total_src_ips} IPs`
    }));
    populateTable('destinationIPsTable', mapped, ['infecção', 'ip_destino', 'ips_fonte']);
  }
  
  // Cidade de destino
  const dstCity = await loadJSON(DATA_PATHS.eventos_infection_dst_city);
  if (dstCity && dstCity.length > 0) {
    populateTable('cityMapTable', dstCity, Object.keys(dstCity[0]));
    document.getElementById('dest-city-count').textContent = dstCity.length;
  }
}


/**
 * OPÇÃO 3: Tráfego Suspeito
 */
async function loadTrafegoSuspeito() {
  console.log('Carregando Tráfego Suspeito...');
  
  // Tipos de tráfego
  const tipos = await loadJSON(DATA_PATHS.trafego_tipos);
  if (tipos) {
    populateTable('trafficTypeTable', tipos, ['tipo', 'quantidade']);
  }
  
  // Eventos por semana (o gráfico está agora exibido em Visão Geral)
  const weeklyChartCanvas = document.getElementById('weeklyEventsChart');
  if (weeklyChartCanvas) {
    const porSemana = await loadJSON(DATA_PATHS.trafego_por_semana);
    if (porSemana && porSemana.length > 0) {
      const labels = porSemana.map(d => `Semana ${d.semana}/${d.ano}`);
      const values = porSemana.map(d => d.quantidade);
      createLineChart('weeklyEventsChart', labels, values, 'Eventos por Semana');
    }
  }
  
  // Dia de maior pico
  const diaPico = await loadJSON(DATA_PATHS.trafego_dia_pico);
  if (diaPico) {
    console.log(`Dia de maior pico: ${diaPico.data} com ${diaPico.quantidade} eventos`);
  }
}

/**
 * OPÇÃO 4: Sistemas Comprometidos
 */
async function loadSistemasComprometidos() {
  console.log('Carregando Sistemas Comprometidos...');
  
  const sistemas = await loadJSON(DATA_PATHS.sistemas_detalhes);
  if (sistemas) {
    const mapped = sistemas.map(item => ({
      ip: getFieldValue(item, ['ip']),
      hostname: getFieldValue(item, ['hostname']),
      asn: getFieldValue(item, ['asn']),
      port: getFieldValue(item, ['port']),
      tag: getFieldValue(item, ['tag']),
      server: getFieldValue(item, ['server'])
    }));
    populateTable('sistemasTable', mapped, ['ip', 'hostname', 'asn', 'port', 'tag', 'server']);

    const tagCounts = mapped.reduce((acc, row) => {
      const tag = row.tag || 'Desconhecido';
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {});

    const sortedTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1]);

    const labels = sortedTags.map(([tag]) => tag);
    const values = sortedTags.map(([, count]) => count);

    if (labels.length > 0) {
      createBarChart('comprometimentoTypeChart', labels, values, 'Tipos de Comprometimento');
    }
  }
}

/**
 * OPÇÃO 5: IPs Bloqueados
 */
async function loadIpsBloqueados() {
  console.log('Carregando IPs Bloqueados...');
  
  const ips = await loadJSON(DATA_PATHS.ips_bloqueados);
  if (ips) {
    const mapped = ips.map(item => ({
      'Data/Hora': getFieldValue(item, ['timestamp']),
      'IP': getFieldValue(item, ['ip']),
      'ASN': getFieldValue(item, ['asn']),
      'MOTIVO': getFieldValue(item, ['reason']),
      'SEVERIDADE': getFieldValue(item, ['severity']),
      'CIDADE': getFieldValue(item, ['city'])
    }));
    populateTable('ipsReputacaoTable', mapped, ['Data/Hora', 'IP', 'ASN', 'MOTIVO', 'SEVERIDADE', 'CIDADE']);

    const reasonCounts = mapped.reduce((acc, row) => {
      const reason = row.MOTIVO || 'Desconhecido';
      acc[reason] = (acc[reason] || 0) + 1;
      return acc;
    }, {});

    const sortedReasons = Object.entries(reasonCounts).sort((a, b) => b[1] - a[1]);
    const labels = sortedReasons.map(([reason]) => reason);
    const values = sortedReasons.map(([, count]) => count);

    if (labels.length > 0) {
      createBarChart('reputationReasonChart', labels, values, 'Motivos de Má Reputação');
    }
  }
}

/**
 * OPÇÃO 6: Vulnerabilidades IPv4
 */
async function loadIPv4Vulnerabilidades() {
  console.log('Carregando Vulnerabilidades IPv4...');

  const vulns = await loadJSON(DATA_PATHS.ipv4_vulnerabilidades);
  if (vulns) {
    const severityOrder = {
      critical: 0,
      high: 1,
      médium: 2,
      medium: 2,
      low: 3,
      info: 4
    };

    // Normalizar campos para lidar com NaN/null/undefined
    const mapped = vulns.map(row => ({
      IP: getFieldValue(row, ['ip']),
      ASN: getFieldValue(row, ['asn']),
      HOSTNAME: getFieldValue(row, ['hostname']),
      'DISPOSITIVO DE BORDA': getFieldValue(row, ['device_type']),
      VULNERABILIDADE: getFieldValue(row, ['tag']),
      SEVERIDADE: getFieldValue(row, ['severity'])
    }));

    const normalizeSeverityKey = (s) => {
      if (s === '-' || s === null || s === undefined) return null;
      const v = String(s).trim().toLowerCase();
      // alguns datasets podem vir como 'medium' ou 'médium'
      if (v === 'médium') return 'médium';
      return v;
    };

    mapped.sort((a, b) => {
      const sa = normalizeSeverityKey(a.SEVERIDADE);
      const sb = normalizeSeverityKey(b.SEVERIDADE);
      const oa = severityOrder[sa] ?? 99;
      const ob = severityOrder[sb] ?? 99;

      if (oa !== ob) return oa - ob;
      // desempate: por ASN/IP/hostname (strings) para estabilidade
      const ipA = String(a.IP ?? '');
      const ipB = String(b.IP ?? '');
      return ipA.localeCompare(ipB);
    });

    populateTable(
      'ipv4VulnsTable',
      mapped,
      ['IP', 'ASN', 'HOSTNAME', 'DISPOSITIVO DE BORDA', 'VULNERABILIDADE', 'SEVERIDADE']
    );
  }
}

/**
 * OPÇÃO 7: Vulnerabilidades IPv6
 */
async function loadIPv6Vulnerabilidades() {
  console.log('Carregando Vulnerabilidades IPv6...');

  const vulns = await loadJSON(DATA_PATHS.ipv6_vulnerabilidades);
  if (vulns) {
    const severityOrder = {
      critical: 0,
      high: 1,
      médium: 2,
      medium: 2,
      low: 3,
      info: 4
    };

    const mapped = vulns.map(row => ({
      IP: getFieldValue(row, ['ip']),
      ASN: getFieldValue(row, ['asn']),
      HOSTNAME: getFieldValue(row, ['hostname']),
      'DISPOSITIVO DE BORDA': getFieldValue(row, ['device_type']),
      VULNERABILIDADE: getFieldValue(row, ['tag']),
      SEVERIDADE: getFieldValue(row, ['severity'])
    }));

    const normalizeSeverityKey = (s) => {
      if (s === '-' || s === null || s === undefined) return null;
      const v = String(s).trim().toLowerCase();
      if (v === 'médium') return 'médium';
      return v;
    };

    mapped.sort((a, b) => {
      const sa = normalizeSeverityKey(a.SEVERIDADE);
      const sb = normalizeSeverityKey(b.SEVERIDADE);
      const oa = severityOrder[sa] ?? 99;
      const ob = severityOrder[sb] ?? 99;

      if (oa !== ob) return oa - ob;
      const ipA = String(a.IP ?? '');
      const ipB = String(b.IP ?? '');
      return ipA.localeCompare(ipB);
    });

    populateTable(
      'ipv6VulnsTable',
      mapped,
      ['IP', 'ASN', 'HOSTNAME', 'DISPOSITIVO DE BORDA', 'VULNERABILIDADE', 'SEVERIDADE']
    );
  }
}

/**
 * OPÇÃO 8: Contas Comprometidas
 */
async function loadContasComprometidas() {
  console.log('Carregando Contas Comprometidas...');

  const contas = await loadJSON(DATA_PATHS.contas_comprometidas);
  if (contas && contas.length > 0) {
    // Atualizar título com quantidade de contas
    const quantEl = document.getElementById('contas-comprometidas-quantidade');
    if (quantEl) {
      quantEl.textContent = contas.length.toLocaleString();
    }

    // Mapear campos para nomes descritivos (similar a IPv6)
    const mapped = contas.map(row => ({
      'EMAIL': getFieldValue(row, ['email']),
      'USERNAME': getFieldValue(row, ['username']),
      'SEVERIDADE': getFieldValue(row, ['severity']),
      'SERVIÇO': getFieldValue(row, ['service']),
      'STATUS': getFieldValue(row, ['status'])
    }));

    populateTable('contasTable', mapped, ['EMAIL', 'USERNAME', 'SEVERIDADE', 'SERVIÇO', 'STATUS']);
  }
}

/**
 * OPÇÃO 9: Phishing
 */
async function loadPhishing() {
  console.log('Carregando Phishing...');
  
  const phishing = await loadJSON(DATA_PATHS.phishing);
  if (phishing) {
    const colunas = Object.keys(phishing[0] || {});
    populateTable('phishingTable', phishing, colunas.slice(0, 3));
  }
}

/**
 * OPÇÃO 10: Kaspersky
 */
async function loadKaspersky() {
  console.log('Carregando Kaspersky...');
  
  const threats = await loadJSON(DATA_PATHS.kaspersky_threats);
  if (!threats || !threats.categories) {
    console.error('Dados de ameaças Kaspersky não encontrados');
    return;
  }
  
  console.log('Dados Kaspersky carregados:', threats.categories.length, 'categorias');
  
  // Renderiza 7 gráficos, um para cada categoria
  threats.categories.forEach((category, index) => {
    const canvasId = `kasperskyCat${index}`;
    renderKaskerskyChart(canvasId, category);
  });
  
  // Carrega e renderiza gráfico de evolução temporal
  const evolution = await loadJSON(DATA_PATHS.kaspersky_evolution);
  if (evolution && evolution.length > 0) {
    renderKaskerskyEvolution('kaskerskyEvolutionChart', evolution);
  }
}

/**
 * Renderiza um gráfico horizontal de barras para uma categoria Kaspersky
 */
function renderKaskerskyChart(canvasId, category) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.warn(`Canvas não encontrado: ${canvasId}`);
    return;
  }
  
  const container = canvas.closest('.chart-container');
  if (container) {
    const height = Math.max(400, Math.min(600, category.agents.length * 35));
    container.style.height = height + 'px';
  }
  
  const ctx = canvas.getContext('2d');

  if (canvas.chartInstance) {
    canvas.chartInstance.destroy();
  }
  
  const labels = category.agents.map(a => a.agent);
  const data = category.agents.map(a => a.percentage);
  const maxValue = data.length ? Math.max(10, ...data) * 1.05 : 10;
  
  const colors = data.map((value, index) => {
    const intensity = 1 - (index / Math.max(data.length - 1, 1)) * 0.6;
    return `rgba(26, ${Math.round(150 + intensity * 80)}, ${Math.round(220 - intensity * 100)}, 0.85)`;
  });
  
  const categoryDisplayName = category.name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  canvas.chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: categoryDisplayName,
        data: data,
        backgroundColor: colors,
        borderColor: colors.map(c => c.replace('0.85', '1')),
        borderWidth: 1.5,
        borderRadius: 6,
        barPercentage: 0.85,
        categoryPercentage: 0.85
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 10,
          right: 10,
          left: 10,
          bottom: 10
        }
      },
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: categoryDisplayName,
          font: { size: 14, weight: '600' },
          padding: { bottom: 8 }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.parsed.x.toFixed(2) + '%';
            }
          },
          bodyFont: { size: 12 },
          padding: 10
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          max: Math.min(100, maxValue),
          ticks: {
            callback: value => value + '%',
            font: { size: 11 }
          },
          title: {
            display: true,
            text: 'Percentagem (%)',
            font: { size: 11, weight: 'bold' }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.06)'
          }
        },
        y: {
          ticks: {
            font: { size: 10 }
          },
          grid: {
            display: false
          }
        }
      }
    }
  });
}

/**
 * Renderiza gráfico de evolução temporal dos vectores de ameaça Kaspersky
 */
function renderKaskerskyEvolution(canvasId, evolutionData) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || !evolutionData || evolutionData.length === 0) {
    console.warn(`Canvas ou dados não encontrados para evolução: ${canvasId}`);
    return;
  }

  const container = canvas.closest('.chart-container');
  if (container) {
    container.style.height = '400px';
  }

  const ctx = canvas.getContext('2d');

  if (canvas.chartInstance) {
    canvas.chartInstance.destroy();
  }

  // Extrai as colunas (exceto 'date')
  const threatVectors = Object.keys(evolutionData[0] || {}).filter(key => key !== 'date');
  
  // Cores para cada linha
  const colorMap = {
    'Intrusion Detection': 'rgba(255, 99, 132, 0.8)',
    'Anti-Spam': 'rgba(54, 162, 235, 0.8)',
    'Mail Anti-Virus': 'rgba(75, 192, 192, 0.8)',
    'On-Access Scan': 'rgba(255, 206, 86, 0.8)',
    'On-Demand Scan': 'rgba(153, 102, 255, 0.8)',
    'Ransomware': 'rgba(255, 159, 64, 0.8)',
    'Vulnerability Scan': 'rgba(201, 203, 207, 0.8)'
  };

  // Monta datasets para cada vector de ameaça
  const datasets = threatVectors.map((vector, index) => {
    const color = colorMap[vector] || `hsl(${index * 360 / threatVectors.length}, 70%, 50%)`;
    return {
      label: vector,
      data: evolutionData.map(point => point[vector] || 0),
      borderColor: color,
      backgroundColor: color.replace('0.8', '0.1'),
      borderWidth: 2.5,
      tension: 0.4,
      fill: false,
      pointRadius: 3,
      pointBackgroundColor: color,
      pointBorderColor: color,
      pointHoverRadius: 5
    };
  });

  canvas.chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: evolutionData.map(point => point.date),
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          display: true,
          position: 'right',
          labels: {
            font: { size: 11 },
            padding: 15,
            usePointStyle: true
          }
        },
        title: {
          display: true,
          text: 'Evolução Temporal dos Vectores de Ameaça',
          font: { size: 14, weight: '600' },
          padding: { bottom: 15 }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: { size: 12, weight: 'bold' },
          bodyFont: { size: 11 },
          borderColor: 'rgba(255, 255, 255, 0.3)',
          borderWidth: 1
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Data',
            font: { size: 11, weight: 'bold' }
          },
          ticks: {
            font: { size: 10 },
            maxRotation: 45,
            minRotation: 0
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Número de Incidentes',
            font: { size: 11, weight: 'bold' }
          },
          ticks: {
            font: { size: 10 }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          beginAtZero: true
        }
      }
    }
  });
}

/**
 * Função para alternar entre abas
 */
function openTab(evt, tabName) {
  // Esconder todas as abas
  const tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach(tab => tab.classList.remove('active'));
  
  // Remover classe active de todos os botões
  const tabLinks = document.querySelectorAll('.tab-link');
  tabLinks.forEach(link => link.classList.remove('active'));
  
  // Mostrar a aba selecionada
  const tabElement = document.getElementById(tabName);
  if (tabElement) {
    tabElement.classList.add('active');
  }
  
  // Marcar o botão como active
  if (evt) {
    evt.currentTarget.classList.add('active');
  }
  
  // Carregar dados da aba
  loadTabData(tabName);
}

/**
 * Carrega dados específicos de cada aba
 */
async function loadTabData(tabName) {
  switch(tabName) {
    case 'visao':
      await loadVisaoGeral();
      break;
    case 'eventos':
      await loadEventosSuspeitos();
      break;
    case 'trafego':
      await loadTrafegoSuspeito();
      break;
    case 'sistemas':
      await loadSistemasComprometidos();
      break;
    case 'ips-reputacao':
      await loadIpsBloqueados();
      break;
    case 'vulnerabilidades-ipv4':
      await loadIPv4Vulnerabilidades();
      break;
    case 'vulnerabilidades-ipv6':
      await loadIPv6Vulnerabilidades();
      break;
    case 'contas-comprometidas':
      await loadContasComprometidas();
      break;
    case 'phishing':
      await loadPhishing();
      break;
    case 'kaspersky':
      await loadKaspersky();
      break;
  }
}

/**
 * Inicializa o dashboard ao carregar a página
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('Dashboard inicializado');

  // Carregar dados da aba inicialmente ativa (por padrão "visao")
  const activeTabEl = document.querySelector('.tab-content.active');
  const activeTabName = activeTabEl?.id;

  if (activeTabName === 'eventos') {
    loadEventosSuspeitos();
  } else if (activeTabName === 'trafego') {
    loadTrafegoSuspeito();
  } else if (activeTabName === 'sistemas') {
    loadSistemasComprometidos();
  } else if (activeTabName === 'ips-reputacao') {
    loadIpsBloqueados();
  } else if (activeTabName === 'vulnerabilidades-ipv4') {
    loadIPv4Vulnerabilidades();
  } else if (activeTabName === 'vulnerabilidades-ipv6') {
    loadIPv6Vulnerabilidades();
  } else if (activeTabName === 'contas-comprometidas') {
    loadContasComprometidas();
  } else if (activeTabName === 'phishing') {
    loadPhishing();
  } else if (activeTabName === 'kaspersky') {
    loadKaspersky();
  } else {
    // default
    loadVisaoGeral();
  }
});
