import React, { useState } from 'react';
import { PriorityRule } from '../types';
import { Zap, Plus, Trash2, Edit3, Clock, User, ShieldCheck } from 'lucide-react';

interface PriorityProps {
  rules: PriorityRule[];
  onAdd: (rule: Omit<PriorityRule, 'id'>) => void;
  onDelete: (id: string) => void;
}

export const Priority: React.FC<PriorityProps> = ({ rules, onAdd, onDelete }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newRule, setNewRule] = useState<Omit<PriorityRule, 'id'>>({
    queueName: '',
    effectiveUser: '',
    priority: 'P1',
    effectiveTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
    operator: 'sunxiaodong'
  });

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'P0': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'P1': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'P2': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-white tracking-tight">优先级管理</h3>
          <p className="text-slate-400 text-sm">以队列粒度精细化控制算力获取优先级</p>
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
                <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">生效人</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">优先级</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">生效时间</th>
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
                      <User size={14} className="text-slate-500" />
                      <span className="text-sm">{rule.effectiveUser}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getPriorityColor(rule.priority)}`}>
                      {rule.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock size={14} />
                      <span className="text-xs font-mono">{rule.effectiveTime}</span>
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
              <h4 className="text-xl font-bold text-white">新增优先级配置</h4>
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
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">生效人</label>
                <input 
                  type="text"
                  placeholder="例如: bjliwenjuan"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-primary transition-all"
                  value={newRule.effectiveUser}
                  onChange={(e) => setNewRule({...newRule, effectiveUser: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">优先级</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['P0', 'P1', 'P2'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setNewRule({...newRule, priority: p})}
                      className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                        newRule.priority === p 
                          ? 'bg-brand-primary border-brand-primary text-black' 
                          : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">操作人</label>
                <input 
                  type="text"
                  placeholder="例如: sunxiaodong"
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
                  if (!newRule.queueName || !newRule.effectiveUser) return;
                  onAdd(newRule);
                  setShowAdd(false);
                  setNewRule({
                    queueName: '',
                    effectiveUser: '',
                    priority: 'P1',
                    effectiveTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
                    operator: 'sunxiaodong'
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
