<script setup lang="ts">
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Settings2, 
  Zap, 
  Cpu,
  LogOut,
  CalendarDays
} from 'lucide-vue-next';
import { computed } from 'vue';

const props = defineProps<{
  activeTab: string;
}>();

const emit = defineEmits<{
  (e: 'setActiveTab', tab: string): void;
}>();

const menuItems = [
  { id: 'dashboard', label: '数据看板', icon: LayoutDashboard },
  { id: 'priority', label: '队列管理', icon: Zap },
  { id: 'reservation', label: '卡时预留', icon: CalendarDays },
  { id: 'admission', label: '型号准入', icon: ShieldCheck },
  { id: 'kill-config', label: '查杀配置', icon: Settings2 },
];

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
</script>

<template>
  <aside class="w-64 h-screen border-r border-slate-200 flex flex-col bg-white sticky top-0">
    <div class="p-6 flex items-center gap-3">
      <div class="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
        <Cpu class="text-white w-5 h-5" />
      </div>
      <h1 class="font-bold text-xl tracking-tight text-slate-900">弹性算力管理</h1>
    </div>

    <nav class="flex-1 px-3 py-4 space-y-1">
      <button
        v-for="item in menuItems"
        :key="item.id"
        @click="emit('setActiveTab', item.id)"
        :class="cn(
          'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group',
          activeTab === item.id 
            ? 'bg-blue-600/10 text-blue-600 font-semibold' 
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        )"
      >
        <component 
          :is="item.icon" 
          :class="cn(
            'w-5 h-5',
            activeTab === item.id ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
          )" 
        />
        <span class="text-sm">{{ item.label }}</span>
      </button>
    </nav>

    <div class="p-4 border-t border-slate-100">
      <button class="w-full flex items-center gap-3 px-4 py-2.5 text-slate-500 hover:text-blue-600 transition-colors text-sm">
        <LogOut class="w-5 h-5" />
        <span class="font-medium">退出系统</span>
      </button>
    </div>
  </aside>
</template>
