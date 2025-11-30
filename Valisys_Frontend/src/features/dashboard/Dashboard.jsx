import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Activity, CheckCircle, Clock, AlertTriangle, ArrowRightLeft, User, 
  Calendar, AlertCircle
} from 'lucide-react';
import dashboardService from '../../services/dashboardService';
import './Dashboard.css'; 

function DashboardCard({ title, value, icon: Icon, color, subText, isCritical }) {
  return (
    <div className={`stat-card ${isCritical ? 'critical-card' : ''}`} style={{ borderLeftColor: color }}>
      <div className="stat-content">
        <div className="stat-header">
            <span className="stat-label" style={{color: isCritical ? 'var(--color-danger)' : color}}>{title}</span>
            <div className="stat-icon-bg" style={{ backgroundColor: `${color}15`, color: color }}>
                <Icon size={24} />
            </div>
        </div>
        <h2 className="stat-value">{value}</h2>
        {subText && <small className="stat-subtext">{subText}</small>}
      </div>
    </div>
  );
}

function Dashboard() {
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardService.getStats,
    refetchInterval: 15000 
  });

  if (isLoading) return <div className="loading-message"><Activity className="animate-spin"/> Carregando painel de controle...</div>;
  
  if (isError || !stats) return (
    <div className="page-container">
       <div className="error-message">
         <AlertCircle size={24} />
         <span>Sistema offline ou erro ao carregar indicadores.</span>
       </div>
    </div>
  );

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
            <h1>Controle de Produção</h1>
            <span>Indicadores de performance e alertas</span>
        </div>
        <div className="last-update">
            <div className="pulse-dot"></div>
            Tempo Real
        </div>
      </div>

      <div className="stats-grid">
        <DashboardCard 
          title="Em Produção" 
          value={stats.totalOpsAtivas} 
          icon={Activity} 
          color="#2563eb" 
          subText="Ordens ativas na fábrica"
        />
        <DashboardCard 
          title="Ordens em Atraso" 
          value={stats.totalOpsAtrasadas} 
          icon={AlertTriangle} 
          color="#dc2626" 
          subText="Precisam de atenção imediata"
          isCritical={stats.totalOpsAtrasadas > 0}
        />
        <DashboardCard 
          title="Lead Time Médio" 
          value={`${stats.tempoMedioProducao ? stats.tempoMedioProducao.toFixed(1) : 0} dias`} 
          icon={Clock} 
          color="#0891b2" 
          subText="Eficiência de entrega"
        />
        <DashboardCard 
          title="Finalizadas (Total)" 
          value={stats.totalOpsFinalizadas} 
          icon={CheckCircle} 
          color="#16a34a" 
          subText="Ordens concluídas com sucesso"
        />
      </div>

      <div className="dashboard-main-layout">
        
        <div className="charts-column">
            <div className="chart-card">
              <div className="chart-header-wrapper">
                  <h3>Gargalos de Produção</h3>
                  <span className="chart-badge">Por Fase Atual</span>
              </div>
              <div className="chart-wrapper">
                {stats.opsPorFase && stats.opsPorFase.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                        data={stats.opsPorFase} 
                        layout="vertical" 
                        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border-color)" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="nome" type="category" width={130} tick={{fontSize: 11, fill: 'var(--text-secondary)', fontWeight: 500}} />
                      <Tooltip 
                        cursor={{fill: 'transparent'}}
                        contentStyle={{
                            borderRadius: '8px', 
                            border: '1px solid var(--border-color)', 
                            backgroundColor: 'var(--bg-secondary)',
                            color: 'var(--text-primary)'
                        }} 
                      />
                      <Bar dataKey="valor" name="Qtd. Ordens" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="empty-chart-state">Nenhuma O.P em andamento.</div>
                )}
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header-wrapper">
                  <h3>Entregas Realizadas</h3>
                  <span className="chart-badge">Últimos 6 Meses</span>
              </div>
              <div className="chart-wrapper">
                 {stats.opsPorMes && stats.opsPorMes.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.opsPorMes} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                      <XAxis dataKey="nome" tick={{fontSize: 12, fill: 'var(--text-secondary)'}} axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--text-secondary)'}} />
                      <Tooltip 
                        cursor={{fill: 'var(--bg-tertiary)'}}
                        contentStyle={{
                            borderRadius: '8px', 
                            border: '1px solid var(--border-color)', 
                            backgroundColor: 'var(--bg-secondary)',
                            color: 'var(--text-primary)'
                        }} 
                      />
                      <Bar dataKey="valor" name="Entregas" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                 ) : (
                   <div className="empty-chart-state">Sem histórico recente.</div>
                 )}
              </div>
            </div>
        </div>

        <div className="side-column">
            <div className="info-panel alert-panel">
                <div className="panel-header">
                    <AlertTriangle size={20} className="text-danger" />
                    <h3>Ordens Críticas (Atrasadas)</h3>
                </div>
                <div className="panel-content">
                    {stats.ordensCriticas && stats.ordensCriticas.length > 0 ? (
                        <ul className="alert-list">
                            {stats.ordensCriticas.map((op, idx) => (
                                <li key={idx} className="alert-item">
                                    <div className="alert-main">
                                        <span className="op-code-alert">{op.codigo}</span>
                                        <span className="op-prod-alert">{op.produto}</span>
                                    </div>
                                    <div className="alert-meta">
                                        <span className="fase-tag">{op.fase}</span>
                                        <span className="delay-tag">+{op.diasAtraso} dias</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="empty-panel">
                            <CheckCircle size={32} className="text-success" style={{marginBottom: 10}} />
                            <p>Tudo no prazo!</p>
                            <small>Nenhuma ordem atrasada.</small>
                        </div>
                    )}
                </div>
            </div>

            <div className="info-panel">
                <div className="panel-header">
                    <ArrowRightLeft size={20} className="text-primary" />
                    <h3>Atividades Recentes</h3>
                </div>
                <div className="panel-content">
                    {stats.ultimasMovimentacoes && stats.ultimasMovimentacoes.length > 0 ? (
                        <div className="timeline">
                            {stats.ultimasMovimentacoes.map((mov, idx) => (
                                <div key={idx} className="timeline-item">
                                    <div className={`timeline-marker ${mov.tipo === 'Produção' ? 'marker-prod' : 'marker-stock'}`}></div>
                                    <div className="timeline-content">
                                        <p className="timeline-desc">{mov.descricao}</p>
                                        <div className="timeline-meta">
                                            <span className="time">
                                                <Calendar size={10} style={{marginRight:3}}/>
                                                {new Date(mov.data).toLocaleDateString()} {new Date(mov.data).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </div>
                                        <div className="timeline-user">
                                            <User size={10} /> {mov.usuario}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-panel">Sem atividades recentes.</div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;