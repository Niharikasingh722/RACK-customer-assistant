
export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in-progress',
  RESOLVED = 'resolved',
  ESCALATED = 'escalated'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface Ticket {
  id: string;
  customerName: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: Priority;
  createdAt: string;
  lastUpdate: string;
  assignedTo?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  rackEvaluation?: RackEvaluation;
  isHitl?: boolean;
}

export interface RackEvaluation {
  risk: 'low' | 'medium' | 'high';
  authority: boolean;
  controlLimits: string[];
  knowledgeBaseUsed: string[];
  status: 'allowed' | 'blocked' | 'escalated';
  reasoning: string;
}

export interface RackGuardrail {
  id: string;
  category: 'risk' | 'authority' | 'control' | 'knowledge';
  rule: string;
  action: 'block' | 'warn' | 'escalate';
}

export interface AppState {
  tickets: Ticket[];
  messages: Message[];
  isProcessing: boolean;
  hitlRequired: boolean;
  activeTicketId?: string;
  guardrails: RackGuardrail[];
}
