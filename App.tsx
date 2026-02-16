import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ArticlesList from './pages/ArticlesList';
import ArticleForm from './pages/ArticleForm';
import Authors from './pages/Authors';
import Settings from './pages/Settings';
import Home from './src/pages/home/page'; // Importamos la nueva portada
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/noticias" element={<ArticlesList />} />
            <Route path="/crear-noticia" element={<ArticleForm />} />
            <Route path="/editar-noticia/:id" element={<ArticleForm />} />
            <Route path="/autores" element={<Authors />} />
            <Route path="/configuracion" element={<Settings />} />
            {/* Nueva ruta para ver la web tal cual la hemos programado */}
            <Route path="https://aistudio.google.com/apps/drive/1rDm_cYqpKlkzp8y1XwjEKQf322-qqtlg?showPreview=true&showAssistant=true" element={<Home />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
