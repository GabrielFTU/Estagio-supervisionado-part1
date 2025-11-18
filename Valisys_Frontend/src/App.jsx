import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './features/auth/Login.jsx'; 
import Layout from './components/Layout.jsx'; // Importa Layout
import ProdutoList from './features/produto/ProdutoList.Jsx'; 
import ProdutoForm from './features/produto/ProdutoForm.Jsx';
import ProdutoEdit from './features/produto/ProdutoEdit.jsx';
import PerfilList from './features/perfil/PerfilList.jsx';
import PerfilForm from './features/perfil/PerfilForm.jsx';
import UsuarioList from './features/usuario/UsuarioList.jsx';
import UsuarioForm from './features/usuario/UsuarioForm.jsx';
//import CategoriaList from './features/cadastro/CategoriaList.jsx'; 
//import UnidadeList from './features/cadastro/UnidadeList.jsx';
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
          
          <Route path="/estoque/produtos" element={<ProdutoList />} />
          <Route path="/estoque/produtos/novo" element={<ProdutoForm />} /> 
          <Route path="/estoque/produtos/editar/:id" element={<ProdutoEdit />} />

          <Route path="/producao/op" element={<h1>Ordens de Produção</h1>} />
          <Route path="/producao/lotes" element={<h1>Gerenciamento de Lotes</h1>} />

          <Route path="/settings/cadastros/categorias" element={<h1>Categorias de Produto (WIP)</h1>} />
          <Route path="/settings/cadastros/unidades" element={<h1>Unidades de Medida (WIP)</h1>} />

          <Route path="/settings/usuarios" element={<UsuarioList />} />
          <Route path="/settings/usuarios/novo" element={<UsuarioForm />} />
          <Route path="/settings/usuarios/editar/:id" element={<UsuarioForm />} /> 
          <Route path="/settings/perfis" element={<PerfilList />} />
          <Route path="/settings/perfis/novo" element={<PerfilForm />} /> 
          <Route path="/settings/perfis/editar/:id" element={<PerfilForm />} /> 

          

        </Route>
      </Route>
      
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App; 