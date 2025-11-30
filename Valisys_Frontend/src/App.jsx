import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './features/auth/Login.jsx'; 
import Layout from './components/Layout.jsx'; 
import useAuthStore from './stores/useAuthStore.js'; 

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

import RelatorioMovimentacoes from './features/relatorios/RelatorioMovimentacoes.jsx';
import RelatorioProdutos from './features/relatorios/RelatorioProdutos.jsx';

import FichaTecnicaList from './features/fichatecnica/FichaTecnicaList.jsx';
import FichaTecnicaForm from './features/fichatecnica/FichaTecnicaForm.jsx';
import FichaTecnicaDetails from './features/fichatecnica/FichaTecnicaDetails.jsx'

import RoteiroList from './features/roteiro/RoteiroList.jsx';
import RoteiroForm from './features/roteiro/RoteiroForm.jsx';

import EstoqueAcabado from './features/estoque/EstoqueAcabado.jsx';
import KanbanProducao from './features/producao/KanbanProducao.jsx';

import Dashboard from './features/dashboard/Dashboard.jsx';

import LoteList from './features/lote/LoteList.jsx';
import LoteForm from './features/lote/LoteForm.jsx';

import ConsultaOP from './features/fabrica/ConsultaOP.jsx';
import RelatorioProducao from './features/relatorios/RelatorioProducao.jsx';
import LogList from './features/logs/LogList.jsx';

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
          
          <Route path="/" element={<Dashboard />} />
          
          <Route path="/estoque/produtos" element={<ProdutoList />} />
          <Route path="/estoque/produtos/novo" element={<ProdutoForm />} /> 
          <Route path="/estoque/produtos/editar/:id" element={<ProdutoEdit />} />
          <Route path="/estoque/movimentacoes" element={<Placeholder title="Movimentações de Estoque" />} />

          <Route path="/producao/op" element={<OrdemDeProducaoList />} />
          <Route path="/producao/op/novo" element={<OrdemDeProducaoForm />} />
          <Route path="/producao/op/editar/:id" element={<OrdemDeProducaoForm />} />

          <Route path="/engenharia/fichas-tecnicas" element={<FichaTecnicaList />} />
          <Route path="/engenharia/fichas-tecnicas/novo" element={<FichaTecnicaForm />} />
          <Route path="/engenharia/fichas-tecnicas/editar/:id" element={<FichaTecnicaForm />} />
          <Route path="/engenharia/fichas-tecnicas/visualizar/:id" element={<FichaTecnicaDetails />} />
          
          <Route path="/engenharia/roteiros" element={<RoteiroList />} />
          <Route path="/engenharia/roteiros/novo" element={<RoteiroForm />} />
          <Route path="/engenharia/roteiros/editar/:id" element={<RoteiroForm />} />

          <Route path="/estoque/acabados" element={<EstoqueAcabado />} />
          <Route path="/fabrica/movimentacoes" element={<Placeholder title="Chão de Fábrica: Apontamentos" />} />

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

          <Route path="/settings/sistema/logs" element={<LogList />} />
          <Route path="/settings/sistema/auditoria" element={<Placeholder title="Auditoria" />} />

          <Route path="/producao/lotes" element={<LoteList />} />
          <Route path="/producao/lotes/novo" element={<LoteForm />} />
          <Route path="/producao/lotes/editar/:id" element={<LoteForm />} />

          <Route path="/relatorios/movimentacoes" element={<RelatorioMovimentacoes />} />
          
          <Route path="/relatorios/estoque" element={<RelatorioProdutos />} /> 
          
          <Route path="/relatorios/producao" element={<RelatorioProducao />} />
          <Route path="/relatorios/clientes" element={<Placeholder title="Relatório: Clientes" />} />

          <Route path="/fabrica/kanban" element={<KanbanProducao />} />
          <Route path="/fabrica/consultar-op" element={<ConsultaOP />} />

          <Route path="/settings/cadastros/fases" element={<FaseProducaoList />} />
          <Route path="/settings/cadastros/fases/novo" element={<FaseProducaoForm />} />

        </Route>
      </Route>
      
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;