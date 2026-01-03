import React, { useState } from 'react';
import { analyzeDecisionBias } from './services/geminiService';
import { BiasDetectorResponse, MOCK_INITIAL_DATA, ScenarioContext } from './types';
import Dashboard from './components/Dashboard';

const PRESET_SCENARIOS = [
  {
    label: "Hiring Decision",
    text: "I interviewed John today. He went to the same university as me, which means he clearly has a good educational foundation. He seemed a bit nervous during the technical questions, but I think he's just a 'big picture' thinker like myself. The other candidate had better test scores, but didn't have that 'spark' or culture fit. I'm going to recommend hiring John."
  },
  {
    label: "Project Investment",
    text: "We've already spent $2 million on Project X over the last 3 years. Even though the market research shows user interest is declining, we can't just throw away that investment. If we put in another $500k, we can probably turn it around. Quitting now would be a total waste of the budget we've already used."
  },
  {
    label: "Price Setting",
    text: "Our competitor launched their product at $50. I think we should price ours at $45 to undercut them. It feels like the right number. I haven't looked at our unit economics in detail yet, but $45 seems close enough to their price to be competitive but cheaper."
  }
];

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [context, setContext] = useState<ScenarioContext>(ScenarioContext.NONE);
  const [result, setResult] = useState<BiasDetectorResponse>(MOCK_INITIAL_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeDecisionBias(inputText, context);
      setResult(data);
    } catch (err) {
      setError("Analysis failed. Please check your API key and connection.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadScenario = (text: string) => {
    setInputText(text);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">CogniClear <span className="text-cyan-400 font-mono text-sm font-normal ml-1">v1.0</span></h1>
          </div>
          <div className="text-xs font-mono text-slate-500">
             SYSTEM_STATUS: <span className="text-green-500">ONLINE</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Intro / Banner */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-3">
            Audit Your Decisions. Eliminate Bias.
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Our AI engine detects cognitive traps like Confirmation Bias, Anchoring, and Sunk Cost Fallacy in your reasoning text.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Input Section */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Context Selectors */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
              <label className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-3 block">
                Analysis Context
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: ScenarioContext.NONE, label: "Normal" },
                  { value: ScenarioContext.HIGH_STAKES, label: "High Stakes" },
                  { value: ScenarioContext.TIME_PRESSURE, label: "Time Pressure" },
                  { value: ScenarioContext.PEER_PRESSURE, label: "Peer Pressure" }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setContext(opt.value)}
                    className={`text-sm py-2 px-3 rounded-md transition-all border ${
                      context === opt.value
                        ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400'
                        : 'bg-slate-800 border-transparent text-slate-400 hover:bg-slate-750 hover:text-slate-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Input Area */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col h-[500px]">
              <div className="flex justify-between items-center mb-3">
                 <label className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                  Decision Narrative
                </label>
                <div className="flex gap-2">
                   {PRESET_SCENARIOS.map((preset, idx) => (
                     <button 
                       key={idx}
                       onClick={() => loadScenario(preset.text)}
                       className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-400 px-2 py-1 rounded transition"
                       title={`Load ${preset.label} preset`}
                     >
                       {preset.label}
                     </button>
                   ))}
                </div>
              </div>
              
              <textarea
                className="flex-1 w-full bg-slate-950 border border-slate-700 rounded-lg p-4 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 resize-none font-mono leading-relaxed"
                placeholder="Describe your decision making process here... e.g. 'I decided to invest in X because...'"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />

              <div className="mt-4">
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !inputText.trim()}
                  className={`w-full py-3 rounded-lg font-bold text-sm tracking-wide uppercase transition-all shadow-lg ${
                    loading || !inputText.trim()
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-500/20'
                  }`}
                >
                  {loading ? 'Processing Neural Audit...' : 'Analyze for Bias'}
                </button>
                {error && <p className="text-red-400 text-xs mt-2 text-center">{error}</p>}
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-8">
            <Dashboard data={result} loading={loading} />
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;
