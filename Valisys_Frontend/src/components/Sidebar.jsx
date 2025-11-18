import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Menu, Factory, Box, Settings, Users, Layers, Tag, Ruler, Key, ChevronDown, ChevronUp, LogOut, Home, ArrowLeft, ArrowRight
} from 'lucide-react';
import useAuthStore from '../stores/useAuthStore.js';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const [openMenu, setOpenMenu] = useState('estoque'); 
  const { toggleTheme, theme } = useAuthStore((state) => ({ toggleTheme: state.toggleTheme, theme: state.theme }));
  const logout = useAuthStore((state) => state.logout);

  const toggleMenu = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const menus = [
    { name: 'Dashboard', icon: Home, link: '/', exact: true },
    { 
      name: 'Produção', icon: Factory, menuName: 'producao',
      subMenu: [
        { name: 'Ordens de Produção', link: '/producao/op' },
        { name: 'Lotes', link: '/producao/lotes' },
      ]
    },
    { 
      name: 'Estoque', icon: Box, menuName: 'estoque',
      subMenu: [
        { name: 'Produtos', link: '/estoque/produtos' },
        { name: 'Movimentações', link: '/estoque/movimentacoes' },
      ]
    },
  ];
  
  const settingsMenu = { 
      name: 'Configurações', icon: Settings, menuName: 'settings',
      groups: [
          {
              name: 'Cadastros', icon: Tag, menuName: 'settings-cadastros',
              subMenu: [
                  { name: 'Categorias', link: '/settings/cadastros/categorias' },
                  { name: 'Unidades de Medida', link: '/settings/cadastros/unidades' },
              ]
          },
          {
              name: 'Acesso', icon: Key, menuName: 'settings-acesso',
              subMenu: [
                  { name: 'Usuários', link: '/settings/usuarios' },
                  { name: 'Perfis', link: '/settings/perfis' },
              ]
          },
      ]
    };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      <div className="sidebar-header">
        <button onClick={toggleSidebar} className="toggle-btn-fixed">
          {isCollapsed ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
        </button>
      </div>

      <div className="sidebar-nav">
        {menus.map((menu) => (
          <div key={menu.name}>
          </div>
        ))}
      </div>
      
      <div className="sidebar-footer">
          <div 
            className={`menu-item has-submenu settings-toggle ${openMenu === settingsMenu.menuName ? 'open' : ''}`}
            onClick={() => toggleMenu(settingsMenu.menuName)}
          >
              <Settings size={20} className="menu-icon" />
              {!isCollapsed && (
                  <>
                      <span>{settingsMenu.name}</span>
                      {openMenu === settingsMenu.menuName ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </>
              )}
              {isCollapsed && <span className="tooltip">{settingsMenu.name}</span>}
          </div>
          
          {settingsMenu.groups && openMenu === settingsMenu.menuName && !isCollapsed && (
              <div className="settings-groups-container">
                  {settingsMenu.groups.map(group => (
                      <div key={group.name} className="group-item">
                          
                          <div 
                            className={`group-header ${openMenu === group.menuName ? 'open' : ''}`}
                            onClick={() => toggleMenu(group.menuName)}
                          >
                            <group.icon size={16} className="group-icon" />
                            <span className="group-name">{group.name}</span>
                            {openMenu === group.menuName ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </div>

                          {openMenu === group.menuName && (
                            <div className="submenu-group">
                                {group.subMenu.map((item) => (
                                    <NavLink
                                        key={item.link}
                                        to={item.link}
                                        className={({ isActive }) => `submenu-item ${isActive ? 'active' : ''}`}
                                    >
                                        <span>{item.name}</span>
                                    </NavLink>
                                ))}
                            </div>
                          )}
                      </div>
                  ))}
              </div>
          )}

          <button onClick={logout} className="logout-btn exit-btn">
              <LogOut size={20} />
              {!isCollapsed && <span>Sair</span>}
          </button>
      </div>
    </div>
  );
};

export default Sidebar;