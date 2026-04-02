<script setup lang="ts">
import { ref } from 'vue';
import type { Reservation, GPUModel } from '../types';
import { Calendar, Clock, Cpu, Layers, Plus, Trash2, CheckCircle2, AlertCircle, Repeat, Hash } from 'lucide-vue-next';

const props = defineProps<{
  reservations: Reservation[];
  models: GPUModel[];
}>();

const emit = defineEmits<{
  (e: 'add', reservation: Omit<Reservation, 'id' | 'status'>): void;
  (e: 'delete', id: string): void;
}>();

const showAdd = ref(false);
const newRes = ref<Omit<Reservation, 'id' | 'status' | 'modelName'>>({
  queueName: '',
  modelId: props.models[0]?.id || '',
  startTime: '',
  endTime: '',
  cardHours: 100,
  nature: 'non-periodic'
});

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return { class: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: CheckCircle2, text: '生效中' };
    case 'pending':
      return { class: 'bg-amber-50 text-amber-600 border-amber-100', icon: Clock, text: '待生效' };
    case 'expired':
      return { class: 'bg-slate-50 text-slate-500 border-slate-100', icon: AlertCircle, text: '已过期' };
    default:
      return null;
  }
};

const handleAdd = () => {
  emit('add', newRes.value);
  showAdd.value = false;
  newRes.value = {
    queueName: '',
    modelId: props.models[0]?.id || '',
    startTime: '',
    endTime: '',
    cardHours: 100,
    nature: 'non-periodic'
  };
};
</script>

<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-xl font-bold text-slate-900">卡时预留配置</h3>
        <p class="text-slate-500 text-sm">针对高优任务或特定部门进行弹性队列的资源预留</p>
      </div>
      <button 
        @click="showAdd = true"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg flex items-center gap-2 transition-all shadow-sm"
      >
        <Plus size="18" />
        创建预留
      </button>
    </div>

    <div class="grid grid-cols-1 gap-4">
      <div v-if="reservations.length === 0" class="bg-white p-12 flex flex-col items-center justify-center text-slate-400 border-dashed border-2 border-slate-200 rounded-2xl">
        <Calendar size="48" class="mb-4 opacity-20" />
        <p>暂无活跃的卡时预留配置</p>
      </div>
      <div 
        v-else
        v-for="res in reservations" 
        :key="res.id"
        class="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 group relative hover:border-blue-200 hover:shadow-md transition-all"
      >
        <div class="flex-1 grid grid-cols-2 md:grid-cols-6 gap-8 w-full">
          <div class="space-y-2">
            <p class="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">队列名称</p>
            <div class="flex items-center gap-2 text-slate-900 font-bold text-lg leading-tight">
              <div class="w-1.5 h-1.5 rounded-full bg-blue-500" />
              {{ res.queueName }}
            </div>
          </div>
          <div class="space-y-2">
            <p class="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">集群</p>
            <div class="flex items-center gap-2 text-slate-700">
              <Layers size="16" class="text-blue-500" />
              <span class="text-sm font-medium">
                {{ models.find(m => m.id === res.modelId)?.clusterName || '-' }}
              </span>
            </div>
          </div>
          <div class="space-y-2">
            <p class="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">预留性质</p>
            <div class="flex items-center gap-2 text-slate-700">
              <Repeat v-if="res.nature === 'periodic'" size="16" class="text-blue-500" />
              <Hash v-else size="16" class="text-slate-400" />
              <span class="text-sm font-medium">
                {{ res.nature === 'periodic' ? `周期预留 (${res.periodType === 'daily' ? '按天' : ''})` : '非周期预留' }}
              </span>
            </div>
          </div>
          <div class="space-y-2">
            <p class="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">预留型号</p>
            <div class="flex items-center gap-2 text-slate-700">
              <Cpu size="16" class="text-blue-500" />
              <span class="text-sm font-medium">{{ res.modelName }}</span>
            </div>
          </div>
          <div class="space-y-2">
            <p class="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">预留卡时量</p>
            <div class="text-blue-600 font-mono font-bold text-2xl flex items-baseline gap-1">
              {{ res.cardHours.toLocaleString() }} <span class="text-xs font-normal text-slate-400">Hrs</span>
            </div>
          </div>
          <div class="space-y-2">
            <p class="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">预留周期</p>
            <div class="text-xs text-slate-500 flex flex-col gap-1 leading-relaxed font-medium">
              <span>起: {{ res.startTime }}</span>
              <span>止: {{ res.endTime }}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-100 pt-6 md:pt-0">
          <span v-if="getStatusBadge(res.status)" :class="`px-2 py-1 rounded-md text-[10px] font-bold uppercase flex items-center gap-1 border ${getStatusBadge(res.status)!.class}`">
            <component :is="getStatusBadge(res.status)!.icon" size="10" />
            {{ getStatusBadge(res.status)!.text }}
          </span>
          <button 
            @click="emit('delete', res.id)"
            class="p-2.5 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-500 transition-all"
          >
            <Trash2 size="20" />
          </button>
        </div>
      </div>
    </div>

    <!-- Add Reservation Modal -->
    <div v-if="showAdd" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white w-full max-w-lg p-8 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 shadow-2xl">
        <h4 class="text-xl font-bold text-slate-900 mb-6">创建卡时预留</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="col-span-2">
            <label class="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">队列名称</label>
            <input 
              type="text"
              placeholder="例如: A部门-高优训练队列"
              class="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
              v-model="newRes.queueName"
            />
          </div>
          
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">预留性质</label>
            <select 
              class="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
              v-model="newRes.nature"
              @change="newRes.periodType = newRes.nature === 'periodic' ? 'daily' : undefined"
            >
              <option value="non-periodic">非周期预留</option>
              <option value="periodic">周期预留</option>
            </select>
          </div>

          <div v-if="newRes.nature === 'periodic'">
            <label class="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">周期类型</label>
            <select 
              class="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
              v-model="newRes.periodType"
            >
              <option value="daily">按天预留</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">预留型号</label>
            <select 
              class="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
              v-model="newRes.modelId"
            >
              <option v-for="m in models" :key="m.id" :value="m.id">{{ m.name }}</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">预留卡时量 (Hrs)</label>
            <input 
              type="number"
              class="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
              v-model="newRes.cardHours"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">开始时间</label>
            <input 
              type="datetime-local"
              class="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
              v-model="newRes.startTime"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">结束时间</label>
            <input 
              type="datetime-local"
              class="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
              v-model="newRes.endTime"
            />
          </div>
        </div>
        <div class="flex gap-3 mt-8">
          <button 
            @click="showAdd = false"
            class="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-medium"
          >
            取消
          </button>
          <button 
            @click="handleAdd"
            class="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-sm"
          >
            确认预留
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
