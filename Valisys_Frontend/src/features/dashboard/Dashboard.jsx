import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Activity, CheckCircle, Box, Layers, AlertCircle } from 'lucide-react';
import dashboardService from '../../services/dashboardService';
import './Dashboard.css'; 

function DashboardCard({ title, value, icon: Icon, color, subText }) {
  return (
    <div 
      className="stat-card" 
      style={{ borderLeftColor: color }} 
    >
      <div className="stat-info">
        <span className="stat-label">{title}</span>
        <h2>{value}</h2>
        {subText && <small className="stat-subtext">{subText}</small>}
      </div>
      <div 
        className="stat-icon-wrapper" 
        style={{ backgroundColor: `${color}20`, color: color }}
      >
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
  
  if (isError || !stats) return (
    <div className="page-container">
       <div className="error-message">
         <AlertCircle size={24} />
         <span>Erro ao carregar dados do painel ou serviço indisponível.</span>
       </div>
    </div>
  );

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard de Produção</h1>
        <span>Visão geral em tempo real</span>
      </div>

      <div className="stats-grid">
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

      <div className="charts-grid">
        
        <div className="chart-card">
          <h3 className="chart-header">
             Gargalos de Produção 
             <small style={{fontWeight: 'normal', fontSize: '0.8rem', color: '#666'}}>(Qtd. por Fase)</small>
          </h3>
          
          <div className="chart-wrapper">
            {stats.opsPorFase && stats.opsPorFase.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                    data={stats.opsPorFase} 
                    layout="vertical" 
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                  <XAxis type="number" allowDecimals={false} stroke="#6b7280" fontSize={12} />
                  <YAxis dataKey="nome" type="category" width={100} tick={{fontSize: 11}} stroke="#6b7280" />
                  <Tooltip 
                    cursor={{fill: 'rgba(0,0,0,0.05)'}} 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}} 
                  />
                  <Bar dataKey="valor" name="Ordens" fill="#2563eb" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-chart-state">
                  Nenhuma O.P. ativa no momento.
              </div>
            )}
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-header">
             Entregas Mensais 
             <small style={{fontWeight: 'normal', fontSize: '0.8rem', color: '#666'}}>(Últimos 6 meses)</small>
          </h3>
          
          <div className="chart-wrapper">
             {stats.opsPorMes && stats.opsPorMes.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.opsPorMes} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="nome" tick={{fontSize: 12}} stroke="#6b7280" />
                  <YAxis allowDecimals={false} stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    cursor={{fill: 'rgba(0,0,0,0.05)'}} 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}} 
                  />
                  <Legend />
                  <Bar dataKey="valor" name="Concluídas" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
             ) : (
               <div className="empty-chart-state">
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