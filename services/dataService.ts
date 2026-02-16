
import { Article, ArchivedArticle, Author, Category } from '../types';

// Initial Mock Data to populate the app if empty
const INITIAL_AUTHORS: Author[] = [
  { id: '1', name: 'Eduardo Elvira', role: 'Director', imageUrl: 'https://ui-avatars.com/api/?name=Eduardo+Elvira&background=0D8ABC&color=fff&size=128', systemRole: 'ADMIN' },
  { id: '2', name: 'Nerea F.Elena', role: 'Redacción', imageUrl: 'https://ui-avatars.com/api/?name=Nerea+F+Elena&background=E63946&color=fff&size=128', systemRole: 'EDITOR' },
  { id: '3', name: 'Manolo Herrera', role: 'Redacción', imageUrl: 'https://ui-avatars.com/api/?name=Manolo+Herrera&background=random&size=128', systemRole: 'EDITOR' },
  { id: '4', name: 'Rubén Sánchez', role: 'Redacción', imageUrl: 'https://ui-avatars.com/api/?name=Ruben+Sanchez&background=random&size=128', systemRole: 'EDITOR' },
  { id: '5', name: 'Iris Rodríguez', role: 'Redacción', imageUrl: 'https://ui-avatars.com/api/?name=Iris+Rodriguez&background=random&size=128', systemRole: 'EDITOR' },
  { id: '6', name: 'Antonio Tortosa', role: 'Redacción', imageUrl: 'https://ui-avatars.com/api/?name=Antonio+Tortosa&background=random&size=128', systemRole: 'EDITOR' },
  { id: '7', name: 'Inés Sáez', role: 'Redacción', imageUrl: 'https://ui-avatars.com/api/?name=Ines+Saez&background=random&size=128', systemRole: 'EDITOR' },
  { id: '8', name: 'Enrique Salazar', role: 'Redacción', imageUrl: 'https://ui-avatars.com/api/?name=Enrique+Salazar&background=random&size=128', systemRole: 'EDITOR' },
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: '101',
    title: 'Sábado en el Carnaval del Toro de Ciudad Rodrigo',
    summary: 'Cuatro orejas y varios novillos aplaudidos en el arrastre en una tarde marcada por el viento.',
    content: '<p>Texto completo de la crónica del carnaval...</p>',
    imageUrl: 'https://picsum.photos/800/600?random=10',
    contentImages: [],
    category: Category.CRONICAS,
    authorId: '2', // Nerea F.Elena
    date: new Date().toISOString(),
    isPublished: true,
    bullfightLocation: 'Plaza Mayor de Ciudad Rodrigo',
    bullfightCattle: 'Novillos de las ganaderías de Talavante y un eral de El Pilar.',
    bullfightSummary: 'En este sábado de carnaval, Ciudad Rodrigo vivió una tarde con una novillada de Talavante sensacional, ofreciendo cada uno de ellos un juego más que notable.',
    bullfightResults: [
        { bullfighter: 'Diego Urdiales', result: 'una oreja' },
        { bullfighter: 'Alejandro Talavante', result: 'ovación' },
        { bullfighter: 'Pablo Aguado', result: 'una oreja' },
        { bullfighter: 'El Mene', result: 'una oreja' },
        { bullfighter: 'Moisés Fraile', result: 'ovación' }
    ]
  },
];

const STORAGE_KEYS = {
  ARTICLES: 'td_articles_v4',
  AUTHORS: 'td_authors_v4',
  ARCHIVE: 'td_archive_v4', // Nueva key para el historial
};

// --- SISTEMA DE AUTO-GUARDADO (AUTO-SYNC) ---
let autoSaveTimer: any = null;

// Función para detener el auto-guardado si vamos a hacer un guardado manual
export const stopAutoSync = () => {
    if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
        autoSaveTimer = null;
        console.log("🛑 Auto-guardado cancelado (priorizando acción manual).");
    }
};

export const triggerCloudSync = () => {
  if (autoSaveTimer) clearTimeout(autoSaveTimer);

  autoSaveTimer = setTimeout(async () => {
    try {
      console.log("☁️ Detectados cambios: Iniciando auto-guardado en GitHub...");
      const { syncWithGitHub } = await import('./githubService');
      
      const result = await syncWithGitHub(); // Usará el retry logic si falla
      if (result.success) {
        console.log("✅ Auto-guardado completado con éxito.");
      } else {
        console.warn("⚠️ El auto-guardado no se completó:", result.message);
      }
    } catch (error) {
      console.error("❌ Error en el proceso de auto-guardado:", error);
    }
  }, 1500);
};


// Helpers to simulate DB interaction
export const getAuthors = (): Author[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.AUTHORS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.AUTHORS, JSON.stringify(INITIAL_AUTHORS));
    return INITIAL_AUTHORS;
  }
  return JSON.parse(stored);
};

export const saveAuthor = (author: Author, skipSync = false): void => {
  const authors = getAuthors();
  const existingIndex = authors.findIndex((a) => String(a.id) === String(author.id));
  if (existingIndex >= 0) {
    authors[existingIndex] = author;
  } else {
    authors.push(author);
  }
  localStorage.setItem(STORAGE_KEYS.AUTHORS, JSON.stringify(authors));
  
  if (!skipSync) {
    triggerCloudSync();
  }
};

export const deleteAuthor = (id: string): void => {
  const authors = getAuthors().filter((a) => String(a.id) !== String(id));
  localStorage.setItem(STORAGE_KEYS.AUTHORS, JSON.stringify(authors));
  triggerCloudSync();
};

export const getArticles = (): Article[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.ARTICLES);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(INITIAL_ARTICLES));
    return INITIAL_ARTICLES;
  }
  return JSON.parse(stored);
};

export const getArchivedArticles = (): ArchivedArticle[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.ARCHIVE);
    return stored ? JSON.parse(stored) : [];
};

export const saveArticle = (article: Article, skipSync = false): void => {
  const articles = getArticles();
  // USAMOS STRING PARA COMPARAR ID DE FORMA ROBUSTA
  const existingIndex = articles.findIndex((a) => String(a.id) === String(article.id));
  
  if (existingIndex >= 0) {
    articles[existingIndex] = article;
  } else {
    articles.unshift(article); 
  }
  localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
  
  if (!skipSync) {
    triggerCloudSync();
  }
};

// "ELIMINAR" AHORA ES "ARCHIVAR" (Seguridad)
export const deleteArticle = (id: string, userId: string = 'system'): void => {
  const articles = getArticles();
  // USAMOS STRING PARA COMPARAR
  const articleToArchive = articles.find((a) => String(a.id) === String(id));
  
  if (articleToArchive) {
      // 1. Crear registro de archivo
      const archived: ArchivedArticle = {
          ...articleToArchive,
          archivedAt: new Date().toISOString(),
          archivedBy: userId
      };

      // 2. Guardar en historial
      const archive = getArchivedArticles();
      archive.unshift(archived);
      localStorage.setItem(STORAGE_KEYS.ARCHIVE, JSON.stringify(archive));

      // 3. Eliminar de la lista activa (Filtrando robustamente)
      const newArticles = articles.filter((a) => String(a.id) !== String(id));
      localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(newArticles));
      
      triggerCloudSync();
  }
};

export const restoreArticle = (id: string): boolean => {
    const archive = getArchivedArticles();
    // USAMOS STRING PARA COMPARAR, ASEGURANDO QUE SE ENCUENTRA
    const articleToRestore = archive.find(a => String(a.id) === String(id));

    if (articleToRestore) {
        // 1. Reconstruir el artículo activo explícitamente para limpiar basura del historial
        // Esto asegura que el objeto resultante sea EXACTAMENTE del tipo Article y no tenga props de ArchivedArticle
        const activeArticle: Article = {
            id: String(articleToRestore.id), 
            title: articleToRestore.title,
            summary: articleToRestore.summary,
            content: articleToRestore.content,
            imageUrl: articleToRestore.imageUrl,
            contentImages: articleToRestore.contentImages || [],
            category: articleToRestore.category,
            authorId: String(articleToRestore.authorId), 
            date: articleToRestore.date,
            isPublished: false, // SIEMPRE se restaura como borrador por seguridad
            
            // Campos opcionales de crónicas
            bullfightLocation: articleToRestore.bullfightLocation || '',
            bullfightCattle: articleToRestore.bullfightCattle || '',
            bullfightSummary: articleToRestore.bullfightSummary || '',
            bullfightResults: articleToRestore.bullfightResults || []
        };

        saveArticle(activeArticle);

        // 2. Quitar del archivo (Filtrando robustamente)
        const newArchive = archive.filter(a => String(a.id) !== String(id));
        localStorage.setItem(STORAGE_KEYS.ARCHIVE, JSON.stringify(newArchive));
        
        triggerCloudSync();
        return true;
    }
    return false;
};

export const getArticleById = (id: string): Article | undefined => {
  return getArticles().find((a) => String(a.id) === String(id));
};
