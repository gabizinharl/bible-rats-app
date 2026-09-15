const STORAGE_KEYS = {
  session: 'christian_gym_session',
  progress: 'christian_gym_progress',
  demo: 'christian_gym_demo'
};

const BOOK_COLORS = [
  '#f87171', '#fb7185', '#f97316', '#facc15', '#84cc16', '#22c55e', '#2dd4bf', '#38bdf8', '#60a5fa', '#a78bfa', '#c084fc', '#f472b6'
];

const defaultBookData = [
  { name: 'Gênesis', chapters: 50, testament: 'AT' },
  { name: 'Êxodo', chapters: 40, testament: 'AT' },
  { name: 'Levítico', chapters: 27, testament: 'AT' },
  { name: 'Números', chapters: 36, testament: 'AT' },
  { name: 'Deuteronômio', chapters: 34, testament: 'AT' },
  { name: 'Josué', chapters: 24, testament: 'AT' },
  { name: 'Juízes', chapters: 21, testament: 'AT' },
  { name: 'Rute', chapters: 4, testament: 'AT' },
  { name: '1 Samuel', chapters: 31, testament: 'AT' },
  { name: '2 Samuel', chapters: 24, testament: 'AT' },
  { name: '1 Reis', chapters: 22, testament: 'AT' },
  { name: '2 Reis', chapters: 25, testament: 'AT' },
  { name: '1 Crônicas', chapters: 29, testament: 'AT' },
  { name: '2 Crônicas', chapters: 36, testament: 'AT' },
  { name: 'Esdras', chapters: 10, testament: 'AT' },
  { name: 'Neemias', chapters: 13, testament: 'AT' },
  { name: 'Ester', chapters: 10, testament: 'AT' },
  { name: 'Jó', chapters: 42, testament: 'AT' },
  { name: 'Salmos', chapters: 150, testament: 'AT' },
  { name: 'Provérbios', chapters: 31, testament: 'AT' },
  { name: 'Eclesiastes', chapters: 12, testament: 'AT' },
  { name: 'Cânticos', chapters: 8, testament: 'AT' },
  { name: 'Isaías', chapters: 66, testament: 'AT' },
  { name: 'Jeremias', chapters: 52, testament: 'AT' },
  { name: 'Lamentações', chapters: 5, testament: 'AT' },
  { name: 'Ezequiel', chapters: 48, testament: 'AT' },
  { name: 'Daniel', chapters: 12, testament: 'AT' },
  { name: 'Oséias', chapters: 14, testament: 'AT' },
  { name: 'Joel', chapters: 3, testament: 'AT' },
  { name: 'Amós', chapters: 9, testament: 'AT' },
  { name: 'Obadias', chapters: 1, testament: 'AT' },
  { name: 'Jonas', chapters: 4, testament: 'AT' },
  { name: 'Miquéias', chapters: 7, testament: 'AT' },
  { name: 'Naum', chapters: 3, testament: 'AT' },
  { name: 'Habacuque', chapters: 3, testament: 'AT' },
  { name: 'Sofonias', chapters: 3, testament: 'AT' },
  { name: 'Ageu', chapters: 2, testament: 'AT' },
  { name: 'Zacarias', chapters: 14, testament: 'AT' },
  { name: 'Malaquias', chapters: 4, testament: 'AT' },
  { name: 'Mateus', chapters: 28, testament: 'NT' },
  { name: 'Marcos', chapters: 16, testament: 'NT' },
  { name: 'Lucas', chapters: 24, testament: 'NT' },
  { name: 'João', chapters: 21, testament: 'NT' },
  { name: 'Atos', chapters: 28, testament: 'NT' },
  { name: 'Romanos', chapters: 16, testament: 'NT' },
  { name: '1 Coríntios', chapters: 16, testament: 'NT' },
  { name: '2 Coríntios', chapters: 13, testament: 'NT' },
  { name: 'Gálatas', chapters: 6, testament: 'NT' },
  { name: 'Efésios', chapters: 6, testament: 'NT' },
  { name: 'Filipenses', chapters: 4, testament: 'NT' },
  { name: 'Colossenses', chapters: 4, testament: 'NT' },
  { name: '1 Tessalonicenses', chapters: 5, testament: 'NT' },
  { name: '2 Tessalonicenses', chapters: 3, testament: 'NT' },
  { name: '1 Timóteo', chapters: 6, testament: 'NT' },
  { name: '2 Timóteo', chapters: 4, testament: 'NT' },
  { name: 'Tito', chapters: 3, testament: 'NT' },
  { name: 'Filemom', chapters: 1, testament: 'NT' },
  { name: 'Hebreus', chapters: 13, testament: 'NT' },
  { name: 'Tiago', chapters: 5, testament: 'NT' },
  { name: '1 Pedro', chapters: 5, testament: 'NT' },
  { name: '2 Pedro', chapters: 3, testament: 'NT' },
  { name: '1 João', chapters: 5, testament: 'NT' },
  { name: '2 João', chapters: 1, testament: 'NT' },
  { name: '3 João', chapters: 1, testament: 'NT' },
  { name: 'Judas', chapters: 1, testament: 'NT' },
  { name: 'Apocalipse', chapters: 22, testament: 'NT' }
];

defaultBookData.forEach((book, index) => {
  book.color = BOOK_COLORS[index % BOOK_COLORS.length];
});

const seedProgress = buildSeedProgress();

function buildSeedProgress() {
  const progress = [];
  const seen = new Set();

  for (let i = 0; i < 20; i += 1) {
    const randomBook = defaultBookData[Math.floor(Math.random() * defaultBookData.length)];
    const chapter = Math.floor(Math.random() * randomBook.chapters) + 1;
    const key = `${randomBook.name}:${chapter}`;

    if (seen.has(key)) {
      i -= 1;
      continue;
    }

    seen.add(key);

    progress.push({
      id: `seed-${Date.now()}-${i}`,
      book: randomBook.name,
      chapter,
      completed_at: new Date(Date.now() - Math.random() * 18 * 86400000).toISOString()
    });
  }

  return progress.sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at));
}

function getStoredItem(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Erro ao recuperar ${key}:`, error);
    return null;
  }
}

function setStoredItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getSupabaseConfig() {
  const url = localStorage.getItem('supabase_url');
  const key = localStorage.getItem('supabase_anon_key');

  return {
    url,
    key
  };
}

function getSupabaseClient() {
  const config = getSupabaseConfig();

  if (!config.url || !config.key) {
    return null;
  }

  return window.supabase.createClient(config.url, config.key);
}

function ensureDemoSession() {
  const existing = getStoredItem(STORAGE_KEYS.session);

  if (!existing || !existing.user) {
    const demoSession = {
      user: {
        id: 'demo-user',
        email: 'demo@christiangym.app',
        full_name: 'Usuário Demo',
        username: 'demo_user'
      }
    };

    localStorage.setItem('christian_gym_demo', 'true');
    setStoredItem(STORAGE_KEYS.session, demoSession);
    setStoredItem(STORAGE_KEYS.progress, seedProgress);
  }
}

function getSession() {
  ensureDemoSession();
  return getStoredItem(STORAGE_KEYS.session);
}

function getProgress() {
  const session = getSession();
  const storedProgress = getStoredItem(STORAGE_KEYS.progress);
  const isDemoMode = localStorage.getItem('christian_gym_demo') === 'true' || session.user?.email === 'demo@christiangym.app';

  if (isDemoMode) {
    return storedProgress || seedProgress;
  }

  return storedProgress || [];
}

function saveProgress(entries) {
  setStoredItem(STORAGE_KEYS.progress, entries);
}

function updateProgress(book, chapter, verse = null) {
  const currentProgress = getProgress();

  if (verse == null) {
    const chapterEntry = currentProgress.find(
      (entry) => entry.book === book && entry.chapter === chapter && entry.verse == null
    );

    const merged = chapterEntry
      ? currentProgress.filter((entry) => !(entry.book === book && entry.chapter === chapter && entry.verse == null))
      : [
          {
            id: `manual-${Date.now()}`,
            book,
            chapter,
            completed_at: new Date().toISOString()
          },
          ...currentProgress
        ];

    saveProgress(merged);
    return merged;
  }

  const verseEntry = currentProgress.find(
    (entry) => entry.book === book && entry.chapter === chapter && entry.verse === verse
  );

  const merged = verseEntry
    ? currentProgress.filter(
        (entry) => !(entry.book === book && entry.chapter === chapter && entry.verse === verse)
      )
    : [
        {
          id: `manual-${Date.now()}-${verse}`,
          book,
          chapter,
          verse,
          completed_at: new Date().toISOString()
        },
        ...currentProgress
      ];

  saveProgress(merged);
  return merged;
}

function getBooks() {
  return defaultBookData;
}

function buildAppData() {
  const session = getSession();
  const progress = getProgress();

  const uniqueChapterKeys = new Set(
    progress
      .filter((entry) => entry.verse == null)
      .map((entry) => `${entry.book}:${entry.chapter}`)
  );

  const totalChaptersRead = uniqueChapterKeys.size;
  const totalVerseReads = progress.filter((entry) => entry.verse != null).length;
  const streak = 12;
  const achievements = [
    { id: 'a1', achievement_name: 'Primeiro Passo', description: 'Completou sua primeira leitura.' },
    { id: 'a2', achievement_name: 'Sequência 7', description: 'Leu por 7 dias consecutivos.' },
    { id: 'a3', achievement_name: 'Discípulo', description: 'Registrou 20 capítulos.' }
  ];

  return {
    session,
    progress,
    books: defaultBookData,
    totalChaptersRead,
    totalVerseReads,
    streak,
    achievements,
    challenges: [
      {
        id: 'c1',
        title: 'Leitura de 30 dias',
        description: 'Leia todos os 30 dias da rotina.',
        progress: 18,
        target: 30,
        badge: 'Dedicado'
      },
      {
        id: 'c2',
        title: 'Salmos completos',
        description: 'Complete os 150 Salmos.',
        progress: 60,
        target: 150,
        badge: 'Adorador'
      }
    ]
  };
}

function logout() {
  localStorage.removeItem(STORAGE_KEYS.session);
  window.location.href = './login.html';
}

window.database = {
  STORAGE_KEYS,
  getSupabaseClient,
  getSupabaseConfig,
  getSession,
  getProgress,
  saveProgress,
  updateProgress,
  getBooks,
  buildAppData,
  logout
};
