import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Settings, LogOut, User, Box } from 'lucide-react';
import useAuthStore from '../stores/useAuthStore.js';
import './Layout.css';

function Layout() {
    const logout = useAuthStore((state) => state.logout);
  return (
    <div className="app-layout">
      <nav className="navbar">
        <div className="nav-brand">Valisys Production</div>
        <div className="nav-links">
          <Link to="/">Dashboard</Link>
          <Link to="/produtos">Produtos</Link>
          <Link to="/configuracoes/usuarios">Usuários</Link> 
          <Link to="/configuracoes/perfis">Perfis</Link>   
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

export default Layout;