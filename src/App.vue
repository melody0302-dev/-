<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import Sidebar from './components/Sidebar.vue';
import Monitoring from './components/Monitoring.vue';
import Admission from './components/Admission.vue';
import Priority from './components/Priority.vue';
import KillConfigView from './components/KillConfig.vue';
import ReservationView from './components/Reservation.vue';
import type { ClusterStats, GPUModel, QueueRule, KillConfig, Reservation, ElasticTask } from './types';

const INITIAL_MODELS: GPUModel[] = [
  {
    id: '1',
    name: 'NVIDIA A100',
    clusterName: 'dt02',
    totalCards: 1024,
    usedCards: 842,
    isAdmitted: true,
    trainingEnabled: true,
    inferenceEnabled: true,
    trainingLimit: 80,
    inferenceLimit: 20,
    predicted7dCardHours: 125000,
    reservedCardHours: 15000,
    consumedCardHours: 82400,
    guaranteeRate: 95,
    enabledClusters: 'dt02;dt'
  },
  {
    id: '2',
    name: 'ASCEND910',
    clusterName: 'dt02',
    totalCards: 512,
    usedCards: 120,
    isAdmitted: true,
    trainingEnabled: true,
    inferenceEnabled: false,
    trainingLimit: 100,
    inferenceLimit: 0,
    predicted7dCardHours: 45000,
    reservedCardHours: 5000,
    consumedCardHours: 12000,
    guaranteeRate: 88,
    enabledClusters: 'dt02'
  },
  {
    id: '3',
    name: 'NVIDIA V100',
    clusterName: 'dt',
    totalCards: 2048,
    usedCards: 1500,
    isAdmitted: true,
    trainingEnabled: false,
    inferenceEnabled: true,
    trainingLimit: 0,
    inferenceLimit: 100,
    predicted7dCardHours: 85000,
    reservedCardHours: 10000,
    consumedCardHours: 65000,
    guaranteeRate: 92,
    enabledClusters: 'dt'
  }
];

const INITIAL_TASKS: ElasticTask[] = [
  {
    id: 't1',
    taskName: 'llm-pretrain-v2',
    owner: 'melody_admin',
    department: 'AI Lab',
    taskType: 'Training',
    modelName: 'NVIDIA A100',
    consumedCardHours: 12500,
    startTime: '2024-03-20 10:00',
    endTime: '2024-03-25 10:00'
  },
  {
    id: 't2',
    taskName: 'stable-diffusion-finetune',
    owner: 'john_doe',
    department: 'Creative AI',
    taskType: 'Training',
    modelName: 'NVIDIA V100',
    consumedCardHours: 4200,
    startTime: '2024-03-22 14:00',
    endTime: '2024-03-24 18:00'
  },
  {
    id: 't3',
    taskName: 'bert-inference-service',
    owner: 'jane_smith',
    department: 'NLP Group',
    taskType: 'Inference',
    modelName: 'NVIDIA A100',
    consumedCardHours: 850,
    startTime: '2024-03-24 08:00',
    endTime: '2024-03-25 08:00'
  }
];

const INITIAL_RULES: QueueRule[] = [
  {
    id: 'r1',
    queueName: 'elas-llm-train-01',
    modelId: '1',
    modelName: 'NVIDIA A100',
    maxReplicas: 32,
    maxCardHours: 50000,
    operator: 'admin_melody'
  },
  {
    id: 'r2',
    queueName: 'elas-search-dev-02',
    modelId: '3',
    modelName: 'NVIDIA V100',
    maxReplicas: 16,
    maxCardHours: 20000,
    operator: 'admin_melody'
  }
];

const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res1',
    queueName: 'A部门-高优训练队列',
    modelId: '1',
    modelName: 'NVIDIA A100',
    startTime: '2024-03-25 00:00',
    endTime: '2024-03-31 23:59',
    cardHours: 15000,
    status: 'active',
    nature: 'non-periodic'
  }
];

const activeTab = ref('dashboard');
const models = ref<GPUModel[]>(INITIAL_MODELS);
const rules = ref<QueueRule[]>(INITIAL_RULES);
const reservations = ref<Reservation[]>(INITIAL_RESERVATIONS);
const tasks = ref<ElasticTask[]>(INITIAL_TASKS);
const killConfig = ref<KillConfig>({
  threshold: 15,
  gracePeriod: 30,
  enabled: true,
  whitelistQueues: ['elas-llm-train-01', 'elas-search-dev-02']
});

const stats = ref<ClusterStats>({
  totalCardHours: 125000,
  usedCardHours: 82400,
  availableCardHours: 42600,
  tidalCardHours: 15800,
  models: INITIAL_MODELS
});

watchEffect(() => {
  const totalPredicted = models.value.reduce((acc, m) => acc + m.predicted7dCardHours, 0);
  const totalUsed = models.value.reduce((acc, m) => acc + m.usedCards * 24, 0); 
  stats.value = {
    totalCardHours: totalPredicted,
    usedCardHours: totalUsed,
    availableCardHours: totalPredicted - totalUsed,
    tidalCardHours: Math.round(totalPredicted * 0.12),
    models: models.value
  };
});

const handleUpdateModel = (id: string, updates: Partial<GPUModel>) => {
  models.value = models.value.map(m => m.id === id ? { ...m, ...updates } : m);
};

const handleAddRule = (rule: Omit<QueueRule, 'id'>) => {
  const id = Math.random().toString(36).substr(2, 9);
  rules.value = [...rules.value, { ...rule, id }];
};

const handleDeleteRule = (id: string) => {
  rules.value = rules.value.filter(r => r.id !== id);
};

const handleAddReservation = (res: Omit<Reservation, 'id' | 'status'>) => {
  const id = Math.random().toString(36).substr(2, 9);
  const modelName = models.value.find(m => m.id === res.modelId)?.name || 'Unknown';
  reservations.value = [...reservations.value, { ...res, id, modelName, status: 'pending' }];
};

const handleDeleteReservation = (id: string) => {
  reservations.value = reservations.value.filter(r => r.id !== id);
};
</script>

<template>
  <div className="flex min-h-screen bg-[#f0f2f5]">
    <Sidebar :activeTab="activeTab" @setActiveTab="activeTab = $event" />
    
    <main className="flex-1 flex flex-col min-w-0">
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <Monitoring v-if="activeTab === 'dashboard'" :stats="stats" :tasks="tasks" />
          <Admission v-else-if="activeTab === 'admission'" :models="models" @update="handleUpdateModel" />
          <Priority v-else-if="activeTab === 'priority'" :rules="rules" :models="models" @add="handleAddRule" @delete="handleDeleteRule" />
          <ReservationView v-else-if="activeTab === 'reservation'" :reservations="reservations" :models="models" @add="handleAddReservation" @delete="handleDeleteReservation" />
          <KillConfigView v-else-if="activeTab === 'kill-config'" :config="killConfig" @change="killConfig = $event" />
          <Monitoring v-else :stats="stats" :tasks="tasks" />
        </div>
      </div>
    </main>
  </div>
</template>
