import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Monitoring } from './components/Monitoring';
import { Admission } from './components/Admission';
import { Priority } from './components/Priority';
import { KillConfigView } from './components/KillConfig';
import { ReservationView } from './components/Reservation';
import { ClusterStats, GPUModel, PriorityRule, KillConfig, Reservation } from './types';
import { Bell, Search, User } from 'lucide-react';

const INITIAL_MODELS: GPUModel[] = [
  { 
    id: '1', 
    name: 'NVIDIA G5', 
    clusterName: 'CLUSTER-A',
    totalCards: 512, 
    usedCards: 420, 
    isAdmitted: true, 
    trainingEnabled: true, 
    inferenceEnabled: true, 
    trainingLimit: 5000, 
    inferenceLimit: 2000,
    predicted7dCardHours: 85000,
    reservedCardHours: 72000,
    consumedCardHours: 68000,
    guaranteeRate: 94.4
  },
  { 
    id: '2', 
    name: 'NVIDIA G1', 
    clusterName: 'CLUSTER-A',
    totalCards: 256, 
    usedCards: 180, 
    isAdmitted: true, 
    trainingEnabled: true, 
    inferenceEnabled: false, 
    trainingLimit: 3000, 
    inferenceLimit: 0,
    predicted7dCardHours: 42000,
    reservedCardHours: 35000,
    consumedCardHours: 32000,
    guaranteeRate: 91.4
  },
  { 
    id: '3', 
    name: 'ASCEND910', 
    clusterName: 'CLUSTER-B',
    totalCards: 1024, 
    usedCards: 300, 
    isAdmitted: true, 
    trainingEnabled: false, 
    inferenceEnabled: true, 
    trainingLimit: 0, 
    inferenceLimit: 5000,
    predicted7dCardHours: 172000,
    reservedCardHours: 150000,
    consumedCardHours: 142000,
    guaranteeRate: 94.6
  },
  { 
    id: '4', 
    name: 'ASCEND HC', 
    clusterName: 'CLUSTER-C',
    totalCards: 2048, 
    usedCards: 1500, 
    isAdmitted: false, 
    trainingEnabled: false, 
    inferenceEnabled: false, 
    trainingLimit: 0, 
    inferenceLimit: 0,
    predicted7dCardHours: 344000,
    reservedCardHours: 300000,
    consumedCardHours: 280000,
    guaranteeRate: 93.3
  },
];

const INITIAL_RULES: PriorityRule[] = [
  { id: 'r1', queueName: 'elas-llm-train-01', effectiveUser: 'bjliwenjuan', priority: 'P0', effectiveTime: '2026-03-19 10:00', operator: 'sunxiaodong' },
  { id: 'r2', queueName: 'elas-search-dev-02', effectiveUser: 'zhangsan_01', priority: 'P1', effectiveTime: '2026-03-18 15:30', operator: 'sunxiaodong' },
  { id: 'r3', queueName: 'elas-autodrive-test', effectiveUser: 'lisi_02', priority: 'P2', effectiveTime: '2026-03-17 09:00', operator: 'admin_melody' },
];

const INITIAL_RESERVATIONS: Reservation[] = [
  { 
    id: 'res1', 
    queueName: 'elas-llm-oxygen-studiolfga', 
    modelId: '1', 
    modelName: 'NVIDIA A100 (80GB)', 
    startTime: '2026-03-20 00:00', 
    endTime: '2026-03-25 23:59', 
    cardHours: 5000, 
    status: 'pending' 
  },
  { 
    id: 'res2', 
    queueName: 'elas-ea-search-up-devlfga', 
    modelId: '2', 
    modelName: 'NVIDIA H100', 
    startTime: '2026-03-18 08:00', 
    endTime: '2026-03-22 18:00', 
    cardHours: 2400, 
    status: 'active' 
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [models, setModels] = useState<GPUModel[]>(INITIAL_MODELS);
  const [rules, setRules] = useState<PriorityRule[]>(INITIAL_RULES);
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS);
  const [killConfig, setKillConfig] = useState<KillConfig>({
    threshold: 15,
    gracePeriod: 30,
    enabled: true,
    whitelistQueues: ['elas-llm-train-01', 'elas-search-dev-02']
  });

  const [stats, setStats] = useState<ClusterStats>({
    totalCardHours: 125000,
    usedCardHours: 82400,
    availableCardHours: 42600,
    models: INITIAL_MODELS
  });

  // Update stats when models change
  useEffect(() => {
    const totalPredicted = models.reduce((acc, m) => acc + m.predicted7dCardHours, 0);
    const totalUsed = models.reduce((acc, m) => acc + m.usedCards * 24, 0); // Keep mock usage for now
    setStats({
      totalCardHours: totalPredicted,
      usedCardHours: totalUsed,
      availableCardHours: totalPredicted - totalUsed,
      models: models
    });
  }, [models]);

  const handleUpdateModel = (id: string, updates: Partial<GPUModel>) => {
    setModels(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const handleAddRule = (rule: Omit<PriorityRule, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setRules(prev => [...prev, { ...rule, id }]);
  };

  const handleDeleteRule = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
  };

  const handleAddReservation = (res: Omit<Reservation, 'id' | 'status'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const modelName = models.find(m => m.id === res.modelId)?.name || 'Unknown';
    setReservations(prev => [...prev, { ...res, id, modelName, status: 'pending' }]);
  };

  const handleDeleteReservation = (id: string) => {
    setReservations(prev => prev.filter(r => r.id !== id));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Monitoring stats={stats} />;
      case 'admission': return <Admission models={models} onUpdate={handleUpdateModel} />;
      case 'priority': return <Priority rules={rules} onAdd={handleAddRule} onDelete={handleDeleteRule} />;
      case 'reservation': return <ReservationView reservations={reservations} models={models} onAdd={handleAddReservation} onDelete={handleDeleteReservation} />;
      case 'kill-config': return <KillConfigView config={killConfig} onChange={setKillConfig} />;
      default: return <Monitoring stats={stats} />;
    }
  };

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return '算力实时监控';
      case 'admission': return '型号准入管理';
      case 'priority': return '优先级策略';
      case 'reservation': return '卡时预留配置';
      case 'kill-config': return '自动化查杀';
      default: return '弹性算力运营系统';
    }
  };

  return (
    <div className="flex min-h-screen bg-bg-dark selection:bg-brand-primary/30">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-black/20 backdrop-blur-sm sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-white tracking-tight">{getTitle()}</h2>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              CLUSTER-01 ONLINE
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-primary transition-colors" />
              <input 
                type="text" 
                placeholder="搜索任务、型号或用户..." 
                className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/20 w-64 transition-all"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-secondary rounded-full border-2 border-bg-dark" />
              </button>
              <div className="h-8 w-px bg-white/10" />
              <button className="flex items-center gap-3 pl-2 group">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-white group-hover:text-brand-primary transition-colors">Admin_Melody</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Product Manager</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border border-white/10 flex items-center justify-center overflow-hidden">
                  <User className="text-slate-400" size={20} />
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 overflow-y-auto">
          {renderContent()}
        </div>

        {/* Footer Info */}
        <footer className="mt-auto p-8 border-t border-white/5 flex justify-between items-center text-[10px] text-slate-600 font-mono uppercase tracking-widest">
          <div className="flex gap-6">
            <span>System Version: v2.4.0-stable</span>
            <span>Last Sync: {new Date().toLocaleTimeString()}</span>
          </div>
          <div>
            © 2026 弹性算力运营系统 (9N-Computing power). ALL RIGHTS RESERVED.
          </div>
        </footer>
      </main>
    </div>
  );
}
