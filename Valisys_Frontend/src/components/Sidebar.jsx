import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, Settings, LogOut, ChevronDown, ChevronUp, ArrowLeft, ArrowRight,
  Factory, Box, Layers, Key, ClipboardList, DraftingCompass, ChartBar, ShieldAlert,
  Trello 
} from 'lucide-react';
import useAuthStore from '../stores/useAuthStore.js';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const [openMenu, setOpenMenu] = useState(null); 
  const [openSettingsGroup, setOpenSettingsGroup] = useState(null);
  const [openPopover, setOpenPopover] = useState(null);
  const sidebarRef = useRef(null);
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setOpenPopover(null);
      }
    };

    if (isCollapsed && openPopover) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isCollapsed, openPopover]);

  const toggleMenu = (menuName) => {
    if (openMenu === 'settings' && menuName === 'settings') {
        setOpenSettingsGroup(null);
    }
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const handleCollapsedMenuClick = (menuName, e) => {
    e.stopPropagation();
    setOpenPopover(openPopover === menuName ? null : menuName);
  };

  const toggleSettingsGroup = (groupName) => {
    setOpenSettingsGroup(openSettingsGroup === groupName ? null : groupName);
  };

  const isSubMenuActive = (subMenu) => {
    return subMenu.some(item => location.pathname === item.link);
  };

  const isSettingsGroupActive = (subMenu) => {
    return subMenu.some(item => location.pathname === item.link);
  };

  const menus = [
    { name: 'Dashboard', icon: Home, link: '/', exact: true },
    
    { 
      name: 'Engenharia', icon: DraftingCompass, menuName: 'engenharia',
      subMenu: [
        { name: 'Fichas Técnicas', link: '/engenharia/fichas-tecnicas' },
        { name: 'Roteiros de Produção', link: '/engenharia/roteiros' },
      ]
    },
    { 
      name: 'Produção', icon: ClipboardList, menuName: 'producao',
      subMenu: [
        { name: 'Ordens de Produção', link: '/producao/op' },
        { name: 'Lote', link: '/producao/lotes' },
      ]
    },
    {
      name: 'Fábrica', icon: Factory, menuName: 'fabrica',
      subMenu: [
        { name: 'Quadro Kanban', link: '/fabrica/kanban' }, 
        { name: 'Consulta e Ação', link: '/fabrica/consultar-op' }, 
        //{ name: 'Apontamentos', link: '/fabrica/movimentacoes' }, em desenvolvimento
      ]
    },
    { 
      name: 'Estoque', icon: Box, menuName: 'estoque',
      subMenu: [
        { name: 'Estoque Produtos', link: '/estoque/acabados' }, 
        { name: 'Produto', link: '/estoque/produtos' },
        //{ name: 'Movimentações', link: '/estoque/movimentacoes' }, em desenvolvimento
      ]
    },
    {
      name: 'Relatórios', icon: ChartBar, menuName: 'relatorios',
      subMenu: [
        { name: 'Movimentações', link: '/relatorios/movimentacoes' },
        { name: 'Catálogo de Produtos', link: '/relatorios/estoque' },
        { name: 'Produção', link: '/relatorios/producao' },
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
          {
              name: 'Sistema', icon: ShieldAlert, menuName: 'settings-sistema',
              subMenu: [
                  { name: 'Logs de Atividades', link: '/settings/sistema/logs' },
                  //{ name: 'Auditoria', link: '/settings/sistema/auditoria' },
              ]
          },
      ]
    };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`} ref={sidebarRef}>
      <div className="sidebar-header">
        <div className="brand-logo">
          <img src="/Logo_V.png" alt="Valisys V3 Logo" className="valisys-logo" />
          {!isCollapsed && (
            <span className="brand-name">ALISYS</span>
          )}
        </div>
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
                            className={`menu-item has-submenu ${openMenu === menu.menuName ? 'open' : ''} ${isSubMenuActive(menu.subMenu) ? 'active' : ''} ${isCollapsed && openPopover === menu.menuName ? 'popover-open' : ''}`}
                            onClick={(e) => {
                              if (isCollapsed) {
                                handleCollapsedMenuClick(menu.menuName, e);
                              } else {
                                toggleMenu(menu.menuName);
                              }
                            }}
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
                                        onClick={() => setOpenPopover(null)}
                                    >
                                        <span>{item.name}</span>
                                    </NavLink>
                                ))}
                            </div>
                        )}
                        
                        {isCollapsed && openPopover === menu.menuName && (
                            <div className="popover-menu">
                                {menu.subMenu.map((item) => (
                                    <NavLink
                                        key={item.link}
                                        to={item.link}
                                        className={({ isActive }) => `popover-item ${isActive ? 'active' : ''}`}
                                        onClick={() => setOpenPopover(null)}
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
            className={`menu-item has-submenu settings-toggle ${openMenu === settingsMenu.menuName ? 'open' : ''} ${settingsMenu.groups && settingsMenu.groups.some(g => isSettingsGroupActive(g.subMenu)) ? 'active' : ''} ${isCollapsed && openPopover === settingsMenu.menuName ? 'popover-open' : ''}`}
            onClick={(e) => {
              if (isCollapsed) {
                handleCollapsedMenuClick(settingsMenu.menuName, e);
              } else {
                toggleMenu(settingsMenu.menuName);
              }
            }}
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
                            className={`group-header ${openSettingsGroup === group.menuName ? 'open' : ''}`}
                            onClick={() => toggleSettingsGroup(group.menuName)}
                          >
                            <group.icon size={16} className="group-icon" />
                            <span className="group-name">{group.name}</span>
                            {openSettingsGroup === group.menuName ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </div>

                          {openSettingsGroup === group.menuName && (
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

          {isCollapsed && openPopover === settingsMenu.menuName && (
              <div className="popover-menu settings-popover">
                  {settingsMenu.groups.map(group => (
                      <div key={group.name}>
                          <div className="popover-group-title">
                              <group.icon size={14} className="group-icon" />
                              <span>{group.name}</span>
                          </div>
                          {group.subMenu.map((item) => (
                              <NavLink
                                  key={item.link}
                                  to={item.link}
                                  className={({ isActive }) => `popover-item ${isActive ? 'active' : ''}`}
                                  onClick={() => setOpenPopover(null)}
                              >
                                  <span>{item.name}</span>
                              </NavLink>
                          ))}
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