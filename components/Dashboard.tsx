import React from 'react';
import { BiasDetectorResponse } from '../types';
import ScoreChart from './ScoreChart';
import BiasDetails from './BiasDetails';

interface DashboardProps {
  data: BiasDetectorResponse | null;
  loading: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
          <p className="text-cyan-400 font-mono animate-pulse">Running Cognitive Audit...</p>
        </div>
      </div>
    );
  }

  if (!data || data.overallScore === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center min-h-[400px] text-slate-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <p>Enter a decision scenario to initialize the audit system.</p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Scores & Visuals */}
      <div className="lg:col-span-5 space-y-6">
        {/* Main Score Card */}
        <div className="glass-panel p-6 rounded-xl flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
          <h3 className="text-slate-400 uppercase tracking-widest text-xs font-bold mb-2">Decision Quality Score</h3>
          <div className={`text-6xl font-bold font-mono my-2 ${getScoreColor(data.overallScore)}`}>
            {data.overallScore}
            <span className="text-2xl text-slate-600">/100</span>
          </div>
          <p className="text-sm text-slate-300 mt-2">{data.summary}</p>
        </div>

        {/* Metrics Chart */}
        <div className="glass-panel p-4 rounded-xl">
           <h3 className="text-slate-400 uppercase tracking-widest text-xs font-bold mb-4 text-center">Audit Metrics</h3>
           <ScoreChart metrics={data.metrics} />
        </div>
      </div>

      {/* Right Column: Details & Correction */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Bias List */}
        <div className="glass-panel p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                Detected Anomalies
             </h3>
             <span className="bg-slate-700 text-xs px-2 py-1 rounded text-slate-300">{data.biases.length} Found</span>
          </div>
          <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            <BiasDetails biases={data.biases} />
          </div>
        </div>

        {/* Correction/Counterfactual */}
        <div className="glass-panel p-6 rounded-xl border-t-2 border-t-green-500/50">
          <h3 className="text-green-400 font-semibold text-lg mb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI Optimized Alternative
          </h3>
          <div className="prose prose-invert prose-sm max-w-none">
            <p className="text-slate-300 leading-relaxed whitespace-pre-line">{data.correction}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
