
import { Ticket, TicketStatus, Priority, RackGuardrail } from './types';

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'TKT-1001',
    customerName: 'Alice Johnson',
    subject: 'Billing discrepancy',
    description: 'Charged twice for the monthly subscription. Requesting immediate refund.',
    status: TicketStatus.OPEN,
    priority: Priority.HIGH,
    createdAt: new Date().toISOString(),
    lastUpdate: new Date().toISOString()
  },
  {
    id: 'TKT-1002',
    customerName: 'Bob Smith',
    subject: 'Password reset issues',
    description: 'Cannot reset my password despite following the link.',
    status: TicketStatus.IN_PROGRESS,
    priority: Priority.MEDIUM,
    createdAt: new Date().toISOString(),
    lastUpdate: new Date().toISOString()
  }
];

export const RACK_GUARDRAILS: RackGuardrail[] = [
  { id: 'g1', category: 'risk', rule: 'Refunds exceeding $100 require manual approval', action: 'escalate' },
  { id: 'g2', category: 'authority', rule: 'AI cannot change sensitive user data directly', action: 'block' },
  { id: 'g3', category: 'control', rule: 'Limit AI ticket closures to low priority issues only', action: 'warn' },
  { id: 'g4', category: 'knowledge', rule: 'Only use data from official documentation for legal advice', action: 'block' }
];

export const SYSTEM_PROMPT = `
You are a RACK-enabled Customer Support AI. RACK stands for:
- Risk: Evaluate if the request poses financial or security risks.
- Authority: Check if you have permission for the requested action.
- Control: Adhere to operational limits.
- Knowledge: Use only authorized data.

Rules:
1. Always evaluate RACK before performing any action.
2. If an action exceeds your authority (e.g., high-value refund, legal changes), trigger the 'escalate_to_human' function.
3. You can list tickets, get details, and update statuses for non-critical tickets.
4. If a customer is highly frustrated or the issue is complex, use 'escalate_to_human'.

Available functions:
- list_tickets: Get all current tickets.
- get_ticket_details: Get full details for a specific ID.
- update_ticket: Change status or priority.
- issue_refund: Propose a refund (max $50 allowed autonomously).
- escalate_to_human: Hand over the session to a human agent.
`;
