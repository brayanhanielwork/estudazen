
'use strict';
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const KEY = 'estudazen_v3';
const cloud = window.ESTUDAZEN_CLOUD || { enabled:false };
let db = load(), user = db.active || '', view = 'home', moduleIndex = 0, spread = 0, flip = '', examAnswers = {}, essay = '', quizPicked = {}, rankMode = 'local', globalRanks = [], globalState = { loading:false, message:'' };
let toastTimer;

const VISUAL_GUIDES = {
  org: {
    overview: 'A administração conecta direção, coordenação e resultados por meio de pessoas e recursos.',
    items: [
      { label:'Direção', icon:'🎯', detail:'Indica o rumo da ação administrativa e expressa a intenção organizacional.' },
      { label:'Coordenação', icon:'🧭', detail:'Articula recursos, pessoas e prioridades para evitar dispersão de esforços.' },
      { label:'Resultados', icon:'✅', detail:'Representam os objetivos efetivamente alcançados a partir da ação gerencial.' }
    ],
    integrated: 'Em conjunto, esses elementos mostram que administrar não se resume a mandar ou controlar: trata-se de transformar objetivos em resultados por meio de coordenação racional.',
    example: 'Exemplo prático: em uma escola, a direção define a meta de reduzir evasão; a coordenação organiza ações com professores e atendimento; os resultados aparecem nos indicadores de permanência dos alunos.'
  },
  balance: {
    overview: 'Eficiência, eficácia e efetividade analisam o desempenho sob perspectivas complementares.',
    items: [
      { label:'Eficiência', icon:'⚙️', detail:'Relação entre resultados e recursos empregados, com ênfase em produtividade e economia.' },
      { label:'Eficácia', icon:'🎯', detail:'Grau de alcance dos objetivos planejados.' },
      { label:'Efetividade', icon:'🌱', detail:'Avaliação dos impactos relevantes e duradouros gerados pela ação.' }
    ],
    integrated: 'As três ideias não competem entre si. Uma organização madura procura alcançar metas, utilizar bem os recursos e produzir impactos consistentes.',
    example: 'Exemplo prático: uma clínica atende mais pacientes (eficácia), reduz desperdícios de insumos (eficiência) e melhora a satisfação do público ao longo do tempo (efetividade).'
  },
  cycle: {
    overview: 'O processo administrativo é cíclico e integra planejamento, organização, direção e controle.',
    items: [
      { label:'Planejar', icon:'🧭', detail:'Define objetivos, prioridades, prazos e critérios de ação.' },
      { label:'Organizar', icon:'🧩', detail:'Distribui tarefas, recursos e responsabilidades de forma coerente.' },
      { label:'Dirigir', icon:'🤝', detail:'Mobiliza pessoas por meio de liderança, comunicação e coordenação cotidiana.' },
      { label:'Controlar', icon:'📊', detail:'Compara o desempenho com padrões e sustenta correções.' }
    ],
    integrated: 'As quatro funções se alimentam mutuamente: o controle informa novos planos; a organização viabiliza a execução; a direção sustenta a ação humana.',
    example: 'Exemplo prático: em um e-commerce, a empresa planeja a campanha, organiza estoques e equipes, dirige a operação logística e controla prazos de entrega para corrigir falhas.'
  },
  levels: {
    overview: 'Os níveis de gestão diferenciam a abrangência da decisão e o horizonte temporal analisado.',
    items: [
      { label:'Estratégico', icon:'🏛️', detail:'Concentra decisões amplas, de longo prazo e com impacto para toda a organização.' },
      { label:'Tático', icon:'🧩', detail:'Traduz diretrizes estratégicas em planos, projetos e alocação de recursos por área.' },
      { label:'Operacional', icon:'⚙️', detail:'Coordena a execução cotidiana e o tratamento de problemas imediatos.' }
    ],
    integrated: 'Os três níveis não funcionam isoladamente. A coerência gerencial depende da comunicação entre decisões estratégicas, desdobramentos táticos e execução operacional.',
    example: 'Exemplo prático: a diretoria decide expandir serviços (estratégico), a gerência comercial estrutura metas e orçamento (tático) e a equipe de atendimento executa o novo processo (operacional).'
  },
  network: {
    overview: 'Organizações são sistemas abertos e se mantêm em interação contínua com diferentes agentes.',
    items: [
      { label:'Pessoas', icon:'👥', detail:'São fonte de trabalho, conhecimento e relações organizacionais.' },
      { label:'Empresa', icon:'🏢', detail:'É o núcleo que transforma insumos em produtos, serviços e resultados.' },
      { label:'Mercado', icon:'🌍', detail:'Reúne clientes, concorrentes, fornecedores e demais forças externas.' }
    ],
    integrated: 'A noção de sistema aberto evidencia que o desempenho interno depende também da capacidade de interpretar e responder ao ambiente.',
    example: 'Exemplo prático: uma empresa de varejo revê seu mix de produtos após perceber mudança no comportamento de compra dos clientes e restrições dos fornecedores.'
  },
  layers: {
    overview: 'O ambiente organizacional pode ser observado em camadas com diferentes graus de influência direta.',
    items: [
      { label:'Interno', icon:'🏢', detail:'Inclui estrutura, cultura, pessoas, processos e recursos sob controle mais direto.' },
      { label:'Operacional', icon:'🤝', detail:'Abrange agentes de contato direto, como clientes, fornecedores e concorrentes.' },
      { label:'Contextual', icon:'🌍', detail:'Reúne forças macro, como economia, legislação, tecnologia e transformações sociais.' }
    ],
    integrated: 'A distinção entre essas camadas ajuda a evitar análises simplistas e orienta respostas gerenciais mais adequadas ao nível do problema.',
    example: 'Exemplo prático: a taxa de juros pertence ao ambiente contextual, enquanto a falha de entrega de um fornecedor específico está no ambiente operacional.'
  },
  people: {
    overview: 'Liderança, comunicação e clima interferem diretamente no comportamento das equipes.',
    items: [
      { label:'Equipe', icon:'👥', detail:'Grupo que executa atividades e produz resultados coletivos.' },
      { label:'Comunicação', icon:'💬', detail:'Canal pelo qual orientações, feedbacks e expectativas são compartilhados.' },
      { label:'Aprendizado', icon:'🌱', detail:'Capacidade da equipe de aperfeiçoar práticas a partir da experiência.' }
    ],
    integrated: 'Dirigir pessoas não significa apenas supervisionar tarefas, mas construir coordenação, compromisso e aprendizagem no cotidiano.',
    example: 'Exemplo prático: um supervisor que explica metas, acompanha dificuldades e devolve feedback claro tende a elevar a qualidade do desempenho da equipe.'
  },
  fork: {
    overview: 'Tomar decisões envolve comparar alternativas e reconhecer restrições.',
    items: [
      { label:'Alternativas', icon:'🛤️', detail:'Conjuntos possíveis de ação diante de um problema ou oportunidade.' },
      { label:'Critérios', icon:'⚖️', detail:'Parâmetros utilizados para comparar as opções disponíveis.' },
      { label:'Escolha', icon:'✅', detail:'Decisão final baseada em análise, julgamento e responsabilidade.' }
    ],
    integrated: 'O valor de uma decisão não está só no ato de escolher, mas na qualidade do processo de análise que sustenta a escolha.',
    example: 'Exemplo prático: ao decidir entre terceirizar ou internalizar uma etapa produtiva, o gestor compara custos, riscos, prazo e impacto na qualidade.'
  },
  cards: {
    overview: 'Problemas gerenciais exigem diagnóstico, interpretação e encaminhamento adequado.',
    items: [
      { label:'Problema', icon:'🧩', detail:'Situação que demanda investigação e resposta administrativa.' },
      { label:'Análise', icon:'🔍', detail:'Exame das causas, dos dados relevantes e das alternativas disponíveis.' },
      { label:'Solução', icon:'✅', detail:'Ação definida para enfrentar o problema com coerência técnica.' }
    ],
    integrated: 'Sem análise consistente, soluções tendem a atacar sintomas e não as causas do problema.',
    example: 'Exemplo prático: diante do aumento de reclamações, a organização não apenas treina a equipe, mas investiga origem do retrabalho, falhas de processo e gargalos de comunicação.'
  },
  steps: {
    overview: 'O controle administrativo segue etapas lógicas que permitem medir e corrigir desvios.',
    items: [
      { label:'Identificar', icon:'①', detail:'Definir o que será acompanhado e qual padrão deve ser atingido.' },
      { label:'Comparar', icon:'②', detail:'Confrontar o desempenho real com o padrão estabelecido.' },
      { label:'Agir', icon:'③', detail:'Realizar ajustes quando houver desvio significativo.' }
    ],
    integrated: 'Controlar não é punir. É produzir informação útil para realinhar a ação organizacional.',
    example: 'Exemplo prático: a empresa acompanha o prazo médio de entrega, compara com a meta e redesenha o fluxo logístico ao identificar atrasos recorrentes.'
  },
  target: {
    overview: 'Objetivos, indicadores e resultados compõem a lógica de acompanhamento do desempenho.',
    items: [
      { label:'Objetivo', icon:'🎯', detail:'Resultado pretendido em termos qualitativos ou quantitativos.' },
      { label:'Indicador', icon:'📏', detail:'Medida que permite acompanhar o avanço em direção ao objetivo.' },
      { label:'Resultado', icon:'✅', detail:'Desempenho efetivamente alcançado após a execução.' }
    ],
    integrated: 'Sem indicadores coerentes, o controle perde precisão; sem objetivos, os indicadores ficam sem significado gerencial.',
    example: 'Exemplo prático: o objetivo é melhorar a satisfação do cliente; o indicador é a nota média de atendimento; o resultado é a evolução dessa nota ao longo do semestre.'
  },
  swot: {
    overview: 'A análise SWOT organiza o diagnóstico estratégico entre fatores internos e externos.',
    items: [
      { label:'Forças', icon:'💪', detail:'Capacidades e recursos internos que favorecem o desempenho.' },
      { label:'Fraquezas', icon:'⚠️', detail:'Limitações internas que restringem a competitividade ou a execução.' },
      { label:'Oportunidades', icon:'🌤️', detail:'Condições externas favoráveis que podem ser aproveitadas.' },
      { label:'Ameaças', icon:'🌧️', detail:'Fatores externos que podem comprometer resultados.' }
    ],
    integrated: 'A utilidade da SWOT está em articular diagnóstico e ação: reconhecer condições internas e externas ajuda a formular estratégias realistas.',
    example: 'Exemplo prático: uma empresa identifica equipe qualificada como força, baixa presença digital como fraqueza, expansão do mercado online como oportunidade e concorrência agressiva como ameaça.'
  }
};

function load(){
  try{return JSON.parse(localStorage.getItem(KEY)) || { users:{}, active:'' };}
  catch{return { users:{}, active:'' };}
}
function save(){ localStorage.setItem(KEY, JSON.stringify(db)); }
function profile(){ return db.users[user]; }
function ensure(name){
  name = name.trim().replace(/\s+/g,' ').slice(0,30);
  if(!name) return false;
  if(!db.users[name]) db.users[name] = { name, answers:{}, completed:{}, exam:null, essay:'', created:Date.now(), notes:'' };
  user = name; db.active = name; save();
  if(cloudEnabled()) syncGlobalRanking(true).catch(()=>{});
  return true;
}
function cloudEnabled(){ return !!(cloud && cloud.enabled && cloud.url && cloud.anonKey); }
function score(p){ return Object.values(p.answers||{}).reduce((acc,a)=>acc+(a.correct?10:0),0) + Math.round((p.exam?.score||0) * 10); }
function countAnswers(p){ return Object.values(p.answers||{}).filter(a=>a.correct).length; }
function completion(p){ return COURSE.reduce((n,m,i)=>n + (p.completed[i]||0), 0); }
function ranks(){ return Object.values(db.users).sort((a,b)=>score(b)-score(a) || countAnswers(b)-countAnswers(a) || a.created-b.created); }
function notify(msg){ const t = $('#toast'); if(!t) return; t.textContent = msg; t.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(()=>t.classList.remove('show'), 2600); }
function headers(){
  return { 'Content-Type':'application/json', 'apikey': cloud.anonKey, 'Authorization': `Bearer ${cloud.anonKey}` };
}
async function fetchGlobalRanks(){
  if(!cloudEnabled()){
    globalState = { loading:false, message:'Ranking global não configurado. Edite o arquivo config.js e informe os dados do Supabase.' };
    globalRanks = [];
    render();
    return;
  }
  try{
    globalState = { loading:true, message:'Carregando ranking global...' };
    render();
    const table = cloud.table || 'estudazen_ranking';
    const url = `${cloud.url}/rest/v1/${table}?select=name,points,correct_answers,updated_at&order=points.desc,correct_answers.desc,updated_at.asc`;
    const res = await fetch(url, { headers: headers() });
    if(!res.ok) throw new Error(`Falha ao ler o ranking global (${res.status}).`);
    globalRanks = await res.json();
    globalState = { loading:false, message: globalRanks.length ? '' : 'Ainda não há perfis sincronizados no ranking global.' };
  }catch(err){
    globalState = { loading:false, message: err.message || 'Não foi possível carregar o ranking global.' };
  }
  render();
}
async function syncGlobalRanking(silent=false){
  if(!cloudEnabled() || !user || !profile()) return false;
  try{
    const table = cloud.table || 'estudazen_ranking';
    const payload = [{
      name: profile().name,
      points: score(profile()),
      correct_answers: countAnswers(profile()),
      updated_at: new Date().toISOString()
    }];
    const url = `${cloud.url}/rest/v1/${table}?on_conflict=name`;
    const res = await fetch(url, {
      method:'POST',
      headers: { ...headers(), 'Prefer':'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify(payload)
    });
    if(!res.ok) throw new Error(`Falha ao sincronizar (${res.status}).`);
    if(rankMode === 'global') fetchGlobalRanks();
    if(!silent) notify('Pontuação sincronizada no ranking global.');
    return true;
  }catch(err){
    if(!silent) notify('Não foi possível sincronizar o ranking global.');
    return false;
  }
}
function header(active){
  return `<header class="topbar"><div class="brand"><span class="leaf">📖</span> EstudaZen</div><nav class="nav"><button class="${active==='home'?'active':''}" data-go="home">⌂ Início</button><button class="${active==='reader'?'active':''}" data-go="reader">▤ Estudo</button><button class="${active==='ranking'?'active':''}" data-go="ranking">🏆 Ranking</button><button class="${active==='exam'?'active':''}" data-go="exam">✦ Simulado</button></nav><button class="profile" data-go="switch">♙ Olá, ${esc(user)}! ▾</button></header>`;
}
function rankHtml(limit=5, list=ranks(), mode='local'){
  const rr = list.slice(0, limit);
  return rr.length ? rr.map((p,i)=>`<div class="rankitem ${((mode==='local' ? p.name : p.name)===user && mode==='local') ? 'mine':''}"><span>${['🥇','🥈','🥉'][i] || (i+1)+'º'}</span><span class="rankname">${esc(p.name)} ${mode==='local' && p.name===user ? '(você)' : ''}</span><b>${mode==='local' ? score(p) : (p.points ?? 0)} pts</b></div>`).join('') : '<p class="empty">O ranking começa com a primeira pontuação registrada.</p>';
}
function globalSummary(){
  if(cloudEnabled()) return '<span class="status-chip">🌐 Ranking global pronto para sincronização</span>';
  return '<span class="status-chip">💾 Modo local ativo</span>';
}
function side(){
  const p = profile();
  const percent = Math.round(100 * completion(p) / (COURSE.length * 6));
  return `<aside class="rightcol"><section class="panel"><h3>🎯 Seu progresso</h3><b>Administração • 1º semestre</b><p class="smallmuted">${completion(p)} de ${COURSE.length*6} páginas concluídas</p><div class="track"><div class="fill" style="width:${percent}%"></div></div><p class="smallmuted">${percent}% do percurso</p></section><section class="panel"><h3>🏆 Ranking</h3>${rankHtml()}<div class="rank-hint">${globalSummary()}</div><p class="smallmuted">Abra a tela de ranking para alternar entre o modo local e o modo global.</p><button class="linkish" data-go="ranking">Ver ranking completo</button></section><section class="panel"><h3>📚 Unidades</h3><div class="chapterlist">${COURSE.map((m,i)=>`<button data-module="${i}">${m.icon} ${i+1}. ${esc(m.short)} ${profile().completed[i]===6?'✓':''}</button>`).join('')}</div></section></aside>`;
}
function login(){
  return `<main class="login-shell"><section class="login-board"><div class="rings">${'<span></span>'.repeat(6)}</div><div class="logoicon">📖🌱</div><h1>EstudaZen</h1><div class="subtitle">ESTUDO • PRÁTICA • EVOLUÇÃO</div><h2>Bem-vindo(a)!</h2><p>Informe seu nome para abrir seu fichário, acompanhar sua evolução e participar do ranking.</p><form id="loginform"><input class="nameinput" id="username" placeholder="Digite seu nome de usuário" maxlength="30" required autocomplete="nickname"><br><button type="submit" class="btn wide">Entrar →</button></form><div class="login-icons"><div><span>📖</span>Estude no seu ritmo</div><div><span>📊</span>Acompanhe o progresso</div><div><span>🏆</span>Dispute o ranking</div></div></section></main>`;
}
function dashboard(){
  const p = profile();
  const percent = Math.round(completion(p)/(COURSE.length*6)*100);
  return `${header('home')}<main class="dashboard"><div class="dashboard-main"><section class="hero"><h1>Bem-vindo(a) de volta, ${esc(user)}!</h1><p>Continue estudando com um percurso estruturado, exercícios mais analíticos e recursos visuais para tornar a leitura mais objetiva e agradável.</p></section><div class="dashboard-grid"><section><h2 class="section-title">🎓 Minhas matérias</h2><div class="subject"><div class="subject-icon">🌳</div><div style="flex:1"><h3>Administração</h3><p>Fundamentos de Administração • 1º semestre</p><div class="track"><div class="fill" style="width:${percent}%"></div></div><p class="smallmuted">${percent}% concluído</p><button class="btn small" data-go="reader">Continuar estudo →</button></div></div><h2 class="section-title" style="margin-top:25px">📗 Seu percurso</h2><div class="chapterlist">${COURSE.map((m,i)=>`<button data-module="${i}">${m.icon} ${esc(m.title)} <span class="smallmuted"> · ${p.completed[i]||0}/6 páginas</span></button>`).join('')}</div></section><section><h2 class="section-title">🗂 Ferramentas de estudo</h2><div class="tools-grid"><button class="tool" data-go="reader"><span>📖</span><b>Fichário A4</b></button><button class="tool" data-go="exam"><span>📝</span><b>Simulado</b></button><button class="tool" data-go="ranking"><span>🏆</span><b>Ranking</b></button><button class="tool" data-go="notes"><span>✏️</span><b>Anotações</b></button><button class="tool" data-go="review"><span>🔁</span><b>Revisar erros</b></button><button class="tool" data-go="export"><span>💾</span><b>Exportar progresso</b></button></div><div class="callout" style="margin-top:28px">💡 <b>Dica de estudo:</b> observe as palavras destacadas, passe o mouse sobre as ilustrações e leia os blocos “Conceito central”, “Integração do tema” e “Exemplo prático” antes de responder às questões.</div></section></div></div>${side()}</main>`;
}
function pageGuide(page){ return VISUAL_GUIDES[page.visual] || { overview: page.lead, items:[], integrated: page.text, example: page.tip }; }
function glossaryEntries(page, guide){
  const entries = [{ term: page.term[0], meaning: page.term[1] }];
  guide.items.forEach(item => entries.push({ term: item.label, meaning: item.detail }));
  return entries;
}
function annotate(text, entries){
  let html = esc(text);
  (entries || []).slice(0, 4).forEach(entry => {
    const term = esc(entry.term);
    const tip = esc(entry.meaning);
    const idx = html.indexOf(term);
    if(idx !== -1){
      html = html.slice(0, idx) + `<span tabindex="0" class="term-highlight" data-tip="${tip}">${term}</span>` + html.slice(idx + term.length);
    }
  });
  return html;
}
function figureFor(guide, kind){
  const items = guide.items.length ? guide.items : [{ label:'Síntese', icon:'📘', detail: guide.overview }];
  return `<figure class="learning-visual" aria-label="Esquema interativo sobre o conteúdo"><div class="visual-elements" data-kind="${esc(kind)}">${items.map(item=>`<button type="button" class="hotspot" data-tip="${esc(item.detail)}" title="${esc(item.detail)}" aria-label="${esc(item.label)}: ${esc(item.detail)}"><span class="spot-icon">${esc(item.icon)}</span>${esc(item.label)}</button>`).join('')}</div><figcaption class="visual-hint" aria-live="polite">Passe o mouse ou toque em um conceito para ver uma explicação breve.</figcaption></figure>`;
}
function lessonPage(module, index){
  const p = module.pages[index];
  const g = pageGuide(p);
  const glossary = glossaryEntries(p, g);
  const items = g.items;
  return `<span class="page-tag">${esc(p.tag)}</span><h2>${esc(p.title)}</h2><p class="lead">${annotate(p.lead,glossary)}</p>
  <div class="lesson-top">${figureFor(g,p.visual)}<div class="lesson-summary"><strong>Em poucas palavras</strong><p>${esc(g.overview)}</p></div></div>
  <section class="lesson-section lesson-intro"><h4>Entenda o conceito</h4><p class="bodytxt">${annotate(p.text,glossary)}</p></section>
  <section class="lesson-section"><h4>Entenda cada elemento</h4><div class="concept-grid">${items.map(item=>`<div class="concept-tile"><h5>${esc(item.icon)} ${esc(item.label)}</h5><p>${esc(item.detail)}</p></div>`).join('')}</div></section>
  <section class="lesson-synthesis"><h4>Como os conceitos se relacionam</h4><p class="integrated-copy">${annotate(g.integrated,glossary)}</p></section>
  <section class="lesson-example"><h4>Aplicação prática</h4><p class="example-copy">${annotate(g.example,glossary)}</p></section>
  <div class="lesson-glossary"><b>Termo essencial:</b> <span tabindex="0" class="term-highlight" data-tip="${esc(p.term[1])}" title="${esc(p.term[1])}">${esc(p.term[0])}</span> — ${esc(p.term[1])}</div>
  <div class="lesson-remark">✦ ${esc(p.tip)}</div>`;
}
function questionPage(module, qi){
  const q = module.quiz[qi], id = `${moduleIndex}-${qi}`, answered = profile().answers[id], pick = quizPicked[id] ?? (answered?.chosen ?? -1);
  return `<span class="page-tag">✦ Hora de praticar</span><h3>Questão ${qi+1} de 2</h3><p class="bodytxt" style="font-weight:700">${esc(q.q)}</p><div class="quiz-options">${q.options.map((o,j)=>`<button class="option ${pick===j?'selected':''} ${answered?(j===q.answer?'correct':j===answered.chosen&&!answered.correct?'wrong':''):''}" data-answer="${qi}:${j}" ${answered?'disabled':''}>${'ABCD'[j]}) ${esc(o)}</button>`).join('')}</div>${answered ? `<div class="answerfeedback"><b>${answered.correct?'✅ Resposta correta! +10 pontos':'💡 Continue estudando'}</b><br>${esc(q.explain)}<br><small>Gabarito: ${'ABCD'[q.answer]}.</small></div>` : pick !== -1 ? `<button style="margin-top:15px" class="btn small" data-confirm="${qi}">Conferir resposta →</button>` : '<div class="tip">Escolha uma alternativa e confira para desbloquear a próxima etapa.</div>'}`;
}
function bookReader(){
  const m = COURSE[moduleIndex], n = spread * 2, f = flip; flip = '';
  return `${header('reader')}<div class="bookview"><main class="reader"><div class="reader-head"><button class="btn small secondary" data-go="home">← Início</button><h3>${m.icon} ${esc(m.title)}</h3><span class="smallmuted">Unidade ${moduleIndex+1}/${COURSE.length}</span></div><section class="book ${f}" aria-label="Fichário aberto com duas páginas A4"><article class="page left">${n < 4 ? lessonPage(m, n) : questionPage(m, n-4)}<span class="pageline">${n+1} / 6</span></article><article class="page right">${n+1 < 4 ? lessonPage(m, n+1) : questionPage(m, n-3)}<span class="pageline">${n+2} / 6</span></article></section><div class="book-footer"><button class="btn small secondary" data-page="-1" ${moduleIndex===0 && spread===0 ? 'disabled' : ''}>← Anterior</button><span class="counter">Folhas ${n+1}–${n+2} de 6</span><button class="btn small" data-page="1" ${moduleIndex===COURSE.length-1 && spread===2 ? 'disabled' : ''}>Próximas →</button></div><div class="notice" style="margin-top:14px">📖 Cada unidade mantém o padrão de 4 páginas teóricas e 2 páginas de exercícios. Em telas menores, as folhas são empilhadas verticalmente para preservar a legibilidade.</div></main>${side()}</div>`;
}
function changePage(delta){
  let next = spread + delta, mi = moduleIndex;
  if(next > 2){ mi++; next = 0; }
  if(next < 0){ mi--; next = 2; }
  if(mi < 0 || mi >= COURSE.length) return;
  if(delta > 0 && spread === 2){ const k1 = `${moduleIndex}-0`, k2 = `${moduleIndex}-1`; if(!profile().answers[k1] || !profile().answers[k2]){ notify('Responda às duas questões para continuar.'); return; } }
  if(delta > 0 && spread === 1 && !profile().completed[moduleIndex]) profile().completed[moduleIndex] = 4;
  if(delta > 0 && spread === 2) profile().completed[moduleIndex] = 6;
  moduleIndex = mi; spread = next; profile().lastModule = mi; profile().lastSpread = next;
  if(spread === 2) profile().completed[mi] = Math.max(profile().completed[mi] || 0, 4);
  if(spread === 1) profile().completed[mi] = Math.max(profile().completed[mi] || 0, 2);
  save(); flip = delta > 0 ? 'flip-forward' : 'flip-back'; render();
}
function attemptModule(i){ const p = profile(); if(i > 0 && p.completed[i-1] !== 6){ notify('Conclua a unidade anterior para desbloquear esta.'); return; } moduleIndex = i; spread = p.lastModule === i ? (p.lastSpread || 0) : 0; view = 'reader'; flip = 'flip-forward'; render(); }
function leaderboard(){
  if(rankMode === 'global' && cloudEnabled() && !globalRanks.length && !globalState.loading && !globalState.message){ setTimeout(fetchGlobalRanks, 0); }
  const localPart = `${ranks().map((p,i)=>`<div class="rankitem ${p.name===user?'mine':''}" style="font-size:16px;padding:15px"><b>${['🥇','🥈','🥉'][i] || i+1+'º'}</b><span style="flex:1">${esc(p.name)} ${p.name===user?'(você)':''}</span><span>${countAnswers(p)} acertos</span><b>${score(p)} pontos</b></div>`).join('') || '<p class="empty">Ainda não há registros no ranking local.</p>'}`;
  const globalPart = cloudEnabled() ? (globalState.loading ? '<p class="notice">Carregando ranking global...</p>' : globalRanks.length ? globalRanks.map((p,i)=>`<div class="rankitem" style="font-size:16px;padding:15px"><b>${['🥇','🥈','🥉'][i] || i+1+'º'}</b><span style="flex:1">${esc(p.name)}</span><span>${p.correct_answers ?? 0} acertos</span><b>${p.points ?? 0} pontos</b></div>`).join('') : `<p class="notice">${esc(globalState.message || 'Ainda não há dados globais.')}</p>`) : `<div class="notice">🌐 O modo global já aparece nesta tela, mas precisa de configuração externa para funcionar. Para ativá-lo, edite o arquivo <code>config.js</code> com as credenciais do Supabase. Enquanto isso, o ranking local continua funcionando normalmente.</div>`;
  return `${header('ranking')}<main class="exam"><section class="panel"><h1>🏆 Ranking dos estudantes</h1><p class="muted">Ganhe 10 pontos por resposta correta nas atividades do fichário. O simulado final também pode acrescentar pontos. A pontuação não é duplicada quando a mesma resposta é revista.</p><div class="rank-toolbar"><div class="mode-switch"><button class="${rankMode==='local'?'active':''}" data-rank-mode="local">Modo local</button><button class="${rankMode==='global'?'active':''}" data-rank-mode="global">Modo global</button></div>${globalSummary()}${cloudEnabled() ? '<button class="btn small secondary" data-sync-global>Sincronizar agora</button>' : ''}</div>${rankMode==='local' ? localPart : globalPart}<div class="notice" style="margin-top:20px">${rankMode==='local' ? 'O ranking local compara apenas perfis salvos neste navegador.' : 'O ranking global depende de um serviço de dados configurado. Nesta versão, o site já está preparado para Supabase.'}</div><button class="btn secondary" style="margin-top:20px" data-go="home">← Voltar</button></section></main>`;
}
function examView(){
  const p = profile(), submitted = !!p.exam;
  return `${header('exam')}<main class="exam"><div class="panel"><span class="page-tag">Avaliação final</span><h1>Simulado de Administração</h1><p class="muted">10 questões de múltipla escolha (0,8 ponto por acerto) e uma questão discursiva (até 2 pontos).</p><div class="notice">As questões objetivas são corrigidas automaticamente. A discursiva pode ser enviada ao ChatGPT para uma análise explicada; esta versão estática não acessa uma IA por conta própria.</div></div><section class="panel">${FINAL_QUIZ.map((q,i)=>`<div class="question"><h3>${i+1}. ${esc(q.q)}</h3><div class="quiz-options">${q.options.map((o,j)=>`<button class="option ${((submitted ? p.exam.answers[i] : examAnswers[i])===j)?'selected':''} ${submitted&&j===q.answer?'correct':''} ${submitted&&p.exam.answers[i]===j&&j!==q.answer?'wrong':''}" data-exam-answer="${i}:${j}" ${submitted?'disabled':''}>${'ABCD'[j]}) ${esc(o)}</button>`).join('')}</div>${submitted ? `<div class="answerfeedback">${p.exam.answers[i]===q.answer?'✅ Correto':'❌ Incorreto'} — ${esc(q.explain)}</div>` : ''}</div>`).join('')}${submitted ? `<h2 class="score">${p.exam.score.toFixed(1).replace('.',',')} / 8,0</h2><p>${p.exam.correct} acertos de 10.</p>` : `<p class="smallmuted">Respondidas: ${Object.keys(examAnswers).length}/10</p><button class="btn" data-exam-finish ${Object.keys(examAnswers).length<10?'disabled':''}>Corrigir questões objetivas</button>`}</section><section class="panel"><h2 class="section-title">✍️ Questão discursiva</h2><p>${esc(ESSAY.prompt)}</p><textarea id="essay" placeholder="Escreva sua resposta com exemplos práticos...">${esc(p.essay || essay)}</textarea><p class="smallmuted">Critérios: conceitos (0,5); aplicação (0,6); exemplos (0,5); clareza (0,4).</p><div class="toolbar"><button class="btn small" data-save-essay>💾 Salvar resposta</button><button class="btn small secondary" data-ai-review>✨ Solicitar correção pela IA</button></div><p class="notice">A correção abre um pedido preparado no ChatGPT, com seu texto e rubrica. Isso exige conexão com a internet e uma conta com acesso ao serviço. A nota discursiva não é lançada automaticamente no ranking.</p></section></main>`;
}
function notesView(){ const n = profile().notes || ''; return `${header('notes')}<main class="exam"><section class="panel"><h1>✏️ Meu caderno</h1><p>Anotações pessoais que ficam salvas neste dispositivo.</p><textarea id="notes" style="min-height:350px">${esc(n)}</textarea><p><button class="btn" data-save-notes>Salvar minhas anotações</button></p></section></main>`; }
function reviewView(){ let errors = []; COURSE.forEach((m,i)=>m.quiz.forEach((q,j)=>{ if(profile().answers[`${i}-${j}`] && !profile().answers[`${i}-${j}`].correct) errors.push({m,q}); })); return `${header('review')}<main class="exam"><section class="panel"><h1>🔁 Revisão dos erros</h1>${errors.length ? errors.map(({m,q})=>`<div class="question"><b>${esc(m.title)}</b><p>${esc(q.q)}</p><div class="answerfeedback"><b>Resposta correta: ${esc(q.options[q.answer])}</b><br>${esc(q.explain)}</div></div>`).join('') : '<p>Sem erros registrados nas questões das unidades até agora. Continue estudando!</p>'}</section></main>`; }
function switchUser(){ user=''; db.active=''; save(); view='login'; render(); }
function exportData(){ const b = new Blob([JSON.stringify(db.users[user], null, 2)], { type:'application/json' }); const url = URL.createObjectURL(b), a = document.createElement('a'); a.href = url; a.download = 'estudazen-progresso.json'; a.click(); URL.revokeObjectURL(url); }
function render(){ const app = $('#app'); app.innerHTML = !user || view==='login' ? login() : view==='home' ? dashboard() : view==='reader' ? bookReader() : view==='ranking' ? leaderboard() : view==='exam' ? examView() : view==='notes' ? notesView() : reviewView(); }
function clickHandler(e){
  const x = e.target.closest('[data-go],[data-module],[data-page],[data-answer],[data-confirm],[data-exam-answer],[data-exam-finish],[data-save-essay],[data-ai-review],[data-save-notes],[data-rank-mode],[data-sync-global]');
  if(!x) return;
  if(x.dataset.go){
    const v = x.dataset.go;
    if(v==='switch') return switchUser();
    if(v==='export') return exportData();
    if(v==='reader'){ moduleIndex = profile().lastModule || 0; spread = profile().lastSpread || 0; }
    view = v; render(); return;
  }
  if(x.dataset.rankMode){ rankMode = x.dataset.rankMode; if(rankMode==='global') fetchGlobalRanks(); else render(); return; }
  if(x.hasAttribute('data-sync-global')){ syncGlobalRanking(); return; }
  if(x.dataset.module !== undefined) return attemptModule(Number(x.dataset.module));
  if(x.dataset.page !== undefined) return changePage(Number(x.dataset.page));
  if(x.dataset.answer){ let [qi,j] = x.dataset.answer.split(':').map(Number); let id = `${moduleIndex}-${qi}`; if(profile().answers[id]) return; quizPicked[id] = j; render(); return; }
  if(x.dataset.confirm !== undefined){ let qi = Number(x.dataset.confirm), id = `${moduleIndex}-${qi}`, chosen = quizPicked[id], q = COURSE[moduleIndex].quiz[qi]; if(chosen === undefined) return; profile().answers[id] = { chosen, correct: chosen === q.answer }; save(); if(cloudEnabled()) syncGlobalRanking(true).catch(()=>{}); notify(chosen===q.answer ? '+10 pontos! Muito bem!' : 'Resposta registrada. Leia a explicação.'); render(); return; }
  if(x.dataset.examAnswer){ let [i,j] = x.dataset.examAnswer.split(':').map(Number); examAnswers[i] = j; render(); return; }
  if(x.hasAttribute('data-exam-finish')){ if(Object.keys(examAnswers).length !== 10) return; let correct = FINAL_QUIZ.filter((q,i)=>examAnswers[i]===q.answer).length; profile().exam = { answers:{...examAnswers}, correct, score: correct*.8 }; save(); if(cloudEnabled()) syncGlobalRanking(true).catch(()=>{}); render(); notify(`Simulado corrigido: ${correct}/10 acertos!`); return; }
  if(x.hasAttribute('data-save-essay')){ profile().essay = $('#essay').value; essay = profile().essay; save(); notify('Resposta salva neste dispositivo.'); return; }
  if(x.hasAttribute('data-ai-review')){ let answer = $('#essay').value.trim(); if(answer.length < 30){ notify('Escreva pelo menos algumas frases antes de enviar.'); return; } profile().essay = answer; save(); let prompt = `Corrija esta resposta discursiva de Fundamentos de Administração. Questão: ${ESSAY.prompt} Avalie domínio das funções (0,5 ponto), aplicação ao caso (0,6), exemplos/justificativa (0,5) e clareza (0,4). Dê nota de 0 a 2 com justificativa, sugestões precisas e exemplo melhorado. Minha resposta: ${answer}`; navigator.clipboard?.writeText(prompt).then(()=>notify('Pedido copiado! Cole no ChatGPT para receber a correção.')).catch(()=>notify('Selecione e copie seu texto.')); window.open('https://chatgpt.com/','_blank','noopener,noreferrer'); return; }
  if(x.hasAttribute('data-save-notes')){ profile().notes = $('#notes').value; save(); notify('Anotações salvas.'); }
}
// Hotspot interactions: a contextual hint appears below the diagram without covering the text.
function showFigureHint(el){
  const figure=el.closest('.learning-visual');
  if(!figure) return;
  const hint=figure.querySelector('.visual-hint');
  if(!hint) return;
  figure.querySelectorAll('.hotspot.active').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  hint.textContent=el.dataset.tip || 'Explore os conceitos do esquema.';
}
document.addEventListener('pointerover',e=>{const el=e.target.closest?.('.hotspot');if(el)showFigureHint(el)});
document.addEventListener('focusin',e=>{const el=e.target.closest?.('.hotspot');if(el)showFigureHint(el)});
document.addEventListener('click',e=>{const el=e.target.closest?.('.hotspot');if(el)showFigureHint(el)});
document.addEventListener('click', clickHandler);
document.addEventListener('submit', e => { if(e.target.id==='loginform'){ e.preventDefault(); if(!ensure($('#username').value)){ notify('Digite um nome válido'); return; } moduleIndex = profile().lastModule || 0; spread = profile().lastSpread || 0; view='home'; render(); }});
document.addEventListener('input', e => { if(e.target.id==='essay') essay = e.target.value; });
document.addEventListener('keydown', e => { if(view!=='reader' || ['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)) return; if(e.key==='ArrowRight') changePage(1); if(e.key==='ArrowLeft') changePage(-1); });
if(user && db.users[user]){ moduleIndex = profile().lastModule || 0; spread = profile().lastSpread || 0; view = 'home'; }
else { user=''; view='login'; }
render();
