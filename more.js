/* =====================================================================
   MORE MODULE — the "More" tab: Search, Bible Quiz, Today's Verse,
   Know Your Bible, Bible Concordance, Reading Plan, My Highlights.
   Independent module: delete this file (and its script tag) and the app
   keeps working (the More tab simply disappears). It reads the Bible only
   through DV.bible (provided by bible.js). Every screen is a full-page modal
   with a return arrow, and has its own link.
   ===================================================================== */
(function() {
  try {
    if (!window.DV) return;

    function Q(s) { return document.querySelector(s); }
    function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
    function B() { return window.DV.bible || null; }
    function data() { var b = B(); return b ? b.data() : null; }
    function ready() { return !!data(); }
    function bodyEl() { return Q('#dvModalBody'); }
    function svg(p, s) { s = s || 24; return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>'; }
    var NOT_READY = '<div class="dv-mo-note">The Bible is still being prepared. Please try again in a moment.</div>';

    /* ===== STYLES ===== */
    var css = '' +
      '.dv-mo-row{display:flex;align-items:center;gap:16px;width:100%;padding:20px 8px;border:none;border-bottom:1px solid var(--dv-border);background:transparent;color:var(--dv-text);font-size:1.2rem;font-weight:700;font-family:inherit;text-align:left;cursor:pointer}' +
      '.dv-mo-row:active{background:var(--dv-bg)}' +
      '.dv-mo-row svg{color:var(--dv-primary);flex-shrink:0}' +
      '.dv-mo-note{font-size:1.1rem;color:var(--dv-text-sub);line-height:1.5;padding:8px 0}' +
      '.dv-mo-sw input{width:100%;padding:13px 18px;border:2px solid var(--dv-border);border-radius:999px;background:var(--dv-bg);color:var(--dv-text);font-size:1.1rem;font-family:inherit;outline:none}' +
      '.dv-mo-sw input:focus{border-color:var(--dv-primary)}' +
      '.dv-mo-count{font-size:1rem;font-weight:700;color:var(--dv-text-sub);margin:12px 4px 8px}' +
      '.dv-mo-item{display:block;width:100%;text-align:left;background:var(--dv-bg);border:none;border-radius:12px;padding:12px 14px;margin-bottom:8px;font-family:inherit;color:var(--dv-text);font-size:var(--dvBs,22px);line-height:1.6;cursor:pointer}' +
      '.dv-mo-item:active{background:var(--dv-border)}' +
      '.dv-mo-ref{display:block;font-size:1rem;font-weight:800;color:var(--dv-primary)}' +
      '.dv-mo-hit{background:#FFD700;color:#000;padding:0 3px;border-radius:4px}' +
      '.dv-mo-btn{display:block;width:100%;padding:15px;margin-top:12px;border:none;border-radius:12px;background:var(--dv-primary);color:#fff;font-size:1.1rem;font-weight:700;font-family:inherit;cursor:pointer}' +
      '.dv-mo-btn.dv-mo-sec{background:var(--dv-bg);color:var(--dv-text);border:2px solid var(--dv-border)}' +
      '.dv-mo-prog{display:flex;justify-content:space-between;font-size:1.1rem;font-weight:800;color:var(--dv-primary);margin-bottom:6px}' +
      '.dv-mo-q{font-size:var(--dvBs,22px);line-height:1.7;font-style:italic;margin:12px 0 18px;color:var(--dv-text)}' +
      '.dv-mo-opt{display:block;width:100%;padding:16px;margin-bottom:10px;border:2px solid var(--dv-border);border-radius:12px;background:var(--dv-bg);color:var(--dv-text);font-size:1.15rem;font-weight:700;font-family:inherit;text-align:left;cursor:pointer}' +
      '.dv-mo-opt.dv-ok{background:#16A34A;color:#fff;border-color:#16A34A}.dv-mo-opt.dv-bad{background:#DC2626;color:#fff;border-color:#DC2626}' +
      '.dv-mo-conf{position:fixed;inset:0;z-index:10050;background:rgba(0,0,0,0.72);display:none;align-items:center;justify-content:center;padding:20px}' +
      '.dv-mo-conf.dv-on{display:flex}' +
      '.dv-mo-conf-card{width:100%;background:var(--dv-surface);color:var(--dv-text);border-radius:16px;padding:22px;text-align:center}' +
      '.dv-mo-conf-h{font-size:1.5rem;font-weight:800;margin-bottom:10px}' +
      '.dv-mo-conf-v{font-size:var(--dvBs,22px);line-height:1.6;font-style:italic;margin-bottom:10px}' +
      '.dv-mo-conf-r{font-size:1.2rem;font-weight:800;color:var(--dv-primary)}' +
      '.dv-mo-conf-t{font-size:1rem;color:var(--dv-text-sub);margin-top:12px}' +
      '.dv-mo-score{font-size:2rem;font-weight:800;color:var(--dv-primary);text-align:center;margin:18px 0}' +
      '.dv-mo-know h4{font-size:1.25rem;font-weight:800;color:var(--dv-text);margin:20px 0 6px;padding-left:10px;border-left:4px solid var(--dv-primary);line-height:1.5}' +
      '.dv-mo-know p,.dv-mo-know li{font-size:1.05rem;line-height:1.65;color:var(--dv-text-sub);margin:0 0 10px}' +
      '.dv-mo-know ul{padding-left:22px;margin:0 0 10px}' +
      '.dv-mo-know b{color:var(--dv-text)}' +
      '.dv-mo-tv{font-size:calc(var(--dvBs,22px) + 2px);line-height:1.65;font-style:italic;color:var(--dv-text);margin:10px 0 12px;background:var(--dv-bg);padding:14px;border-radius:12px;border-left:6px solid var(--dv-primary)}' +
      '.dv-mo-tvr{font-size:1.2rem;font-weight:800;color:var(--dv-primary)}' +
      '.dv-tv-pop{position:fixed;top:86px;left:12px;right:12px;z-index:9500;background:var(--dv-surface);color:var(--dv-text);border-left:6px solid var(--dv-primary);border-radius:12px;box-shadow:var(--dv-shadow-lg);padding:12px 14px;opacity:0;pointer-events:none;transition:opacity .3s;cursor:pointer;font-family:inherit}' +
      '.dv-tv-pop.dv-on{opacity:1;pointer-events:auto}' +
      '.dv-tv-pop b{display:block;font-size:1rem;color:var(--dv-primary);margin-bottom:2px}' +
      '.dv-tv-pop span{display:block;font-size:1.05rem;line-height:1.45}' +
      '.dv-mo-hl{display:block;width:100%;text-align:left;border:none;border-left:6px solid #000;border-radius:8px;padding:10px 12px;margin-bottom:8px;font-family:inherit;font-size:var(--dvBs,22px);line-height:1.6;cursor:pointer}';
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);

    /* ===== BIBLE ACCESS HELPERS ===== */
    function parseRef(r) {
      var b = B(), d = data(), m = /^(.+) (\d+):(\d+)$/.exec(r);
      if (!b || !d || !m) return null;
      var bi = b.names.indexOf(m[1]), ci = +m[2] - 1, vi = +m[3] - 1;
      if (bi < 0 || !d[bi] || !d[bi].c[ci] || d[bi].c[ci][vi] === undefined) return null;
      return { bi: bi, ci: ci, vi: vi, ref: r, text: d[bi].c[ci][vi] };
    }
    function jump(bi, ci, v) { B().jump(bi, ci, v); }
    function mark(text, terms) {
      if (!terms.length) return esc(text);
      var re = new RegExp('\\b(' + terms.map(function(w) { return w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|') + ')', 'gi'), out = '', last = 0, m;
      while ((m = re.exec(text))) {
        out += esc(text.slice(last, m.index)) + '<span class="dv-mo-hit">' + esc(m[0]) + '</span>';
        last = m.index + m[0].length;
      }
      return out + esc(text.slice(last));
    }
    function shareText(text, url) {
      if (navigator.share) navigator.share({ title: 'Holy Bible KJV', text: text, url: url }).catch(function() {});
      else DV.toast('Sharing is not supported on this device');
    }
    function shareBt(text, url) {
      var msg = text + '\n\n' + url, file = null;
      try { file = new File([msg], 'verse.txt', { type: 'text/plain' }); } catch (e) {}
      if (navigator.share && file && navigator.canShare && navigator.canShare({ files: [file] })) navigator.share({ files: [file], title: 'Holy Bible KJV' }).catch(function() {});
      else if (navigator.share) navigator.share({ title: 'Holy Bible KJV', text: msg }).catch(function() {});
      else { DV.toast('Sharing is not supported on this device'); return; }
      DV.toast('Choose Bluetooth from the list');
    }

    /* ===== ROUTE HELPER (every screen = full-page modal + own link) ===== */
    var timers = { t: null, i: null };
    function stopTimers() { clearTimeout(timers.t); clearInterval(timers.i); var c = Q('#dvMoConf'); if (c) c.classList.remove('dv-on'); }
    function screen(slug, title, description, build) {
      DV.route(slug, {
        title: title,
        description: description,
        navKey: 'more',
        open: function() { build(title); },
        close: function() { stopTimers(); var b = bodyEl(); if (b) b.onclick = null; DV.closeModal(); }
      });
    }

    /* ===== MORE (hub) ===== */
    var features = [
      ['search', 'Search', '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>'],
      ['bible-quiz', 'Bible Quiz', '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>'],
      ['todays-verse', 'Today\'s Verse', '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>'],
      ['know-your-bible', 'Know Your Bible', '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>'],
      ['bible-concordance', 'Bible Concordance', '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>'],
      ['reading-plan', 'Reading Plan', '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><polyline points="9 10 11 12 15 8"/>'],
      ['my-highlights', 'My Highlights', '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>']
    ];
    screen('more', 'More', 'Search, Bible Quiz, Today\'s Verse, Know Your Bible, Bible Concordance, Reading Plan and My Highlights.', function(t) {
      DV.openModal(t, features.map(function(f) { return '<button class="dv-mo-row" data-dvmo="' + f[0] + '">' + svg(f[2], 26) + f[1] + '</button>'; }).join(''), function() {
        bodyEl().onclick = function(e) { var r = e.target.closest('[data-dvmo]'); if (r) DV.navigate(r.getAttribute('data-dvmo')); };
      });
    });

    /* ===== 1. SEARCH (100+ results, 100 more at a time) ===== */
    var sr = { list: [], shown: 0, terms: [] };
    function searchRender() {
      var box = Q('#dvMoRes'), cnt = Q('#dvMoCount');
      if (!box) return;
      var h = '', end = Math.min(sr.shown, sr.list.length), b = B();
      for (var i = 0; i < end; i++) {
        var r = sr.list[i];
        h += '<button class="dv-mo-item" data-dvj="' + r.bi + ':' + r.ci + ':' + r.vi + '"><span class="dv-mo-ref">' + esc(b.names[r.bi] + ' ' + (r.ci + 1) + ':' + (r.vi + 1)) + '</span>' + mark(r.t, sr.terms) + '</button>';
      }
      if (sr.list.length > end) h += '<button class="dv-mo-btn dv-mo-sec" data-dvmore="1">Show 100 more (' + (sr.list.length - end) + ' remaining)</button>';
      box.innerHTML = h;
      cnt.textContent = sr.list.length ? sr.list.length + ' verses found' + (sr.list.length >= 1500 ? ' (showing the first 1500)' : '') : '';
    }
    function searchRun(q) {
      var d = data(), cnt = Q('#dvMoCount');
      q = q.trim();
      sr = { list: [], shown: 100, terms: [] };
      if (!d) { Q('#dvMoRes').innerHTML = NOT_READY; cnt.textContent = ''; return; }
      if (q.length < 3) { Q('#dvMoRes').innerHTML = '<div class="dv-mo-note">Type at least 3 letters to search the whole Bible.</div>'; cnt.textContent = ''; return; }
      var words = q.split(/\s+/).filter(Boolean);
      var res = words.map(function(w) { return new RegExp('\\b' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'); });
      sr.terms = words;
      outer:
      for (var bi = 0; bi < d.length; bi++) {
        for (var ci = 0; ci < d[bi].c.length; ci++) {
          for (var vi = 0; vi < d[bi].c[ci].length; vi++) {
            var t = d[bi].c[ci][vi];
            if (res.every(function(re) { return re.test(t); })) {
              sr.list.push({ bi: bi, ci: ci, vi: vi, t: t });
              if (sr.list.length >= 1500) break outer;
            }
          }
        }
      }
      if (!sr.list.length) { Q('#dvMoRes').innerHTML = '<div class="dv-mo-note">No verses found for "' + esc(q) + '".</div>'; cnt.textContent = ''; return; }
      searchRender();
    }
    screen('search', 'Search', 'Search the whole King James Bible.', function(t) {
      DV.openModal(t, '<div class="dv-mo-sw"><input id="dvMoQ" type="search" placeholder="Search the Bible" autocomplete="off"></div><div class="dv-mo-count" id="dvMoCount"></div><div id="dvMoRes"><div class="dv-mo-note">Type a word or phrase to search the whole Bible.</div></div>', function() {
        var tm = null, inp = Q('#dvMoQ');
        inp.addEventListener('input', function() { clearTimeout(tm); tm = setTimeout(function() { searchRun(inp.value); }, 300); });
        bodyEl().onclick = function(e) {
          if (e.target.closest('[data-dvmore]')) { sr.shown += 100; searchRender(); return; }
          var j = e.target.closest('[data-dvj]');
          if (j) { var p = j.getAttribute('data-dvj').split(':'); jump(+p[0], +p[1], +p[2] + 1); }
        };
        setTimeout(function() { inp.focus(); }, 80);
      });
    });

    /* ===== 2. BIBLE QUIZ (auto-progressive, 5-second full-verse confirmation) ===== */
    var qz = null;
    document.body.insertAdjacentHTML('beforeend', '<div class="dv-mo-conf" id="dvMoConf"><div class="dv-mo-conf-card"><div class="dv-mo-conf-h" id="dvMoConfH"></div><div class="dv-mo-conf-v" id="dvMoConfV"></div><div class="dv-mo-conf-r" id="dvMoConfR"></div><div class="dv-mo-conf-t" id="dvMoConfT"></div></div></div>');
    function pickVerse() {
      var d = data();
      for (var n = 0; n < 300; n++) {
        var bi = Math.floor(Math.random() * 66), ci = Math.floor(Math.random() * d[bi].c.length), vs = d[bi].c[ci], vi = Math.floor(Math.random() * vs.length), tx = vs[vi], w = tx.split(' ');
        if (w.length >= 9 && tx.length <= 240) return { bi: bi, ci: ci, vi: vi, tx: tx, w: w };
      }
      return null;
    }
    function qzShow() {
      var box = bodyEl(), b = B();
      if (!box) return;
      if (qz.i >= qz.total) {
        box.innerHTML = '<div class="dv-mo-prog"><span>Quiz Complete</span></div><div class="dv-mo-score">' + qz.score + ' of ' + qz.total + '</div><button class="dv-mo-btn" data-dvq="again">Play Again</button>';
        return;
      }
      var v = pickVerse();
      if (!v) { box.innerHTML = NOT_READY; return; }
      qz.cur = v; qz.locked = false;
      var cut = Math.ceil(v.w.length * 0.6), opts = [v.bi];
      while (opts.length < 4) { var r = Math.floor(Math.random() * 66); if (opts.indexOf(r) < 0) opts.push(r); }
      opts.sort(function() { return Math.random() - 0.5; });
      box.innerHTML = '<div class="dv-mo-prog"><span>Question ' + (qz.i + 1) + ' of ' + qz.total + '</span><span>Score ' + qz.score + '</span></div>' +
        '<div class="dv-mo-q">\u201C' + esc(v.w.slice(0, cut).join(' ')) + ' ...\u201D</div>' +
        '<div class="dv-mo-count" style="margin:0 0 10px">Which book of the Bible is this verse from?</div>' +
        opts.map(function(o) { return '<button class="dv-mo-opt" data-dvo="' + o + '">' + esc(b.names[o]) + '</button>'; }).join('');
    }
    function qzAnswer(btn) {
      if (qz.locked) return;
      qz.locked = true;
      var b = B(), pick = +btn.getAttribute('data-dvo'), v = qz.cur, ok = pick === v.bi;
      if (ok) qz.score++;
      document.querySelectorAll('.dv-mo-opt').forEach(function(o) {
        var n = +o.getAttribute('data-dvo');
        if (n === v.bi) o.classList.add('dv-ok'); else if (n === pick) o.classList.add('dv-bad');
      });
      Q('#dvMoConfH').textContent = ok ? 'Correct!' : 'Not quite';
      Q('#dvMoConfH').style.color = ok ? '#16A34A' : '#DC2626';
      Q('#dvMoConfV').textContent = '\u201C' + v.tx + '\u201D';
      Q('#dvMoConfR').textContent = b.names[v.bi] + ' ' + (v.ci + 1) + ':' + (v.vi + 1);
      var left = 5;
      Q('#dvMoConfT').textContent = 'Next question in ' + left + '...';
      Q('#dvMoConf').classList.add('dv-on');
      clearInterval(timers.i);
      timers.i = setInterval(function() { left--; if (left > 0) Q('#dvMoConfT').textContent = 'Next question in ' + left + '...'; }, 1000);
      clearTimeout(timers.t);
      timers.t = setTimeout(function() {
        clearInterval(timers.i);
        Q('#dvMoConf').classList.remove('dv-on');
        qz.i++;
        qzShow();
      }, 5000);
    }
    screen('bible-quiz', 'Bible Quiz', 'Test your knowledge of the Bible with a 10-question quiz.', function(t) {
      DV.openModal(t, ready() ? '' : NOT_READY, function() {
        if (!ready()) return;
        qz = { i: 0, total: 10, score: 0, locked: false, cur: null };
        qzShow();
        bodyEl().onclick = function(e) {
          var o = e.target.closest('[data-dvo]');
          if (o) { qzAnswer(o); return; }
          if (e.target.closest('[data-dvq="again"]')) { qz = { i: 0, total: 10, score: 0, locked: false, cur: null }; qzShow(); }
        };
      });
    });

    /* ===== 3. TODAY'S VERSE (popup anywhere + modal) ===== */
    var tvRefs = ['John 3:16', 'Psalms 23:1', 'Philippians 4:13', 'Jeremiah 29:11', 'Proverbs 3:5', 'Isaiah 41:10', 'Romans 8:28', 'Joshua 1:9', 'Matthew 6:33', 'Psalms 46:1', 'Isaiah 40:31', 'Romans 12:2', 'Philippians 4:6', '2 Timothy 1:7', 'Hebrews 11:1', 'John 14:6', 'Psalms 119:105', 'Matthew 11:28', 'Proverbs 22:6', 'Galatians 2:20', 'Ephesians 2:8', '1 Corinthians 13:13', 'Psalms 27:1', 'Romans 5:8', 'John 14:27', 'Isaiah 26:3', 'Psalms 37:4', 'Colossians 3:23', '1 Peter 5:7', 'James 1:5', 'Matthew 5:16', 'Lamentations 3:23', 'Psalms 91:1', 'Micah 6:8', 'Romans 10:9', 'Joshua 24:15', 'Psalms 34:8', 'Proverbs 16:3', 'Isaiah 53:5', 'John 1:1', 'Genesis 1:1', 'Psalms 121:1', 'Matthew 28:19', 'Acts 1:8', '2 Corinthians 5:17', 'Galatians 5:22', 'Ephesians 6:10', 'Hebrews 13:8', '1 John 4:19', 'Revelation 21:4', 'Psalms 19:1', 'Deuteronomy 31:6', 'Psalms 118:24', 'Zephaniah 3:17', 'Nahum 1:7', 'Romans 15:13', '1 Thessalonians 5:16', 'Psalms 139:14', 'Exodus 14:14'];
    function tvVerse() {
      if (!ready()) return null;
      var d = new Date(), day = Math.floor(new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() / 86400000);
      for (var k = 0; k < tvRefs.length; k++) {
        var v = parseRef(tvRefs[(day + k) % tvRefs.length]);
        if (v) return v;
      }
      return null;
    }
    document.body.insertAdjacentHTML('beforeend', '<div class="dv-tv-pop" id="dvTvPop"></div>');
    var tvTimer = null;
    function tvHide() { var p = Q('#dvTvPop'); if (p) p.classList.remove('dv-on'); clearTimeout(tvTimer); }
    Q('#dvTvPop').addEventListener('click', function() { tvHide(); DV.navigate('todays-verse'); });
    function tvPopup() {
      var key = new Date().toDateString(), seen = '';
      try { seen = localStorage.getItem('dvTvSeen') || ''; } catch (e) {}
      if (seen === key) return;
      var n = 0, iv = setInterval(function() {
        n++;
        var v = tvVerse();
        if (v) {
          clearInterval(iv);
          try { localStorage.setItem('dvTvSeen', key); } catch (e) {}
          Q('#dvTvPop').innerHTML = '<b>Today\'s Verse</b><span>' + esc(v.text.length > 110 ? v.text.slice(0, 107) + '...' : v.text) + '</span><b style="margin:4px 0 0">' + esc(v.ref) + '</b>';
          Q('#dvTvPop').classList.add('dv-on');
          tvTimer = setTimeout(tvHide, 9000);
        } else if (n > 120) clearInterval(iv);
      }, 1000);
    }
    screen('todays-verse', 'Today\'s Verse', 'A verse from the King James Bible for today.', function(t) {
      var v = tvVerse();
      DV.openModal(t, v ? '<div class="dv-mo-tv">\u201C' + esc(v.text) + '\u201D</div><div class="dv-mo-tvr">' + esc(v.ref) + ' (KJV)</div>' +
        '<button class="dv-mo-btn" data-dvt="read">Read the Chapter</button><button class="dv-mo-btn dv-mo-sec" data-dvt="share">Share via Android</button><button class="dv-mo-btn dv-mo-sec" data-dvt="bt">Share via Bluetooth</button>' : NOT_READY, function() {
        if (!v) return;
        bodyEl().onclick = function(e) {
          var a = e.target.closest('[data-dvt]');
          if (!a) return;
          var k = a.getAttribute('data-dvt'), txt = '\u201C' + v.text + '\u201D \u2014 ' + v.ref + ' (KJV)', url = DV.url('todays-verse');
          if (k === 'read') jump(v.bi, v.ci, v.vi + 1);
          else if (k === 'share') shareText(txt, url);
          else shareBt(txt, url);
        };
      });
    });

    /* ===== 4. KNOW YOUR BIBLE ===== */
    var knowHTML = '<div class="dv-mo-know">' +
      '<h4>The Bible at a Glance</h4>' +
      '<p>The Bible is a collection of <b>66 books</b>: <b>39</b> in the Old Testament and <b>27</b> in the New Testament. It was written over roughly <b>1,500 years</b> by about <b>40 authors</b>, in Hebrew, Aramaic and Greek. The King James Version has <b>1,189 chapters</b> and <b>31,102 verses</b>.</p>' +
      '<h4>The Old Testament (39 books)</h4>' +
      '<ul><li><b>Law</b> (5): Genesis to Deuteronomy</li><li><b>History</b> (12): Joshua to Esther</li><li><b>Poetry and Wisdom</b> (5): Job to Song of Solomon</li><li><b>Major Prophets</b> (5): Isaiah to Daniel</li><li><b>Minor Prophets</b> (12): Hosea to Malachi</li></ul>' +
      '<h4>The New Testament (27 books)</h4>' +
      '<ul><li><b>Gospels</b> (4): Matthew, Mark, Luke, John</li><li><b>History</b> (1): Acts</li><li><b>Letters of Paul</b> (13): Romans to Philemon</li><li><b>General Letters</b> (8): Hebrews to Jude</li><li><b>Prophecy</b> (1): Revelation</li></ul>' +
      '<h4>Who Wrote the Bible</h4>' +
      '<ul><li><b>Moses</b> is traditionally credited with the first five books.</li><li><b>David</b> wrote many of the Psalms (about 73 carry his name).</li><li><b>Solomon</b> is traditionally credited with Proverbs, Ecclesiastes and the Song of Solomon.</li><li><b>The prophets</b> wrote the books that bear their names, from Isaiah to Malachi.</li><li><b>Matthew, Mark, Luke and John</b> wrote the four Gospels. Luke also wrote Acts.</li><li><b>Paul</b> is credited with 13 letters. <b>James, Peter, John and Jude</b> wrote the General Letters. The author of Hebrews is not named.</li><li><b>John</b> is traditionally credited with Revelation.</li></ul>' +
      '<h4>Key Figures</h4>' +
      '<ul><li><b>Adam and Eve</b>: the first man and woman.</li><li><b>Noah</b>: built the ark.</li><li><b>Abraham</b>: father of faith, called by God to a new land.</li><li><b>Joseph</b>: sold into Egypt, later rose to rule under Pharaoh.</li><li><b>Moses</b>: led Israel out of Egypt and received the Law.</li><li><b>Joshua</b>: led Israel into the Promised Land.</li><li><b>Ruth and Esther</b>: women whose books bear their names.</li><li><b>David</b>: shepherd, king and psalmist.</li><li><b>Solomon</b>: king who built the Temple in Jerusalem.</li><li><b>Elijah and Daniel</b>: prophets who stood for God before kings.</li><li><b>John the Baptist</b>: prepared the way for Jesus.</li><li><b>Jesus Christ</b>: the center of the New Testament.</li><li><b>Peter and Paul</b>: leading apostles of the early church.</li></ul>' +
      '<h4>Key Events</h4>' +
      '<ul><li>Creation and the fall of man (Genesis 1 to 3)</li><li>The Flood (Genesis 6 to 9)</li><li>The call of Abraham (Genesis 12)</li><li>The Exodus and the Passover (Exodus 12 to 14)</li><li>The Ten Commandments at Mount Sinai (Exodus 20)</li><li>Crossing the Jordan into the Promised Land (Joshua 3)</li><li>David becomes king; Solomon builds the Temple</li><li>The fall of Jerusalem and the exile in Babylon (586 BC)</li><li>The birth, ministry, death and resurrection of Jesus (the four Gospels)</li><li>Pentecost and the birth of the church (Acts 2)</li><li>The missionary journeys of Paul (Acts 13 to 28)</li></ul>' +
      '<h4>Famous Verses and Records</h4>' +
      '<ul><li><b>John 3:16</b> is one of the best-known verses in the Bible.</li><li><b>John 11:35</b> ("Jesus wept.") is the shortest verse in the King James Version.</li><li><b>Esther 8:9</b> is the longest verse in the King James Version.</li><li><b>Psalm 119</b> is the longest chapter (176 verses). <b>Psalm 117</b> is the shortest.</li><li><b>Psalms</b> is the book with the most chapters (150).</li></ul>' +
      '<h4>The Origin of the King James Bible</h4>' +
      '<p>In 1603 James VI of Scotland also became King James I of England. At the <b>Hampton Court Conference in 1604</b>, church leaders asked for a new English translation, and the king approved the plan.</p>' +
      '<p>About <b>47 scholars</b> worked in <b>six companies</b> at Westminster, Oxford and Cambridge. They translated from the original Hebrew, Aramaic and Greek, and drew on earlier English Bibles, especially the work of <b>William Tyndale</b>, the Geneva Bible and the Bishops\' Bible.</p>' +
      '<p>The translation was <b>published in 1611</b> and became known as the <b>Authorized Version</b>. For centuries it was the most widely used English Bible, and its language shaped English worship and literature. Today the text is in the public domain.</p>' +
      '</div>';
    screen('know-your-bible', 'Know Your Bible', 'Facts about the Bible: its books, authors, figures, events and the origin of the King James Bible.', function(t) {
      DV.openModal(t, knowHTML);
    });

    /* ===== 5. BIBLE CONCORDANCE (topics for ministers) ===== */
    var topics = [
      ['faith', 'Faith', ['Hebrews 11:1', 'Hebrews 11:6', 'Romans 10:17', 'Mark 11:24', '2 Corinthians 5:7', 'James 2:17', 'Matthew 17:20']],
      ['love', 'Love', ['John 3:16', '1 Corinthians 13:4', '1 John 4:8', 'John 13:34', 'Romans 5:8', '1 John 4:19', 'Matthew 22:37']],
      ['grace', 'Grace', ['Ephesians 2:8', '2 Corinthians 12:9', 'Romans 6:14', 'Titus 2:11', 'Romans 3:24', 'John 1:16']],
      ['forgiveness', 'Forgiveness', ['1 John 1:9', 'Ephesians 4:32', 'Colossians 3:13', 'Matthew 6:14', 'Psalms 103:12', 'Luke 23:34']],
      ['prayer', 'Prayer', ['Matthew 6:6', 'Philippians 4:6', '1 Thessalonians 5:17', 'James 5:16', 'Jeremiah 33:3', 'Matthew 7:7', 'John 14:13']],
      ['salvation', 'Salvation', ['John 14:6', 'Romans 10:9', 'Acts 4:12', 'Titus 3:5', 'John 3:3', 'Romans 6:23', 'Acts 16:31']],
      ['healing', 'Healing', ['Isaiah 53:5', 'Psalms 103:3', 'James 5:14', 'Exodus 15:26', 'Jeremiah 30:17', '3 John 1:2', 'Psalms 147:3']],
      ['hope', 'Hope', ['Romans 15:13', 'Jeremiah 29:11', 'Romans 8:24', 'Hebrews 6:19', 'Lamentations 3:21', 'Psalms 42:11', 'Romans 5:5']],
      ['wisdom', 'Wisdom', ['James 1:5', 'Proverbs 3:5', 'Proverbs 9:10', 'Proverbs 4:7', 'Proverbs 2:6', 'Psalms 111:10']],
      ['fear-and-anxiety', 'Fear and Anxiety', ['Isaiah 41:10', '2 Timothy 1:7', 'Psalms 27:1', '1 Peter 5:7', 'Philippians 4:6', 'Psalms 56:3', 'Matthew 6:34']],
      ['strength', 'Strength', ['Philippians 4:13', 'Isaiah 40:31', 'Psalms 28:7', 'Nehemiah 8:10', 'Ephesians 6:10', 'Psalms 46:1', 'Joshua 1:9']],
      ['peace', 'Peace', ['John 14:27', 'Isaiah 26:3', 'Philippians 4:7', 'John 16:33', 'Colossians 3:15', 'Romans 5:1', 'Psalms 4:8']],
      ['giving-and-tithing', 'Giving and Tithing', ['Malachi 3:10', 'Luke 6:38', '2 Corinthians 9:7', 'Proverbs 3:9', 'Acts 20:35', 'Proverbs 11:25']],
      ['marriage-and-family', 'Marriage and Family', ['Genesis 2:24', 'Ephesians 5:25', 'Proverbs 18:22', 'Ecclesiastes 4:12', 'Joshua 24:15', 'Proverbs 22:6', 'Ephesians 6:1']],
      ['leadership', 'Leadership', ['Proverbs 29:18', 'Mark 10:45', '1 Timothy 3:1', 'Acts 6:3', '1 Peter 5:2', 'Matthew 20:26', '2 Timothy 2:2']],
      ['holy-spirit', 'The Holy Spirit', ['John 14:26', 'Acts 1:8', 'Acts 2:4', 'Galatians 5:22', 'Romans 8:14', 'John 16:13', 'Ephesians 5:18']],
      ['repentance', 'Repentance', ['Acts 3:19', '2 Chronicles 7:14', 'Luke 13:3', 'Mark 1:15', 'Acts 2:38', 'Psalms 51:10', 'Isaiah 55:7']],
      ['humility', 'Humility', ['James 4:10', '1 Peter 5:6', 'Proverbs 11:2', 'Micah 6:8', 'Philippians 2:3', 'Matthew 23:12']],
      ['worship-and-praise', 'Worship and Praise', ['Psalms 100:4', 'John 4:24', 'Psalms 150:6', 'Psalms 34:1', 'Hebrews 13:15', 'Psalms 95:6']],
      ['evangelism', 'Evangelism', ['Matthew 28:19', 'Mark 16:15', 'Acts 1:8', 'Romans 1:16', '2 Timothy 4:2', 'Matthew 5:16', 'Romans 10:14']],
      ['suffering-and-trials', 'Suffering and Trials', ['James 1:2', 'Romans 8:28', '1 Peter 4:12', '2 Corinthians 4:17', 'Romans 8:18', 'Psalms 34:19', 'John 16:33']],
      ['obedience', 'Obedience', ['John 14:15', 'Deuteronomy 28:1', '1 Samuel 15:22', 'James 1:22', 'Luke 11:28', 'Acts 5:29']],
      ['fasting', 'Fasting', ['Matthew 6:16', 'Isaiah 58:6', 'Joel 2:12', 'Matthew 17:21', 'Daniel 9:3', 'Acts 13:2']],
      ['eternal-life', 'Eternal Life', ['John 3:16', 'John 10:28', 'Romans 6:23', '1 John 5:11', 'John 11:25', 'Revelation 21:4']]
    ];
    screen('bible-concordance', 'Bible Concordance', 'Popular topics from the Bible for ministers, with verses.', function(t) {
      DV.openModal(t, '<div class="dv-mo-count" style="margin-top:0">Choose a topic</div>' + topics.map(function(tp) { return '<button class="dv-mo-row" data-dvtp="' + tp[0] + '">' + esc(tp[1]) + '</button>'; }).join(''), function() {
        bodyEl().onclick = function(e) { var r = e.target.closest('[data-dvtp]'); if (r) DV.navigate('topic-' + r.getAttribute('data-dvtp')); };
      });
    });
    topics.forEach(function(tp) {
      screen('topic-' + tp[0], tp[1], 'Bible verses on ' + tp[1] + '.', function(t) {
        var h = '';
        if (!ready()) h = NOT_READY;
        else {
          tp[2].forEach(function(r) {
            var v = parseRef(r);
            if (v) h += '<button class="dv-mo-item" data-dvj="' + v.bi + ':' + v.ci + ':' + v.vi + '"><span class="dv-mo-ref">' + esc(r) + '</span>' + esc(v.text) + '</button>';
          });
        }
        DV.openModal(t, h, function() {
          bodyEl().onclick = function(e) {
            var j = e.target.closest('[data-dvj]');
            if (j) { var p = j.getAttribute('data-dvj').split(':'); jump(+p[0], +p[1], +p[2] + 1); }
          };
        });
      });
    });

    /* ===== 6. READING PLAN (whole Bible in 365 days) ===== */
    function planLoad() { try { return JSON.parse(localStorage.getItem('dvPlan') || '{}') || {}; } catch (e) { return {}; } }
    function planSave(p) { try { localStorage.setItem('dvPlan', JSON.stringify(p)); } catch (e) {} }
    function midnight() { var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); }
    var planArmed = false;
    function planRender() {
      var box = bodyEl(), b = B(), p = planLoad();
      if (!box) return;
      if (!p.start) {
        box.innerHTML = '<div class="dv-mo-note">Read the whole Bible in 365 days. Each day gives you a short reading, from Genesis to Revelation.</div><button class="dv-mo-btn" data-dvp="start">Start the Plan</button>';
        return;
      }
      var all = [];
      b.counts.forEach(function(c, bi) { for (var ci = 0; ci < c; ci++) all.push([bi, ci]); });
      var day = Math.floor((midnight() - p.start) / 86400000) + 1, done = p.done || {}, total = 0;
      Object.keys(done).forEach(function(k) { if (done[k]) total++; });
      if (day > 365) day = 365;
      var s = Math.floor((day - 1) * all.length / 365), e = Math.floor(day * all.length / 365), h = '';
      h += '<div class="dv-mo-prog"><span>Day ' + day + ' of 365</span><span>' + total + ' days completed</span></div><div class="dv-mo-count" style="margin-top:6px">Today\'s reading</div>';
      all.slice(s, e).forEach(function(x) { h += '<button class="dv-mo-row" data-dvrp="' + x[0] + ':' + x[1] + '">' + esc(b.names[x[0]] + ' ' + (x[1] + 1)) + '</button>'; });
      h += '<button class="dv-mo-btn" data-dvp="done">' + (done[day] ? 'Completed. Tap to undo' : 'Mark Day Complete') + '</button>';
      h += '<button class="dv-mo-btn dv-mo-sec" data-dvp="restart">Restart Plan</button>';
      box.innerHTML = h;
    }
    screen('reading-plan', 'Reading Plan', 'Read the whole Bible in 365 days.', function(t) {
      DV.openModal(t, ready() ? '' : NOT_READY, function() {
        if (!ready()) return;
        planArmed = false;
        planRender();
        bodyEl().onclick = function(e) {
          var r = e.target.closest('[data-dvrp]'), a = e.target.closest('[data-dvp]');
          if (r) { var q = r.getAttribute('data-dvrp').split(':'); jump(+q[0], +q[1], 0); return; }
          if (!a) return;
          var k = a.getAttribute('data-dvp'), p = planLoad();
          if (k === 'start') { p = { start: midnight(), done: {} }; planSave(p); }
          else if (k === 'done') {
            var day = Math.min(365, Math.floor((midnight() - p.start) / 86400000) + 1);
            p.done = p.done || {}; p.done[day] = !p.done[day]; planSave(p);
            DV.toast(p.done[day] ? 'Day marked complete' : 'Day unmarked');
          } else if (k === 'restart') {
            if (!planArmed) { planArmed = true; DV.toast('Tap Restart Plan again to confirm'); setTimeout(function() { planArmed = false; }, 4000); return; }
            planArmed = false; planSave({}); DV.toast('Plan restarted');
          }
          planRender();
        };
      });
    });

    /* ===== 7. MY HIGHLIGHTS ===== */
    screen('my-highlights', 'My Highlights', 'Your highlighted Bible verses.', function(t) {
      var b = B(), d = data(), h = '';
      if (!d) h = NOT_READY;
      else {
        var map = b.hl(), keys = Object.keys(map).sort(function(x, y) {
          var a = x.split(':'), c = y.split(':');
          return (+a[0] - +c[0]) || (+a[1] - +c[1]);
        });
        keys.forEach(function(k) {
          var kp = k.split(':'), bi = +kp[0], ci = +kp[1];
          Object.keys(map[k]).map(Number).sort(function(x, y) { return x - y; }).forEach(function(n) {
            var col = b.colors[map[k][n]], tx = d[bi] && d[bi].c[ci] && d[bi].c[ci][n - 1];
            if (!col || tx === undefined) return;
            h += '<button class="dv-mo-hl" style="background:' + col.c + ';color:' + col.t + '" data-dvj="' + bi + ':' + ci + ':' + (n - 1) + '"><b>' + esc(b.names[bi] + ' ' + (ci + 1) + ':' + n) + '</b><br>' + esc(tx) + '</button>';
          });
        });
        if (!h) h = '<div class="dv-mo-note">No highlights yet. In the reader, tap a verse, then tap a color to highlight it.</div>';
      }
      DV.openModal(t, h, function() {
        bodyEl().onclick = function(e) {
          var j = e.target.closest('[data-dvj]');
          if (j) { var p = j.getAttribute('data-dvj').split(':'); jump(+p[0], +p[1], +p[2] + 1); }
        };
      });
    });

    /* ===== REGISTER WITH THE SHELL ===== */
    DV.addNavItem({
      key: 'more',
      id: 'dvMoreNavBtn',
      html: svg('<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>', 22) + 'More'
    });
    tvPopup();
  } catch (e) {}
})();
