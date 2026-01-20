
import React, { useState, useCallback, useEffect } from 'react';
import { RefreshCw, Layers } from 'lucide-react';
import { BASE_MEMBERS, EXTRA_MEMBER } from './constants';
import { SkillLevel, TeamMember } from './types';
import SkillBadge from './components/SkillBadge';

const App: React.FC = () => {
  const [isExtended, setIsExtended] = useState(false);
  const [members, setMembers] = useState<TeamMember[]>(BASE_MEMBERS);
  const [skills, setSkills] = useState<SkillLevel[]>([]);
  const [isRotating, setIsRotating] = useState(false);

  // Initialize and reset skills when the mode toggles
  useEffect(() => {
    // Switch ON (isExtended = true) adds the extra name and includes Middle-Intermediate
    // Switch OFF (isExtended = false) keeps 4 names and has Lower/Upper Intermediate
    const currentMembers = isExtended ? [...BASE_MEMBERS, EXTRA_MEMBER] : BASE_MEMBERS;
    setMembers(currentMembers);

    // Intermediate is "constantly split" (Lower/Upper)
    // Switch ON adds "Middle-Intermediate"
    const availableSkills: SkillLevel[] = isExtended 
      ? ['Beginner', 'Lower-Intermediate', 'Middle-Intermediate', 'Upper-Intermediate', 'Advanced']
      : ['Beginner', 'Lower-Intermediate', 'Upper-Intermediate', 'Advanced'];

    // Fill the skills array by matching or cycling through available skills
    const initialSkills = currentMembers.map((_, index) => 
      availableSkills[index % availableSkills.length]
    );
    setSkills(initialSkills);
  }, [isExtended]);

  const rotateSkills = useCallback(() => {
    setIsRotating(true);
    // Brief timeout for visual feedback
    setTimeout(() => {
      setSkills(prevSkills => {
        const newSkills = [...prevSkills];
        const lastSkill = newSkills.pop()!;
        newSkills.unshift(lastSkill);
        return newSkills;
      });
      setIsRotating(false);
    }, 150);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Header with Switch */}
          <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-600 font-medium">
              <Layers className="w-5 h-5" />
              <span>{isExtended ? 'Extra Tier (Middle-Int)' : 'Split Intermediates'}</span>
            </div>
            <button 
              onClick={() => setIsExtended(!isExtended)}
              aria-label="Toggle Extended Mode"
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isExtended ? 'bg-indigo-600' : 'bg-slate-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isExtended ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Member List */}
          <ul className="divide-y divide-slate-100">
            {members.map((member, index) => (
              <li 
                key={member.id} 
                className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
              >
                <span className="text-lg font-semibold text-slate-700">{member.name}</span>
                <div className={`transition-all duration-300 transform ${isRotating ? 'scale-90 opacity-0' : 'scale-100 opacity-100'}`}>
                  {skills[index] && <SkillBadge level={skills[index]} />}
                </div>
              </li>
            ))}
          </ul>

          {/* Action Footer */}
          <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-center">
            <button
              onClick={rotateSkills}
              disabled={isRotating}
              className={`
                group flex items-center gap-3 px-8 py-3 rounded-xl font-bold text-white shadow-md
                transition-all duration-200 active:scale-95
                ${isRotating 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-100'}
              `}
            >
              <RefreshCw className={`w-5 h-5 ${isRotating ? 'animate-spin' : ''}`} />
              <span className="uppercase tracking-wider">Rotate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
