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
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">队列管理</h3>
          <p className="text-slate-500 text-sm">以队列粒度精细化调控算力使用上限</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg flex items-center gap-2 transition-all shadow-sm"
        >
          <Plus size={18} />
          新增配置
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">队列名称</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">型号</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">最大副本数</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">7日内最大预约卡时</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">操作人</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                        <Zap size={16} />
                      </div>
                      <span className="text-sm font-medium text-slate-900 font-mono">{rule.queueName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Cpu size={14} className="text-blue-500" />
                      <span className="text-sm">{rule.modelName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Box size={14} className="text-slate-400" />
                      <span className="text-sm font-mono">{rule.maxReplicas}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-blue-600 font-mono font-bold">
                      <span>{rule.maxCardHours.toLocaleString()}</span>
                      <span className="text-[10px] font-normal text-slate-400 uppercase">Hrs</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <ShieldCheck size={14} className="text-emerald-500" />
                      <span className="text-sm">{rule.operator}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-colors">
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => onDelete(rule.id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md p-8 animate-in zoom-in-95 duration-300 rounded-2xl border border-slate-200 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <Plus size={20} />
              </div>
              <h4 className="text-xl font-bold text-slate-900">新增队列配置</h4>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">队列名称</label>
                <input 
                  type="text"
                  placeholder="例如: elas-llm-train-01"
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-mono"
                  value={newRule.queueName}
                  onChange={(e) => setNewRule({...newRule, queueName: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">型号</label>
                <select 
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  value={newRule.modelId}
                  onChange={(e) => setNewRule({...newRule, modelId: e.target.value})}
                >
                  {models.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">最大副本数</label>
                  <input 
                    type="number"
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-mono"
                    value={newRule.maxReplicas}
                    onChange={(e) => setNewRule({...newRule, maxReplicas: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">7日内最大预约卡时</label>
                  <input 
                    type="number"
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-mono"
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
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  value={newRule.operator}
                  onChange={(e) => setNewRule({...newRule, operator: e.target.value})}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button 
                onClick={() => setShowAdd(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium"
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
                className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all text-sm shadow-sm"
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
