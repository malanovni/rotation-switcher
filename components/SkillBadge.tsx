
import React from 'react';
import { SkillLevel } from '../types';
import { SKILL_COLORS } from '../constants';

interface SkillBadgeProps {
  level: SkillLevel;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ level }) => {
  return (
    <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border shadow-sm transition-all duration-300 ${SKILL_COLORS[level]}`}>
      {level}
    </span>
  );
};

export default SkillBadge;
