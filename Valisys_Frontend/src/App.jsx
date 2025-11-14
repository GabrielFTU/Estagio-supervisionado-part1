import { Routes, Route, Outlet, Link } from 'react-router-dom';
// CORREÇÃO: Corrigido para bater com o seu nome de arquivo 'produto.jsx'
import Produtos from './features/produtos/produto.jsx'; 
import './App.css'; 

// Layout (sem alterações)
function Layout() {
  return (
    <div>
      <nav className="navbar">
        <Link to="/" className="nav-logo">Valisys</Link>
        <div className="nav-links">
          <Link to="/">Dashboard</Link>
          <Link to="/produtos">Produtos</Link>
        </div>
      </nav>
      <main className="content">
        <Outlet /> 
      </main>
    </div>
  );
}

// Home (sem alterações)
function Home() {
  return <h1>Frontend Valisys - Dashboard</h1>;
}

// App (sem alterações)
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} /> 
        <Route path="produtos" element={<Produtos />} />
      </Route>
    </Routes>
  );
}

export default App;