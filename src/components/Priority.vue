<script setup lang="ts">
import { ref } from 'vue';
import type { QueueRule, GPUModel } from '../types';
import { Zap, Plus, Trash2, Edit3, ShieldCheck, Cpu, Box } from 'lucide-vue-next';

const props = defineProps<{
  rules: QueueRule[];
  models: GPUModel[];
}>();

const emit = defineEmits<{
  (e: 'add', rule: Omit<QueueRule, 'id'>): void;
  (e: 'delete', id: string): void;
}>();

const showAdd = ref(false);
const newRule = ref<Omit<QueueRule, 'id' | 'modelName'>>({
  queueName: '',
  modelId: props.models[0]?.id || '',
  maxReplicas: 10,
  maxCardHours: 5000,
  operator: 'admin_melody'
});

const handleAdd = () => {
  if (!newRule.value.queueName) return;
  const modelName = props.models.find(m => m.id === newRule.value.modelId)?.name || 'Unknown';
  emit('add', { ...newRule.value, modelName });
  showAdd.value = false;
  newRule.value = {
    queueName: '',
    modelId: props.models[0]?.id || '',
    maxReplicas: 10,
    maxCardHours: 5000,
    operator: 'admin_melody'
  };
};
</script>

<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-xl font-bold text-slate-900 tracking-tight">队列管理</h3>
        <p class="text-slate-500 text-sm">以队列粒度精细化调控算力使用上限</p>
      </div>
      <button 
        @click="showAdd = true"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg flex items-center gap-2 transition-all shadow-sm"
      >
        <Plus size="18" />
        新增配置
      </button>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200">
              <th class="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">队列名称</th>
              <th class="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">型号</th>
              <th class="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">最大副本数</th>
              <th class="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">7日内最大预约卡时</th>
              <th class="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">操作人</th>
              <th class="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="rule in rules" :key="rule.id" class="hover:bg-slate-50/50 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <Zap size="16" />
                  </div>
                  <span class="text-sm font-medium text-slate-900 font-mono">{{ rule.queueName }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2 text-slate-600">
                  <Cpu size="14" class="text-blue-500" />
                  <span class="text-sm">{{ rule.modelName }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2 text-slate-600">
                  <Box size="14" class="text-slate-400" />
                  <span class="text-sm font-mono">{{ rule.maxReplicas }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2 text-blue-600 font-mono font-bold">
                  <span>{{ rule.maxCardHours.toLocaleString() }}</span>
                  <span class="text-[10px] font-normal text-slate-400 uppercase">Hrs</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2 text-slate-600">
                  <ShieldCheck size="14" class="text-emerald-500" />
                  <span class="text-sm">{{ rule.operator }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button class="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-colors">
                    <Edit3 size="16" />
                  </button>
                  <button 
                    @click="emit('delete', rule.id)"
                    class="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size="16" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Rule Modal -->
    <div v-if="showAdd" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white w-full max-w-md p-8 animate-in zoom-in-95 duration-300 rounded-2xl border border-slate-200 shadow-2xl">
        <div class="flex items-center gap-3 mb-6">
          <div class="p-2 rounded-lg bg-blue-50 text-blue-600">
            <Plus size="20" />
          </div>
          <h4 class="text-xl font-bold text-slate-900">新增队列配置</h4>
        </div>
        
        <div class="space-y-5">
          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">队列名称</label>
            <input 
              type="text"
              placeholder="例如: elas-llm-train-01"
              class="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-mono"
              v-model="newRule.queueName"
            />
          </div>
          
          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">型号</label>
            <select 
              class="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              v-model="newRule.modelId"
            >
              <option v-for="m in models" :key="m.id" :value="m.id">{{ m.name }}</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">最大副本数</label>
              <input 
                type="number"
                class="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-mono"
                v-model="newRule.maxReplicas"
              />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">7日内最大预约卡时</label>
              <input 
                type="number"
                class="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-mono"
                v-model="newRule.maxCardHours"
              />
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">操作人</label>
            <input 
              type="text"
              placeholder="例如: admin_melody"
              class="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              v-model="newRule.operator"
            />
          </div>
        </div>

        <div class="flex gap-4 mt-10">
          <button 
            @click="showAdd = false"
            class="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium"
          >
            取消
          </button>
          <button 
            @click="handleAdd"
            class="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all text-sm shadow-sm"
          >
            确认提交
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
