import React from 'react';
import { DetectedBias } from '../types';

interface BiasDetailsProps {
  biases: DetectedBias[];
}

const BiasDetails: React.FC<BiasDetailsProps> = ({ biases }) => {
  if (biases.length === 0) {
    return (
      <div className="text-slate-400 text-sm italic text-center py-8">
        No specific cognitive biases detected yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {biases.map((bias, idx) => (
        <div 
          key={idx} 
          className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 transition hover:border-cyan-400/50 hover:bg-slate-800"
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-cyan-400 font-semibold font-mono">{bias.name}</h4>
            <span className={`text-xs px-2 py-1 rounded font-bold ${
              bias.confidence > 80 ? 'bg-red-500/20 text-red-400' : 
              bias.confidence > 50 ? 'bg-yellow-500/20 text-yellow-400' : 
              'bg-blue-500/20 text-blue-400'
            }`}>
              {bias.confidence}% Conf.
            </span>
          </div>
          
          <p className="text-slate-300 text-sm mb-3">{bias.description}</p>
          
          <div className="bg-slate-900/50 p-3 rounded border-l-2 border-slate-600">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Trigger Detected:</p>
            <p className="text-slate-200 text-sm italic font-serif">"{bias.triggerPhrase}"</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BiasDetails;
