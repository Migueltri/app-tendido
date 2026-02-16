
import { AppSettings, Article, Author, ArchivedArticle } from '../types';
import { getArticles, getAuthors, getArchivedArticles } from './dataService';

const SETTINGS_KEY = 'td_app_settings';

export const getSettings = (): AppSettings => {
  const stored = localStorage.getItem(SETTINGS_KEY);
  const settings = stored ? JSON.parse(stored) : {};
  
  // Defaults
  return {
    githubToken: settings.githubToken || '',
    repoOwner: settings.repoOwner || '',
    repoName: settings.repoName || '',
    filePath: settings.filePath || 'public/data/db.json',
    repoBranch: settings.repoBranch || 'main'
  };
};

export const saveSettings = (settings: AppSettings) => {
  const cleanSettings = {
    ...settings,
    githubToken: settings.githubToken.trim(),
    repoOwner: settings.repoOwner.trim(),
    repoName: settings.repoName.trim(),
    filePath: settings.filePath.trim().replace(/^\//, ''),
    repoBranch: settings.repoBranch?.trim() || 'main'
  };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(cleanSettings));
};

interface GitHubFileResponse {
  sha: string;
  content: string;
  encoding: string;
}

interface DatabaseSchema {
  articles: Article[];
  authors: Author[];
  archivedArticles?: ArchivedArticle[];
  lastUpdated: string;
}

// Codifica a Base64 soportando caracteres UTF-8 (acentos, ñ, emojis) de forma segura
const utf8_to_b64 = (str: string) => {
  return window.btoa(unescape(encodeURIComponent(str)));
};

// Decodifica Base64 a UTF-8
const b64_to_utf8 = (str: string) => {
  return decodeURIComponent(escape(window.atob(str)));
};

export const verifyConnection = async (): Promise<{ success: boolean; message: string }> => {
    const settings = getSettings();
    if (!settings.githubToken || !settings.repoOwner || !settings.repoName) {
       return { success: false, message: 'Faltan datos: Revisa la Configuración.' };
    }
  
    // 1. Verificar acceso al Repo
    const repoUrl = `https://api.github.com/repos/${settings.repoOwner}/${settings.repoName}`;
    try {
        const repoRes = await fetch(repoUrl, {
            headers: { 'Authorization': `token ${settings.githubToken}` },
            cache: 'no-store'
        });
        
        if (repoRes.status === 401) return { success: false, message: '❌ Token inválido o caducado.' };
        if (repoRes.status === 404) return { success: false, message: '❌ No se encuentra el repositorio. Revisa el nombre.' };
        if (repoRes.status !== 200) return { success: false, message: `❌ Error de GitHub: ${repoRes.status}` };

        const repoData = await repoRes.json();
        if (repoData.permissions && repoData.permissions.push === false) {
            return { success: false, message: '⚠️ El Token es válido pero NO tiene permisos de escritura (marca "repo" al crearlo).' };
        }

        // 2. Verificar acceso al Archivo
        const fileUrl = `https://api.github.com/repos/${settings.repoOwner}/${settings.repoName}/contents/${settings.filePath}?ref=${settings.repoBranch}&t=${Date.now()}`;
        const fileRes = await fetch(fileUrl, {
             headers: { 'Authorization': `token ${settings.githubToken}` },
             cache: 'no-store'
        });

        if (fileRes.status === 404) {
             return { success: true, message: `✅ Conexión correcta. El archivo db.json se creará al publicar la primera vez.` };
        }

        return { success: true, message: `✅ Conexión exitosa. Todo listo.` };

    } catch (e: any) {
        return { success: false, message: `❌ Error de red: ${e.message}` };
    }
}

export const syncWithGitHub = async (retries = 3): Promise<{ success: boolean; message: string }> => {
  const settings = getSettings();
  
  if (!settings.githubToken) {
    return { success: false, message: 'Error: Configura el Token en el menú Configuración.' };
  }

  // URL base para el archivo
  const baseUrl = `https://api.github.com/repos/${settings.repoOwner}/${settings.repoName}/contents/${settings.filePath}`;
  
  const headers = {
    'Authorization': `token ${settings.githubToken}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`📡 Intentando subir a GitHub (Intento ${attempt})...`);

        // 1. OBTENER SHA ACTUAL (IMPORTANTE: usamos timestamp para romper la caché del navegador)
        const getUrl = `${baseUrl}?ref=${settings.repoBranch}&timestamp=${Date.now()}`;
        
        const getResponse = await fetch(getUrl, { 
            method: 'GET',
            headers,
            cache: 'no-store', // Forzar no-cache
            referrerPolicy: 'no-referrer'
        });
        
        let sha = '';
        
        if (getResponse.ok) {
          const data: GitHubFileResponse = await getResponse.json();
          sha = data.sha;
        } else if (getResponse.status === 404) {
          console.log("✨ Archivo nuevo, se creará uno.");
        } else {
           const errText = await getResponse.text();
           throw new Error(`Error leyendo repo (${getResponse.status}): ${errText}`);
        }

        // 2. PREPARAR DATOS
        const currentData: DatabaseSchema = {
            articles: getArticles(),
            authors: getAuthors(),
            archivedArticles: getArchivedArticles(),
            lastUpdated: new Date().toISOString()
        };

        // Convertir a JSON bonito
        const jsonString = JSON.stringify(currentData, null, 2);
        // Codificar a Base64 (UTF-8 safe)
        const contentEncoded = utf8_to_b64(jsonString);

        // 3. SUBIR (PUT)
        const body = {
          message: `Update CMS: ${new Date().toLocaleString('es-ES')}`,
          content: contentEncoded,
          sha: sha || undefined, // Si es nuevo no mandamos SHA
          branch: settings.repoBranch 
        };

        const putResponse = await fetch(baseUrl, {
          method: 'PUT',
          headers,
          body: JSON.stringify(body)
        });

        if (putResponse.ok) {
            return { success: true, message: '¡Noticias subidas correctamente a la web!' };
        }

        // Manejo de conflictos (409) - Alguien o algo modificó el archivo mientras leíamos
        if (putResponse.status === 409) {
            console.warn("⚠️ Conflicto de versión (SHA). Reintentando...");
            await new Promise(r => setTimeout(r, 1500)); // Esperar 1.5s
            continue; 
        }

        const err = await putResponse.json();
        throw new Error(`Error GitHub (${putResponse.status}): ${err.message}`);

      } catch (error: any) {
        console.error(`❌ Fallo intento ${attempt}:`, error);
        
        if (attempt === retries) {
            return { success: false, message: `No se pudo subir: ${error.message}` };
        }
        await new Promise(r => setTimeout(r, 1000 * attempt));
      }
  }

  return { success: false, message: 'Error desconocido.' };
};

export const downloadFromGitHub = async (): Promise<{ success: boolean; message: string; data?: DatabaseSchema }> => {
    const settings = getSettings();
    if (!settings.githubToken) return { success: false, message: 'Falta configuración.' };

    // Usamos timestamp para asegurar que descargamos lo último de verdad
    const url = `https://api.github.com/repos/${settings.repoOwner}/${settings.repoName}/contents/${settings.filePath}?ref=${settings.repoBranch}&t=${Date.now()}`;
    
    try {
        const response = await fetch(url, {
            headers: { 'Authorization': `token ${settings.githubToken}` },
            cache: 'no-store'
        });

        if (!response.ok) {
            if(response.status === 404) throw new Error('El archivo no existe aún en el repositorio.');
            throw new Error(`Error descargando: ${response.status}`);
        }

        const data: GitHubFileResponse = await response.json();
        const decodedContent = b64_to_utf8(data.content);
        const db: DatabaseSchema = JSON.parse(decodedContent);

        if (db.articles) localStorage.setItem('td_articles_v4', JSON.stringify(db.articles));
        if (db.authors) localStorage.setItem('td_authors_v4', JSON.stringify(db.authors));
        if (db.archivedArticles) localStorage.setItem('td_archive_v4', JSON.stringify(db.archivedArticles));

        return { success: true, message: 'Datos descargados correctamente', data: db };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
