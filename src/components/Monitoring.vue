<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart, BarChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DatasetComponent
} from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';
import type { GPUModel, ClusterStats, ElasticTask } from '../types';
import { Cpu, Server, Activity, ChevronDown, Waves, User, Briefcase, Clock, Tag } from 'lucide-vue-next';

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DatasetComponent
]);

const props = defineProps<{
  stats: ClusterStats;
  tasks: ElasticTask[];
}>();

const selectedModelId = ref<string | 'all'>('all');

const BASE_HISTORY_DATA = [
  { time: '00:00', used: 2500, total: 8200 },
  { time: '04:00', used: 1800, total: 7800 },
  { time: '08:00', used: 3200, total: 8100 },
  { time: '12:00', used: 3800, total: 8500 },
  { time: '16:00', used: 3500, total: 8300 },
  { time: '20:00', used: 2800, total: 8000 },
  { time: '23:59', used: 2400, total: 8200 },
];

const chartOption = computed(() => {
  let scale = 1;
  
  if (selectedModelId.value !== 'all') {
    const model = props.stats.models.find(m => m.id === selectedModelId.value);
    if (model) {
      const overallTotalCards = props.stats.models.reduce((acc, m) => acc + m.totalCards, 0);
      scale = model.totalCards / overallTotalCards;
    }
  } else {
    const totalCapacity = props.stats.models.reduce((acc, m) => acc + m.totalCards * 24, 0);
    scale = totalCapacity / 8000;
  }

  const data = BASE_HISTORY_DATA.map(d => {
    const used = Math.round(d.used * scale);
    const total = Math.round(d.total * scale);
    return {
      time: d.time,
      used,
      idle: Math.max(0, total - used)
    };
  });

  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#f0f0f0',
      textStyle: { color: '#666' },
      extraCssText: 'box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-radius: 8px;'
    },
    legend: {
      data: ['被占用卡时', '闲置卡时'],
      right: 10,
      top: 0,
      icon: 'circle',
      textStyle: { fontSize: 12, color: '#666' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
      top: '15%'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map(d => d.time),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#8c8c8c', fontSize: 12 }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { type: 'dashed', color: '#f0f0f0' } },
      axisLabel: { 
        color: '#8c8c8c', 
        fontSize: 12,
        formatter: (v: number) => `${(v/1000).toFixed(1)}k`
      }
    },
    series: [
      {
        name: '被占用卡时',
        type: 'line',
        smooth: true,
        data: data.map(d => d.used),
        lineStyle: { width: 2, color: '#1677ff' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(22, 119, 255, 0.1)' },
              { offset: 1, color: 'rgba(22, 119, 255, 0)' }
            ]
          }
        },
        itemStyle: { color: '#1677ff' }
      },
      {
        name: '闲置卡时',
        type: 'line',
        smooth: true,
        data: data.map(d => d.idle),
        lineStyle: { width: 2, color: '#10b981' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(16, 185, 129, 0.1)' },
              { offset: 1, color: 'rgba(16, 185, 129, 0)' }
            ]
          }
        },
        itemStyle: { color: '#10b981' }
      }
    ]
  };
});
</script>

<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Top Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-2 mb-4 text-slate-800 font-bold">
          <Cpu size="18" class="text-blue-500" />
          <span>未来7天预测总卡时</span>
        </div>
        <div class="flex items-baseline gap-2">
          <h3 class="text-3xl font-bold text-slate-900">{{ stats.totalCardHours.toLocaleString() }}</h3>
          <span class="text-emerald-500 text-xs font-bold">+12%</span>
        </div>
        <div class="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div class="h-full bg-blue-500 w-full" />
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-2 mb-4 text-slate-800 font-bold">
          <Waves size="18" class="text-blue-500" />
          <span>潮汐卡时</span>
        </div>
        <div class="flex items-baseline gap-2">
          <h3 class="text-3xl font-bold text-slate-900">{{ stats.tidalCardHours.toLocaleString() }}</h3>
          <span class="text-slate-500 text-xs">
            {{ (stats.tidalCardHours / stats.totalCardHours * 100).toFixed(1) }}% 占比
          </span>
        </div>
        <div class="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            class="h-full bg-blue-500" 
            :style="{ width: `${(stats.tidalCardHours / stats.totalCardHours * 100)}%` }"
          />
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-2 mb-4 text-slate-800 font-bold">
          <Activity size="18" class="text-blue-500" />
          <span>已占用卡时</span>
        </div>
        <div class="flex items-baseline gap-2">
          <h3 class="text-3xl font-bold text-slate-900">{{ stats.usedCardHours.toLocaleString() }}</h3>
          <span class="text-slate-500 text-xs">
            {{ (stats.usedCardHours / stats.totalCardHours * 100).toFixed(1) }}% 负载
          </span>
        </div>
        <div class="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            class="h-full bg-blue-500" 
            :style="{ width: `${(stats.usedCardHours / stats.totalCardHours * 100)}%` }"
          />
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-2 mb-4 text-slate-800 font-bold">
          <Server size="18" class="text-blue-500" />
          <span>可用空闲卡时</span>
        </div>
        <div class="flex items-baseline gap-2">
          <h3 class="text-3xl font-bold text-slate-900">{{ stats.availableCardHours.toLocaleString() }}</h3>
          <span class="text-emerald-500 text-xs font-bold">实时可用</span>
        </div>
        <div class="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            class="h-full bg-emerald-500" 
            :style="{ width: `${(stats.availableCardHours / stats.totalCardHours * 100)}%` }"
          />
        </div>
      </div>
    </div>

    <!-- Charts and Tables -->
    <div class="space-y-6">
      <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h4 class="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Activity class="w-5 h-5 text-blue-500" />
            算力占用趋势 (24h)
          </h4>
          
          <div class="relative group">
            <select 
              v-model="selectedModelId"
              class="appearance-none bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 pr-10 text-sm text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer hover:bg-slate-100 transition-all"
            >
              <option value="all">全部型号</option>
              <option v-for="m in stats.models" :key="m.id" :value="m.id">{{ m.name }}</option>
            </select>
            <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div class="h-[350px] w-full">
          <v-chart class="chart" :option="chartOption" autoresize />
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h4 class="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Cpu class="w-5 h-5 text-blue-500" />
          型号分布明细
        </h4>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-100">
                <th class="pb-4 text-xs text-slate-500 font-bold">型号</th>
                <th class="pb-4 text-xs text-slate-500 font-bold">集群名称</th>
                <th class="pb-4 text-xs text-slate-500 font-bold text-right">7天预测卡时</th>
                <th class="pb-4 text-xs text-slate-500 font-bold text-right">已预约卡时</th>
                <th class="pb-4 text-xs text-slate-500 font-bold text-right">已消费卡时</th>
                <th class="pb-4 text-xs text-slate-500 font-bold text-right">卡时保障率</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="model in stats.models" :key="model.id" class="group hover:bg-slate-50 transition-colors">
                <td class="py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded bg-blue-50 flex items-center justify-center">
                      <Cpu size="14" class="text-blue-500" />
                    </div>
                    <span class="text-sm font-semibold text-slate-800">{{ model.name }}</span>
                  </div>
                </td>
                <td class="py-4">
                  <span class="text-xs text-slate-500">{{ model.clusterName }}</span>
                </td>
                <td class="py-4 text-right">
                  <span class="text-sm text-slate-700 font-mono">{{ model.predicted7dCardHours.toLocaleString() }}</span>
                </td>
                <td class="py-4 text-right">
                  <span class="text-sm text-slate-700 font-mono">{{ model.reservedCardHours.toLocaleString() }}</span>
                </td>
                <td class="py-4 text-right">
                  <span class="text-sm text-slate-700 font-mono">{{ model.consumedCardHours.toLocaleString() }}</span>
                </td>
                <td class="py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <span class="text-sm font-bold text-blue-600">{{ model.guaranteeRate }}%</span>
                    <div class="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        class="h-full bg-blue-500" 
                        :style="{ width: `${model.guaranteeRate}%` }"
                      />
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h4 class="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Activity class="w-5 h-5 text-blue-500" />
          弹性任务明细
        </h4>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-100">
                <th class="pb-4 text-xs text-slate-500 font-bold">任务名称</th>
                <th class="pb-4 text-xs text-slate-500 font-bold">所属人</th>
                <th class="pb-4 text-xs text-slate-500 font-bold">部门名称</th>
                <th class="pb-4 text-xs text-slate-500 font-bold">任务类型</th>
                <th class="pb-4 text-xs text-slate-500 font-bold">卡型号</th>
                <th class="pb-4 text-xs text-slate-500 font-bold text-right">消费卡时数</th>
                <th class="pb-4 text-xs text-slate-500 font-bold">开始时间</th>
                <th class="pb-4 text-xs text-slate-500 font-bold">结束时间</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="task in tasks" :key="task.id" class="group hover:bg-slate-50 transition-colors">
                <td class="py-4">
                  <span class="text-sm font-semibold text-slate-800">{{ task.taskName }}</span>
                </td>
                <td class="py-4">
                  <div class="flex items-center gap-2">
                    <User size="12" class="text-slate-400" />
                    <span class="text-sm text-slate-600">{{ task.owner }}</span>
                  </div>
                </td>
                <td class="py-4">
                  <div class="flex items-center gap-2">
                    <Briefcase size="12" class="text-slate-400" />
                    <span class="text-sm text-slate-600">{{ task.department }}</span>
                  </div>
                </td>
                <td class="py-4">
                  <span :class="`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    task.taskType === 'Training' ? 'bg-blue-50 text-blue-600' : 'bg-cyan-50 text-cyan-600'
                  }`">
                    {{ task.taskType }}
                  </span>
                </td>
                <td class="py-4">
                  <div class="flex items-center gap-2">
                    <Tag size="12" class="text-slate-400" />
                    <span class="text-sm text-slate-600">{{ task.modelName }}</span>
                  </div>
                </td>
                <td class="py-4 text-right">
                  <span class="text-sm text-blue-600 font-bold">{{ task.consumedCardHours.toLocaleString() }}</span>
                </td>
                <td class="py-4">
                  <div class="flex items-center gap-2 text-slate-400">
                    <Clock size="12" />
                    <span class="text-xs">{{ task.startTime }}</span>
                  </div>
                </td>
                <td class="py-4">
                  <div class="flex items-center gap-2 text-slate-400">
                    <Clock size="12" />
                    <span class="text-xs">{{ task.endTime }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart {
  height: 100%;
  width: 100%;
}
</style>
