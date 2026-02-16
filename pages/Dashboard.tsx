import React, { useEffect, useState } from 'react';
import { getArticles, getAuthors } from '../services/dataService';
import { syncWithGitHub, downloadFromGitHub, getSettings } from '../services/githubService';
import { Article, Category } from '../types';
import { Newspaper, Users, MessageSquare, TrendingUp, CloudUpload, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
    </div>
    <div className={`p-4 rounded-full ${color} text-white`}>
      {icon}
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [authorCount, setAuthorCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [autoSyncDone, setAutoSyncDone] = useState(false);

  useEffect(() => {
    // 1. Carga inicial local
    setArticles(getArticles());
    setAuthorCount(getAuthors().length);

    // 2. Auto-Sincronización (Descarga de "Para Siempre")
    const settings = getSettings();
    if (settings.githubToken && !autoSyncDone) {
        handleAutoDownload();
    }
  }, []);

  const handleAutoDownload = async () => {
      // Descarga silenciosa para asegurar que tenemos los datos de la nube
      try {
          const result = await downloadFromGitHub();
          if (result.success && result.data) {
              setArticles(result.data.articles);
              setAuthorCount(result.data.authors.length);
              setAutoSyncDone(true);
              console.log("✅ Datos sincronizados con la nube automáticamente.");
          }
      } catch (error) {
          console.error("Error en auto-sync:", error);
      }
  };

  const handleSync = async () => {
      setIsSyncing(true);
      setStatusMsg('Conectando con GitHub...');
      const result = await syncWithGitHub();
      setStatusMsg(result.message);
      setIsSyncing(false);
      setTimeout(() => setStatusMsg(''), 5000);
  };

  const handleDownload = async () => {
      if(!confirm("Esto sobrescribirá los datos locales con los de la web. ¿Continuar?")) return;
      setIsSyncing(true);
      setStatusMsg('Descargando datos...');
      const result = await downloadFromGitHub();
      if (result.success && result.data) {
          setArticles(result.data.articles);
          setAuthorCount(result.data.authors.length);
      }
      setStatusMsg(result.message);
      setIsSyncing(false);
  };

  const cronicasCount = articles.filter(a => a.category === Category.CRONICAS).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
            <h2 className="text-3xl font-bold text-gray-800">Hola, {currentUser?.name || 'Editor'}</h2>
            <div className="flex items-center gap-2 mt-2">
                <p className="text-gray-500">Bienvenido al panel de control de Tendido Digital.</p>
                {autoSyncDone && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium animate-fade-in">
                        <CheckCircle2 size={12} /> Sincronizado con la Nube
                    </span>
                )}
            </div>
        </div>
        
        {/* Sync Controls */}
        <div className="flex items-center gap-2">
            <button 
                onClick={handleDownload}
                disabled={isSyncing}
                className="bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 disabled:opacity-50 text-sm font-medium"
                title="Forzar descarga manual de la web"
            >
                <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
                Importar de Web
            </button>
            <button 
                onClick={handleSync}
                disabled={isSyncing}
                className="bg-brand-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 disabled:opacity-50 font-medium shadow-md"
            >
                <CloudUpload size={18} />
                {isSyncing ? 'Publicando...' : 'Publicar cambios en la Web'}
            </button>
        </div>
      </div>

      {statusMsg && (
          <div className={`p-4 rounded-lg text-center font-medium ${statusMsg.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {statusMsg}
          </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Noticias" 
          value={articles.length} 
          icon={<Newspaper size={24} />} 
          color="bg-brand-red" 
        />
        <StatCard 
          title="Crónicas" 
          value={cronicasCount} 
          icon={<TrendingUp size={24} />} 
          color="bg-blue-600" 
        />
        <StatCard 
          title="Autores" 
          value={authorCount} 
          icon={<Users size={24} />} 
          color="bg-emerald-500" 
        />
        <StatCard 
          title="Opinión" 
          value={articles.filter(a => a.category === Category.OPINION).length} 
          icon={<MessageSquare size={24} />} 
          color="bg-purple-500" 
        />
      </div>

      <div className="bg-white p-8 rounded-xl border border-gray-100 text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Acceso Rápido</h3>
        <p className="text-gray-500 mb-6">¿Qué deseas hacer hoy?</p>
        <div className="flex justify-center gap-4">
             <Link to="/crear-noticia" className="bg-brand-red text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors">
                 Redactar Nueva Noticia
             </Link>
             <Link to="/noticias" className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                 Ver Listado de Noticias
             </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;