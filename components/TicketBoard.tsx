
import React from 'react';
import { Ticket, TicketStatus, Priority } from '../types';

interface TicketBoardProps {
  tickets: Ticket[];
  activeTicketId?: string;
}

const TicketBoard: React.FC<TicketBoardProps> = ({ tickets, activeTicketId }) => {
  const getPriorityColor = (p: Priority) => {
    switch(p) {
      case Priority.CRITICAL: return 'text-red-600 bg-red-50 border-red-200';
      case Priority.HIGH: return 'text-orange-600 bg-orange-50 border-orange-200';
      case Priority.MEDIUM: return 'text-blue-600 bg-blue-50 border-blue-200';
      case Priority.LOW: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getStatusIcon = (s: TicketStatus) => {
    switch(s) {
      case TicketStatus.RESOLVED: return (
        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
      );
      case TicketStatus.ESCALATED: return (
        <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
      );
      default: return <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center">
        <h2 className="font-semibold text-slate-800">Support Tickets</h2>
        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
          {tickets.length} Total
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {tickets.map((ticket) => (
          <div 
            key={ticket.id} 
            className={`p-4 rounded-xl border transition-all ${
              activeTicketId === ticket.id 
                ? 'border-blue-500 ring-2 ring-blue-100 shadow-md' 
                : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">{ticket.id}</span>
              <div className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority.toUpperCase()}
              </div>
            </div>
            <h3 className="font-semibold text-slate-900 text-sm mb-1 truncate">{ticket.subject}</h3>
            <p className="text-xs text-slate-600 mb-3 line-clamp-2">{ticket.description}</p>
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                {getStatusIcon(ticket.status)}
                <span className="text-[10px] font-semibold text-slate-500 capitalize">{ticket.status}</span>
              </div>
              <span className="text-[10px] text-slate-400">{ticket.customerName}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketBoard;
