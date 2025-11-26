import React, { useState, useEffect, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Calendar, Package, Hash, AlertCircle } from 'lucide-react';
import ordemDeProducaoService from '../../services/ordemDeProducaoService.js';
import faseProducaoService from '../../services/faseProducaoService.js';
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
  
  const { data: ordensRaw, isLoading: loadingOrdens } = useQuery({ 
    queryKey: ['ordensDeProducao'], 
    queryFn: ordemDeProducaoService.getAll 
  });

  const { data: fasesRaw, isLoading: loadingFases } = useQuery({ 
    queryKey: ['fasesProducao'], 
    queryFn: faseProducaoService.getAll 
  });

  const [boardData, setBoardData] = useState({});

  const moveCardMutation = useMutation({
    mutationFn: ({ ordemId, novaFaseId }) => ordemDeProducaoService.trocarFase(ordemId, novaFaseId),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ordensDeProducao'] });
    },
    onError: (err) => {
        alert(`Erro ao mover card: ${err.response?.data?.message || err.message}`);
        queryClient.invalidateQueries({ queryKey: ['ordensDeProducao'] }); 
    }
  });

  const fasesOrdenadas = useMemo(() => {
      if (!fasesRaw) return [];
      return [...fasesRaw].sort((a, b) => a.ordem - b.ordem);
  }, [fasesRaw]);

  useEffect(() => {
    if (ordensRaw && fasesOrdenadas.length > 0) {
      const grouped = {};
      
      fasesOrdenadas.forEach(fase => {
        const key = (fase.id || fase.Id).toLowerCase();
        grouped[key] = [];
      });

      console.log("--- INÍCIO DO PROCESSAMENTO DO KANBAN ---");
      let count = 0;

      ordensRaw.forEach(o => {
          const rawStatus = o.status !== undefined ? o.status : o.Status;
          const status = normalizarStatus(rawStatus);
          
          const faseIdRaw = o.faseAtualId || o.FaseAtualId;
          
          if (!faseIdRaw) {
              console.warn(`Ordem ${o.codigoOrdem || o.CodigoOrdem} ignorada: Sem Fase definida.`);
              return;
          }

          const faseId = faseIdRaw.toLowerCase();

          // Filtro: Só mostramos Ativa e Aguardando
          if (status === 'Ativa' || status === 'Aguardando') {
              if (grouped[faseId]) {
                  grouped[faseId].push({
                      ...o,
                      id: (o.id || o.Id).toString(), // Garante ID string para o DragDrop
                      codigoOrdem: o.codigoOrdem || o.CodigoOrdem,
                      produtoNome: o.produtoNome || o.ProdutoNome,
                      quantidade: o.quantidade || o.Quantidade,
                      dataInicio: o.dataInicio || o.DataInicio,
                      roteiroCodigo: o.roteiroCodigo || o.RoteiroCodigo,
                      status: status, // Usa o status normalizado
                      faseAtualId: faseId
                  });
                  count++;
              } else {
                  console.warn(`Ordem ${o.codigoOrdem} tem uma fase (${faseId}) que não existe nas colunas.`);
              }
          }
      });
      
      console.log(`Total de ordens posicionadas no quadro: ${count}`);
      setBoardData(grouped);
    }
  }, [ordensRaw, fasesOrdenadas]);

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
        setBoardData({ ...boardData, [sourceColId]: sourceItems });
    } else {
        destItems.splice(destination.index, 0, movedItem);
        setBoardData({
            ...boardData,
            [sourceColId]: sourceItems,
            [destColId]: destItems
        });
        
        moveCardMutation.mutate({ 
            ordemId: draggableId, 
            novaFaseId: destColId 
        });
    }
  };

  if (loadingOrdens || loadingFases) return <div className="loading-center"><Loader2 className="animate-spin" /> Carregando Kanban...</div>;

  if (!loadingFases && fasesRaw?.length === 0) {
      return (
          <div className="kanban-container empty-state-container">
              <div className="empty-state">
                  <AlertCircle size={48} style={{marginBottom: '15px', color: '#f59e0b'}} />
                  <h2>Nenhuma Fase de Produção</h2>
                  <p>Cadastre as fases em Configurações {'>'} Cadastros {'>'} Fases.</p>
              </div>
          </div>
      );
  }

  return (
    <div className="kanban-container">
      <div className="kanban-header">
        <h1>Quadro de Produção (Kanban)</h1>
        <span className="badge-kanban">Visualização em Tempo Real</span>
      </div>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          {fasesOrdenadas.map((fase) => {
            const faseId = (fase.id || fase.Id).toLowerCase();
            const cards = boardData[faseId] || [];
            
            return (
                <div key={faseId} className="kanban-column">
                <div className="column-header">
                    <h3>{fase.nome || fase.Nome}</h3>
                    <span className="count">{cards.length}</span>
                </div>
                
                <Droppable droppableId={faseId}>
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
                                <div className="card-header">
                                    <span className="card-code"><Hash size={12}/> {ordem.codigoOrdem}</span>
                                    {ordem.roteiroCodigo && <span className="card-roteiro">Rot: {ordem.roteiroCodigo}</span>}
                                </div>
                                
                                <div className="card-body">
                                    <div className="product-name"><Package size={14}/> {ordem.produtoNome}</div>
                                    <div className="card-meta">
                                        <span className="qty">{ordem.quantidade} Un</span>
                                        <span className="date"><Calendar size={12}/> {new Date(ordem.dataInicio).toLocaleDateString().slice(0,5)}</span>
                                    </div>
                                    {ordem.status !== 'Ativa' && (
                                        <div style={{marginTop: '8px', fontSize: '0.75rem', color: '#f59e0b', fontWeight: 'bold'}}>
                                            {ordem.status}
                                        </div>
                                    )}
                                </div>
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
  );
}

export default KanbanProducao;