<script setup lang="ts">
import type { KillConfig } from '../types';
import { Settings2, AlertTriangle, Timer, Power, Info, Plus, X } from 'lucide-vue-next';

const props = defineProps<{
  config: KillConfig;
}>();

const emit = defineEmits<{
  (e: 'change', config: KillConfig): void;
}>();

const handleAddWhitelist = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const val = input.value.trim();
  if (val && !props.config.whitelistQueues.includes(val)) {
    emit('change', { ...props.config, whitelistQueues: [...props.config.whitelistQueues, val] });
    input.value = '';
  }
};

const handleRemoveWhitelist = (queue: string) => {
  emit('change', { ...props.config, whitelistQueues: props.config.whitelistQueues.filter(q => q !== queue) });
};
</script>

<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-xl font-bold text-slate-900">自动化查杀配置</h3>
        <p class="text-slate-500 text-sm">自动清理低利用率任务，释放无效占用的算力资源</p>
      </div>
      <div :class="`flex items-center gap-3 px-4 py-1.5 rounded-full border transition-all ${
        config.enabled 
          ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
          : 'bg-slate-50 border-slate-200 text-slate-500'
      }`">
        <Power size="16" />
        <span class="text-xs font-bold uppercase tracking-wider">{{ config.enabled ? '已开启' : '已关闭' }}</span>
        <button 
          @click="emit('change', { ...config, enabled: !config.enabled })"
          :class="`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
            config.enabled ? 'bg-emerald-500' : 'bg-slate-300'
          }`"
        >
          <span
            :class="`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
              config.enabled ? 'translate-x-5' : 'translate-x-1'
            }`"
          />
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-8">
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <label class="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <AlertTriangle class="text-blue-500 w-4 h-4" />
              利用率查杀水位线
            </label>
            <span class="text-2xl font-mono text-blue-600 font-bold">{{ config.threshold }}%</span>
          </div>
          <input 
            type="range"
            min="1"
            max="50"
            step="1"
            class="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600"
            :value="config.threshold"
            @input="emit('change', { ...config, threshold: parseInt(($event.target as HTMLInputElement).value) })"
          />
          <div class="flex justify-between text-[10px] text-slate-400 font-mono uppercase font-bold">
            <span>1% (极低)</span>
            <span>25% (推荐)</span>
            <span>50% (严格)</span>
          </div>
        </div>

        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <label class="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Timer class="text-red-500 w-4 h-4" />
              查杀宽限时长
            </label>
            <span class="text-2xl font-mono text-red-500 font-bold">{{ config.gracePeriod }} Min</span>
          </div>
          <input 
            type="range"
            min="5"
            max="120"
            step="5"
            class="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-red-500"
            :value="config.gracePeriod"
            @input="emit('change', { ...config, gracePeriod: parseInt(($event.target as HTMLInputElement).value) })"
          />
          <div class="flex justify-between text-[10px] text-slate-400 font-mono uppercase font-bold">
            <span>5m (即时)</span>
            <span>60m (标准)</span>
            <span>120m (宽松)</span>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6 border-l-4 border-l-blue-500">
          <h5 class="text-slate-900 font-bold mb-3 flex items-center gap-2">
            <Info class="w-4 h-4 text-blue-500" />
            策略逻辑说明
          </h5>
          <ul class="space-y-3 text-sm text-slate-600">
            <li class="flex gap-2">
              <span class="text-blue-500 font-bold">•</span>
              系统每隔 5 分钟扫描一次全量离线任务的 GPU 利用率。
            </li>
            <li class="flex gap-2">
              <span class="text-blue-500 font-bold">•</span>
              若任务利用率持续低于 <span class="text-blue-600 font-mono font-bold">{{ config.threshold }}%</span> 超过 <span class="text-blue-600 font-mono font-bold">{{ config.gracePeriod }}</span> 分钟，将触发自动查杀。
            </li>
            <li class="flex gap-2">
              <span class="text-blue-500 font-bold">•</span>
              查杀前将通过系统通知告知任务所属用户，并保留任务日志。
            </li>
          </ul>
        </div>

        <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6 bg-red-50/10 border-red-100">
          <h5 class="text-slate-900 font-bold mb-3 flex items-center justify-between">
            查杀白名单 (队列粒度)
            <span class="text-[10px] text-slate-400 font-normal">不受策略影响</span>
          </h5>
          
          <div class="space-y-4">
            <div class="flex gap-2">
              <input 
                type="text"
                placeholder="输入队列名称..."
                class="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                @keydown.enter="handleAddWhitelist"
              />
              <button 
                class="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                @click="handleAddWhitelist"
              >
                <Plus size="14" />
              </button>
            </div>

            <div class="flex flex-wrap gap-2 min-h-[60px]">
              <p v-if="config.whitelistQueues.length === 0" class="text-[10px] text-slate-400 italic">暂无白名单队列</p>
              <span 
                v-for="queue in config.whitelistQueues"
                :key="queue" 
                class="group flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-mono font-bold"
              >
                {{ queue }}
                <button 
                  @click="handleRemoveWhitelist(queue)"
                  class="hover:text-blue-800 transition-colors"
                >
                  <X size={12} />
                </button>
              </span>
            </div>

            <div class="pt-4 border-t border-slate-100">
              <p class="text-[10px] text-slate-400 mb-2 font-bold uppercase tracking-widest">内置白名单类型</p>
              <div class="flex flex-wrap gap-2">
                <span v-for="tag in ['交互式开发', '高优先级调试', '系统核心任务']" :key="tag" class="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-500 text-[10px] font-medium">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
