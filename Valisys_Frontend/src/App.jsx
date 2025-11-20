import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './features/auth/Login.jsx'; 
import Layout from './components/Layout.jsx'; 
import useAuthStore from './stores/useAuthStore.js'; 

// --- Imports dos Componentes (Se algum não existir, crie um arquivo vazio temporário) ---
import ProdutoList from './features/produto/ProdutoList.jsx'; 
import ProdutoForm from './features/produto/ProdutoForm.jsx';
import ProdutoEdit from './features/produto/ProdutoEdit.jsx';

import PerfilList from './features/perfil/PerfilList.jsx';
import PerfilForm from './features/perfil/PerfilForm.jsx';

import UsuarioList from './features/usuario/UsuarioList.jsx';
import UsuarioForm from './features/usuario/UsuarioForm.jsx';

import FornecedorList from './features/fornecedor/FornecedorList.jsx';
import FornecedorForm from './features/fornecedor/FornecedorForm.jsx';

import AlmoxarifadoList from './features/almoxarifado/AlmoxarifadoList.jsx';
import AlmoxarifadoForm from './features/almoxarifado/AlmoxarifadoForm.jsx';

import CategoriaProdutoList from './features/categoria/CategoriaProdutoList.jsx';
import CategoriaProdutoForm from './features/categoria/CategoriaProdutoForm.jsx';

import TipoOrdemDeProducaoList from './features/tiposop/TipoOrdemDeProducaoList.jsx';
import TipoOrdemDeProducaoForm from './features/tiposop/TipoOrdemDeProducaoForm.jsx';

import FaseProducaoList from './features/fasesproducao/FaseProducaoList.jsx';
import FaseProducaoForm from './features/fasesproducao/FaseProducaoForm.jsx';

import UnidadeMedidaList from './features/unidade/UnidadeMedidaList.jsx';
import UnidadeMedidaForm from './features/unidade/UnidadeMedidaForm.jsx';

import OrdemDeProducaoList from './features/producao/OrdemDeProducaoList.jsx';
import OrdemDeProducaoForm from './features/producao/OrdemDeProducaoForm.jsx';

const Placeholder = ({ title }) => <div style={{padding: '20px'}}><h1>{title}</h1><p>Módulo em desenvolvimento.</p></div>;

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
          
          <Route path="/" element={<Placeholder title="Dashboard" />} />
          
          <Route path="/estoque/produtos" element={<ProdutoList />} />
          <Route path="/estoque/produtos/novo" element={<ProdutoForm />} /> 
          <Route path="/estoque/produtos/editar/:id" element={<ProdutoEdit />} />
          <Route path="/estoque/movimentacoes" element={<Placeholder title="Movimentações de Estoque" />} />

          <Route path="/producao/op" element={<OrdemDeProducaoList />} />
          <Route path="/producao/op/novo" element={<OrdemDeProducaoForm />} />
          <Route path="/producao/op/editar/:id" element={<OrdemDeProducaoForm />} />
          <Route path="/producao/lotes" element={<Placeholder title="Gerenciamento de Lotes" />} />

          <Route path="/engenharia/fichas-tecnicas" element={<Placeholder title="Fichas Técnicas" />} />
          <Route path="/engenharia/fichas-tecnicas/novo" element={<Placeholder title="Nova Ficha Técnica" />} />
          <Route path="/engenharia/roteiros" element={<Placeholder title="Roteiros de Produção" />} />

          <Route path="/fabrica/consultar-op" element={<Placeholder title="Chão de Fábrica: Consulta OP" />} />
          <Route path="/fabrica/movimentacoes" element={<Placeholder title="Chão de Fábrica: Apontamentos" />} />

          <Route path="/relatorios/movimentacoes" element={<Placeholder title="Relatório: Movimentações" />} />
          <Route path="/relatorios/estoque" element={<Placeholder title="Relatório: Posição de Estoque" />} />
          <Route path="/relatorios/producao" element={<Placeholder title="Relatório: Produção" />} />
          <Route path="/relatorios/clientes" element={<Placeholder title="Relatório: Clientes" />} />

          <Route path="/settings/cadastros/fornecedores" element={<FornecedorList />} />
          <Route path="/settings/cadastros/fornecedores/novo" element={<FornecedorForm />} />
          <Route path="/settings/cadastros/fornecedores/editar/:id" element={<FornecedorForm />} />

          <Route path="/settings/cadastros/categorias" element={<CategoriaProdutoList />} />
          <Route path="/settings/cadastros/categorias/novo" element={<CategoriaProdutoForm />} />
          <Route path="/settings/cadastros/categorias/editar/:id" element={<CategoriaProdutoForm />} />

          <Route path="/settings/cadastros/unidades" element={<UnidadeMedidaList />} />
          <Route path="/settings/cadastros/unidades/novo" element={<UnidadeMedidaForm />} />
          <Route path="/settings/cadastros/unidades/editar/:id" element={<UnidadeMedidaForm />} />

          <Route path="/settings/cadastros/almoxarifados" element={<AlmoxarifadoList />} />
          <Route path="/settings/cadastros/almoxarifados/novo" element={<AlmoxarifadoForm />} />
          <Route path="/settings/cadastros/almoxarifados/editar/:id" element={<AlmoxarifadoForm />} />

          <Route path="/settings/cadastros/tiposop" element={<TipoOrdemDeProducaoList />} />
          <Route path="/settings/cadastros/tiposop/novo" element={<TipoOrdemDeProducaoForm />} />
          <Route path="/settings/cadastros/tiposop/editar/:id" element={<TipoOrdemDeProducaoForm />} />

          <Route path="/settings/cadastros/fases" element={<FaseProducaoList />} />
          <Route path="/settings/cadastros/fases/novo" element={<FaseProducaoForm />} />
          <Route path="/settings/cadastros/fases/editar/:id" element={<FaseProducaoForm />} />

          <Route path="/settings/usuarios" element={<UsuarioList />} />
          <Route path="/settings/usuarios/novo" element={<UsuarioForm />} />
          <Route path="/settings/usuarios/editar/:id" element={<UsuarioForm />} /> 

          <Route path="/settings/perfis" element={<PerfilList />} />
          <Route path="/settings/perfis/novo" element={<PerfilForm />} /> 
          <Route path="/settings/perfis/editar/:id" element={<PerfilForm />} /> 

          <Route path="/settings/sistema/logs" element={<Placeholder title="Logs do Sistema" />} />
          <Route path="/settings/sistema/auditoria" element={<Placeholder title="Auditoria" />} />

        </Route>
      </Route>
      
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;