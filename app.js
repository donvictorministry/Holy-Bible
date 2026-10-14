/* app.js - Main Application Controller */
window.BibleData = null;

window.App = (function () {
  let currentBookIdx = 0;
  let currentChapterIdx = 0;

  // LocalStorage keys
  const HIGHLIGHTS_KEY = "bible_highlights_store";
  const THEME_KEY = "bible_app_theme";

  let highlights = JSON.parse(localStorage.getItem(HIGHLIGHTS_KEY) || "{}");

  const readerView = document.getElementById('reader-view');
  const passageTitle = document.getElementById('currentPassageTitle');
  const modalScrim = document.getElementById('modalScrim');
  const searchSheet = document.getElementById('searchSheet');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResultsContainer');

  // Initialize
  function init() {
    initTheme();
    registerServiceWorker();
    loadBibleDatabase();
    bindEvents();
  }

  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  }

  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode'); // Light mode default
    }
  }

  function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  }

  function loadBibleDatabase() {
    fetch('kjv.json')
      .then(r => {
        if (!r.ok) throw new Error("Could not load kjv.json");
        return r.json();
      })
      .then(data => {
        window.BibleData = data;
        // Default: Open Genesis Chapter 1
        renderPassage(0, 0);
      })
      .catch(err => {
        readerView.innerHTML = `<p style="color:red; text-align:center;">Failed to open kjv.json. Ensure kjv.json is located in the same directory.</p>`;
      });
  }

  // Render passage: Bible text strictly 21px (satisfying >= 20px requirement)
  function renderPassage(bIdx, cIdx, targetVerse = null) {
    currentBookIdx = bIdx;
    currentChapterIdx = cIdx;

    const book = window.BibleData.books[bIdx];
    const chapter = book.chapters[cIdx];

    passageTitle.textContent = `${book.name} ${chapter.chapter}`;

    let html = `<h2 class="chapter-title-header">${book.name} ${chapter.chapter}</h2>`;

    chapter.verses.forEach(v => {
      const verseKey = `${book.name}_${chapter.chapter}_${v.verse}`;
      const isHighlighted = highlights[verseKey] ? 'highlighted' : '';

      html += `
        <div class="verse-item ${isHighlighted}" id="v-${v.verse}" onclick="window.App.toggleHighlight('${verseKey}', this)">
          <span class="verse-num">${v.verse}</span>${v.text}
        </div>
      `;
    });

    readerView.innerHTML = html;

    // Smooth scroll to target verse if requested
    if (targetVerse) {
      setTimeout(() => {
        const el = document.getElementById(`v-${targetVerse}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
    } else {
      readerView.scrollTop = 0;
    }
  }

  // Yellow tap-to-highlight logic
  function toggleHighlight(verseKey, element) {
    if (highlights[verseKey]) {
      delete highlights[verseKey];
      element.classList.remove('highlighted');
    } else {
      highlights[verseKey] = true;
      element.classList.add('highlighted');
    }
    localStorage.setItem(HIGHLIGHTS_KEY, JSON.stringify(highlights));
  }

  // Offline Full Search
  function performSearch(term) {
    if (!term || term.trim().length < 3) {
      searchResults.innerHTML = `<p style="text-align:center; color:gray;">Please enter at least 3 letters.</p>`;
      return;
    }

    const cleanTerm = term.toLowerCase().trim();
    let matches = [];

    for (let b = 0; b < window.BibleData.books.length; b++) {
      const book = window.BibleData.books[b];
      for (let c = 0; c < book.chapters.length; c++) {
        const ch = book.chapters[c];
        for (let v = 0; v < ch.verses.length; v++) {
          const verse = ch.verses[v];
          if (verse.text.toLowerCase().includes(cleanTerm)) {
            matches.push({ bIdx: b, cIdx: c, bookName: book.name, chapter: ch.chapter, verse: verse.verse, text: verse.text });
            if (matches.length >= 60) break; // Limit search to 60 instant results for speed
          }
        }
        if (matches.length >= 60) break;
      }
      if (matches.length >= 60) break;
    }

    if (matches.length === 0) {
      searchResults.innerHTML = `<p style="text-align:center;">No results found for "${term}".</p>`;
      return;
    }

    let out = "";
    matches.forEach(m => {
      out += `
        <div class="search-result-item" onclick="window.App.navigateToVerse(${m.bIdx}, ${m.cIdx}, ${m.verse})">
          <span class="search-ref-badge">${m.bookName} ${m.chapter}:${m.verse}</span>
          <span>${m.text}</span>
        </div>`;
    });
    searchResults.innerHTML = out;
  }

  function navigateToVerse(bIdx, cIdx, vNum) {
    closeSheets();
    renderPassage(bIdx, cIdx, vNum);
  }

  function closeSheets() {
    searchSheet.classList.remove('open');
    Navigation.closeDirectory();
    modalScrim.classList.remove('open');
  }

  function bindEvents() {
    document.getElementById('themeToggleBtn').onclick = toggleTheme;
    document.getElementById('navDirectoryBtn').onclick = Navigation.openDirectory;
    document.getElementById('closeDirectoryBtn').onclick = Navigation.closeDirectory;

    document.getElementById('navSearchBtn').onclick = () => {
      searchSheet.classList.add('open');
      modalScrim.classList.add('open');
      searchInput.focus();
    };

    document.getElementById('closeSearchBtn').onclick = closeSheets;
    modalScrim.onclick = closeSheets;

    document.getElementById('navReadBtn').onclick = () => {
      closeSheets();
    };

    searchInput.addEventListener('input', (e) => {
      performSearch(e.target.value);
    });
  }

  init();

  return {
    renderPassage,
    toggleHighlight,
    navigateToVerse
  };
})();
