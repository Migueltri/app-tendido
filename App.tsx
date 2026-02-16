import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ArticlesList from './pages/ArticlesList';
import ArticleForm from './pages/ArticleForm';
import Authors from './pages/Authors';
import Settings from './pages/Settings';
import Home from './pages/home/page'; // CORRECCIÓN: Ruta relativa limpia
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
            {/* CORRECCIÓN: Ruta interna válida */}
            <Route path="/web" element={<Home />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
