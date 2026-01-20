
import { TeamMember, SkillLevel } from './types';

export const BASE_MEMBERS: TeamMember[] = [
  { id: '1', name: 'Alyssa' },
  { id: '2', name: 'Rami' },
  { id: '3', name: 'David' },
  { id: '4', name: 'Chloe' }
];

export const EXTRA_MEMBER: TeamMember = { id: '5', name: 'Tin/Nikita' };

export const SKILL_COLORS: Partial<Record<SkillLevel, string>> = {
  'Beginner': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Lower-Intermediate': 'bg-blue-100 text-blue-700 border-blue-200',
  'Middle-Intermediate': 'bg-sky-100 text-sky-700 border-sky-200',
  'Upper-Intermediate': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Intermediate': 'bg-slate-100 text-slate-700 border-slate-200',
  'Advanced': 'bg-purple-100 text-purple-700 border-purple-200'
};
