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
    var st2 = document.createElement('style');
    st2.textContent = '.dv-mo-sub{margin-left:auto;font-size:1rem;font-weight:600;color:var(--dv-text-sub)}' +
      '.dv-mo-plain{font-style:normal;font-weight:700}' +
      '.dv-mo-badge{display:block;width:70%;max-width:320px;margin:10px auto;border-radius:12px;box-shadow:var(--dv-shadow)}' +
      '.dv-mo-two{display:flex;gap:10px}.dv-mo-two .dv-mo-btn{flex:1}' +
      '.dv-mo-btn[disabled]{opacity:0.4}' +
      '.dv-mo-conf-a{font-size:1.15rem;font-weight:700;color:var(--dv-text);margin-bottom:10px}' +
      '.dv-mo-books .dv-mo-row{padding:14px 8px}';
    document.head.appendChild(st2);

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
      ['daily-study-guide', 'Daily Study Guide', '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="9 15 11 17 15 13"/>'],
      ['suggested-reading', 'Suggested Reading', '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>'],
      ['know-your-bible', 'Know Your Bible', '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>'],
      ['bible-concordance', 'Bible Concordance', '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>'],
      ['reading-plan', 'Reading Plan', '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><polyline points="9 10 11 12 15 8"/>'],
      ['my-highlights', 'My Highlights', '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>'],
      ['notepad', 'Notepad', '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>']
    ];
    screen('more', 'More', 'Search, Bible Quiz, Today\'s Verse, Know Your Bible, Bible Concordance, Reading Plan and My Highlights.', function(t) {
      DV.openModal(t, features.filter(function(f) { return f[0] !== 'notepad' || DV.hasRoute('notepad'); }).map(function(f) { return '<button class="dv-mo-row" data-dvmo="' + f[0] + '">' + svg(f[2], 26) + f[1] + '</button>'; }).join(''), function() {
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

    /* ===== 2. BIBLE QUIZ (6 series of 5 questions, all kinds of questions, badges, confetti) ===== */
    var qz = null, qzSess = { done: 0, score: 0, name: '' };
    function qzBest() { try { return JSON.parse(localStorage.getItem('dvQuizBest') || '{}') || {}; } catch (e) { return {}; } }
    function qzSaveBest(s, sc) { var b = qzBest(); if (!(b[s] >= sc)) { b[s] = sc; try { localStorage.setItem('dvQuizBest', JSON.stringify(b)); } catch (e) {} } }
    function shuffle(a) { return a.sort(function() { return Math.random() - 0.5; }); }
    function rndBooks(n, not) { var r = []; while (r.length < n) { var x = Math.floor(Math.random() * 66); if (x !== not && r.indexOf(x) < 0) r.push(x); } return r; }
    var facts = [
      ['Who built the ark?', 'Noah', ['Moses', 'Abraham', 'Jonah'], 'Genesis 6:14'],
      ['Who was swallowed by a great fish?', 'Jonah', ['Elijah', 'Peter', 'Daniel'], 'Jonah 1:17'],
      ['Who was thrown into the lions\' den?', 'Daniel', ['Joseph', 'David', 'Jeremiah'], 'Daniel 6:16'],
      ['Who led Israel into the Promised Land after Moses?', 'Joshua', ['Caleb', 'Aaron', 'Samuel'], 'Joshua 1:2'],
      ['Which king wrote many of the Psalms?', 'David', ['Solomon', 'Saul', 'Hezekiah'], 'Psalms 23:1'],
      ['Which king asked God for wisdom?', 'Solomon', ['David', 'Saul', 'Hezekiah'], '1 Kings 3:12'],
      ['Who was sold by his brothers into Egypt?', 'Joseph', ['Benjamin', 'Reuben', 'Jacob'], 'Genesis 37:28'],
      ['Which disciple denied Jesus three times?', 'Peter', ['John', 'Thomas', 'Andrew'], 'Matthew 26:75'],
      ['Who baptized Jesus in the Jordan?', 'John the Baptist', ['Peter', 'Paul', 'Philip'], 'Matthew 3:13'],
      ['In which garden did Adam and Eve live?', 'Eden', ['Gethsemane', 'Carmel', 'Zion'], 'Genesis 2:8'],
      ['On which mountain did Moses receive the Ten Commandments?', 'Sinai', ['Carmel', 'Zion', 'Ararat'], 'Exodus 19:20'],
      ['In which town was Jesus born?', 'Bethlehem', ['Nazareth', 'Jerusalem', 'Capernaum'], 'Matthew 2:1'],
      ['Who was the first martyr of the early church?', 'Stephen', ['James', 'Peter', 'Barnabas'], 'Acts 7:59'],
      ['Who was chosen to replace Judas Iscariot?', 'Matthias', ['Barnabas', 'Silas', 'Timothy'], 'Acts 1:26'],
      ['Which disciple was a tax collector?', 'Matthew', ['Peter', 'Thomas', 'Philip'], 'Matthew 9:9'],
      ['Who traveled with Paul on his first missionary journey?', 'Barnabas', ['Timothy', 'Titus', 'Apollos'], 'Acts 13:2'],
      ['How many disciples did Jesus choose?', 'Twelve', ['Seven', 'Ten', 'Seventy'], 'Matthew 10:1'],
      ['In how many days did God make the heavens and the earth?', 'Six', ['Three', 'Seven', 'Ten'], 'Exodus 20:11'],
      ['What is the shortest verse in the King James Bible?', 'Jesus wept.', ['Rejoice evermore.', 'Pray without ceasing.', 'Remember Lot\'s wife.'], 'John 11:35'],
      ['Who wrote the Book of Acts?', 'Luke', ['Paul', 'John', 'Peter'], 'Acts 1:1'],
      ['Who is traditionally credited with writing Revelation?', 'John', ['Paul', 'Peter', 'Luke'], 'Revelation 1:1'],
      ['What is the first book of the Bible?', 'Genesis', ['Exodus', 'Psalms', 'Matthew'], 'Genesis 1:1'],
      ['What is the last book of the Bible?', 'Revelation', ['Jude', 'Malachi', 'Acts'], 'Revelation 22:21'],
      ['Who was the mother of Jesus?', 'Mary', ['Martha', 'Elizabeth', 'Ruth'], 'Matthew 1:18'],
      ['Who preached in the wilderness before Jesus began his ministry?', 'John the Baptist', ['Elijah', 'Isaiah', 'Paul'], 'Matthew 3:1'],
      ['Who interpreted Pharaoh\'s dreams in Egypt?', 'Joseph', ['Moses', 'Daniel', 'Aaron'], 'Genesis 41:25'],
      ['Which woman became queen and saved her people from Haman\'s plot?', 'Esther', ['Ruth', 'Deborah', 'Hannah'], 'Esther 4:14'],
      ['Which giant did David defeat with a sling and a stone?', 'Goliath', ['Og', 'Sisera', 'Nimrod'], '1 Samuel 17:50'],
      ['Who was Ruth\'s mother-in-law?', 'Naomi', ['Orpah', 'Rachel', 'Leah'], 'Ruth 1:16'],
      ['Which prophet was taken up to heaven in a whirlwind?', 'Elijah', ['Elisha', 'Isaiah', 'Jeremiah'], '2 Kings 2:11'],
      ['What was Paul\'s name before his conversion?', 'Saul', ['Silas', 'Simon', 'Samuel'], 'Acts 13:9'],
      ['What did Jesus turn water into at Cana?', 'Wine', ['Oil', 'Milk', 'Honey'], 'John 2:9']
    ];
    function pickVerse() {
      var d = data();
      for (var n = 0; n < 300; n++) {
        var bi = Math.floor(Math.random() * 66), ci = Math.floor(Math.random() * d[bi].c.length), vs = d[bi].c[ci], vi = Math.floor(Math.random() * vs.length), tx = vs[vi], w = tx.split(' ');
        if (w.length >= 9 && tx.length <= 240) return { bi: bi, ci: ci, vi: vi, tx: tx, w: w };
      }
      return null;
    }
    function genQuestion() {
      var b = B(), t = Math.random(), i, o, v;
      if (t < 0.22) {
        v = pickVerse();
        if (v) {
          o = [v.bi].concat(rndBooks(3, v.bi)); shuffle(o);
          return { q: '\u201C' + v.w.slice(0, Math.ceil(v.w.length * 0.6)).join(' ') + ' ...\u201D', verse: true, ask: 'Which book of the Bible is this verse from?', opts: o.map(function(x) { return b.names[x]; }), ans: o.indexOf(v.bi), ref: [v.bi, v.ci, v.vi] };
        }
      } else if (t < 0.47) {
        v = pickVerse();
        if (v) {
          var cut = Math.ceil(v.w.length * 0.6), end = v.w.slice(cut).join(' '), ends = [end], g = 0;
          while (ends.length < 4 && g++ < 80) {
            var o2 = pickVerse();
            if (!o2) break;
            var e2 = o2.w.slice(Math.ceil(o2.w.length * 0.6)).join(' ');
            if (ends.indexOf(e2) < 0) ends.push(e2);
          }
          if (ends.length === 4) {
            var sh = shuffle(ends.slice());
            return { q: '\u201C' + v.w.slice(0, cut).join(' ') + ' ...\u201D', verse: true, ask: 'Choose the correct ending of this verse.', opts: sh, ans: sh.indexOf(end), ref: [v.bi, v.ci, v.vi] };
          }
        }
      } else if (t < 0.77) {
        var f = facts[Math.floor(Math.random() * facts.length)], fo = shuffle([f[1]].concat(f[2])), pr = parseRef(f[3]);
        if (pr) return { q: f[0], verse: false, ask: '', opts: fo, ans: fo.indexOf(f[1]), ref: [pr.bi, pr.ci, pr.vi] };
      } else if (t < 0.87) {
        i = Math.floor(Math.random() * 65);
        o = [i + 1].concat(rndBooks(3, i)); o = o.filter(function(x, k) { return o.indexOf(x) === k; });
        while (o.length < 4) { var r4 = Math.floor(Math.random() * 66); if (r4 !== i && o.indexOf(r4) < 0) o.push(r4); }
        shuffle(o);
        return { q: 'Which book comes right after ' + b.names[i] + '?', verse: false, ask: '', opts: o.map(function(x) { return b.names[x]; }), ans: o.indexOf(i + 1), ref: [i + 1, 0, 0] };
      } else if (t < 0.95) {
        i = Math.floor(Math.random() * 66);
        var N = b.counts[i], nums = [N];
        while (nums.length < 4) { var x2 = N + Math.floor(Math.random() * 9) - 4; if (x2 > 0 && nums.indexOf(x2) < 0) nums.push(x2); }
        shuffle(nums);
        return { q: 'How many chapters are in the book of ' + b.names[i] + '?', verse: false, ask: '', opts: nums.map(String), ans: nums.indexOf(N), ref: [i, 0, 0] };
      }
      i = Math.floor(Math.random() * 66);
      return { q: 'In which part of the Bible is the book of ' + b.names[i] + '?', verse: false, ask: '', opts: ['Old Testament', 'New Testament'], ans: i < 39 ? 0 : 1, ref: [i, 0, 0] };
    }

    /* ----- confetti + badges ----- */
    function confetti() {
      var cols = ['#FFD700', '#1877F2', '#16A34A', '#DC2626', '#7C3AED', '#EA580C', '#0D9488'];
      for (var i = 0; i < 90; i++) {
        var p = document.createElement('div'), dur = 2.2 + Math.random() * 2.2, sz = 8 + Math.random() * 10;
        p.className = 'dv-confetti';
        p.style.cssText = 'left:' + (Math.random() * 100) + 'vw;background:' + cols[i % cols.length] + ';width:' + sz + 'px;height:' + (sz * (0.6 + Math.random() * 0.8)) + 'px;border-radius:' + (Math.random() > 0.5 ? '50%' : '2px') + ';animation-duration:' + dur + 's;animation-delay:' + (Math.random() * 0.9) + 's;';
        document.body.appendChild(p);
        (function(el, ms) { setTimeout(function() { if (el.parentNode) el.parentNode.removeChild(el); }, ms); })(p, (dur + 1.2) * 1000);
      }
    }
    function drawBadge(kind, o, cb) {
      var W = 900, H = 1000, c = document.createElement('canvas');
      c.width = W; c.height = H;
      var x = c.getContext('2d');
      var pal = kind === 'perfect' ? ['#FFF0A0', '#FFD700', '#B8860B', '#5c3a00'] : (kind === 'personal' ? ['#CDB8FF', '#7C3AED', '#4C1D95', '#ffffff'] : ['#C4E0FF', '#1877F2', '#0D5DBD', '#ffffff']);
      x.fillStyle = '#fffdf2'; x.fillRect(0, 0, W, H);
      x.strokeStyle = pal[2]; x.lineWidth = 8; x.strokeRect(24, 24, W - 48, H - 48);
      x.fillStyle = pal[2];
      x.beginPath(); x.moveTo(330, 600); x.lineTo(270, 820); x.lineTo(345, 790); x.lineTo(385, 850); x.lineTo(450, 640); x.closePath(); x.fill();
      x.beginPath(); x.moveTo(570, 600); x.lineTo(630, 820); x.lineTo(555, 790); x.lineTo(515, 850); x.lineTo(450, 640); x.closePath(); x.fill();
      var g = x.createRadialGradient(450, 380, 40, 450, 380, 290);
      g.addColorStop(0, pal[0]); g.addColorStop(1, pal[1]);
      x.fillStyle = g; x.beginPath(); x.arc(450, 380, 290, 0, Math.PI * 2); x.fill();
      x.strokeStyle = pal[2]; x.lineWidth = 16; x.stroke();
      x.lineWidth = 4; x.beginPath(); x.arc(450, 380, 250, 0, Math.PI * 2); x.stroke();
      x.fillStyle = pal[3]; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.font = 'bold 44px Roboto, sans-serif'; x.fillText('BIBLE QUIZ', 450, 220);
      x.font = 'bold 150px Roboto, sans-serif'; x.fillText(o.score, 450, 385);
      x.font = 'bold 44px Roboto, sans-serif'; x.fillText(kind === 'perfect' ? 'PERFECT SCORE' : (kind === 'personal' ? 'CHAMPION' : 'REWARD'), 450, 520);
      x.fillStyle = '#2a1a00';
      var name = o.name || '';
      if (kind === 'personal' && name) {
        var sz = 64;
        for (; sz >= 30; sz -= 2) { x.font = 'bold ' + sz + 'px Roboto, sans-serif'; if (x.measureText(name).width <= 740) break; }
        x.fillText(name, 450, 905);
        x.font = '34px Roboto, sans-serif'; x.fillText('Bible Quiz \u2014 ' + o.sub, 450, 950);
      } else {
        x.font = 'bold 54px Roboto, sans-serif'; x.fillText(o.title, 450, 905);
        x.font = '34px Roboto, sans-serif'; x.fillText(o.sub, 450, 950);
      }
      x.font = '28px Roboto, sans-serif'; x.fillStyle = pal[2]; x.fillText('Holy Bible KJV  |  ' + window.location.host, 450, 985);
      c.toBlob(cb, 'image/png');
    }
    function saveBlob(blob, name) {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = name;
      document.body.appendChild(a); a.click(); a.remove();
      DV.toast('Badge saved to your device');
    }
    function shareBlob(blob, name, text) {
      var file = null;
      try { file = new File([blob], name, { type: 'image/png' }); } catch (e) {}
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) navigator.share({ files: [file], text: text }).catch(function() {});
      else DV.toast('Sharing is not supported on this device');
    }

    /* ----- screens ----- */
    document.body.insertAdjacentHTML('beforeend', '<div class="dv-mo-conf" id="dvMoConf"><div class="dv-mo-conf-card"><div class="dv-mo-conf-h" id="dvMoConfH"></div><div class="dv-mo-conf-a" id="dvMoConfA"></div><div class="dv-mo-conf-v" id="dvMoConfV"></div><div class="dv-mo-conf-r" id="dvMoConfR"></div><div class="dv-mo-conf-t" id="dvMoConfT"></div></div></div>');
    function qzHub() {
      var box = bodyEl(), best = qzBest(), h = '';
      h += '<div class="dv-mo-prog"><span>Series played this visit</span><span>' + Math.min(qzSess.done, 3) + ' of 3</span></div>';
      h += '<div class="dv-mo-note">Six series, five questions each. Play 3 series in one visit to unlock your personalized badge.</div>';
      for (var s = 1; s <= 6; s++) h += '<button class="dv-mo-row" data-dvs="' + s + '">Series ' + s + '<span class="dv-mo-sub">' + (best[s] !== undefined ? 'Best ' + best[s] + ' of 5' : 'Not played') + '</span></button>';
      if (qzSess.done >= 3) {
        h += '<div class="dv-mo-count">Your personalized badge is unlocked</div><div class="dv-mo-sw"><input id="dvMoName" type="text" maxlength="40" placeholder="Your name" value="' + esc(qzSess.name) + '"></div>' +
          '<button class="dv-mo-btn" data-dvq="personal">Download Personalized Badge</button>';
      }
      box.innerHTML = h;
    }
    function qzShow() {
      var box = bodyEl(), b = B();
      if (!box) return;
      if (qz.i >= qz.total) { qzFinish(); return; }
      qz.cur = genQuestion(); qz.locked = false;
      var q = qz.cur;
      box.innerHTML = '<div class="dv-mo-prog"><span>Series ' + qz.series + ' \u2022 Question ' + (qz.i + 1) + ' of ' + qz.total + '</span><span>Score ' + qz.score + '</span></div>' +
        '<div class="' + (q.verse ? 'dv-mo-q' : 'dv-mo-q dv-mo-plain') + '">' + esc(q.q) + '</div>' +
        (q.ask ? '<div class="dv-mo-count" style="margin:0 0 10px">' + esc(q.ask) + '</div>' : '') +
        q.opts.map(function(o, k) { return '<button class="dv-mo-opt" data-dvo="' + k + '">' + esc(o) + '</button>'; }).join('');
    }
    function qzAnswer(btn) {
      if (qz.locked) return;
      qz.locked = true;
      var b = B(), d = data(), q = qz.cur, pick = +btn.getAttribute('data-dvo'), ok = pick === q.ans;
      if (ok) qz.score++;
      document.querySelectorAll('.dv-mo-opt').forEach(function(o) {
        var n = +o.getAttribute('data-dvo');
        if (n === q.ans) o.classList.add('dv-ok'); else if (n === pick) o.classList.add('dv-bad');
      });
      Q('#dvMoConfH').textContent = ok ? 'Correct!' : 'Not quite';
      Q('#dvMoConfH').style.color = ok ? '#16A34A' : '#DC2626';
      Q('#dvMoConfA').textContent = ok ? '' : 'Answer: ' + q.opts[q.ans];
      Q('#dvMoConfV').textContent = '\u201C' + d[q.ref[0]].c[q.ref[1]][q.ref[2]] + '\u201D';
      Q('#dvMoConfR').textContent = b.names[q.ref[0]] + ' ' + (q.ref[1] + 1) + ':' + (q.ref[2] + 1);
      var left = 5;
      Q('#dvMoConfT').textContent = 'Next in ' + left + '...';
      Q('#dvMoConf').classList.add('dv-on');
      clearInterval(timers.i);
      timers.i = setInterval(function() { left--; if (left > 0) Q('#dvMoConfT').textContent = 'Next in ' + left + '...'; }, 1000);
      clearTimeout(timers.t);
      timers.t = setTimeout(function() {
        clearInterval(timers.i);
        Q('#dvMoConf').classList.remove('dv-on');
        qz.i++;
        qzShow();
      }, 5000);
    }
    function qzFinish() {
      var box = bodyEl(), sc = qz.score, kind = sc === 5 ? 'perfect' : (sc >= 3 ? 'reward' : null);
      qzSaveBest(qz.series, sc);
      qzSess.done++; qzSess.score += sc;
      var h = '<div class="dv-mo-prog"><span>Series ' + qz.series + ' complete</span></div><div class="dv-mo-score">' + sc + ' of 5</div>';
      if (kind) {
        confetti();
        h += '<div class="dv-mo-note" style="text-align:center">' + (kind === 'perfect' ? 'Perfect score! Your gold badge is ready.' : 'Well done! Your rewards badge is ready.') + '</div><img id="dvMoBadge" class="dv-mo-badge" alt="Badge">' +
          '<button class="dv-mo-btn" data-dvq="dl">Download Badge</button><button class="dv-mo-btn dv-mo-sec" data-dvq="sh">Share Badge</button>';
        drawBadge(kind, { score: sc + '/5', title: kind === 'perfect' ? 'Gold Badge' : 'Rewards Badge', sub: 'Series ' + qz.series }, function(blob) {
          qz.blob = blob;
          var im = Q('#dvMoBadge');
          if (im && blob) im.src = URL.createObjectURL(blob);
        });
      } else h += '<div class="dv-mo-note" style="text-align:center">Score 3 or more to earn a badge. Try again!</div>';
      h += '<button class="dv-mo-btn dv-mo-sec" data-dvq="again">Play This Series Again</button><button class="dv-mo-btn dv-mo-sec" data-dvq="hub">All Series</button>';
      box.innerHTML = h;
    }
    screen('bible-quiz', 'Bible Quiz', 'Test your knowledge of the Bible. Six series of five questions, with badges to earn.', function(t) {
      DV.openModal(t, ready() ? '' : NOT_READY, function() {
        if (!ready()) return;
        qz = null;
        qzHub();
        bodyEl().onclick = function(e) {
          var o = e.target.closest('[data-dvo]'), s = e.target.closest('[data-dvs]'), a = e.target.closest('[data-dvq]');
          if (o && qz) { qzAnswer(o); return; }
          if (s) { qz = { series: +s.getAttribute('data-dvs'), i: 0, total: 5, score: 0, locked: false, cur: null }; qzShow(); return; }
          if (!a) return;
          var k = a.getAttribute('data-dvq');
          if (k === 'hub') { qz = null; qzHub(); }
          else if (k === 'again' && qz) { qz = { series: qz.series, i: 0, total: 5, score: 0, locked: false, cur: null }; qzShow(); }
          else if (k === 'dl' && qz && qz.blob) saveBlob(qz.blob, 'bible-quiz-badge.png');
          else if (k === 'sh' && qz && qz.blob) shareBlob(qz.blob, 'bible-quiz-badge.png', 'I earned a badge on the Holy Bible KJV quiz! ' + DV.url(''));
          else if (k === 'personal') {
            var nm = (Q('#dvMoName').value || '').trim();
            if (!nm) { DV.toast('Enter your name'); return; }
            qzSess.name = nm;
            drawBadge('personal', { score: qzSess.score + '/' + (qzSess.done * 5), name: nm, sub: qzSess.done + ' series' }, function(blob) { if (blob) saveBlob(blob, 'bible-quiz-personal-badge.png'); });
          }
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
    Q('#dvTvPop').addEventListener('click', function() { var r = Q('#dvTvPop').getAttribute('data-r') || 'todays-verse'; tvHide(); DV.navigate(r); });
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
          Q('#dvTvPop').setAttribute('data-r', 'todays-verse');
          Q('#dvTvPop').classList.add('dv-on');
          tvTimer = setTimeout(tvHide, 9000);
        } else if (n > 120) clearInterval(iv);
      }, 1000);
    }
    // Promo popups that lead to other features (one per visit, after a minute of use)
    var promos = [
      ['Bible Quiz', 'Test your Bible knowledge. Play a quick series and earn a badge.', 'bible-quiz'],
      ['Daily Study Guide', 'Today\'s study guide is ready for you.', 'daily-study-guide'],
      ['Suggested Reading', 'What to read for healing, love, prayer, forgiveness and more.', 'suggested-reading'],
      ['Reading Plan', 'Complete a whole book in 7 or 30 days.', 'reading-plan'],
      ['Know Your Bible', 'Learn about the books, authors and the King James Bible.', 'know-your-bible']
    ];
    function promoPopup() {
      var tries = 0;
      function attempt() {
        tries++;
        var modalOpen = Q('#dvInfoModal') && Q('#dvInfoModal').classList.contains('dv-active'), popOpen = Q('#dvTvPop').classList.contains('dv-on');
        if ((modalOpen || popOpen) && tries < 4) { setTimeout(attempt, 20000); return; }
        if (modalOpen || popOpen) return;
        var idx = 0;
        try { idx = +localStorage.getItem('dvPromoIdx') || 0; localStorage.setItem('dvPromoIdx', (idx + 1) % promos.length); } catch (e) {}
        var p = promos[idx % promos.length];
        Q('#dvTvPop').innerHTML = '<b>' + esc(p[0]) + '</b><span>' + esc(p[1]) + '</span>';
        Q('#dvTvPop').setAttribute('data-r', p[2]);
        Q('#dvTvPop').classList.add('dv-on');
        clearTimeout(tvTimer);
        tvTimer = setTimeout(tvHide, 8000);
      }
      setTimeout(attempt, 75000);
    }

    screen('todays-verse', 'Today\'s Verse', 'A verse from the King James Bible for today.', function(t) {
      var v = tvVerse();
      DV.openModal(t, v ? '<div class="dv-mo-tv">\u201C' + esc(v.text) + '\u201D</div><div class="dv-mo-tvr">' + esc(v.ref) + ' (KJV)</div>' +
        '<button class="dv-mo-btn" data-dvt="read">Read the Chapter</button><button class="dv-mo-btn dv-mo-sec" data-dvt="share">Share via Android</button><button class="dv-mo-btn dv-mo-sec" data-dvt="wa">Share to WhatsApp</button><button class="dv-mo-btn dv-mo-sec" data-dvt="fb">Share to Facebook</button><button class="dv-mo-btn dv-mo-sec" data-dvt="bt">Share via Bluetooth</button>' : NOT_READY, function() {
        if (!v) return;
        bodyEl().onclick = function(e) {
          var a = e.target.closest('[data-dvt]');
          if (!a) return;
          var k = a.getAttribute('data-dvt'), txt = '\u201C' + v.text + '\u201D \u2014 ' + v.ref + ' (KJV)', url = DV.url('todays-verse');
          if (k === 'read') jump(v.bi, v.ci, v.vi + 1);
          else if (k === 'share') shareText(txt, url);
          else if (k === 'wa') window.open('https://wa.me/?text=' + encodeURIComponent(txt + '\n\n' + url), '_blank');
          else if (k === 'fb') window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url) + '&quote=' + encodeURIComponent(txt), '_blank');
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

    /* ===== 6. READING PLAN (whole Bible in 365 days, or one book in 30 or 7 days) ===== */
    function planLoad() { try { return JSON.parse(localStorage.getItem('dvPlan2') || '{}') || {}; } catch (e) { return {}; } }
    function planSave(p) { try { localStorage.setItem('dvPlan2', JSON.stringify(p)); } catch (e) {} }
    function midnight() { var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); }
    var planArmed = false, planStage = 'menu', planPickDays = 30, planView = 0;
    function planSegments(p, day) {
      var b = B(), d = data(), out = [], i;
      if (p.type === 'bible') {
        var all = [];
        b.counts.forEach(function(c, bi) { for (var ci = 0; ci < c; ci++) all.push([bi, ci]); });
        var s = Math.floor((day - 1) * all.length / p.days), e = Math.floor(day * all.length / p.days);
        all.slice(s, e).forEach(function(x) { out.push({ bi: x[0], ci: x[1], from: 0, to: d[x[0]].c[x[1]].length - 1, full: true }); });
        return out;
      }
      var flat = [];
      d[p.book].c.forEach(function(ch, ci) { for (var vi = 0; vi < ch.length; vi++) flat.push([ci, vi]); });
      var s2 = Math.floor((day - 1) * flat.length / p.days), e2 = Math.floor(day * flat.length / p.days);
      for (i = s2; i < e2; i++) {
        var last = out[out.length - 1];
        if (last && last.ci === flat[i][0]) last.to = flat[i][1];
        else out.push({ bi: p.book, ci: flat[i][0], from: flat[i][1], to: flat[i][1] });
      }
      out.forEach(function(sg) { sg.full = sg.from === 0 && sg.to === d[sg.bi].c[sg.ci].length - 1; });
      return out;
    }
    function planRender() {
      var box = bodyEl(), b = B(), p = planLoad(), h = '', i;
      if (!box) return;
      if (!p.start) {
        if (planStage === 'pick') {
          h = '<div class="dv-mo-prog"><span>Choose a book (' + planPickDays + ' days)</span></div><div class="dv-mo-books">';
          for (i = 0; i < 66; i++) h += '<button class="dv-mo-row" data-dvbk="' + i + '">' + esc(b.names[i]) + '</button>';
          box.innerHTML = h + '</div><button class="dv-mo-btn dv-mo-sec" data-dvp="menu">Back</button>';
          return;
        }
        box.innerHTML = '<div class="dv-mo-note">Choose a reading plan.</div>' +
          '<button class="dv-mo-row" data-dvp="whole">Whole Bible in 365 days</button>' +
          '<button class="dv-mo-row" data-dvp="b30">Complete a single book in 30 days</button>' +
          '<button class="dv-mo-row" data-dvp="b7">Complete a single book in 7 days</button>';
        return;
      }
      var day = Math.min(p.days, Math.floor((midnight() - p.start) / 86400000) + 1), done = p.done || {}, total = 0;
      Object.keys(done).forEach(function(k) { if (done[k]) total++; });
      if (!planView) planView = day;
      planView = Math.max(1, Math.min(p.days, planView));
      var title = p.type === 'bible' ? 'Whole Bible in 365 days' : b.names[p.book] + ' in ' + p.days + ' days';
      h += '<div class="dv-mo-prog"><span>' + esc(title) + '</span></div>';
      h += '<div class="dv-mo-prog"><span>Day ' + planView + ' of ' + p.days + (planView === day ? ' (today)' : '') + '</span><span>' + total + ' completed</span></div><div class="dv-mo-count" style="margin-top:6px">Reading</div>';
      var segs = planSegments(p, planView);
      if (!segs.length) h += '<div class="dv-mo-note">No new reading today. Review what you have read.</div>';
      segs.forEach(function(sg) {
        var label = b.names[sg.bi] + ' ' + (sg.ci + 1) + (sg.full ? '' : ':' + (sg.from + 1) + (sg.to > sg.from ? '-' + (sg.to + 1) : ''));
        h += '<button class="dv-mo-row" data-dvrp="' + sg.bi + ':' + sg.ci + ':' + sg.from + '">' + esc(label) + '</button>';
      });
      h += '<button class="dv-mo-btn" data-dvp="done">' + (done[planView] ? 'Completed. Tap to undo' : 'Mark Day Complete') + '</button>';
      h += '<div class="dv-mo-two"><button class="dv-mo-btn dv-mo-sec" data-dvp="prev">Previous Day</button><button class="dv-mo-btn dv-mo-sec" data-dvp="next">Next Day</button></div>';
      h += '<button class="dv-mo-btn dv-mo-sec" data-dvp="restart">Change Plan</button>';
      box.innerHTML = h;
    }
    screen('reading-plan', 'Reading Plan', 'Read the whole Bible in 365 days, or complete a single book in 30 or 7 days.', function(t) {
      DV.openModal(t, ready() ? '' : NOT_READY, function() {
        if (!ready()) return;
        planArmed = false; planStage = 'menu'; planView = 0;
        planRender();
        bodyEl().onclick = function(e) {
          var r = e.target.closest('[data-dvrp]'), a = e.target.closest('[data-dvp]'), bk = e.target.closest('[data-dvbk]');
          if (r) { var q = r.getAttribute('data-dvrp').split(':'); jump(+q[0], +q[1], +q[2] + 1); return; }
          if (bk) { planSave({ type: 'book', book: +bk.getAttribute('data-dvbk'), days: planPickDays, start: midnight(), done: {} }); planView = 0; planRender(); return; }
          if (!a) return;
          var k = a.getAttribute('data-dvp'), p = planLoad();
          if (k === 'whole') { planSave({ type: 'bible', days: 365, start: midnight(), done: {} }); planView = 0; }
          else if (k === 'b30' || k === 'b7') { planPickDays = k === 'b30' ? 30 : 7; planStage = 'pick'; }
          else if (k === 'menu') planStage = 'menu';
          else if (k === 'prev') planView--;
          else if (k === 'next') planView++;
          else if (k === 'done') {
            p.done = p.done || {}; p.done[planView] = !p.done[planView]; planSave(p);
            DV.toast(p.done[planView] ? 'Day marked complete' : 'Day unmarked');
          } else if (k === 'restart') {
            if (!planArmed) { planArmed = true; DV.toast('Tap Change Plan again to confirm'); setTimeout(function() { planArmed = false; }, 4000); return; }
            planArmed = false; planSave({}); planStage = 'menu'; planView = 0; DV.toast('Choose a new plan');
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

    /* ===== DAILY STUDY GUIDE (90 days, ready in advance) ===== */
    var sgOff = 0;
    function sgBuild() {
      var box = bodyEl(), b = B();
      if (!box) return;
      var dt = new Date(); dt.setDate(dt.getDate() + sgOff);
      var dayNum = Math.floor(new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()).getTime() / 86400000);
      var tp = topics[dayNum % topics.length], n = tp[2].length, st = Math.floor(dayNum / topics.length) % n, h = '';
      h += '<div class="dv-mo-prog"><span>' + esc(dt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })) + '</span></div>';
      h += '<div class="dv-mo-prog"><span>Day ' + (sgOff + 1) + ' of 90</span><span>Theme: ' + esc(tp[1]) + '</span></div><div class="dv-mo-count" style="margin-top:6px">Read</div>';
      for (var k = 0; k < 3; k++) {
        var v = parseRef(tp[2][(st + k) % n]);
        if (v) h += '<button class="dv-mo-item" data-dvj="' + v.bi + ':' + v.ci + ':' + v.vi + '"><span class="dv-mo-ref">' + esc(v.ref) + '</span>' + esc(v.text) + '</button>';
      }
      h += '<div class="dv-mo-count">Reflect</div><div class="dv-mo-know"><ul><li>What does this reading teach you about ' + esc(tp[1].toLowerCase()) + '?</li><li>What one step will you take today because of it?</li></ul></div>';
      h += '<div class="dv-mo-count">Pray</div><div class="dv-mo-know"><p>Thank God for His Word, and ask Him to help you live what you have read today.</p></div>';
      h += '<div class="dv-mo-two"><button class="dv-mo-btn dv-mo-sec" data-dvg="prev"' + (sgOff <= 0 ? ' disabled' : '') + '>Previous Day</button><button class="dv-mo-btn dv-mo-sec" data-dvg="next"' + (sgOff >= 89 ? ' disabled' : '') + '>Next Day</button></div>';
      if (sgOff !== 0) h += '<button class="dv-mo-btn" data-dvg="today">Back to Today</button>';
      box.innerHTML = h;
    }
    screen('daily-study-guide', 'Daily Study Guide', 'A daily Bible study guide, ready for the next 90 days.', function(t) {
      DV.openModal(t, ready() ? '' : NOT_READY, function() {
        if (!ready()) return;
        sgOff = 0; sgBuild();
        bodyEl().onclick = function(e) {
          var j = e.target.closest('[data-dvj]'), g = e.target.closest('[data-dvg]');
          if (j) { var p = j.getAttribute('data-dvj').split(':'); jump(+p[0], +p[1], +p[2] + 1); return; }
          if (!g) return;
          var k = g.getAttribute('data-dvg');
          if (k === 'prev' && sgOff > 0) sgOff--; else if (k === 'next' && sgOff < 89) sgOff++; else if (k === 'today') sgOff = 0;
          sgBuild();
          bodyEl().scrollTop = 0;
        };
      });
    });

    /* ===== SUGGESTED READING (100 topical guides) ===== */
    var sug = [
      ['spiritual growth', ['2 Peter 3:18', 'Ephesians 4:15', 'Colossians 2:6-7', '1 Peter 2:2']],
      ['healing', ['Psalms 103:2-3', 'Isaiah 53:5', 'James 5:14-15', 'Jeremiah 30:17']],
      ['evangelism', ['Matthew 28:19-20', 'Romans 10:14-15', 'Mark 16:15', '2 Timothy 4:2']],
      ['forgiveness', ['Matthew 6:14-15', 'Colossians 3:13', 'Ephesians 4:32', '1 John 1:9']],
      ['love', ['1 Corinthians 13:4-7', 'John 13:34-35', '1 John 4:7-8', 'Romans 12:9-10']],
      ['spiritual gifts', ['1 Corinthians 12:4-11', 'Romans 12:6-8', 'Ephesians 4:11-12', '1 Peter 4:10']],
      ['praying for loved ones', ['1 Timothy 2:1', 'Philippians 1:3-4', 'James 5:16', 'Ephesians 6:18']],
      ['supporting the gospel', ['Philippians 4:15-17', '2 Corinthians 9:6-7', 'Galatians 6:6', '3 John 1:8']],
      ['passing an exam', ['Proverbs 2:6', 'James 1:5', 'Daniel 1:17', 'Proverbs 3:5-6']],
      ['a life partner', ['Genesis 2:18', 'Proverbs 18:22', 'Proverbs 31:10-12', '2 Corinthians 6:14']],
      ['the fruit of the womb', ['Psalms 127:3', '1 Samuel 1:27', 'Genesis 25:21', 'Luke 1:37', 'Psalms 113:9']],
      ['living a sanctified life', ['1 Thessalonians 4:3-4', 'Hebrews 12:14', '1 Peter 1:15-16', 'Romans 12:1-2']],
      ['financial breakthrough', ['Philippians 4:19', 'Deuteronomy 8:18', 'Malachi 3:10', 'Proverbs 10:22']],
      ['your job and career', ['Colossians 3:23-24', 'Proverbs 22:29', 'Psalms 90:17', 'Deuteronomy 28:12']],
      ['protection', ['Psalms 91:1-4', 'Psalms 121:7-8', 'Isaiah 54:17', '2 Thessalonians 3:3']],
      ['fear', ['Isaiah 41:10', '2 Timothy 1:7', 'Psalms 27:1', 'Joshua 1:9']],
      ['anxiety', ['Philippians 4:6-7', '1 Peter 5:7', 'Matthew 6:25-27', 'Psalms 94:19']],
      ['discouragement', ['Psalms 42:11', 'Psalms 34:18', 'Isaiah 61:3', '2 Corinthians 4:8-9']],
      ['loneliness', ['Deuteronomy 31:6', 'Hebrews 13:5', 'Psalms 68:6', 'Matthew 28:20']],
      ['grief and loss', ['Matthew 5:4', 'Psalms 23:4', 'John 11:25-26', 'Revelation 21:4']],
      ['patience', ['James 5:7-8', 'Romans 12:12', 'Psalms 37:7', 'Galatians 6:9']],
      ['humility', ['James 4:10', 'Philippians 2:3-4', '1 Peter 5:5-6', 'Micah 6:8']],
      ['faith', ['Hebrews 11:1', 'Hebrews 11:6', 'Romans 10:17', 'Mark 11:22-24']],
      ['hope', ['Romans 15:13', 'Jeremiah 29:11', 'Lamentations 3:21-23', 'Hebrews 6:19']],
      ['peace', ['John 14:27', 'Isaiah 26:3', 'Philippians 4:7', 'Colossians 3:15']],
      ['joy', ['Nehemiah 8:10', 'Psalms 16:11', 'John 15:11', 'Philippians 4:4']],
      ['strength', ['Isaiah 40:31', 'Philippians 4:13', 'Psalms 46:1', 'Ephesians 6:10']],
      ['wisdom', ['James 1:5', 'Proverbs 4:7', 'Proverbs 9:10', 'Colossians 2:3']],
      ['guidance', ['Proverbs 3:5-6', 'Psalms 32:8', 'Isaiah 30:21', 'Psalms 119:105']],
      ['gratitude', ['1 Thessalonians 5:18', 'Psalms 100:4', 'Colossians 3:15-17', 'Psalms 107:1']],
      ['worship', ['John 4:23-24', 'Psalms 95:1-6', 'Psalms 100:1-5', 'Revelation 4:11']],
      ['fasting', ['Matthew 6:16-18', 'Isaiah 58:6', 'Joel 2:12', 'Acts 13:2-3']],
      ['repentance', ['Acts 3:19', 'Luke 15:7', '2 Chronicles 7:14', 'Psalms 51:10']],
      ['salvation', ['John 3:16-17', 'Romans 10:9-10', 'Ephesians 2:8-9', 'Acts 4:12']],
      ['the Holy Spirit', ['John 14:16-17', 'Acts 1:8', 'Galatians 5:22-23', 'Romans 8:26']],
      ['baptism', ['Matthew 3:16-17', 'Acts 2:38', 'Romans 6:3-4', 'Mark 16:16']],
      ['the Word of God', ['2 Timothy 3:16-17', 'Hebrews 4:12', 'Psalms 119:11', 'Joshua 1:8']],
      ['meditating on Scripture', ['Psalms 1:1-3', 'Psalms 119:97', 'Joshua 1:8', 'Philippians 4:8']],
      ['courage', ['Joshua 1:9', 'Deuteronomy 31:6', 'Psalms 27:14', '1 Corinthians 16:13']],
      ['perseverance', ['Hebrews 12:1-2', 'Galatians 6:9', 'James 1:12', '2 Timothy 4:7']],
      ['temptation', ['1 Corinthians 10:13', 'James 1:13-15', 'Matthew 26:41', 'Hebrews 4:15-16']],
      ['anger', ['Ephesians 4:26-27', 'James 1:19-20', 'Proverbs 15:1', 'Proverbs 29:11']],
      ['pride', ['Proverbs 16:18', 'Proverbs 11:2', 'James 4:6', '1 John 2:16']],
      ['envy and jealousy', ['Proverbs 14:30', 'James 3:16', 'Galatians 5:26', 'Psalms 37:1']],
      ['the tongue', ['James 3:5-6', 'Proverbs 18:21', 'Ephesians 4:29', 'Psalms 141:3']],
      ['honesty', ['Proverbs 12:22', 'Ephesians 4:25', 'Colossians 3:9', 'Proverbs 11:3']],
      ['generosity', ['Luke 6:38', '2 Corinthians 9:6-8', 'Proverbs 11:25', 'Acts 20:35']],
      ['tithing', ['Malachi 3:10', 'Proverbs 3:9-10', 'Leviticus 27:30', 'Luke 11:42']],
      ['marriage', ['Genesis 2:24', 'Ephesians 5:25-33', 'Proverbs 5:18', 'Ecclesiastes 4:9-12']],
      ['raising children', ['Proverbs 22:6', 'Ephesians 6:4', 'Deuteronomy 6:6-7', 'Psalms 127:3-5']],
      ['honoring parents', ['Exodus 20:12', 'Ephesians 6:1-3', 'Proverbs 1:8', 'Colossians 3:20']],
      ['friendship', ['Proverbs 17:17', 'Proverbs 27:17', 'Ecclesiastes 4:9-10', 'John 15:13']],
      ['unity in the church', ['Psalms 133:1', 'Ephesians 4:3-6', '1 Corinthians 1:10', 'John 17:21']],
      ['church leadership', ['1 Timothy 3:1-7', 'Titus 1:5-9', '1 Peter 5:2-3', 'Acts 20:28']],
      ['serving others', ['Mark 10:45', 'Galatians 5:13', 'Philippians 2:3-4', '1 Peter 4:10']],
      ['your calling', ['Jeremiah 1:5', 'Isaiah 6:8', 'Romans 8:28-30', 'Ephesians 2:10']],
      ['purpose', ['Proverbs 19:21', 'Jeremiah 29:11', 'Romans 8:28', 'Ephesians 2:10']],
      ['prayer', ['Matthew 6:9-13', 'Philippians 4:6', '1 Thessalonians 5:17', 'Luke 18:1']],
      ['persistent prayer', ['Luke 18:1-8', 'Luke 11:5-10', 'Matthew 7:7-8', 'Jeremiah 33:3']],
      ['answered prayer', ['1 John 5:14-15', 'John 15:7', 'Mark 11:24', 'James 5:16-18']],
      ['deliverance', ['Psalms 34:17', 'Psalms 91:14-16', 'Isaiah 61:1', 'Colossians 1:13']],
      ['spiritual warfare', ['Ephesians 6:10-18', '2 Corinthians 10:4-5', 'James 4:7', '1 Peter 5:8-9']],
      ['victory', ['1 John 5:4', '1 Corinthians 15:57', 'Romans 8:37', '2 Corinthians 2:14']],
      ['a breakthrough', ['Isaiah 43:19', 'Psalms 18:29', 'Micah 2:13', 'Isaiah 45:2']],
      ['favor', ['Psalms 5:12', 'Proverbs 3:3-4', 'Genesis 39:21', 'Luke 2:52']],
      ['restoration', ['Joel 2:25', 'Psalms 23:3', 'Jeremiah 30:17', '1 Peter 5:10']],
      ['a new beginning', ['2 Corinthians 5:17', 'Isaiah 43:18-19', 'Lamentations 3:22-23', 'Philippians 3:13-14']],
      ['your identity in Christ', ['2 Corinthians 5:17', 'Galatians 2:20', 'Ephesians 1:4-5', '1 Peter 2:9']],
      ['God\'s love', ['Romans 8:38-39', '1 John 4:16', 'Jeremiah 31:3', 'Psalms 136:1']],
      ['God\'s faithfulness', ['Lamentations 3:22-23', 'Deuteronomy 7:9', '2 Timothy 2:13', 'Psalms 36:5']],
      ['God\'s promises', ['2 Corinthians 1:20', 'Numbers 23:19', 'Hebrews 10:23', '2 Peter 1:4']],
      ['trusting God', ['Proverbs 3:5-6', 'Psalms 56:3-4', 'Isaiah 26:4', 'Jeremiah 17:7']],
      ['waiting on God', ['Psalms 27:14', 'Isaiah 40:31', 'Lamentations 3:25-26', 'Psalms 37:7']],
      ['contentment', ['Philippians 4:11-13', '1 Timothy 6:6-8', 'Hebrews 13:5', 'Psalms 23:1']],
      ['integrity', ['Proverbs 10:9', 'Psalms 25:21', 'Proverbs 11:3', 'Titus 2:7']],
      ['stewardship', ['Luke 16:10-11', '1 Corinthians 4:2', 'Matthew 25:21', '1 Peter 4:10']],
      ['hard work', ['Proverbs 10:4', 'Colossians 3:23', 'Proverbs 12:24', 'Ecclesiastes 9:10']],
      ['rest', ['Matthew 11:28-30', 'Exodus 20:8-10', 'Psalms 127:2', 'Mark 6:31']],
      ['a sick family member', ['Psalms 41:3', 'James 5:14-15', 'Psalms 107:20', '3 John 1:2']],
      ['the elderly', ['Psalms 71:18', 'Isaiah 46:4', 'Proverbs 16:31', 'Leviticus 19:32']],
      ['young people', ['Ecclesiastes 12:1', '1 Timothy 4:12', 'Psalms 119:9', 'Proverbs 22:6']],
      ['widows and orphans', ['James 1:27', 'Psalms 68:5', 'Deuteronomy 10:18', 'Isaiah 1:17']],
      ['the poor and needy', ['Proverbs 19:17', 'Psalms 41:1', 'Matthew 25:35-40', 'Proverbs 14:31']],
      ['justice', ['Micah 6:8', 'Isaiah 1:17', 'Amos 5:24', 'Proverbs 31:8-9']],
      ['praying for leaders', ['1 Timothy 2:1-2', 'Romans 13:1', 'Proverbs 21:1', 'Jeremiah 29:7']],
      ['your nation', ['2 Chronicles 7:14', 'Psalms 33:12', 'Proverbs 14:34', 'Jeremiah 29:7']],
      ['revival', ['2 Chronicles 7:14', 'Habakkuk 3:2', 'Psalms 85:6', 'Isaiah 57:15']],
      ['the return of Christ', ['1 Thessalonians 4:16-17', 'Matthew 24:42-44', 'Acts 1:11', 'Titus 2:13']],
      ['heaven', ['John 14:1-3', 'Revelation 21:1-4', '2 Corinthians 5:1', 'Philippians 3:20']],
      ['the resurrection', ['John 11:25-26', '1 Corinthians 15:20-22', 'Romans 6:4-5', '1 Thessalonians 4:14']],
      ['Christmas', ['Isaiah 9:6', 'Luke 2:8-14', 'Matthew 1:21-23', 'John 1:14']],
      ['Easter', ['Matthew 28:5-6', '1 Corinthians 15:3-4', 'Luke 24:1-7', 'Romans 4:25']],
      ['the New Year', ['Lamentations 3:22-23', 'Isaiah 43:18-19', 'Psalms 65:11', 'Jeremiah 29:11']],
      ['thanksgiving', ['Psalms 136:1', '1 Chronicles 16:34', 'Psalms 107:1', 'Colossians 3:17']],
      ['starting a business', ['Proverbs 16:3', 'Deuteronomy 8:18', 'Proverbs 21:5', 'Psalms 90:17']],
      ['a journey', ['Psalms 121:7-8', 'Exodus 23:20', 'Proverbs 3:6', 'Psalms 91:11']],
      ['a new home', ['Joshua 24:15', 'Psalms 127:1', 'Proverbs 24:3-4', 'Proverbs 14:1']],
      ['a court case', ['Isaiah 54:17', 'Proverbs 21:1', 'Psalms 37:6', 'Isaiah 41:11']],
      ['safe delivery of a child', ['Psalms 139:13-14', 'Isaiah 66:9', 'Psalms 127:3', 'Hebrews 11:11']],
      ['the salvation of your family', ['Acts 16:31', 'Joshua 24:15', 'Psalms 103:17', 'Isaiah 49:25']]
    ];
    function parseRange(r) {
      var b = B(), d = data(), m = /^(.+) (\d+):(\d+)(?:-(\d+))?$/.exec(r);
      if (!b || !d || !m) return null;
      var bi = b.names.indexOf(m[1]), ci = +m[2] - 1, a = +m[3], z = m[4] ? +m[4] : a;
      if (bi < 0 || !d[bi] || !d[bi].c[ci]) return null;
      var items = [];
      for (var n = a; n <= z && n <= a + 11; n++) { var tx = d[bi].c[ci][n - 1]; if (tx !== undefined) items.push({ n: n, t: tx }); }
      return items.length ? { bi: bi, ci: ci, vi: a - 1, ref: r, items: items } : null;
    }
    screen('suggested-reading', 'Suggested Reading', 'Find what to read for healing, love, prayer, forgiveness, evangelism and more.', function(t) {
      var h = '<div class="dv-mo-sw"><input id="dvMoSug" type="search" placeholder="Find a topic" autocomplete="off"></div><div id="dvMoSugList" style="margin-top:10px"></div>';
      DV.openModal(t, h, function() {
        function list(q) {
          q = (q || '').toLowerCase().trim();
          var out = '';
          sug.forEach(function(s, i) { if (!q || s[0].toLowerCase().indexOf(q) !== -1) out += '<button class="dv-mo-row" data-dvsg="' + i + '">For ' + esc(s[0]) + ', read</button>'; });
          Q('#dvMoSugList').innerHTML = out || '<div class="dv-mo-note">No topics found.</div>';
        }
        list('');
        Q('#dvMoSug').addEventListener('input', function() { list(this.value); });
        bodyEl().onclick = function(e) { var r = e.target.closest('[data-dvsg]'); if (r) DV.navigate('suggested-' + r.getAttribute('data-dvsg')); };
      });
    });
    DV.addRouteMatcher(function(slug) {
      var m = /^suggested-(\d+)$/.exec(slug);
      if (!m || !sug[+m[1]]) return null;
      var s = sug[+m[1]], ttl = 'For ' + s[0] + ', read';
      return {
        title: ttl, description: 'Bible passages to read ' + ttl.replace('For ', 'for ').replace(', read', '') + '.', navKey: 'more',
        open: function() {
          var h = '';
          if (!ready()) h = NOT_READY;
          else s[1].forEach(function(r) {
            var p = parseRange(r);
            if (p) h += '<button class="dv-mo-item" data-dvj="' + p.bi + ':' + p.ci + ':' + p.vi + '"><span class="dv-mo-ref">' + esc(r) + '</span>' + p.items.map(function(x) { return '<b>' + x.n + '</b> ' + esc(x.t); }).join(' ') + '</button>';
          });
          DV.openModal(ttl, h, function() {
            bodyEl().onclick = function(e) { var j = e.target.closest('[data-dvj]'); if (j) { var q = j.getAttribute('data-dvj').split(':'); jump(+q[0], +q[1], +q[2] + 1); } };
          });
        },
        close: function() { var b = bodyEl(); if (b) b.onclick = null; DV.closeModal(); }
      };
    });

    /* ===== REGISTER WITH THE SHELL ===== */
    DV.addNavItem({
      key: 'more',
      id: 'dvMoreNavBtn',
      html: svg('<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>', 22) + 'More'
    });
    tvPopup();
    promoPopup();
  } catch (e) {}
})();
