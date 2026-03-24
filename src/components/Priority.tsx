import React, { useState } from 'react';
import { QueueRule, GPUModel } from '../types';
import { Zap, Plus, Trash2, Edit3, User, ShieldCheck, Cpu, Box, Clock } from 'lucide-react';

interface PriorityProps {
  rules: QueueRule[];
  models: GPUModel[];
  onAdd: (rule: Omit<QueueRule, 'id'>) => void;
  onDelete: (id: string) => void;
}

export const Priority: React.FC<PriorityProps> = ({ rules, models, onAdd, onDelete }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newRule, setNewRule] = useState<Omit<QueueRule, 'id' | 'modelName'>>({
    queueName: '',
    modelId: models[0]?.id || '',
    maxReplicas: 10,
    maxCardHours: 5000,
    operator: 'admin_melody'
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-white tracking-tight">队列管理</h3>
          <p className="text-slate-400 text-sm">以队列粒度精细化调控算力使用上限</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-brand-primary hover:bg-brand-primary/90 text-black font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(0,242,255,0.3)]"
        >
          <Plus size={18} />
          新增配置
        </button>
      </div>

      <div className="glass-card overflow-hidden border border-white/5 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">队列名称</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">型号</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">最大副本数</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">最大卡时数</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">操作人</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/5 text-brand-primary">
                        <Zap size={16} />
                      </div>
                      <span className="text-sm font-medium text-white font-mono">{rule.queueName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Cpu size={14} className="text-brand-secondary" />
                      <span className="text-sm">{rule.modelName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Box size={14} className="text-slate-500" />
                      <span className="text-sm font-mono">{rule.maxReplicas}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-brand-primary font-mono font-bold">
                      <span>{rule.maxCardHours.toLocaleString()}</span>
                      <span className="text-[10px] font-normal text-slate-500 uppercase">Hrs</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-300">
                      <ShieldCheck size={14} className="text-emerald-500" />
                      <span className="text-sm">{rule.operator}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => onDelete(rule.id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-md p-8 animate-in zoom-in-95 duration-300 border border-white/10 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-brand-primary/20 text-brand-primary">
                <Plus size={20} />
              </div>
              <h4 className="text-xl font-bold text-white">新增队列配置</h4>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">队列名称</label>
                <input 
                  type="text"
                  placeholder="例如: elas-llm-train-01"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-primary transition-all font-mono"
                  value={newRule.queueName}
                  onChange={(e) => setNewRule({...newRule, queueName: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">型号</label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-primary transition-all"
                  value={newRule.modelId}
                  onChange={(e) => setNewRule({...newRule, modelId: e.target.value})}
                >
                  {models.map(m => (
                    <option key={m.id} value={m.id} className="bg-bg-dark">{m.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">最大副本数</label>
                  <input 
                    type="number"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-primary transition-all font-mono"
                    value={newRule.maxReplicas}
                    onChange={(e) => setNewRule({...newRule, maxReplicas: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">最大卡时数</label>
                  <input 
                    type="number"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-primary transition-all font-mono"
                    value={newRule.maxCardHours}
                    onChange={(e) => setNewRule({...newRule, maxCardHours: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">操作人</label>
                <input 
                  type="text"
                  placeholder="例如: admin_melody"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-primary transition-all"
                  value={newRule.operator}
                  onChange={(e) => setNewRule({...newRule, operator: e.target.value})}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button 
                onClick={() => setShowAdd(false)}
                className="flex-1 px-4 py-3 rounded-lg border border-white/10 text-slate-400 hover:bg-white/5 transition-colors text-sm font-medium"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  if (!newRule.queueName) return;
                  const modelName = models.find(m => m.id === newRule.modelId)?.name || 'Unknown';
                  onAdd({ ...newRule, modelName });
                  setShowAdd(false);
                  setNewRule({
                    queueName: '',
                    modelId: models[0]?.id || '',
                    maxReplicas: 10,
                    maxCardHours: 5000,
                    operator: 'admin_melody'
                  });
                }}
                className="flex-1 px-4 py-3 rounded-lg bg-brand-primary text-black font-bold hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all text-sm"
              >
                确认提交
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
