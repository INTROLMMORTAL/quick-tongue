(function () {
  'use strict';

  /* ---------- утилиты ---------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const app = $('#app');
  const KEY = 'quick-tongue-v1';
  const INTERVALS = [0, 1, 2, 4, 8, 16, 32]; // дни до повторения по уровням 0..6
  const PRAISE = ['Отлично!', 'Верно!', 'Супер!', 'Так держать!', 'Точно!'];

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const norm = s => s.toLowerCase().replace(/[’]/g, "'").replace(/[^a-z' ]/g, ' ').replace(/\s+/g, ' ').trim();
  const strip = t => t.replace(/[.,!?]/g, '');
  const today = () => new Date().toLocaleDateString('sv-SE');
  const addDays = n => { const d = new Date(); d.setDate(d.getDate() + n); return d.toLocaleDateString('sv-SE'); };
  const dayDiff = (a, b) => Math.round((new Date(b) - new Date(a)) / 864e5);

  /* ---------- состояние ---------- */
  const DEFAULTS = () => ({ xp: 0, streak: 0, last: null, done: {}, words: {}, voice: '', rate: 0.9 });
  let S = (() => {
    try { const s = JSON.parse(localStorage.getItem(KEY)); if (s) return Object.assign(DEFAULTS(), s); } catch (e) { /* ignore */ }
    return DEFAULTS();
  })();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } };

  const ALL = UNITS.flatMap((u, ui) => u.words.map(w => Object.assign({ unit: ui }, w)));
  const WORDS = {};
  ALL.forEach(w => { WORDS[w.en] = w; });

  function touchStreak() {
    const t = today();
    if (S.last === t) return;
    S.streak = (S.last && dayDiff(S.last, t) === 1) ? S.streak + 1 : 1;
    S.last = t;
  }
  const currentStreak = () => (S.last && dayDiff(S.last, today()) <= 1) ? S.streak : 0;

  /* ---------- интервальные повторения (по системе Лейтнера) ---------- */
  function mark(en, ok) {
    const w = S.words[en] || (S.words[en] = { box: 0, due: today(), seen: 0 });
    w.seen++;
    w.box = ok ? Math.min(w.box + 1, 6) : 0;
    w.due = addDays(INTERVALS[w.box]);
    save();
  }
  const dueList = () => Object.keys(S.words).filter(k => WORDS[k] && S.words[k].due <= today());

  /* ---------- озвучка и распознавание речи ---------- */
  const hasTTS = 'speechSynthesis' in window;
  let voices = [];
  function loadVoices() { if (hasTTS) voices = speechSynthesis.getVoices().filter(v => v.lang.toLowerCase().startsWith('en')); }
  loadVoices();
  if (hasTTS) speechSynthesis.onvoiceschanged = () => { loadVoices(); if (tab === 'set') go('set'); };

  function makeUtter(text, rate, pitch) {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    const v = voices.find(x => x.name === S.voice) || voices.find(x => x.lang === 'en-US') || voices[0];
    if (v) u.voice = v;
    u.rate = rate || S.rate;
    if (pitch) u.pitch = pitch;
    return u;
  }
  function speak(text, rate) {
    if (!hasTTS) return;
    speechSynthesis.cancel();
    speechSynthesis.speak(makeUtter(text, rate));
  }
  const stopSpeech = () => { if (hasTTS) speechSynthesis.cancel(); };

  let seq = 0;
  function playDialogue(lines, who) {
    if (!hasTTS) return;
    const id = ++seq;
    let i = 0;
    const step = () => {
      if (id !== seq || i >= lines.length) return;
      const u = makeUtter(lines[i].en, null, who.indexOf(lines[i].who) === 0 ? 1 : 1.25);
      u.onend = () => { i++; step(); };
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    };
    step();
  }

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  function listen(onOk, onErr) {
    let finished = false;
    const fail = m => { if (finished) return; finished = true; onErr(m); };
    try {
      const r = new SR();
      r.lang = 'en-US';
      r.maxAlternatives = 3;
      r.interimResults = false;
      r.onresult = e => { finished = true; onOk(Array.from(e.results[0]).map(x => x.transcript)); };
      r.onerror = e => fail(e.error);
      r.onend = () => fail('no-speech');
      r.start();
    } catch (err) { fail('busy'); }
  }
  function similarity(a, b) {
    const A = a.split(' '), B = b.split(' ');
    const pool = A.slice();
    let m = 0;
    B.forEach(w => { const i = pool.indexOf(w); if (i > -1) { m++; pool.splice(i, 1); } });
    return m / Math.max(A.length, B.length);
  }

  /* ---------- фабрики упражнений ---------- */
  const distract = (w, pool, key) => shuffle(pool.filter(x => x.en !== w.en)).slice(0, 3).map(x => x[key]);

  const exChoose = (w, pool) => ({
    t: 'mc', word: w.en, kind: 'Выбери перевод',
    prompt: `<div class="big">${esc(w.en)} <button class="speaker" aria-label="Слушать">🔊</button></div>`,
    say: w.en, options: shuffle([w.ru].concat(distract(w, pool, 'ru'))), correct: w.ru, answer: w.ru
  });
  const exListen = (w, pool) => ({
    t: 'mc', word: w.en, kind: 'Что ты услышал(а)?',
    prompt: `<div class="big"><button class="speaker huge" aria-label="Слушать">🔊</button></div>`,
    say: w.en, options: shuffle([w.en].concat(distract(w, pool, 'en'))), correct: w.en, answer: w.en
  });
  const exReverse = (w, pool) => ({
    t: 'mc', word: w.en, kind: 'Как это по-английски?',
    prompt: `<div class="big">${w.emoji} ${esc(w.ru)}</div>`,
    options: shuffle([w.en].concat(distract(w, pool, 'en'))), correct: w.en, answer: w.en
  });
  const exTypeWord = w => ({ t: 'type', word: w.en, kind: 'Напиши слово', say: w.en, answer: w.en });

  const exBuild = s => ({
    t: 'build', ru: s.ru, answer: s.en,
    words: shuffle(s.en.split(' ').map(strip))
  });
  function exGap(s) {
    const toks = s.en.split(' ');
    const i = toks.findIndex(t => strip(t) === s.gap);
    toks[i] = '____' + toks[i].slice(strip(toks[i]).length);
    return {
      t: 'mc', kind: 'Вставь пропущенное слово',
      prompt: `<div class="sub">${esc(s.ru)}</div><div class="big">${esc(toks.join(' '))}</div>`,
      options: shuffle([s.gap].concat(s.alt)), correct: s.gap, answer: s.en
    };
  }
  const exType = s => ({ t: 'type', kind: 'Напиши, что услышал(а)', say: s.en, answer: s.en });
  const exSpeak = s => ({ t: 'speak', text: s.en, ru: s.ru, answer: s.en });

  function buildPractice(ui) {
    const u = UNITS[ui];
    const pool = UNITS.slice(0, ui + 1).flatMap(x => x.words);
    const list = [];
    u.words.forEach((w, i) => { const k = i % 3; list.push(k === 0 ? exChoose(w, pool) : k === 1 ? exListen(w, pool) : exReverse(w, pool)); });
    u.sentences.forEach((s, i) => {
      list.push(exBuild(s));
      if (s.gap) list.push(exGap(s));
      if (i % 3 === 1) list.push(exType(s));
    });
    if (SR) shuffle(u.sentences).slice(0, 2).forEach(s => list.push(exSpeak(s)));
    return shuffle(list);
  }

  /* ---------- отрисовка упражнений ---------- */
  const RENDER = {
    mc(ex, el, done) {
      el.innerHTML = `<p class="kind">${ex.kind}</p>${ex.prompt}<div class="opts">${ex.options.map((o, i) => `<button class="opt" data-i="${i}">${esc(o)}</button>`).join('')}</div>`;
      if (ex.say) {
        el.querySelectorAll('.speaker').forEach(b => { b.onclick = () => speak(ex.say); });
        setTimeout(() => speak(ex.say), 250);
      }
      el.querySelectorAll('.opt').forEach(b => {
        b.onclick = () => {
          const ok = ex.options[b.dataset.i] === ex.correct;
          el.querySelectorAll('.opt').forEach(x => { x.disabled = true; if (ex.options[x.dataset.i] === ex.correct) x.classList.add('right'); });
          if (!ok) b.classList.add('wrong');
          done(ok);
        };
      });
    },

    build(ex, el, done) {
      el.innerHTML = `<p class="kind">Переведи на английский</p><div class="big">${esc(ex.ru)}</div><div class="slot" id="slot"></div><div class="bank" id="bank"></div><button class="btn" id="chk" disabled>Проверить</button>`;
      const slot = $('#slot', el), bank = $('#bank', el), chk = $('#chk', el);
      const chips = ex.words.map((w, i) => ({ w, i }));
      let chosen = [];
      let locked = false;
      function draw() {
        slot.innerHTML = chosen.map(c => `<button class="chip" data-i="${c.i}">${esc(c.w)}</button>`).join('');
        bank.innerHTML = chips.filter(c => !chosen.includes(c)).map(c => `<button class="chip" data-i="${c.i}">${esc(c.w)}</button>`).join('');
        chk.disabled = locked || !chosen.length;
        if (locked) return;
        slot.querySelectorAll('.chip').forEach(b => { b.onclick = () => { chosen = chosen.filter(c => String(c.i) !== b.dataset.i); draw(); }; });
        bank.querySelectorAll('.chip').forEach(b => { b.onclick = () => { chosen.push(chips[Number(b.dataset.i)]); draw(); }; });
      }
      draw();
      chk.onclick = () => {
        locked = true;
        draw();
        done(norm(chosen.map(c => c.w).join(' ')) === norm(ex.answer));
      };
    },

    type(ex, el, done) {
      el.innerHTML = `<p class="kind">${ex.kind}</p><div class="big"><button class="speaker huge" id="sp" aria-label="Слушать">🔊</button></div><button class="link" id="slow">🐢 Послушать медленно</button><input id="inp" class="inp" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Напиши по-английски"><button class="btn" id="chk">Проверить</button>`;
      const inp = $('#inp', el), chk = $('#chk', el);
      $('#sp', el).onclick = () => speak(ex.say);
      $('#slow', el).onclick = () => speak(ex.say, 0.55);
      setTimeout(() => speak(ex.say), 250);
      const check = () => {
        if (!inp.value.trim()) return;
        inp.disabled = true; chk.disabled = true;
        done(norm(inp.value) === norm(ex.answer));
      };
      chk.onclick = check;
      inp.onkeydown = e => { if (e.key === 'Enter') check(); };
    },

    speak(ex, el, done) {
      el.innerHTML = `<p class="kind">Скажи вслух</p><div class="big">${esc(ex.text)}</div><div class="sub">${esc(ex.ru)}</div><button class="link" id="sp">🔊 Послушать образец</button><button class="mic" id="mic">🎤 Нажми и говори</button><div class="sub" id="res"></div><button class="link" id="skip">Пропустить</button>`;
      const res = $('#res', el), mic = $('#mic', el);
      $('#sp', el).onclick = () => speak(ex.text);
      $('#skip', el).onclick = () => { ex.skipped = true; done(true); };
      mic.onclick = () => {
        mic.disabled = true;
        res.textContent = 'Слушаю…';
        listen(alts => {
          const target = norm(ex.text);
          const best = Math.max.apply(null, alts.map(a => similarity(norm(a), target)));
          if (best >= 0.8) { res.innerHTML = 'Услышано: «' + esc(alts[0]) + '»'; mic.hidden = true; $('#skip', el).hidden = true; done(true); }
          else { res.innerHTML = 'Услышано: «' + esc(alts[0]) + '». Попробуй ещё раз.'; mic.disabled = false; }
        }, err => {
          res.textContent = err === 'not-allowed' ? 'Нет доступа к микрофону. Разреши его в браузере или пропусти задание.' : 'Не удалось распознать. Попробуй ещё раз или пропусти.';
          mic.disabled = false;
        });
      };
    }
  };

  /* ---------- раннер упражнений ---------- */
  function runner(list, opts) {
    const q = list.map(e => Object.assign({}, e));
    const total = q.length;
    let done = 0, correct = 0;
    function step() {
      if (!q.length) { opts.onDone({ total, correct }); return; }
      const ex = q[0];
      app.innerHTML = `<div class="stage"><div class="top"><button class="x" id="x" aria-label="Выйти">✕</button><div class="bar"><i style="width:${Math.round(done / total * 100)}%"></i></div></div><div class="ex" id="ex"></div></div><div class="fb" id="fb" hidden></div>`;
      $('#x').onclick = opts.onExit;
      RENDER[ex.t](ex, $('#ex'), ok => {
        if (ex.word && !ex.retry) mark(ex.word, ok);
        q.shift();
        if (ok) { done++; if (!ex.retry) correct++; }
        else q.push(Object.assign({}, ex, { retry: true }));
        const fb = $('#fb');
        fb.hidden = false;
        fb.className = 'fb ' + (ok ? 'good' : 'bad');
        fb.innerHTML = `<div class="msg"><b>${ok ? pick(PRAISE) : 'Неверно'}</b>${ok ? '' : '<span>Правильно: ' + esc(ex.answer) + '</span>'}</div><button class="btn" id="nx">Далее</button>`;
        $('#nx').onclick = step;
      });
    }
    step();
  }

  /* ---------- экраны ---------- */
  let tab = 'home';
  const VIEWS = { home: homeView, dict: dictView, set: settingsView };

  function shell(html) {
    const items = [['home', '🏠', 'Путь'], ['dict', '📖', 'Словарь'], ['set', '⚙️', 'Настройки']];
    app.innerHTML = `<main class="main">${html}</main><nav class="nav">${items.map(([k, i, l]) => `<button data-tab="${k}" class="${tab === k ? 'on' : ''}"><span>${i}</span>${l}</button>`).join('')}</nav>`;
    app.querySelectorAll('.nav button').forEach(b => { b.onclick = () => go(b.dataset.tab); });
    window.scrollTo(0, 0);
  }
  function go(t) { tab = t; seq++; stopSpeech(); VIEWS[t](); }

  function homeView() {
    const due = dueList().length;
    const units = UNITS.map((u, i) => {
      const unlocked = i === 0 || S.done[UNITS[i - 1].id];
      const d = S.done[u.id];
      return `<button class="unit${unlocked ? '' : ' locked'}${d ? ' done' : ''}" data-i="${i}" ${unlocked ? '' : 'disabled'}>
        <span class="ic">${u.emoji}</span>
        <span class="tx"><b>Юнит ${i + 1} · ${esc(u.title)}</b><small>${esc(u.desc)}</small></span>
        <span class="st">${!unlocked ? '🔒' : d ? '✓ ' + d + '%' : '▶'}</span></button>`;
    }).join('');
    shell(`
      <header class="hdr"><div class="logo">🗣️ Quick Tongue</div><div class="chips"><span class="chip2">🔥 ${currentStreak()}</span><span class="chip2">⭐ ${S.xp}</span></div></header>
      <section class="card rev"><div><b>Повторение</b><small>${due ? 'Слов к повторению: ' + due : 'Сегодня повторять нечего'}</small></div><button class="btn sm" id="rv" ${due ? '' : 'disabled'}>Начать</button></section>
      <h2>Твой путь</h2><div class="path">${units}</div>`);
    app.querySelectorAll('.unit').forEach(b => { b.onclick = () => openUnit(Number(b.dataset.i)); });
    const rv = $('#rv'); if (rv) rv.onclick = startReview;
  }

  function dictView() {
    const ks = Object.keys(S.words).filter(k => WORDS[k]).sort((a, b) => WORDS[a].unit - WORDS[b].unit);
    const rows = ks.map(k => {
      const w = WORDS[k], b = S.words[k].box;
      return `<div class="row" data-w="${esc(k)}"><span class="em">${w.emoji}</span><span class="tx"><b>${esc(w.en)}</b><small>${esc(w.ru)}</small></span><span class="dots">${'●'.repeat(b)}${'○'.repeat(6 - b)}</span></div>`;
    }).join('');
    shell(`<h1>Словарь</h1><p class="muted">Слов: ${ks.length} из ${ALL.length}. Точки показывают, насколько слово закрепилось. Нажми на слово, чтобы послушать.</p>${rows || '<div class="card">Пока пусто. Начни первый юнит.</div>'}`);
    app.querySelectorAll('.row').forEach(r => { r.onclick = () => speak(r.dataset.w); });
  }

  function settingsView() {
    const opts = voices.map(v => `<option value="${esc(v.name)}" ${v.name === S.voice ? 'selected' : ''}>${esc(v.name)} (${esc(v.lang)})</option>`).join('');
    shell(`<h1>Настройки</h1>
      <div class="card"><label>Голос<select id="vo"><option value="">Автоматически</option>${opts}</select></label>
      <label>Скорость речи: <b id="rtv">${S.rate}</b><input id="rt" type="range" min="0.5" max="1.2" step="0.05" value="${S.rate}"></label>
      <button class="btn sm" id="test">🔊 Проверить голос</button></div>
      <div class="card"><p>Озвучка: <b>${hasTTS ? 'доступна' : 'недоступна'}</b><br>Распознавание речи: <b>${SR ? 'доступно' : 'недоступно (используй Chrome или Edge)'}</b></p></div>
      <div class="card"><p class="muted">Прогресс хранится только в этом браузере.</p><button class="btn danger sm" id="reset">Сбросить прогресс</button></div>`);
    $('#vo').onchange = e => { S.voice = e.target.value; save(); };
    $('#rt').oninput = e => { S.rate = Number(e.target.value); $('#rtv').textContent = S.rate; save(); };
    $('#test').onclick = () => speak('Hello! My name is Alex. Nice to meet you.');
    $('#reset').onclick = () => { if (confirm('Удалить весь прогресс?')) { S = DEFAULTS(); save(); go('home'); } };
  }

  function summary(title, r, gain, nextIdx) {
    const acc = Math.round(r.correct / r.total * 100);
    app.innerHTML = `<div class="done"><div class="trophy">🎉</div><h1>${title}</h1>
      <div class="stats"><div><b>${acc}%</b><small>с первой попытки</small></div><div><b>+${gain}</b><small>очков опыта</small></div><div><b>🔥 ${currentStreak()}</b><small>дней подряд</small></div></div>
      ${nextIdx != null ? '<button class="btn" id="nxu">Следующий юнит</button>' : ''}<button class="btn ghost" id="hm">На главную</button></div>`;
    $('#hm').onclick = () => go('home');
    if (nextIdx != null) $('#nxu').onclick = () => openUnit(nextIdx);
  }

  function finishUnit(ui, r) {
    const acc = Math.round(r.correct / r.total * 100);
    const gain = 10 + r.correct * 2;
    S.xp += gain;
    S.done[UNITS[ui].id] = Math.max(S.done[UNITS[ui].id] || 0, acc, 1);
    touchStreak(); save();
    summary('Юнит пройден!', r, gain, ui + 1 < UNITS.length ? ui + 1 : null);
  }

  function startReview() {
    const list = shuffle(dueList()).slice(0, 10).map(en => {
      const w = WORDS[en], b = S.words[en].box;
      const kinds = b >= 3 ? ['type', 'listen', 'reverse'] : ['choose', 'listen', 'reverse'];
      const k = pick(kinds);
      return k === 'type' ? exTypeWord(w) : k === 'choose' ? exChoose(w, ALL) : k === 'listen' ? exListen(w, ALL) : exReverse(w, ALL);
    });
    runner(list, {
      onExit: () => go('home'),
      onDone: r => { const gain = 5 + r.correct; S.xp += gain; touchStreak(); save(); summary('Повторение завершено!', r, gain, null); }
    });
  }

  function openUnit(ui) {
    const u = UNITS[ui];
    const stages = ['words', 'dialogue', 'grammar', 'practice'];
    let si = 0;
    u.words.forEach(w => { if (!S.words[w.en]) S.words[w.en] = { box: 0, due: today(), seen: 0 }; });
    save();

    function frame(title, body, btn) {
      app.innerHTML = `<div class="stage"><div class="top"><button class="x" id="x" aria-label="Выйти">✕</button><div class="bar"><i style="width:${Math.round(si / stages.length * 100)}%"></i></div></div><div class="ex scroll"><h1>${title}</h1>${body}</div></div><div class="fb"><button class="btn" id="nx">${btn}</button></div>`;
      $('#x').onclick = () => go('home');
      $('#nx').onclick = () => { si++; next(); };
    }

    function next() {
      seq++; stopSpeech();
      const st = stages[si];
      if (st === 'words') {
        frame('Новые слова', `<p class="muted">Нажимай на карточки, чтобы услышать слово.</p><div class="grid">${u.words.map(w => `<button class="wcard" data-en="${esc(w.en)}"><span>${w.emoji}</span><b>${esc(w.en)}</b><small>${esc(w.ru)}</small></button>`).join('')}</div>`, 'Дальше');
        app.querySelectorAll('.wcard').forEach(b => { b.onclick = () => speak(b.dataset.en); });
      } else if (st === 'dialogue') {
        const who = Array.from(new Set(u.dialogue.map(l => l.who)));
        frame('Диалог', `<div class="tools"><button class="btn sm" id="pl">▶ Слушать</button><label class="sw"><input type="checkbox" id="tr" checked> перевод</label></div><div class="dlg" id="dlg">${u.dialogue.map((l, i) => `<div class="bub ${who.indexOf(l.who) === 0 ? 'l' : 'r'}" data-i="${i}"><small>${esc(l.who)}</small><span class="en">${esc(l.en)}</span><span class="ru">${esc(l.ru)}</span></div>`).join('')}</div><p class="muted">Нажми на реплику, чтобы услышать её отдельно.</p>`, 'Дальше');
        $('#pl').onclick = () => playDialogue(u.dialogue, who);
        $('#tr').onchange = e => { $('#dlg').classList.toggle('hide-ru', !e.target.checked); };
        app.querySelectorAll('.bub').forEach(b => { b.onclick = () => { seq++; speak(u.dialogue[Number(b.dataset.i)].en); }; });
      } else if (st === 'grammar') {
        frame(esc(u.grammar.title), `<div class="grammar">${u.grammar.html}</div>`, 'Понятно, к заданиям');
      } else {
        runner(buildPractice(ui), { onExit: () => go('home'), onDone: r => finishUnit(ui, r) });
      }
    }
    next();
  }

  go('home');
})();
