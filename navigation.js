/* navigation.js - Navigation, Menus, Directories, and Modal Sheets */
const Navigation = (function () {
  let selectedBookIdx = 0;
  let selectedChapterIdx = 0;

  const scrim = document.getElementById('globalScrim');
  const drawer = document.getElementById('sidebarDrawer');
  const directorySheet = document.getElementById('directorySheet');
  const searchSheet = document.getElementById('searchSheet');
  const aboutSheet = document.getElementById('aboutSheet');
  const contactSheet = document.getElementById('contactSheet');

  const directoryTitle = document.getElementById('directoryTitle');
  const directoryGrid = document.getElementById('directoryGrid');
  const tabBooks = document.getElementById('tabBooks');
  const tabChapters = document.getElementById('tabChapters');
  const tabVerses = document.getElementById('tabVerses');

  function closeAll() {
    drawer.classList.remove('open');
    directorySheet.classList.remove('open');
    searchSheet.classList.remove('open');
    aboutSheet.classList.remove('open');
    contactSheet.classList.remove('open');
    scrim.classList.remove('open');
  }

  function openDrawer() {
    closeAll();
    drawer.classList.add('open');
    scrim.classList.add('open');
  }

  function openSheet(sheetElement) {
    closeAll();
    sheetElement.classList.add('open');
    scrim.classList.add('open');
  }

  function setDirectoryTab(activeTab) {
    [tabBooks, tabChapters, tabVerses].forEach(t => t.classList.remove('active'));
    activeTab.classList.add('active');
  }

  // 1. Books View
  function showBooks() {
    openSheet(directorySheet);
    setDirectoryTab(tabBooks);
    directoryTitle.textContent = "Select Book";
    directoryGrid.className = "grid-content list-books";
    directoryGrid.innerHTML = "";

    window.BibleData.books.forEach((book, idx) => {
      const btn = document.createElement('button');
      btn.className = "book-btn";
      btn.textContent = book.name;
      btn.onclick = () => {
        selectedBookIdx = idx;
        showChapters(idx);
      };
      directoryGrid.appendChild(btn);
    });
  }

  // 2. Chapters View
  function showChapters(bookIdx) {
    selectedBookIdx = (bookIdx !== undefined) ? bookIdx : selectedBookIdx;
    openSheet(directorySheet);
    setDirectoryTab(tabChapters);
    const book = window.BibleData.books[selectedBookIdx];
    directoryTitle.textContent = `${book.name} - Chapters`;
    directoryGrid.className = "grid-content grid-numbers";
    directoryGrid.innerHTML = "";

    book.chapters.forEach((ch, idx) => {
      const btn = document.createElement('button');
      btn.className = "num-btn";
      btn.textContent = ch.chapter;
      btn.onclick = () => {
        selectedChapterIdx = idx;
        showVerses(selectedBookIdx, idx);
      };
      directoryGrid.appendChild(btn);
    });
  }

  // 3. Verses View
  function showVerses(bookIdx, chapterIdx) {
    selectedBookIdx = (bookIdx !== undefined) ? bookIdx : selectedBookIdx;
    selectedChapterIdx = (chapterIdx !== undefined) ? chapterIdx : selectedChapterIdx;
    openSheet(directorySheet);
    setDirectoryTab(tabVerses);
    const chapter = window.BibleData.books[selectedBookIdx].chapters[selectedChapterIdx];
    directoryTitle.textContent = `Chapter ${chapter.chapter} - Verses`;
    directoryGrid.className = "grid-content grid-numbers";
    directoryGrid.innerHTML = "";

    chapter.verses.forEach(v => {
      const btn = document.createElement('button');
      btn.className = "num-btn";
      btn.textContent = v.verse;
      btn.onclick = () => {
        closeAll();
        window.App.renderPassage(selectedBookIdx, selectedChapterIdx, v.verse);
      };
      directoryGrid.appendChild(btn);
    });
  }

  // Bind Buttons
  document.getElementById('drawerOpenBtn').onclick = openDrawer;
  document.getElementById('navBooksBtn').onclick = showBooks;
  document.getElementById('navChaptersBtn').onclick = () => showChapters();
  document.getElementById('navVersesBtn').onclick = () => showVerses();
  document.getElementById('navSearchBtn').onclick = () => openSheet(searchSheet);

  document.getElementById('drawerHomeBtn').onclick = closeAll;
  document.getElementById('drawerAboutBtn').onclick = () => openSheet(aboutSheet);
  document.getElementById('drawerContactBtn').onclick = () => openSheet(contactSheet);

  tabBooks.onclick = () => showBooks();
  tabChapters.onclick = () => showChapters(selectedBookIdx);
  tabVerses.onclick = () => showVerses(selectedBookIdx, selectedChapterIdx);

  scrim.onclick = closeAll;
  document.querySelectorAll('.close-btn').forEach(btn => btn.onclick = closeAll);

  return {
    showBooks,
    showChapters,
    showVerses,
    closeAll,
    setIndices: (b, c) => { selectedBookIdx = b; selectedChapterIdx = c; }
  };
})();