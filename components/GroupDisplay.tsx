
import React from 'react';
import { ShuffleRound } from '../types';
import { Hash, Users } from 'lucide-react';

interface GroupDisplayProps {
  round: ShuffleRound;
}

const GroupDisplay: React.FC<GroupDisplayProps> = ({ round }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
          <Hash className="w-3 h-3" />
          Round {round.id.slice(0, 4)}
        </div>
        <div className="text-slate-400 text-xs">
          {round.timestamp.toLocaleTimeString()}
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {round.groups.map((group, idx) => (
            <div key={group.id} className="flex flex-col p-3 bg-indigo-50 rounded-lg border border-indigo-100">
              <span className="text-[10px] font-bold text-indigo-400 uppercase mb-2 flex items-center gap-1">
                <Users className="w-3 h-3" /> Group {idx + 1}
              </span>
              <div className="flex flex-wrap gap-2">
                {group.members.map(m => (
                  <span key={m} className="px-3 py-1 bg-white border border-indigo-200 rounded-md text-sm font-bold text-indigo-700 shadow-sm">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupDisplay;
