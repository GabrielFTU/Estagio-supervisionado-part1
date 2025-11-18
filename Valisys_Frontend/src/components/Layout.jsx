import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, matchPath, useNavigate } from 'react-router-dom'; 
import { Bell, User, ChevronDown, Sun, Moon } from 'lucide-react'; 
import Sidebar from './Sidebar.jsx'; 
import useAuthStore from '../stores/useAuthStore.js'; 
import './Layout.css'; 
import '../index.css'; 

const ROUTE_TITLES = {
    '/': 'Dashboard',
    '/estoque/produtos': 'Gerenciamento de Produtos',
    '/estoque/produtos/novo': 'Novo Produto',
    '/producao/op': 'Ordens de Produção',
    '/producao/lotes': 'Gerenciamento de Lotes',
    '/settings/usuarios': 'Usuários',
    '/settings/usuarios/novo': 'Novo Usuário',
    '/settings/perfis': 'Perfis',
    '/settings/perfis/novo': 'Novo Perfil',
    '/estoque/produtos/editar/:id': 'Editar Produto',
    '/settings/usuarios/editar/:id': 'Editar Usuário',
    '/settings/perfis/editar/:id': 'Editar Perfil',
};

const getPageTitle = (pathname) => {
    const exactTitle = ROUTE_TITLES[pathname];
    if (exactTitle) return exactTitle;
    
    for (const pathTemplate in ROUTE_TITLES) {
        if (pathTemplate.includes(':id')) {
            const match = matchPath(pathTemplate, pathname);
            if (match) {
                return ROUTE_TITLES[pathTemplate];
            }
        }
    }
    return 'Visualização do Sistema';
}

function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation(); 
  const navigate = useNavigate();
  
  const theme = useAuthStore((state) => state.theme);
  const toggleTheme = useAuthStore((state) => state.toggleTheme);
  
  const userName = "Gerente PCP"; 
  const displayUserName = userName; 

  useEffect(() => {
    document.body.className = `theme-${theme}`; 
  }, [theme]);


  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  const handleProfileClick = () => {
      console.log("Navegação de Perfil desativada. ID de usuário não está sendo lido do store.");
  };

  return (
    <div className={`app-layout theme-${theme} ${isCollapsed ? 'collapsed-mode' : 'expanded-mode'}`}> 
      
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} /> 

      <div className="main-container">
        
        <header className="app-header">
            <h2 className="page-title">{getPageTitle(location.pathname)}</h2> 
            <div className="header-actions">
                
                <button className="icon-action" onClick={toggleTheme} title={`Mudar para Tema ${theme === 'dark' ? 'Claro' : 'Escuro'}`}>
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />} 
                </button>
                
                <button className="icon-action">
                    <Bell size={20} />
                </button>

                <div className="user-profile" onClick={handleProfileClick} role="button" tabIndex={0}>
                    <User size={20} className="profile-icon" />
                    <span className="user-name">{displayUserName}</span>
                    <ChevronDown size={16} className="dropdown-icon" />
                </div>
            </div>
        </header>
        
        <main className="content-area">
          <Outlet />
        </main>
      </div>
      
    </div>
  );
}

export default Layout;