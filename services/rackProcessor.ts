
import { RackEvaluation, Message } from '../types';

export class RackProcessor {
  /**
   * Simulates the RACK evaluation engine that runs alongside the LLM.
   * In a real system, this might be another LLM call or a rule-based engine.
   */
  static evaluate(message: string, actionIntent?: string): RackEvaluation {
    const lowerMessage = message.toLowerCase();
    
    // Default evaluation
    let evalResult: RackEvaluation = {
      risk: 'low',
      authority: true,
      controlLimits: ['Basic Support Access'],
      knowledgeBaseUsed: ['General Docs'],
      status: 'allowed',
      reasoning: 'Request is within standard operational parameters.'
    };

    // Risk Check
    if (lowerMessage.includes('refund') || lowerMessage.includes('money') || lowerMessage.includes('billing')) {
      evalResult.risk = 'medium';
      evalResult.reasoning = 'Financial request detected. Monitoring for limits.';
    }

    // Authority Check
    if (lowerMessage.includes('delete') || lowerMessage.includes('cancel account')) {
      evalResult.authority = false;
      evalResult.status = 'blocked';
      evalResult.reasoning = 'Account deletion requires specific administrative authority not granted to AI.';
    }

    // Control Check (e.g., amount limits)
    if (actionIntent === 'issue_refund') {
      // Mock logic: if we suspect a high amount, we escalate
      if (lowerMessage.includes('large') || lowerMessage.includes('100') || lowerMessage.includes('all')) {
        evalResult.status = 'escalated';
        evalResult.risk = 'high';
        evalResult.reasoning = 'Refund amount exceeds $50 threshold. Escalating to human authority.';
      }
    }

    // Knowledge Check
    if (lowerMessage.includes('legal') || lowerMessage.includes('sue')) {
      evalResult.status = 'escalated';
      evalResult.reasoning = 'Legal threats or inquiries require immediate human-in-the-loop intervention.';
    }

    return evalResult;
  }
}
