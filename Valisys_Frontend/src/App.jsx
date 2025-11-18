import { Routes, Route, Navigate, Outlet, Link } from 'react-router-dom';
import Login from './features/auth/Login.jsx'; 
import Layout from './components/Layout.jsx';
import ProdutoList from './features/produto/ProdutoList.Jsx'; 
import ProdutoForm from './features/produto/ProdutoForm.Jsx';
import ProdutoEdit from './features/produto/ProdutoEdit.jsx';
import PerfilList from './features/perfil/PerfilList.jsx';
import PerfilForm from './features/perfil/PerfilForm.jsx';
import UsuarioList from './features/usuario/UsuarioList.jsx';
import UsuarioForm from './features/usuario/UsuarioForm.jsx';

import useAuthStore from './stores/useAuthStore.js';
import './index.css';

function PrivateRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<PrivateRoute />}>
        
        <Route element={<Layout />}>
          
          <Route path="/" element={<h1>Bem-vindo ao Dashboard</h1>} />
          
          <Route path="/produtos" element={<ProdutoList />} />
          <Route path="/produtos/novo" element={<ProdutoForm />} /> 
          <Route path="/produtos/editar/:id" element={<ProdutoEdit />} />

          <Route path="/configuracoes/perfis" element={<PerfilList />} />
          <Route path="/configuracoes/perfis/novo" element={<PerfilForm />} /> 
          <Route path="/configuracoes/perfis/editar/:id" element={<PerfilForm />} />

          <Route path="/configuracoes/usuarios" element={<UsuarioList />} />
          <Route path="/configuracoes/usuarios/novo" element={<UsuarioForm />} />
          <Route path="/configuracoes/usuarios/editar/:id" element={<UsuarioForm />} />

        </Route>
      </Route>
      
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;