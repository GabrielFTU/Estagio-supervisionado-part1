import { Routes, Route, Navigate, Outlet, Link } from 'react-router-dom';
import Login from './features/auth/Login.jsx'; 
import ProdutoList from './features/produto/ProdutoList.Jsx'; 
import ProdutoForm from './features/produto/ProdutoForm.Jsx';
import ProdutoEdit from './features/produto/ProdutoEdit.jsx';
import useAuthStore from './stores/useAuthStore.js'; 
import './index.css';


function PrivateRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function Layout() {
  const logout = useAuthStore((state) => state.logout);
  
  return (
    <div className="app-layout">
      <nav className="navbar">
        <div className="nav-brand">Valisys Production</div>
        <div className="nav-links">
          <Link to="/">Dashboard</Link>
          <Link to="/produtos">Produtos</Link>
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
          
          <Route path="/produtos" element={<ProdutoList />} />
          <Route path="/produtos/novo" element={<ProdutoForm />} /> 
         <Route path="/produtos/editar/:id" element={<ProdutoEdit />} />
        </Route>
      </Route>
      
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;