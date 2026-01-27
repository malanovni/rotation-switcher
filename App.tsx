import React, { useState, useCallback } from 'react';
import { Plus, Minus, Shuffle, Trash2, LayoutGrid, Users, Wand2 } from 'lucide-react';
import { DEFAULT_PARTICIPANTS, DEFAULT_GROUP_SIZE } from './constants';
import { ShuffleRound, Group } from './types';
import GroupDisplay from './components/GroupDisplay';

const App: React.FC = () => {
  const [participantCount, setParticipantCount] = useState(DEFAULT_PARTICIPANTS);
  const [groupSize, setGroupSize] = useState(DEFAULT_GROUP_SIZE);
  const [history, setHistory] = useState<ShuffleRound[]>([]);

  const adjustCount = (amount: number) => {
    setParticipantCount(prev => Math.max(1, prev + amount));
  };

  const autoSplit = () => {
    // Heuristic: Square root creates a balanced grid (e.g., 16 -> 4x4)
    // Ensures we don't default to 1 unless necessary
    const optimalSize = Math.max(2, Math.round(Math.sqrt(participantCount)));
    setGroupSize(optimalSize);
  };

  const performShuffle = useCallback(() => {
    // Create pool of participants [1, 2, ..., N]
    const pool = Array.from({ length: participantCount }, (_, i) => i + 1);
    
    // Fisher-Yates Shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    // Chunk into groups
    const groups: Group[] = [];
    const effectiveGroupSize = Math.min(groupSize, participantCount); // Handle case where size > count

    for (let i = 0; i < pool.length; i += effectiveGroupSize) {
      groups.push({
        id: Math.random().toString(36).substr(2, 9),
        members: pool.slice(i, i + effectiveGroupSize)
      });
    }

    // Rule: No number should ever be alone.
    // If we have more than one group and the last group has exactly 1 member,
    // merge it into the previous group to avoid a singleton.
    if (groups.length > 1 && groups[groups.length - 1].members.length === 1) {
      const lonelyGroup = groups.pop();
      if (lonelyGroup) {
        groups[groups.length - 1].members.push(...lonelyGroup.members);
      }
    }

    const newRound: ShuffleRound = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      participantCount,
      groups
    };

    setHistory(prev => [newRound, ...prev]);
  }, [participantCount, groupSize]);

  const clearHistory = () => {
    if (confirm('Clear all shuffled groups?')) {
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2 flex items-center justify-center gap-3">
            <LayoutGrid className="w-8 h-8 text-indigo-600" />
            Number Shuffler
          </h1>
          <p className="text-slate-500">Create even groups from a pool of participants.</p>
        </header>

        {/* Controls Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Participant Count */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
                Total People
              </label>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => adjustCount(-1)}
                  className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                >
                  <Minus className="w-5 h-5 text-slate-600" />
                </button>
                <div className="flex-1 text-center">
                  <span className="text-4xl font-black text-indigo-600">{participantCount}</span>
                </div>
                <button 
                  onClick={() => adjustCount(1)}
                  className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                >
                  <Plus className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>

            {/* Group Size */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                  Group Size
                </label>
                <button
                  onClick={autoSplit}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-100"
                  title="Auto-calculate balanced group size"
                >
                  <Wand2 className="w-3 h-3" />
                  AUTO
                </button>
              </div>
              <div className="flex items-center gap-4">
                <input 
                  type="range"
                  min="1"
                  max={Math.max(1, participantCount)}
                  value={groupSize}
                  onChange={(e) => setGroupSize(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <span className="w-8 text-center font-bold text-slate-700">{groupSize}</span>
              </div>
              <p className="mt-2 text-[10px] text-slate-400 font-medium">Split pool into groups of {groupSize}</p>
            </div>
          </div>

          <button
            onClick={performShuffle}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            <Shuffle className="w-5 h-5" />
            SHUFFLE PARTICIPANTS
          </button>
        </div>

        {/* Results / History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-500" />
              Recent Shuffles
            </h2>
            {history.length > 0 && (
              <button 
                onClick={clearHistory}
                className="text-slate-400 hover:text-red-500 transition-colors p-2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400">
              <p className="text-sm">No shuffles generated yet.</p>
              <p className="text-xs mt-1">Adjust participant count and click Shuffle!</p>
            </div>
          ) : (
            history.map(round => (
              <GroupDisplay key={round.id} round={round} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default App;