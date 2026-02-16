import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ArticlesList from './pages/ArticlesList';
import ArticleForm from './pages/ArticleForm';
import Authors from './pages/Authors';
import Settings from './pages/Settings';
// CORRECCIÓN: Ajuste de la ruta relativa asumiendo que App.tsx está en la raíz de src/
import Home from './pages/home/page'; 
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
            
            {/* CORRECCIÓN: Se asigna una ruta interna válida de tu dominio */}
            <Route path="/web" element={<Home />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
