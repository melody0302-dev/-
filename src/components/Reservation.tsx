import React, { useState } from 'react';
import { Reservation, GPUModel } from '../types';
import { Calendar, Clock, Cpu, Layers, Plus, Trash2, CheckCircle2, AlertCircle, Repeat, Hash } from 'lucide-react';
import { motion } from 'motion/react';

interface ReservationProps {
  reservations: Reservation[];
  models: GPUModel[];
  onAdd: (reservation: Omit<Reservation, 'id' | 'status'>) => void;
  onDelete: (id: string) => void;
}

export const ReservationView: React.FC<ReservationProps> = ({ reservations, models, onAdd, onDelete }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newRes, setNewRes] = useState<Omit<Reservation, 'id' | 'status' | 'modelName'>>({
    queueName: '',
    modelId: models[0]?.id || '',
    startTime: '',
    endTime: '',
    cardHours: 100,
    nature: 'non-periodic'
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase flex items-center gap-1"><CheckCircle2 size={10} /> 生效中</span>;
      case 'pending':
        return <span className="px-2 py-1 rounded-md bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase flex items-center gap-1"><Clock size={10} /> 待生效</span>;
      case 'expired':
        return <span className="px-2 py-1 rounded-md bg-slate-500/10 text-slate-400 text-[10px] font-bold uppercase flex items-center gap-1"><AlertCircle size={10} /> 已过期</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-white">卡时预留配置</h3>
          <p className="text-slate-400 text-sm">针对高优任务或特定部门进行弹性队列的资源预留</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="glow-button flex items-center gap-2"
        >
          <Plus size={18} />
          创建预留
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {reservations.length === 0 ? (
          <div className="glass-card p-12 flex flex-col items-center justify-center text-slate-500 border-dashed border-2">
            <Calendar size={48} className="mb-4 opacity-20" />
            <p>暂无活跃的卡时预留配置</p>
          </div>
        ) : (
          reservations.map((res) => (
            <motion.div 
              key={res.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/40 border border-white/5 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 group relative hover:border-white/10 transition-all"
            >
              <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-8 w-full">
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">队列名称</p>
                  <div className="flex items-center gap-2 text-white font-bold text-lg leading-tight">
                    <div className="w-1 h-1 rounded-full bg-brand-primary" />
                    {res.queueName}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">预留性质</p>
                  <div className="flex items-center gap-2 text-slate-200">
                    {res.nature === 'periodic' ? (
                      <Repeat size={16} className="text-brand-secondary" />
                    ) : (
                      <Hash size={16} className="text-slate-500" />
                    )}
                    <span className="text-sm font-medium">
                      {res.nature === 'periodic' ? `周期预留 (${res.periodType === 'daily' ? '按天' : ''})` : '非周期预留'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">预留型号</p>
                  <div className="flex items-center gap-2 text-slate-200">
                    <Cpu size={16} className="text-brand-secondary" />
                    <span className="text-sm font-medium">{res.modelName}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">预留卡时量</p>
                  <div className="text-brand-primary font-mono font-bold text-2xl flex items-baseline gap-1">
                    {res.cardHours.toLocaleString()} <span className="text-xs font-normal text-slate-500">Hrs</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">预留周期</p>
                  <div className="text-xs text-slate-400 flex flex-col gap-1 leading-relaxed">
                    <span>起: {res.startTime}</span>
                    <span>止: {res.endTime}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-6 md:pt-0">
                {getStatusBadge(res.status)}
                <button 
                  onClick={() => onDelete(res.id)}
                  className="p-2.5 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-lg p-8 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <h4 className="text-xl font-bold text-white mb-6">创建卡时预留</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">队列名称</label>
                <input 
                  type="text"
                  placeholder="例如: A部门-高优训练队列"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-primary transition-colors"
                  value={newRes.queueName}
                  onChange={(e) => setNewRes({...newRes, queueName: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">预留性质</label>
                <select 
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-primary transition-colors"
                  value={newRes.nature}
                  onChange={(e) => {
                    const nature = e.target.value as 'periodic' | 'non-periodic';
                    setNewRes({
                      ...newRes, 
                      nature,
                      periodType: nature === 'periodic' ? 'daily' : undefined
                    });
                  }}
                >
                  <option value="non-periodic">非周期预留</option>
                  <option value="periodic">周期预留</option>
                </select>
              </div>

              {newRes.nature === 'periodic' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">周期类型</label>
                  <select 
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-primary transition-colors"
                    value={newRes.periodType}
                    onChange={(e) => setNewRes({...newRes, periodType: e.target.value as 'daily'})}
                  >
                    <option value="daily">按天预留</option>
                  </select>
                </div>
              )}

              <div className={newRes.nature === 'periodic' ? 'col-span-1' : 'col-span-1'}>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">预留型号</label>
                <select 
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-primary transition-colors"
                  value={newRes.modelId}
                  onChange={(e) => setNewRes({...newRes, modelId: e.target.value})}
                >
                  {models.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">预留卡时量 (Hrs)</label>
                <input 
                  type="number"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-primary transition-colors"
                  value={newRes.cardHours}
                  onChange={(e) => setNewRes({...newRes, cardHours: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">开始时间</label>
                <input 
                  type="datetime-local"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-primary transition-colors"
                  value={newRes.startTime}
                  onChange={(e) => setNewRes({...newRes, startTime: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">结束时间</label>
                <input 
                  type="datetime-local"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-primary transition-colors"
                  value={newRes.endTime}
                  onChange={(e) => setNewRes({...newRes, endTime: e.target.value})}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setShowAdd(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-slate-400 hover:bg-white/5 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  onAdd(newRes);
                  setShowAdd(false);
                  setNewRes({
                    queueName: '',
                    modelId: models[0]?.id || '',
                    startTime: '',
                    endTime: '',
                    cardHours: 100,
                    nature: 'non-periodic'
                  });
                }}
                className="flex-1 px-4 py-2.5 rounded-lg bg-brand-primary text-black font-bold hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all"
              >
                确认预留
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
