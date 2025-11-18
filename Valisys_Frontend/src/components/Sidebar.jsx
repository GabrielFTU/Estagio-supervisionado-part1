import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Menu, Factory, Box, Settings, Users, Layers, Tag, Ruler, Key, ChevronDown, ChevronUp, LogOut, Home, ArrowLeft, ArrowRight
} from 'lucide-react';
import useAuthStore from '../stores/useAuthStore.js';
import ValisysLogoV3 from '/Logo_V.png'; 

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const [openMenu, setOpenMenu] = useState('null'); 
  const theme = useAuthStore((state) => state.theme);
  const toggleTheme = useAuthStore((state) => state.toggleTheme);
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
    { 
      name: 'Cadastros', icon: Layers, menuName: 'cadastros',
      subMenu: [
          { name: 'Fornecedores', link: '/settings/cadastros/fornecedores' },
          { name: 'Almoxarifados', link: '/settings/cadastros/almoxarifados' },
          { name: 'Categorias', link: '/settings/cadastros/categorias' },
          { name: 'Unidades de Medida', link: '/settings/cadastros/unidades' },
          { name: 'Fases de Produção', link: '/settings/cadastros/fases' },
          { name: 'Tipos de OP', link: '/settings/cadastros/tiposop' },
      ]
    },
  ];
  
  const settingsMenu = { 
      name: 'Configurações', icon: Settings, menuName: 'settings',
      groups: [
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
        <img src={ValisysLogoV3} alt="Valisys V3 Logo" className="valisys-logo" />
        <button onClick={toggleSidebar} className="toggle-btn-fixed">
          {isCollapsed ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
        </button>
      </div>

      <div className="sidebar-nav">
        {menus.map((menu) => (
            <div key={menu.name}>
                {menu.subMenu ? (
                    <>
                        <div 
                            className={`menu-item has-submenu ${openMenu === menu.menuName ? 'open' : ''}`}
                            onClick={() => toggleMenu(menu.menuName)}
                        >
                            <menu.icon size={20} className="menu-icon" />
                            {!isCollapsed && (
                                <>
                                    <span>{menu.name}</span>
                                    {openMenu === menu.menuName ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </>
                            )}
                            {isCollapsed && <span className="tooltip">{menu.name}</span>}
                        </div>
                        {openMenu === menu.menuName && !isCollapsed && (
                            <div className="submenu">
                                {menu.subMenu.map((item) => (
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
                    </>
                ) : (
                    <NavLink
                        to={menu.link}
                        className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
                        end={menu.exact}
                    >
                        <menu.icon size={20} className="menu-icon" />
                        {!isCollapsed && <span>{menu.name}</span>}
                        {isCollapsed && <span className="tooltip">{menu.name}</span>}
                    </NavLink>
                )}
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