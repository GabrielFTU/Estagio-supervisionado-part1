import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, Settings, LogOut, ChevronDown, ChevronUp, ArrowLeft, ArrowRight,
  Factory, Box, Layers, Key, ClipboardList, DraftingCompass, ChartBar, ShieldAlert
} from 'lucide-react';
import useAuthStore from '../stores/useAuthStore.js';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const [openMenu, setOpenMenu] = useState(null); 
  const [openSettingsGroup, setOpenSettingsGroup] = useState(null);
  const logout = useAuthStore((state) => state.logout);

  const toggleMenu = (menuName) => {
    if (openMenu === 'settings' && menuName === 'settings') {
        setOpenSettingsGroup(null);
    }
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const toggleSettingsGroup = (groupName) => {
    setOpenSettingsGroup(openSettingsGroup === groupName ? null : groupName);
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
      name: 'Produção', icon: Factory, menuName: 'producao',
      subMenu: [
        { name: 'Ordens de Produção', link: '/producao/op' },
        { name: 'Lotes', link: '/producao/lotes' },
      ]
    },
    {
      name: 'Fábrica', icon: ClipboardList, menuName: 'fabrica',
      subMenu: [
        { name: 'Consultar O.P.', link: '/fabrica/consultar-op' },
        { name: 'Apontamentos', link: '/fabrica/movimentacoes' },
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
      name: 'Relatórios', icon: ChartBar, menuName: 'relatorios',
      subMenu: [
        { name: 'Movimentações', link: '/relatorios/movimentacoes' },
        { name: 'Posição de Estoque', link: '/relatorios/estoque' },
        { name: 'Produção por Período', link: '/relatorios/producao' },
        { name: 'Clientes/Parceiros', link: '/relatorios/clientes' },
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
                  { name: 'Auditoria', link: '/settings/sistema/auditoria' },
              ]
          },
      ]
    };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      <div className="sidebar-header">
        <img src="/Logo_V.png" alt="Valisys V3 Logo" className="valisys-logo" />
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

          <button onClick={logout} className="logout-btn exit-btn">
              <LogOut size={20} />
              {!isCollapsed && <span>Sair</span>}
          </button>
      </div>
    </div>
  );
};

export default Sidebar;