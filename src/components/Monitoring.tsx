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
import { GPUModel, ClusterStats, ElasticTask } from '../types';
import { Cpu, Server, Activity, ArrowUpRight, ChevronDown, Waves, User, Briefcase, Clock, Tag } from 'lucide-react';

const COLORS = ['#1677ff', '#ff4d4f', '#3b82f6', '#10b981'];

interface MonitoringProps {
  stats: ClusterStats;
  tasks: ElasticTask[];
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

export const Monitoring: React.FC<MonitoringProps> = ({ stats, tasks }) => {
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
      {/* Top Stats - Redesigned to match image cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold">
            <Cpu size={18} className="text-blue-500" />
            <span>未来7天预测总卡时</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-slate-900">{stats.totalCardHours.toLocaleString()}</h3>
            <span className="text-emerald-500 text-xs font-bold">+12%</span>
          </div>
          <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-full" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold">
            <Waves size={18} className="text-blue-500" />
            <span>潮汐卡时</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-slate-900">{stats.tidalCardHours.toLocaleString()}</h3>
            <span className="text-slate-500 text-xs">
              {(stats.tidalCardHours / stats.totalCardHours * 100).toFixed(1)}% 占比
            </span>
          </div>
          <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500" 
              style={{ width: `${(stats.tidalCardHours / stats.totalCardHours * 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold">
            <Activity size={18} className="text-blue-500" />
            <span>已占用卡时</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-slate-900">{stats.usedCardHours.toLocaleString()}</h3>
            <span className="text-slate-500 text-xs">
              {(stats.usedCardHours / stats.totalCardHours * 100).toFixed(1)}% 负载
            </span>
          </div>
          <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500" 
              style={{ width: `${(stats.usedCardHours / stats.totalCardHours * 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold">
            <Server size={18} className="text-blue-500" />
            <span>可用空闲卡时</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-slate-900">{stats.availableCardHours.toLocaleString()}</h3>
            <span className="text-emerald-500 text-xs font-bold">实时可用</span>
          </div>
          <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500" 
              style={{ width: `${(stats.availableCardHours / stats.totalCardHours * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              算力占用趋势 (24h)
            </h4>
            
            <div className="relative group">
              <select 
                value={selectedModelId}
                onChange={(e) => setSelectedModelId(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 pr-10 text-sm text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer hover:bg-slate-100 transition-all"
              >
                <option value="all">全部型号</option>
                {stats.models.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorUsed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1677ff" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1677ff" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorIdle" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#8c8c8c" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#8c8c8c" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(v) => `${(v/1000).toFixed(1)}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #f0f0f0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  height={36}
                  iconType="circle"
                  formatter={(value) => <span className="text-xs text-slate-600 font-medium">{value}</span>}
                />
                <Area 
                  type="monotone" 
                  dataKey="used" 
                  name="被占用卡时"
                  stroke="#1677ff" 
                  fillOpacity={1} 
                  fill="url(#colorUsed)" 
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="idle" 
                  name="闲置卡时"
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorIdle)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-500" />
            型号分布明细
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-4 text-xs text-slate-500 font-bold">型号</th>
                  <th className="pb-4 text-xs text-slate-500 font-bold">集群名称</th>
                  <th className="pb-4 text-xs text-slate-500 font-bold text-right">7天预测卡时</th>
                  <th className="pb-4 text-xs text-slate-500 font-bold text-right">已预约卡时</th>
                  <th className="pb-4 text-xs text-slate-500 font-bold text-right">已消费卡时</th>
                  <th className="pb-4 text-xs text-slate-500 font-bold text-right">卡时保障率</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {stats.models.map((model) => (
                  <tr key={model.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center">
                          <Cpu size={14} className="text-blue-500" />
                        </div>
                        <span className="text-sm font-semibold text-slate-800">{model.name}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-xs text-slate-500">{model.clusterName}</span>
                    </td>
                    <td className="py-4 text-right">
                      <span className="text-sm text-slate-700 font-mono">{model.predicted7dCardHours.toLocaleString()}</span>
                    </td>
                    <td className="py-4 text-right">
                      <span className="text-sm text-slate-700 font-mono">{model.reservedCardHours.toLocaleString()}</span>
                    </td>
                    <td className="py-4 text-right">
                      <span className="text-sm text-slate-700 font-mono">{model.consumedCardHours.toLocaleString()}</span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-sm font-bold text-blue-600">{model.guaranteeRate}%</span>
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500" 
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

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            弹性任务明细
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-4 text-xs text-slate-500 font-bold">任务名称</th>
                  <th className="pb-4 text-xs text-slate-500 font-bold">所属人</th>
                  <th className="pb-4 text-xs text-slate-500 font-bold">部门名称</th>
                  <th className="pb-4 text-xs text-slate-500 font-bold">任务类型</th>
                  <th className="pb-4 text-xs text-slate-500 font-bold">卡型号</th>
                  <th className="pb-4 text-xs text-slate-500 font-bold text-right">消费卡时数</th>
                  <th className="pb-4 text-xs text-slate-500 font-bold">开始时间</th>
                  <th className="pb-4 text-xs text-slate-500 font-bold">结束时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {tasks.map((task) => (
                  <tr key={task.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-4">
                      <span className="text-sm font-semibold text-slate-800">{task.taskName}</span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <User size={12} className="text-slate-400" />
                        <span className="text-sm text-slate-600">{task.owner}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Briefcase size={12} className="text-slate-400" />
                        <span className="text-sm text-slate-600">{task.department}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        task.taskType === 'Training' ? 'bg-blue-50 text-blue-600' : 'bg-cyan-50 text-cyan-600'
                      }`}>
                        {task.taskType}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Tag size={12} className="text-slate-400" />
                        <span className="text-sm text-slate-600">{task.modelName}</span>
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <span className="text-sm text-blue-600 font-bold">{task.consumedCardHours.toLocaleString()}</span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock size={12} />
                        <span className="text-xs">{task.startTime}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock size={12} />
                        <span className="text-xs">{task.endTime}</span>
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
