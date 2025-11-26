import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Activity, CheckCircle, Box, Layers, AlertCircle } from 'lucide-react';
import dashboardService from '../../services/dashboardService';
import '../../features/produto/ProdutoList.css'; 

function DashboardCard({ title, value, icon: Icon, color, subText }) {
  return (
    <div className="card" style={{ 
      padding: '20px', 
      backgroundColor: 'white', 
      borderRadius: '10px', 
      borderLeft: `5px solid ${color}`,
      boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      minWidth: 0 
    }}>
      <div>
        <span style={{ color: '#666', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase' }}>{title}</span>
        <h2 style={{ margin: '5px 0', fontSize: '2rem', color: '#333' }}>{value}</h2>
        {subText && <small style={{ color: '#999' }}>{subText}</small>}
      </div>
      <div style={{ 
        backgroundColor: `${color}20`, 
        padding: '12px', 
        borderRadius: '50%',
        color: color 
      }}>
        <Icon size={28} />
      </div>
    </div>
  );
}

function Dashboard() {
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardService.getStats,
    refetchInterval: 30000
  });

  if (isLoading) return <div className="loading-message">Carregando dashboard...</div>;
  if (isError || !stats) return <div className="error-message">Erro ao carregar dados do painel ou serviço indisponível.</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Dashboard de Produção</h1>
        <span style={{ fontSize: '0.9rem', color: '#666' }}>Visão geral em tempo real</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <DashboardCard 
          title="O.Ps em Produção" 
          value={stats.totalOpsAtivas} 
          icon={Activity} 
          color="#2563eb" 
          subText="Ordens ativas no momento"
        />
        <DashboardCard 
          title="O.Ps Finalizadas" 
          value={stats.totalOpsFinalizadas} 
          icon={CheckCircle} 
          color="#16a34a" 
          subText="Total histórico concluído"
        />
        <DashboardCard 
          title="Lotes em Processo" 
          value={stats.totalLotesAtivos} 
          icon={Layers} 
          color="#f59e0b" 
          subText="Chassis sendo trabalhados"
        />
        <DashboardCard 
          title="Produtos Cadastrados" 
          value={stats.totalProdutos} 
          icon={Box} 
          color="#9333ea" 
          subText="Catálogo ativo"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        
        <div className="card" style={{ padding: '20px', backgroundColor: 'white', borderRadius: '10px', border: '1px solid var(--border-color)', minWidth: 0 }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#333', display: 'flex', alignItems: 'center', gap: '10px' }}>
             Gargalos de Produção <small style={{fontWeight: 'normal', fontSize: '0.8rem', color: '#666'}}>(Qtd. por Fase)</small>
          </h3>
          
          <div style={{ width: '100%', height: 300, position: 'relative' }}>
            {stats.opsPorFase && stats.opsPorFase.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.opsPorFase} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis dataKey="nome" type="category" width={120} tick={{fontSize: 12}} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px'}} />
                  <Bar dataKey="valor" name="Ordens" fill="#2563eb" radius={[0, 4, 4, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state" style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  Nenhuma O.P. ativa no momento.
              </div>
            )}
          </div>
        </div>

        <div className="card" style={{ padding: '20px', backgroundColor: 'white', borderRadius: '10px', border: '1px solid var(--border-color)', minWidth: 0 }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>
             Entregas Mensais <small style={{fontWeight: 'normal', fontSize: '0.8rem', color: '#666'}}>(Últimos 6 meses)</small>
          </h3>
          
          <div style={{ width: '100%', height: 300, position: 'relative' }}>
             {stats.opsPorMes && stats.opsPorMes.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.opsPorMes}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="nome" tick={{fontSize: 12}} />
                  <YAxis allowDecimals={false} />
                  <Tooltip contentStyle={{borderRadius: '8px'}} />
                  <Legend />
                  <Bar dataKey="valor" name="Concluídas" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
             ) : (
               <div className="empty-state" style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                   Nenhuma produção finalizada no período.
               </div>
             )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;