import { Routes, Route, Navigate, Outlet, Link } from 'react-router-dom';
import Login from './features/auth/Login.jsx'; // <--- Adicionada extensão .jsx
import ProdutoList from './features/produto/ProdutoList.Jsx'; // <--- Adicionada extensão .jsx
import useAuthStore from './stores/useAuthStore.js'; // <--- Adicionada extensão .js
import './index.css'; // Importando o CSS global

// Componente para Proteger Rotas (sem alteração)
function PrivateRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

// Layout Principal (com links atualizados)
function Layout() {
  const logout = useAuthStore((state) => state.logout);
  
  return (
    <div className="app-layout">
      <nav className="navbar">
        <div className="nav-brand">Valisys Production</div>
        <div className="nav-links">
          <Link to="/">Dashboard</Link>
          <Link to="/produtos">Produtos</Link>
          {/* Adicione outros links aqui */}
        </div>
        <div className="nav-user">
          <button onClick={logout} className="btn-logout">
            Sair
          </button>
        </div>
      </nav>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<h1>Bem-vindo ao Dashboard</h1>} />
          <Route path="/produtos" element={<ProdutoList />} /> {/* <--- 2. ADICIONAR ROTA */}
          {/* Rota para o formulário (vamos criar depois) */}
          {/* <Route path="/produtos/novo" element={<h1>Form Novo Produto</h1>} /> */}
          {/* <Route path="/produtos/editar/:id" element={<h1>Form Editar Produto</h1>} /> */}
        </Route>
      </Route>
      
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;

/* === Adicione este CSS no seu 'src/index.css' === */
/*

*/