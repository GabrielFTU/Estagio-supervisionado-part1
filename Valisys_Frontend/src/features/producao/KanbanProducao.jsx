import React, { useState, useEffect, useMemo, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    Loader2, Calendar, Package, Hash, AlertCircle, Filter, Search, X, 
    Settings, Eye, EyeOff, ArrowUp, ArrowDown, Route as RouteIcon 
} from 'lucide-react';
import ordemDeProducaoService from '../../services/ordemDeProducaoService.js';
import faseProducaoService from '../../services/faseProducaoService.js';
import produtoService from '../../services/produtoService.js';
import roteiroProducaoService from '../../services/roteiroProducaoService.js';
import './Kanban.css';

const normalizarStatus = (status) => {
    if (status === 1 || status === '1') return 'Ativa';
    if (status === 2 || status === '2') return 'Aguardando';
    if (status === 3 || status === '3') return 'Finalizada';
    if (status === 4 || status === '4') return 'Cancelada';
    return status; 
};

function KanbanProducao() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [columnConfig, setColumnConfig] = useState([]);
  const [showConfigMenu, setShowConfigMenu] = useState(false);
  const configMenuRef = useRef(null);

  const { data: ordensRaw, isLoading: loadingOrdens } = useQuery({ 
    queryKey: ['ordensDeProducao'], 
    queryFn: ordemDeProducaoService.getAll,
    refetchInterval: 10000 
  });

  const { data: fasesRaw, isLoading: loadingFases } = useQuery({ 
    queryKey: ['fasesProducao'], 
    queryFn: faseProducaoService.getAll 
  });

  const { data: produtos } = useQuery({ 
    queryKey: ['produtos'], 
    queryFn: produtoService.getAll 
  });

  const { data: roteiros } = useQuery({ 
    queryKey: ['roteirosProducao'], 
    queryFn: roteiroProducaoService.getAll 
  });

  const [boardData, setBoardData] = useState({});

  useEffect(() => {
      if (fasesRaw && columnConfig.length === 0) {
          const initialConfig = [...fasesRaw]
              .filter(f => f.ativo)
              .sort((a, b) => a.ordem - b.ordem)
              .map(f => ({
                  id: (f.id || f.Id).toLowerCase(),
                  nome: f.nome || f.Nome,
                  descricao: f.descricao,
                  visible: true
              }));
          setColumnConfig(initialConfig);
      } else if (fasesRaw && columnConfig.length > 0) {
          const localIds = columnConfig.map(c => c.id);
          const newPhases = fasesRaw
              .filter(f => f.ativo && !localIds.includes((f.id || f.Id).toLowerCase()))
              .map(f => ({
                  id: (f.id || f.Id).toLowerCase(),
                  nome: f.nome || f.Nome,
                  descricao: f.descricao,
                  visible: true
              }));
          
          if (newPhases.length > 0) {
              setColumnConfig(prev => [...prev, ...newPhases]);
          }
      }
  }, [fasesRaw, columnConfig.length]);

  useEffect(() => {
      if (!roteiros || columnConfig.length === 0) return;

      if (selectedProduct) {
          const roteiro = roteiros.find(r => (r.produtoId === selectedProduct || r.ProdutoId === selectedProduct) && r.ativo);
          
          if (roteiro && roteiro.etapas) {
              const fasesDoRoteiro = roteiro.etapas.map(e => (e.faseProducaoId || e.FaseProducaoId).toLowerCase());
              
              setColumnConfig(prevConfig => prevConfig.map(col => ({
                  ...col,
                  visible: fasesDoRoteiro.includes(col.id)
              })));
          } else {
              setColumnConfig(prevConfig => prevConfig.map(col => ({ ...col, visible: true })));
          }
      } else {
          setColumnConfig(prevConfig => prevConfig.map(col => ({ ...col, visible: true })));
      }
  }, [selectedProduct, roteiros]); 
  useEffect(() => {
      const handleClickOutside = (event) => {
          if (configMenuRef.current && !configMenuRef.current.contains(event.target)) {
              setShowConfigMenu(false);
          }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const moveCardMutation = useMutation({
    mutationFn: ({ ordemId, novaFaseId }) => ordemDeProducaoService.trocarFase(ordemId, novaFaseId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ordensDeProducao'] }),
    onError: (err) => {
        alert(`Erro ao mover: ${err.response?.data?.message || err.message}`);
        queryClient.invalidateQueries({ queryKey: ['ordensDeProducao'] });
    }
  });

  useEffect(() => {
    if (ordensRaw && columnConfig.length > 0) {
      const grouped = {};
      
      columnConfig.forEach(col => {
        grouped[col.id] = [];
      });

      ordensRaw.forEach(o => {
          const rawStatus = o.status !== undefined ? o.status : o.Status;
          const status = normalizarStatus(rawStatus);
          const faseIdRaw = o.faseAtualId || o.FaseAtualId;
          
          if (!faseIdRaw) return;

          const faseId = faseIdRaw.toLowerCase();

          if (selectedProduct && (o.produtoId || o.ProdutoId) !== selectedProduct) return;
          
          if (searchTerm) {
              const term = searchTerm.toLowerCase();
              const match = (o.codigoOrdem?.toLowerCase().includes(term)) ||
                            (o.produtoNome?.toLowerCase().includes(term)) ||
                            (o.loteNumero?.toLowerCase().includes(term));
              if (!match) return;
          }

          if (status === 'Ativa' || status === 'Aguardando') {
              if (grouped.hasOwnProperty(faseId)) {
                  grouped[faseId].push({
                      ...o,
                      id: (o.id || o.Id).toString(),
                      codigoOrdem: o.codigoOrdem || o.CodigoOrdem,
                      produtoNome: o.produtoNome || o.ProdutoNome,
                      quantidade: o.quantidade || o.Quantidade,
                      dataInicio: o.dataInicio || o.DataInicio,
                      roteiroCodigo: o.roteiroCodigo || o.RoteiroCodigo,
                      loteNumero: o.loteNumero || o.LoteNumero,
                      status: status,
                      faseAtualId: faseId
                  });
              }
          }
      });
      
      setBoardData(grouped);
    }
  }, [ordensRaw, columnConfig, selectedProduct, searchTerm]);

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceColId = source.droppableId;
    const destColId = destination.droppableId;
    
    const sourceItems = [...(boardData[sourceColId] || [])];
    const destItems = [...(boardData[destColId] || [])];
    
    const [movedItem] = sourceItems.splice(source.index, 1);
    movedItem.faseAtualId = destColId; 
    
    if (sourceColId === destColId) {
        sourceItems.splice(destination.index, 0, movedItem);
        setBoardData(prev => ({ ...prev, [sourceColId]: sourceItems }));
    } else {
        destItems.splice(destination.index, 0, movedItem);
        setBoardData(prev => ({
            ...prev,
            [sourceColId]: sourceItems,
            [destColId]: destItems
        }));
        
        moveCardMutation.mutate({ ordemId: draggableId, novaFaseId: destColId });
    }
  };

  const toggleColumnVisibility = (index) => {
      const newConfig = [...columnConfig];
      newConfig[index].visible = !newConfig[index].visible;
      setColumnConfig(newConfig);
  };

  const moveColumn = (index, direction) => {
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= columnConfig.length) return;
      
      const newConfig = [...columnConfig];
      const temp = newConfig[index];
      newConfig[index] = newConfig[newIndex];
      newConfig[newIndex] = temp;
      setColumnConfig(newConfig);
  };

  if (loadingOrdens || loadingFases) return <div className="loading-center"><Loader2 className="animate-spin" /> Carregando Kanban...</div>;

  const visibleColumns = columnConfig.filter(c => c.visible);

  return (
    <div className="kanban-page">
      <div className="kanban-toolbar">
        <div className="header-section">
            <div className="header-title">
                <h1 style={{ color: 'var(--text-primary)' }}>Quadro de Produção</h1>
                <span className="live-badge">Ao Vivo</span>
            </div>
            
            <div className="config-wrapper" ref={configMenuRef}>
                <button 
                    className={`btn-config ${showConfigMenu ? 'active' : ''}`} 
                    onClick={() => setShowConfigMenu(!showConfigMenu)}
                    title="Configurar Colunas"
                >
                    <Settings size={20} />
                </button>

                {showConfigMenu && (
                    <div className="config-dropdown fade-in">
                        <h4>Fases Exibidas</h4>
                        <div className="config-list">
                            {columnConfig.map((col, index) => (
                                <div key={col.id} className="config-item">
                                    <div className="config-controls">
                                        <button onClick={() => moveColumn(index, -1)} disabled={index === 0} className="btn-arrow"><ArrowUp size={14}/></button>
                                        <button onClick={() => moveColumn(index, 1)} disabled={index === columnConfig.length - 1} className="btn-arrow"><ArrowDown size={14}/></button>
                                    </div>
                                    <span className="col-name">{col.nome}</span>
                                    <button className="btn-visibility" onClick={() => toggleColumnVisibility(index)}>
                                        {col.visible ? <Eye size={16} className="text-primary"/> : <EyeOff size={16} className="text-gray"/>}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>

        <div className="filters-area">
            {selectedProduct && (
                <div className="smart-filter-badge">
                    <RouteIcon size={14} /> Filtro Inteligente: Roteiro Ativo
                </div>
            )}
            
            <div className="search-filter">
                <Search size={18} className="search-icon" />
                <input 
                    type="text" 
                    placeholder="Buscar OP..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && <X size={16} className="clear-icon" onClick={() => setSearchTerm('')} />}
            </div>

            <div className="product-filter">
                <Filter size={18} className="filter-icon" />
                <select 
                    value={selectedProduct} 
                    onChange={(e) => setSelectedProduct(e.target.value)}
                >
                    <option value="">Todos os Produtos</option>
                    {produtos?.filter(p => p.ativo).map(p => (
                        <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                </select>
            </div>
        </div>
      </div>
      
      <div className="kanban-scroll-area">
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="kanban-board">
            {visibleColumns.map((col) => {
                const cards = boardData[col.id] || [];
                return (
                    <div key={col.id} className="kanban-column">
                        <div className="column-header">
                            <div className="column-title">
                                <h3>{col.nome}</h3>
                                {col.descricao && <small>{col.descricao}</small>}
                            </div>
                            <span className="count-badge">{cards.length}</span>
                        </div>
                        <Droppable droppableId={col.id}>
                            {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`column-content ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                            >
                                {cards.map((ordem, index) => (
                                <Draggable key={ordem.id} draggableId={ordem.id} index={index}>
                                    {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`kanban-card ${snapshot.isDragging ? 'is-dragging' : ''}`}
                                        style={{ ...provided.draggableProps.style }}
                                    >
                                        <div className="card-top">
                                            <span className="op-code"><Hash size={12}/> {ordem.codigoOrdem}</span>
                                            {ordem.loteNumero && <span className="lote-tag">{ordem.loteNumero}</span>}
                                        </div>
                                        <div className="card-main">
                                            <div className="product-info">
                                                <Package size={16} color='#5A9EEC'/> 
                                                <span>{ordem.produtoNome}</span>
                                            </div>
                                            <div className="card-metrics">
                                                <div className="metric">
                                                    <span className="label">Qtd</span>
                                                    <span className="value">{ordem.quantidade}</span>
                                                </div>
                                                <div className="metric">
                                                    <span className="label">Início</span>
                                                    <span className="value flex-center">
                                                        <Calendar size={10} style={{marginRight: '3px'}}/> 
                                                        {new Date(ordem.dataInicio).toLocaleDateString().slice(0,5)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {ordem.status === 'Aguardando' && <div className="card-status-strip warning">Pausado</div>}
                                    </div>
                                    )}
                                </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                            )}
                        </Droppable>
                    </div>
                );
            })}
            </div>
        </DragDropContext>
      </div>
    </div>
  );
}

export default KanbanProducao;