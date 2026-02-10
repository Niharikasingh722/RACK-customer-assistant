
import React, { useState, useRef, useEffect } from 'react';
import { Message, RackEvaluation } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isProcessing: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isProcessing }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onSendMessage(input);
      setInput('');
    }
  };

  const getRackBadge = (evalData?: RackEvaluation) => {
    if (!evalData) return null;
    const colors = {
      allowed: 'bg-green-100 text-green-700 border-green-200',
      blocked: 'bg-red-100 text-red-700 border-red-200',
      escalated: 'bg-amber-100 text-amber-700 border-amber-200',
    };
    return (
      <div className={`mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border inline-block ${colors[evalData.status]}`}>
        RACK: {evalData.status} | Risk: {evalData.risk}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">AI</div>
          <div>
            <h2 className="font-semibold text-slate-800">Support Assistant</h2>
            <div className="flex items-center gap-1.5 text-xs text-green-600">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              RACK Guardrails Active
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
            <svg className="w-12 h-12 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <p>How can I help you with your tickets today?</p>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
            }`}>
              <div className="text-sm whitespace-pre-wrap leading-relaxed">{m.content}</div>
              {m.role === 'assistant' && getRackBadge(m.rackEvaluation)}
              {m.isHitl && (
                <div className="mt-2 bg-amber-500/10 text-amber-600 p-2 rounded-lg text-xs font-medium border border-amber-500/20">
                  ⚠️ Human agent joined the conversation.
                </div>
              )}
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-none border border-slate-200 flex gap-1">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-100 bg-slate-50">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your request... (e.g., 'List my tickets')"
            disabled={isProcessing}
            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isProcessing || !input.trim()}
            className="absolute right-2 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition disabled:opacity-30"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
