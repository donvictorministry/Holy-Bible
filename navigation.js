/* app.js - Core Scripture Engine */
window.BibleData = null;

window.App = (function () {
  let curBook = 0;
  let curChapter = 0;
  const HIGHLIGHTS_KEY = "bible_highlights_store";
  const THEME_KEY = "bible_app_theme";
  let highlights = JSON.parse(localStorage.getItem(HIGHLIGHTS_KEY) || "{}");

  const readerView = document.getElementById('reader-view');
  const passageTitle = document.getElementById('currentPassageTitle');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResultsContainer');

  function init() {
    initTheme();
    loadBible();
    bindEvents();
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  }

  function initTheme() {
    if (localStorage.getItem(THEME_KEY) === 'dark') {
      document.body.classList.add('dark-mode');
    }
  }

  function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  }

  function loadBible() {
    fetch('kjv.json')
      .then(res => {
        if (!res.ok) throw new Error("kjv.json not reachable");
        return res.json();
      })
      .then(data => {
        window.BibleData = data;
        renderPassage(0, 0); // Genesis 1
      })
      .catch(err => {
        readerView.innerHTML = `<p style="color:red; text-align:center;">Failed to load kjv.json. Ensure the file is in the root directory.</p>`;
      });
  }

  function renderPassage(bookIdx, chIdx, targetVerse = null) {
    curBook = bookIdx;
    curChapter = chIdx;
    Navigation.setIndices(bookIdx, chIdx);

    const book = window.BibleData.books[bookIdx];
    const chapter = book.chapters[chIdx];

    passageTitle.textContent = `${book.name} ${chapter.chapter}`;

    let html = `<h2 class="chapter-title-header">${book.name} ${chapter.chapter}</h2>`;
    chapter.verses.forEach(v => {
      const key = `${book.name}_${chapter.chapter}_${v.verse}`;
      const isHigh = highlights[key] ? 'highlighted' : '';
      html += `
        <div class="verse-item ${isHigh}" id="v-${v.verse}" onclick="window.App.toggleHighlight('${key}', this)">
          <span class="verse-num">${v.verse}</span>${v.text}
        </div>
      `;
    });

    readerView.innerHTML = html;

    if (targetVerse) {
      setTimeout(() => {
        const el = document.getElementById(`v-${targetVerse}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
    } else {
      readerView.scrollTop = 0;
    }
  }

  function toggleHighlight(key, el) {
    if (highlights[key]) {
      delete highlights[key];
      el.classList.remove('highlighted');
    } else {
      highlights[key] = true;
      el.classList.add('highlighted');
    }
    localStorage.setItem(HIGHLIGHTS_KEY, JSON.stringify(highlights));
  }

  function search(term) {
    if (!term || term.trim().length < 3) {
      searchResults.innerHTML = `<p class="status-center">Enter at least 3 letters to search.</p>`;
      return;
    }

    const q = term.toLowerCase().trim();
    let hits = [];

    for (let b = 0; b < window.BibleData.books.length; b++) {
      const book = window.BibleData.books[b];
      for (let c = 0; c < book.chapters.length; c++) {
        const ch = book.chapters[c];
        for (let v = 0; v < ch.verses.length; v++) {
          const verse = ch.verses[v];
          if (verse.text.toLowerCase().includes(q)) {
            hits.push({ b, c, name: book.name, chNum: ch.chapter, vNum: verse.verse, text: verse.text });
            if (hits.length >= 60) break;
          }
        }
        if (hits.length >= 60) break;
      }
      if (hits.length >= 60) break;
    }

    if (hits.length === 0) {
      searchResults.innerHTML = `<p class="status-center">No matches found for "${term}".</p>`;
      return;
    }

    let out = "";
    hits.forEach(h => {
      out += `
        <div class="search-item" onclick="window.App.jumpTo(${h.b}, ${h.c}, ${h.vNum})">
          <span class="search-badge">${h.name} ${h.chNum}:${h.vNum}</span>
          <div>${h.text}</div>
        </div>`;
    });
    searchResults.innerHTML = out;
  }

  function jumpTo(b, c, v) {
    Navigation.closeAll();
    renderPassage(b, c, v);
  }

  function bindEvents() {
    document.getElementById('themeToggleBtn').onclick = toggleTheme;
    searchInput.addEventListener('input', e => search(e.target.value));
  }

  init();

  return { renderPassage, toggleHighlight, jumpTo };
})();