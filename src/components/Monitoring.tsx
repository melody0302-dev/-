import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend
} from 'recharts';
import { GPUModel, ClusterStats } from '../types';
import { Cpu, Server, Activity, ArrowUpRight, ChevronDown } from 'lucide-react';

const COLORS = ['#00f2ff', '#7000ff', '#ff00c8', '#00ff8c'];

interface MonitoringProps {
  stats: ClusterStats;
}

const BASE_HISTORY_DATA = [
  { time: '00:00', used: 2500, total: 8200 },
  { time: '04:00', used: 1800, total: 7800 },
  { time: '08:00', used: 3200, total: 8100 },
  { time: '12:00', used: 3800, total: 8500 },
  { time: '16:00', used: 3500, total: 8300 },
  { time: '20:00', used: 2800, total: 8000 },
  { time: '23:59', used: 2400, total: 8200 },
];

export const Monitoring: React.FC<MonitoringProps> = ({ stats }) => {
  const [selectedModelId, setSelectedModelId] = useState<string | 'all'>('all');

  const chartData = useMemo(() => {
    let scale = 1;
    
    if (selectedModelId !== 'all') {
      const model = stats.models.find(m => m.id === selectedModelId);
      if (model) {
        const overallTotalCards = stats.models.reduce((acc, m) => acc + m.totalCards, 0);
        scale = model.totalCards / overallTotalCards;
      }
    } else {
      const totalCapacity = stats.models.reduce((acc, m) => acc + m.totalCards * 24, 0);
      scale = totalCapacity / 8000;
    }

    return BASE_HISTORY_DATA.map(d => {
      const used = Math.round(d.used * scale);
      const total = Math.round(d.total * scale);
      return {
        ...d,
        used,
        idle: Math.max(0, total - used),
        total
      };
    });
  }, [selectedModelId, stats.models]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Cpu size={80} />
          </div>
          <p className="text-slate-400 text-sm font-medium mb-1">未来7天预测总卡时</p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-bold text-white">{stats.totalCardHours.toLocaleString()}</h3>
            <span className="text-brand-primary text-xs font-mono mb-1.5 flex items-center">
              <ArrowUpRight size={12} /> +12%
            </span>
          </div>
          <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-brand-primary w-full shadow-[0_0_10px_rgba(0,242,255,0.5)]" />
          </div>
        </div>

        <div className="glass-card p-6 relative overflow-hidden group border-brand-secondary/20">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity size={80} />
          </div>
          <p className="text-slate-400 text-sm font-medium mb-1">已占用卡时</p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-bold text-white">{stats.usedCardHours.toLocaleString()}</h3>
            <span className="text-brand-secondary text-xs font-mono mb-1.5">
              {(stats.usedCardHours / stats.totalCardHours * 100).toFixed(1)}% 负载
            </span>
          </div>
          <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-secondary shadow-[0_0_10px_rgba(112,0,255,0.5)]" 
              style={{ width: `${(stats.usedCardHours / stats.totalCardHours * 100)}%` }}
            />
          </div>
        </div>

        <div className="glass-card p-6 relative overflow-hidden group border-emerald-500/20">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Server size={80} />
          </div>
          <p className="text-slate-400 text-sm font-medium mb-1">可用空闲卡时</p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-bold text-emerald-400">{stats.availableCardHours.toLocaleString()}</h3>
            <span className="text-emerald-500 text-xs font-mono mb-1.5">实时可用</span>
          </div>
          <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
              style={{ width: `${(stats.availableCardHours / stats.totalCardHours * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="space-y-6">
        <div className="glass-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-primary" />
              算力占用趋势 (24h)
            </h4>
            
            <div className="relative group">
              <select 
                value={selectedModelId}
                onChange={(e) => setSelectedModelId(e.target.value)}
                className="appearance-none bg-white/5 border border-white/10 rounded-lg px-4 py-2 pr-10 text-sm text-slate-300 focus:outline-none focus:border-brand-primary/50 cursor-pointer hover:bg-white/10 transition-all"
              >
                <option value="all">全部型号</option>
                {stats.models.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorUsed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorIdle" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(v) => `${(v/1000).toFixed(1)}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff20', borderRadius: '8px' }}
                />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  height={36}
                  iconType="circle"
                  formatter={(value) => <span className="text-xs text-slate-400 font-medium">{value}</span>}
                />
                <Area 
                  type="monotone" 
                  dataKey="used" 
                  name="被占用卡时"
                  stroke="#00f2ff" 
                  fillOpacity={0.1} 
                  fill="url(#colorUsed)" 
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="idle" 
                  name="闲置卡时"
                  stroke="#10b981" 
                  fillOpacity={0.1} 
                  fill="url(#colorIdle)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-brand-secondary" />
            型号分布明细
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-4 text-[10px] text-slate-500 uppercase tracking-widest font-medium">型号</th>
                  <th className="pb-4 text-[10px] text-slate-500 uppercase tracking-widest font-medium">集群名称</th>
                  <th className="pb-4 text-[10px] text-slate-500 uppercase tracking-widest font-medium text-right">7天预测卡时</th>
                  <th className="pb-4 text-[10px] text-slate-500 uppercase tracking-widest font-medium text-right">已预约卡时</th>
                  <th className="pb-4 text-[10px] text-slate-500 uppercase tracking-widest font-medium text-right">已消费卡时</th>
                  <th className="pb-4 text-[10px] text-slate-500 uppercase tracking-widest font-medium text-right">卡时保障率</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats.models.map((model) => (
                  <tr key={model.id} className="group hover:bg-white/5 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                          <Cpu size={14} className="text-brand-primary" />
                        </div>
                        <span className="text-sm font-medium text-white">{model.name}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-xs text-slate-400 font-mono">{model.clusterName}</span>
                    </td>
                    <td className="py-4 text-right">
                      <span className="text-sm text-slate-200 font-mono">{model.predicted7dCardHours.toLocaleString()}</span>
                    </td>
                    <td className="py-4 text-right">
                      <span className="text-sm text-slate-200 font-mono">{model.reservedCardHours.toLocaleString()}</span>
                    </td>
                    <td className="py-4 text-right">
                      <span className="text-sm text-slate-200 font-mono">{model.consumedCardHours.toLocaleString()}</span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-sm font-bold text-brand-primary">{model.guaranteeRate}%</span>
                        <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-brand-primary" 
                            style={{ width: `${model.guaranteeRate}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
