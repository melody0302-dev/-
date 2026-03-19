import React from 'react';
import { GPUModel } from '../types';
import { ShieldCheck, CheckCircle2, XCircle, Beaker, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface AdmissionProps {
  models: GPUModel[];
  onUpdate: (id: string, updates: Partial<GPUModel>) => void;
}

export const Admission: React.FC<AdmissionProps> = ({ models, onUpdate }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-white">型号准入管理</h3>
          <p className="text-slate-400 text-sm">配置哪些型号的算力卡可进入弹性空闲算力池，并设置训练/推理限额</p>
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-xs flex items-center gap-2">
            <CheckCircle2 size={14} className="text-brand-primary" />
            型号总数: {models.length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <motion.div 
            key={model.id}
            whileHover={{ y: -5 }}
            className="glass-card p-6 border-l-4 border-l-brand-primary transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 rounded-xl bg-white/5">
                <ShieldCheck className="text-brand-primary" size={24} />
              </div>
              <div className="text-right">
                <h4 className="text-lg font-bold text-white leading-tight">{model.name}</h4>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
                  {model.name === 'ASCEND910' ? 'NPU型号' : 'GPU型号'}
                </p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-2">
                  <Beaker size={16} className={model.trainingEnabled ? "text-brand-primary" : "text-slate-500"} />
                  <span className="text-sm text-slate-300">离线训练</span>
                </div>
                <button 
                  onClick={() => onUpdate(model.id, { trainingEnabled: !model.trainingEnabled })}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                    model.trainingEnabled ? 'bg-brand-primary' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      model.trainingEnabled ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-2">
                  <Zap size={16} className={model.inferenceEnabled ? "text-brand-secondary" : "text-slate-500"} />
                  <span className="text-sm text-slate-300">离线推理</span>
                </div>
                <button 
                  onClick={() => onUpdate(model.id, { inferenceEnabled: !model.inferenceEnabled })}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                    model.inferenceEnabled ? 'bg-brand-secondary' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      model.inferenceEnabled ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest">训练限额 (Hrs)</label>
                  <input 
                    type="number"
                    disabled={!model.trainingEnabled}
                    value={model.trainingLimit}
                    onChange={(e) => onUpdate(model.id, { trainingLimit: parseInt(e.target.value) || 0 })}
                    className={`w-full bg-black/40 border rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none transition-all ${
                      model.trainingEnabled ? 'border-brand-primary/30 focus:border-brand-primary' : 'border-white/5 opacity-50'
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest">推理限额 (Hrs)</label>
                  <input 
                    type="number"
                    disabled={!model.inferenceEnabled}
                    value={model.inferenceLimit}
                    onChange={(e) => onUpdate(model.id, { inferenceLimit: parseInt(e.target.value) || 0 })}
                    className={`w-full bg-black/40 border rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none transition-all ${
                      model.inferenceEnabled ? 'border-brand-secondary/30 focus:border-brand-secondary' : 'border-white/5 opacity-50'
                    }`}
                  />
                </div>
              </div>

              <div className="flex justify-between text-sm pt-2">
                <span className="text-slate-400">集群总量</span>
                <span className="text-slate-200 font-mono">{model.totalCards} Pcs</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">策略说明</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                该型号算力卡已进入弹性池。当前配置：{model.trainingEnabled ? '支持离线训练' : '禁止训练'}，{model.inferenceEnabled ? '支持离线推理' : '禁止推理'}。
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
