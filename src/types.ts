export interface GPUModel {
  id: string;
  name: string;
  clusterName: string;
  totalCards: number;
  usedCards: number;
  isAdmitted: boolean;
  trainingEnabled: boolean;
  inferenceEnabled: boolean;
  trainingLimit: number;
  inferenceLimit: number;
  predicted7dCardHours: number;
  reservedCardHours: number;
  consumedCardHours: number;
  guaranteeRate: number;
}

export interface PriorityRule {
  id: string;
  queueName: string;
  effectiveUser: string;
  priority: 'P0' | 'P1' | 'P2';
  effectiveTime: string;
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
}

export interface ClusterStats {
  totalCardHours: number;
  usedCardHours: number;
  availableCardHours: number;
  models: GPUModel[];
}
