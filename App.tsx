
import React, { useState, useCallback, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import TicketBoard from './components/TicketBoard';
import CompliancePanel from './components/CompliancePanel';
import { INITIAL_TICKETS, RACK_GUARDRAILS } from './constants';
import { AppState, Message, TicketStatus, Ticket } from './types';
import { chatWithGemini } from './services/gemini';
import { RackProcessor } from './services/rackProcessor';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    tickets: INITIAL_TICKETS,
    messages: [],
    isProcessing: false,
    hitlRequired: false,
    activeTicketId: undefined,
    guardrails: RACK_GUARDRAILS,
  });

  const handleSendMessage = useCallback(async (content: string) => {
    // 1. Evaluate User Message for RACK before even calling the model
    const initialRackEval = RackProcessor.evaluate(content);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isProcessing: true,
    }));

    try {
      // 2. Chat with Gemini
      const response = await chatWithGemini([...state.messages, userMessage]);
      const resultCandidate = response.candidates?.[0];
      
      let aiResponseText = response.text || "I'm sorry, I couldn't generate a response.";
      let rackEvaluation = initialRackEval;
      let isHitl = false;

      // 3. Handle Function Calls (Operational Actions)
      if (response.functionCalls && response.functionCalls.length > 0) {
        for (const fc of response.functionCalls) {
          const { name, args } = fc;
          
          // Re-evaluate RACK based on the intended function call
          const functionRackEval = RackProcessor.evaluate(content, name);
          rackEvaluation = functionRackEval;

          if (functionRackEval.status === 'blocked') {
            aiResponseText = `I apologize, but I am not authorized to perform that action: ${functionRackEval.reasoning}`;
          } else if (functionRackEval.status === 'escalated' || name === 'escalate_to_human') {
            aiResponseText = `This request requires human oversight. ${functionRackEval.reasoning}. I've paged a support supervisor.`;
            isHitl = true;
          } else {
            // Execute Mock Logic
            if (name === 'list_tickets') {
              aiResponseText = `I've retrieved the ticket list. There are ${state.tickets.length} tickets available.`;
            } else if (name === 'get_ticket_details') {
              const ticket = state.tickets.find(t => t.id === args.ticketId);
              if (ticket) {
                aiResponseText = `Found details for ${args.ticketId}: ${ticket.subject}. Status: ${ticket.status}. Priority: ${ticket.priority}. Customer: ${ticket.customerName}. Description: ${ticket.description}`;
                setState(p => ({ ...p, activeTicketId: args.ticketId }));
              } else {
                aiResponseText = `I couldn't find a ticket with ID ${args.ticketId}.`;
              }
            } else if (name === 'update_ticket') {
              setState(p => ({
                ...p,
                tickets: p.tickets.map(t => t.id === args.ticketId ? { 
                  ...t, 
                  status: args.status || t.status, 
                  priority: args.priority || t.priority,
                  lastUpdate: new Date().toISOString() 
                } : t)
              }));
              aiResponseText = `Ticket ${args.ticketId} has been updated successfully.`;
            } else if (name === 'issue_refund') {
              aiResponseText = "Refund request for $50 initiated. This is within my autonomous limit.";
            }
          }
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponseText,
        timestamp: Date.now(),
        rackEvaluation,
        isHitl,
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isProcessing: false,
        hitlRequired: isHitl,
      }));

    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: "Operational Error: Connection to the intelligence engine timed out. Please try again or contact system administration.",
        timestamp: Date.now(),
      };
      setState(prev => ({ ...prev, messages: [...prev.messages, errorMessage], isProcessing: false }));
    }
  }, [state.messages, state.tickets]);

  return (
    <div className="h-screen w-full flex flex-col bg-slate-50 text-slate-900 overflow-hidden">
      {/* Top Navbar */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-800">RACK Support Guard</h1>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Enterprise Compliance AI v1.4</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-100 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            System Healthy
          </div>
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden p-6 gap-6">
        {/* Left: Chat Interface (Primary) */}
        <section className="flex-1 min-w-0">
          <ChatInterface 
            messages={state.messages} 
            onSendMessage={handleSendMessage}
            isProcessing={state.isProcessing}
          />
        </section>

        {/* Right Sidebar: Tickets and Compliance */}
        <aside className="hidden lg:flex flex-col w-96 gap-6 overflow-hidden">
          <div className="h-1/2">
            <TicketBoard 
              tickets={state.tickets} 
              activeTicketId={state.activeTicketId}
            />
          </div>
          <div className="h-1/2">
            <CompliancePanel guardrails={state.guardrails} />
          </div>
        </aside>
      </main>

      {/* Footer Info */}
      <footer className="h-8 px-6 bg-white border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-medium">
        <div>&copy; 2024 RACK Systems Inc. Confidential.</div>
        <div className="flex gap-4 uppercase tracking-widest">
          <span>Encrypted Session</span>
          <span className="text-blue-500">Authenticated: Agent AI_01</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
