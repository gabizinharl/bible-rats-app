document.addEventListener('DOMContentLoaded', () => {
  const streakCount = document.getElementById('streak-count');
  const progressCount = document.getElementById('progress-count');
  const achievementsCount = document.getElementById('achievements-count');
  const readProgressTag = document.getElementById('read-progress-tag');
  const readingBookList = document.getElementById('reading-book-list');
  const readingEmpty = document.querySelector('.reading-empty');
  const bibleBookList = document.getElementById('bible-book-list');
  const homeScreen = document.getElementById('home-screen');
  const bibleScreen = document.getElementById('bible-screen');
  const challengesList = document.getElementById('challenges-list');
  const recentProgress = document.getElementById('recent-progress');
  const logoutButton = document.getElementById('logout-button');
  const sharePreview = document.getElementById('share-preview');
  const shareWhatsAppButton = document.getElementById('share-whatsapp-button');

  const expandedBooks = new Set();
  const expandedChapters = new Set();
  const MAX_VERSES_PER_CHAPTER = 25;
  const isDesktopLayout = () => window.innerWidth > 640;

  const getUniqueChapterCount = (progress, bookName) => {
    const uniqueChapters = new Set(
      progress
        .filter((entry) => entry.book === bookName)
        .map((entry) => `${entry.book}:${entry.chapter}`)
    );

    return uniqueChapters.size;
  };

  const renderBookList = (targetElement, books, progress) => {
    if (!targetElement) {
      return;
    }

    const bookCards = books.map((book) => {
      const chaptersRead = getUniqueChapterCount(progress, book.name);
      const isExpanded = expandedBooks.has(book.name);
      const chapters = Array.from({ length: book.chapters }, (_, index) => index + 1);

      const chapterMarkup = chapters.map((chapter) => {
        const isChapterExpanded = expandedChapters.has(`${book.name}:${chapter}`);
        const chapterVerseReads = progress.filter(
          (entry) => entry.book === book.name && entry.chapter === chapter && entry.verse != null
        );
        const chapterReadCount = new Set(chapterVerseReads.map((entry) => entry.verse)).size;

        const verseButtons = Array.from({ length: MAX_VERSES_PER_CHAPTER }, (_, index) => index + 1)
          .map((verse) => {
            const isRead = progress.some(
              (entry) => entry.book === book.name && entry.chapter === chapter && entry.verse === verse
            );

            return `
              <button
                class="verse-chip ${isRead ? 'read' : ''}"
                type="button"
                data-book="${book.name}"
                data-chapter="${chapter}"
                data-verse="${verse}"
              >
                ${verse}
              </button>
            `;
          }).join('');

        return `
          <div class="chapter-item">
            <button
              class="chapter-button ${isChapterExpanded ? 'open' : ''} ${chapterReadCount > 0 ? 'read' : ''}"
              type="button"
              data-book="${book.name}"
              data-chapter="${chapter}"
            >
              <span>Capítulo ${chapter}</span>
              <span class="chapter-badge">${chapterReadCount}/${MAX_VERSES_PER_CHAPTER}</span>
            </button>

            <div class="chapter-detail ${isChapterExpanded ? 'visible' : ''}">
              <div class="verse-grid">${verseButtons}</div>
            </div>
          </div>
        `;
      }).join('');

      const recentChapter = progress
        .filter((entry) => entry.book === book.name)
        .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))[0];

      const summary = isExpanded
        ? `
          <div class="book-summary">
            <span>${chaptersRead}/${book.chapters} capítulos com leitura</span>
            <span>${recentChapter ? `Último capítulo: ${recentChapter.chapter}` : 'Ainda não começou'}</span>
          </div>
        `
        : '<div class="book-summary muted">Clique no livro para ver os capítulos e depois escolha os versículos que você leu.</div>';

      return `
        <article class="book-card ${isExpanded ? 'open' : ''}" style="--book-color: ${book.color};">
          <button class="book-toggle" type="button" data-book="${book.name}" aria-expanded="${isExpanded}">
            <div class="book-title-wrap">
              <h3>${book.name}</h3>
              <span class="book-meta">${book.testament} · ${chaptersRead}/${book.chapters} capítulos</span>
            </div>
            <span class="book-toggle-right">
              <span class="tag">${Math.round((chaptersRead / book.chapters) * 100)}%</span>
              <span class="toggle-indicator">${isExpanded ? '−' : '+'}</span>
            </span>
          </button>

          <div class="book-body ${isExpanded ? 'visible' : ''}">
            ${summary}
            <div class="chapter-grid">${chapterMarkup}</div>
          </div>
        </article>
      `;
    }).join('');

    targetElement.innerHTML = bookCards;
  };

  const buildShareCardMarkup = ({ streak, totalChaptersRead, totalVerseReads, achievements }) => `
    <div class="share-card">
      <div class="share-card-header">
        <span class="share-logo">Bible Rats</span>
        <span class="share-badge">Sequência ${streak} dias</span>
      </div>

      <div class="share-card-body">
        <p>Minha sequência</p>
        <h3>${streak} dias</h3>

        <div class="share-card-stats">
          <div class="share-card-item">
            <small>Capítulos</small>
            <strong>${totalChaptersRead}</strong>
          </div>
          <div class="share-card-item">
            <small>Versículos</small>
            <strong>${totalVerseReads}</strong>
          </div>
          <div class="share-card-item">
            <small>Conquistas</small>
            <strong>${achievements.length}</strong>
          </div>
        </div>
      </div>

      <div class="share-card-footer">
        <span>Leitura</span>
        <span>${totalChaptersRead} capítulos • ${totalVerseReads} versículos</span>
      </div>
    </div>
  `;

  const renderChallenges = (achievements, streak, totalChaptersRead, totalVerseReads) => {
    const appLink = localStorage.getItem('bible_rats_app_url') || window.location.href;

    challengesList.innerHTML = achievements.map((achievement, index) => {
      const isUnlocked =
        index === 0
          ? totalChaptersRead >= 1
          : index === 1
            ? streak >= 7
            : totalChaptersRead >= 20;

      return `
        <div class="challenge-item ${isUnlocked ? 'unlocked' : 'locked'}">
          <div class="challenge-head">
            <h3>${achievement.achievement_name}</h3>
            <span class="badge">${isUnlocked ? 'Conquistado' : 'Em progresso'}</span>
          </div>
          <p>${achievement.description}</p>
        </div>
      `;
    }).join('');

    sharePreview.innerHTML = buildShareCardMarkup({
      streak,
      totalChaptersRead,
      totalVerseReads,
      achievements
    });

    const shareText = `📖 Bible Rats\nMinha sequência: ${streak} dias • ${totalChaptersRead} capítulos • ${totalVerseReads} versículos lidos.\nAbra o app: ${appLink}`;
    const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

    shareWhatsAppButton.href = shareUrl;
    shareWhatsAppButton.setAttribute('target', '_blank');
    shareWhatsAppButton.setAttribute('rel', 'noreferrer');
  };

  const renderRecentProgress = (progress) => {
    const items = progress.slice(0, 6).map((entry) => {
      const suffix = entry.verse != null ? ` · v${entry.verse}` : '';

      return `
        <div class="recent-item">
          <div><strong>${entry.book}</strong> cap. ${entry.chapter}${suffix}</div>
          <small>${new Date(entry.completed_at).toLocaleDateString('pt-BR')}</small>
        </div>
      `;
    }).join('');

    recentProgress.innerHTML = items || '<p>Sem registros ainda.</p>';
  };

  const renderBookListForCurrentLayout = (books, progress) => {
    const desktopLayout = isDesktopLayout();

    if (readingEmpty) {
      readingEmpty.style.display = desktopLayout ? 'none' : 'block';
    }

    if (desktopLayout) {
      renderBookList(readingBookList, books, progress);
      if (bibleBookList) {
        bibleBookList.innerHTML = '';
      }
      return;
    }

    renderBookList(bibleBookList, books, progress);
    if (readingBookList) {
      readingBookList.innerHTML = '';
    }
  };

  const updateDashboard = (data) => {
    const totalBooksChapters = window.database.getBooks().reduce((sum, book) => sum + book.chapters, 0);

    streakCount.textContent = `${data.streak} dias`;
    progressCount.textContent = data.totalChaptersRead;
    achievementsCount.textContent = data.achievements.length;
    readProgressTag.textContent = `${data.totalChaptersRead}/${totalBooksChapters} capítulos`;

    renderBookListForCurrentLayout(data.books, data.progress);
    renderChallenges(data.achievements, data.streak, data.totalChaptersRead, data.totalVerseReads);
    renderRecentProgress(data.progress);
  };

  const setupInteractions = () => {
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');

    const showHomeScreen = (target = 'reading') => {
      homeScreen.classList.remove('hidden');
      bibleScreen.classList.add('hidden');

      if (target === 'reading') {
        requestAnimationFrame(() => {
          homeScreen.scrollIntoView({ behavior: 'smooth', block: 'start' });
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        return;
      }

      scrollToSection(target);
    };

    const showBibleScreen = () => {
      if (isDesktopLayout()) {
        showHomeScreen('reading');
        return;
      }

      homeScreen.classList.add('hidden');
      bibleScreen.classList.remove('hidden');
      renderBookList(bibleBookList, window.database.getBooks(), window.database.getProgress());

      requestAnimationFrame(() => {
        bibleScreen.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    };

    const scrollToSection = (target) => {
      const sectionMap = {
        reading: 'reading-panel',
        achievements: 'achievements-panel',
        recent: 'recent-panel'
      };

      const section = document.getElementById(sectionMap[target] || 'reading-panel');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    const handleBookListClick = (event) => {
      const bookToggle = event.target.closest('.book-toggle');
      if (bookToggle) {
        const { book } = bookToggle.dataset;

        if (expandedBooks.has(book)) {
          expandedBooks.delete(book);
        } else {
          expandedBooks.add(book);
        }

        renderBookListForCurrentLayout(window.database.getBooks(), window.database.getProgress());
        return;
      }

      const chapterButton = event.target.closest('.chapter-button');
      if (chapterButton) {
        const { book, chapter } = chapterButton.dataset;
        const chapterKey = `${book}:${chapter}`;

        if (expandedChapters.has(chapterKey)) {
          expandedChapters.delete(chapterKey);
        } else {
          expandedChapters.add(chapterKey);
        }

        renderBookListForCurrentLayout(window.database.getBooks(), window.database.getProgress());
        return;
      }

      const verseChip = event.target.closest('.verse-chip');
      if (verseChip) {
        const { book, chapter, verse } = verseChip.dataset;
        window.database.updateProgress(book, Number(chapter), Number(verse));

        const data = window.database.buildAppData();
        expandedBooks.add(book);
        expandedChapters.add(`${book}:${chapter}`);
        updateDashboard(data);
      }
    };

    bottomNavItems.forEach((item) => {
      item.addEventListener('click', () => {
        bottomNavItems.forEach((navItem) => navItem.classList.remove('active'));

        if (item.dataset.target === 'bible') {
          item.classList.add('active');
          showBibleScreen();
          return;
        }

        item.classList.add('active');
        showHomeScreen(item.dataset.target);
      });
    });

    document.addEventListener('click', handleBookListClick);

    window.addEventListener('resize', () => {
      const data = window.database.buildAppData();
      updateDashboard(data);
    });

    logoutButton.addEventListener('click', () => {
      window.database.logout();
    });
  };

  const initialize = () => {
    const data = window.database.buildAppData();

    updateDashboard(data);
    setupInteractions();
  };

  initialize();
});
