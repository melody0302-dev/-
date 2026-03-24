export interface GPUModel {
  id: string;
  name: string;
  clusterName: string;
  totalCards: number;
  usedCards: number;
  isAdmitted: boolean;
  trainingEnabled: boolean;
  inferenceEnabled: boolean;
  trainingLimit: number; // percentage (0-100)
  inferenceLimit: number; // percentage (0-100)
  predicted7dCardHours: number;
  reservedCardHours: number;
  consumedCardHours: number;
  guaranteeRate: number;
  enabledClusters: string; // e.g. "dt02;dt"
}

export interface QueueRule {
  id: string;
  queueName: string;
  modelId: string;
  modelName: string;
  maxReplicas: number;
  maxCardHours: number;
  operator: string;
}

export interface KillConfig {
  threshold: number; // percentage
  gracePeriod: number; // minutes
  enabled: boolean;
  whitelistQueues: string[];
}

export interface Reservation {
  id: string;
  queueName: string;
  modelId: string;
  modelName: string;
  startTime: string;
  endTime: string;
  cardHours: number;
  status: 'active' | 'expired' | 'pending';
  nature: 'periodic' | 'non-periodic';
  periodType?: 'daily';
}

export interface ClusterStats {
  totalCardHours: number;
  usedCardHours: number;
  availableCardHours: number;
  tidalCardHours: number;
  models: GPUModel[];
}

export interface ElasticTask {
  id: string;
  taskName: string;
  owner: string;
  department: string;
  taskType: string;
  modelName: string;
  consumedCardHours: number;
  startTime: string;
  endTime: string;
}
