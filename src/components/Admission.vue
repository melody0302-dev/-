<script setup lang="ts">
import type { GPUModel } from '../types';
import { ShieldCheck, CheckCircle2, Beaker, Zap } from 'lucide-vue-next';

const props = defineProps<{
  models: GPUModel[];
}>();

const emit = defineEmits<{
  (e: 'update', id: string, updates: Partial<GPUModel>): void;
}>();
</script>

<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-xl font-bold text-slate-900">型号准入管理</h3>
        <p class="text-slate-500 text-sm">配置哪些型号的算力卡可进入弹性空闲算力池，并设置训练/推理限额</p>
      </div>
      <div class="flex gap-2">
        <div class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs flex items-center gap-2 shadow-sm">
          <CheckCircle2 size="14" class="text-blue-500" />
          型号总数: {{ models.length }}
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6">
      <div 
        v-for="model in models" 
        :key="model.id"
        class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col lg:flex-row items-center gap-8 hover:scale-[1.01]"
      >
        <div class="flex items-center gap-4 min-w-[200px]">
          <div class="p-3 rounded-lg bg-blue-50">
            <ShieldCheck class="text-blue-600" size="24" />
          </div>
          <div>
            <h4 class="text-lg font-bold text-slate-900 leading-tight">{{ model.name }}</h4>
            <p class="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-semibold">
              {{ model.name === 'ASCEND910' ? 'NPU型号' : 'GPU型号' }}
            </p>
          </div>
        </div>
        
        <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          <!-- Training Section -->
          <div class="flex items-center gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div class="flex items-center gap-3 min-w-[120px]">
              <Beaker size="18" :class="model.trainingEnabled ? 'text-blue-600' : 'text-slate-400'" />
              <span class="text-sm font-bold text-slate-700">离线训练</span>
              <button 
                @click="emit('update', model.id, { trainingEnabled: !model.trainingEnabled })"
                :class="`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                  model.trainingEnabled ? 'bg-blue-600' : 'bg-slate-300'
                }`"
              >
                <span
                  :class="`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                    model.trainingEnabled ? 'translate-x-5' : 'translate-x-1'
                  }`"
                />
              </button>
            </div>
            
            <div class="flex-1 flex items-center gap-3">
              <label class="text-[10px] text-slate-500 uppercase tracking-widest font-bold whitespace-nowrap">训练限额 (%)</label>
              <div class="relative w-24">
                <input 
                  type="number"
                  min="0"
                  max="100"
                  :disabled="!model.trainingEnabled"
                  :value="model.trainingLimit"
                  @input="emit('update', model.id, { trainingLimit: Math.min(100, Math.max(0, parseInt(($event.target as HTMLInputElement).value) || 0)) })"
                  :class="`w-full bg-white border rounded-lg pl-3 pr-8 py-1.5 text-sm text-slate-900 focus:outline-none transition-all ${
                    model.trainingEnabled ? 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100' : 'bg-slate-50 border-slate-100 opacity-50'
                  }`"
                />
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">%</span>
              </div>
            </div>
          </div>

          <!-- Inference Section -->
          <div class="flex items-center gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div class="flex items-center gap-3 min-w-[120px]">
              <Zap size="18" :class="model.inferenceEnabled ? 'text-red-500' : 'text-slate-400'" />
              <span class="text-sm font-bold text-slate-700">离线推理</span>
              <button 
                @click="emit('update', model.id, { inferenceEnabled: !model.inferenceEnabled })"
                :class="`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                  model.inferenceEnabled ? 'bg-red-500' : 'bg-slate-300'
                }`"
              >
                <span
                  :class="`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                    model.inferenceEnabled ? 'translate-x-5' : 'translate-x-1'
                  }`"
                />
              </button>
            </div>

            <div class="flex-1 flex items-center gap-3">
              <label class="text-[10px] text-slate-500 uppercase tracking-widest font-bold whitespace-nowrap">推理限额 (%)</label>
              <div class="relative w-24">
                <input 
                  type="number"
                  min="0"
                  max="100"
                  :disabled="!model.inferenceEnabled"
                  :value="model.inferenceLimit"
                  @input="emit('update', model.id, { inferenceLimit: Math.min(100, Math.max(0, parseInt(($event.target as HTMLInputElement).value) || 0)) })"
                  :class="`w-full bg-white border rounded-lg pl-3 pr-8 py-1.5 text-sm text-slate-900 focus:outline-none transition-all ${
                    model.inferenceEnabled ? 'border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-100' : 'bg-slate-50 border-slate-100 opacity-50'
                  }`"
                />
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-1.5 min-w-[180px]">
          <label class="text-[10px] text-slate-500 uppercase tracking-widest font-bold">开启集群</label>
          <div class="flex items-center gap-2">
            <input 
              type="text"
              :value="model.enabledClusters"
              @input="emit('update', model.id, { enabledClusters: ($event.target as HTMLInputElement).value })"
              class="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
