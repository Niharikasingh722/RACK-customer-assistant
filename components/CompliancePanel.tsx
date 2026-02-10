
import React from 'react';
import { RackGuardrail } from '../types';

interface CompliancePanelProps {
  guardrails: RackGuardrail[];
}

const CompliancePanel: React.FC<CompliancePanelProps> = ({ guardrails }) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-900 text-white">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <h2 className="font-semibold">Compliance Engine</h2>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">Operational RACK Framework v1.4.2</p>
      </div>

      <div className="p-4 grid grid-cols-2 gap-2 border-b border-slate-100">
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
          <div className="text-[10px] font-bold text-blue-600 uppercase mb-1">Latency</div>
          <div className="text-xl font-bold text-slate-800">42ms</div>
        </div>
        <div className="p-3 bg-green-50 rounded-lg border border-green-100">
          <div className="text-[10px] font-bold text-green-600 uppercase mb-1">Trust Score</div>
          <div className="text-xl font-bold text-slate-800">99.8%</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Active Guardrails</h3>
          <div className="space-y-2">
            {guardrails.map((g) => (
              <div key={g.id} className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                    g.category === 'risk' ? 'bg-red-100 text-red-600' :
                    g.category === 'authority' ? 'bg-purple-100 text-purple-600' :
                    g.category === 'control' ? 'bg-amber-100 text-amber-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {g.category}
                  </span>
                  <span className={`text-[9px] font-bold capitalize ${
                    g.action === 'block' ? 'text-red-500' :
                    g.action === 'escalate' ? 'text-amber-500' :
                    'text-blue-500'
                  }`}>
                    {g.action}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-tight">{g.rule}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">System Logs</h3>
          <div className="space-y-2 font-mono text-[9px]">
            <div className="text-slate-500"><span className="text-green-600">[08:22:11]</span> RACK initialization complete.</div>
            <div className="text-slate-500"><span className="text-green-600">[08:22:14]</span> Connected to Gemini 3 Pro.</div>
            <div className="text-slate-500"><span className="text-blue-600">[08:25:01]</span> Action check: list_tickets... [ALLOWED]</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompliancePanel;
