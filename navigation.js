/* navigation.js - Handles Books, Chapters, and Verses Directories */
const Navigation = (function () {
  let selectedBookIndex = 0;
  let selectedChapterIndex = 0;

  const directorySheet = document.getElementById('directorySheet');
  const modalScrim = document.getElementById('modalScrim');
  const directoryGrid = document.getElementById('directoryGrid');
  const directoryTitle = document.getElementById('directoryTitle');

  const tabBooks = document.getElementById('tabBooks');
  const tabChapters = document.getElementById('tabChapters');
  const tabVerses = document.getElementById('tabVerses');

  function openDirectory() {
    directorySheet.classList.add('open');
    modalScrim.classList.add('open');
    showBooks();
  }

  function closeDirectory() {
    directorySheet.classList.remove('open');
    modalScrim.classList.remove('open');
  }

  function setActiveTab(activeBtn) {
    [tabBooks, tabChapters, tabVerses].forEach(tab => tab.classList.remove('active'));
    activeBtn.classList.add('active');
  }

  // 1. Books Directory
  function showBooks() {
    setActiveTab(tabBooks);
    directoryTitle.textContent = "Select Book";
    directoryGrid.className = "grid-content list-books";
    directoryGrid.innerHTML = "";

    window.BibleData.books.forEach((book, index) => {
      const btn = document.createElement('button');
      btn.className = "book-row-btn";
      btn.textContent = book.name;
      btn.onclick = () => {
        selectedBookIndex = index;
        showChapters(index);
      };
      directoryGrid.appendChild(btn);
    });
  }

  // 2. Chapters Directory
  function showChapters(bookIndex) {
    selectedBookIndex = bookIndex;
    setActiveTab(tabChapters);
    const book = window.BibleData.books[selectedBookIndex];
    directoryTitle.textContent = `${book.name} - Chapters`;
    directoryGrid.className = "grid-content grid-numbers";
    directoryGrid.innerHTML = "";

    book.chapters.forEach((ch, idx) => {
      const btn = document.createElement('button');
      btn.className = "num-tile-btn";
      btn.textContent = ch.chapter;
      btn.onclick = () => {
        selectedChapterIndex = idx;
        showVerses(selectedBookIndex, idx);
      };
      directoryGrid.appendChild(btn);
    });
  }

  // 3. Verses Directory
  function showVerses(bookIndex, chapterIndex) {
    selectedBookIndex = bookIndex;
    selectedChapterIndex = chapterIndex;
    setActiveTab(tabVerses);
    const chapter = window.BibleData.books[selectedBookIndex].chapters[selectedChapterIndex];
    directoryTitle.textContent = `Chapter ${chapter.chapter} - Verses`;
    directoryGrid.className = "grid-content grid-numbers";
    directoryGrid.innerHTML = "";

    chapter.verses.forEach((v) => {
      const btn = document.createElement('button');
      btn.className = "num-tile-btn";
      btn.textContent = v.verse;
      btn.onclick = () => {
        closeDirectory();
        window.App.renderPassage(selectedBookIndex, selectedChapterIndex, v.verse);
      };
      directoryGrid.appendChild(btn);
    });
  }

  // Tab click bindings
  tabBooks.onclick = () => showBooks();
  tabChapters.onclick = () => showChapters(selectedBookIndex);
  tabVerses.onclick = () => showVerses(selectedBookIndex, selectedChapterIndex);

  return {
    openDirectory,
    closeDirectory,
    showBooks,
    showChapters,
    showVerses,
    getSelectedBook: () => selectedBookIndex,
    getSelectedChapter: () => selectedChapterIndex
  };
})();
