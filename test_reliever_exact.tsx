import React, { useMemo } from 'react';
import { renderToString } from 'react-dom/server';
import { allStaff, postRequirements, postRequirements as initialPosts } from './src/data';
import { Staff, PostRequirement } from './src/types';

const RelieverManager = () => {
  const staff = allStaff;
  const posts = postRequirements;
  const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const changedShiftMap = new Map<string, string>();
  const relievers = staff.filter(s => s.permanentGroup === 'Reliever');
  
  const extractPostNumbers = (str: string): string[] => {
     const nums: string[] = [];
     const regex = /(?:post|rg)[-\s]*([\d\s,&and]+)/gi;
     let match;
     while ((match = regex.exec(str)) !== null) {
         const extracted = match[1].match(/\d+/g);
         if (extracted) {
             const prefix = match[0].toLowerCase().includes('rg') ? 'rg' : 'post';
             nums.push(...extracted.map(n => prefix + '-' + parseInt(n, 10).toString()));
         }
     }
     if (nums.length === 0) {
         const allNums = str.match(/\d+/g);
         if (allNums && str.toLowerCase().includes('post')) {
             nums.push(...allNums.map(n => 'post-' + parseInt(n, 10).toString()));
         }
     }
     return nums;
  };

  const assignmentsByDay = useMemo(() => {
    const assignments = new Map<string, Map<string, Staff[]>>();

    days.forEach(day => {
      const dayAssignments = new Map<string, Staff[]>();
      
      const unassignedOffStaff = staff.filter(s => {
         const isSReliever = changedShiftMap.has(s.id) ? changedShiftMap.get(s.id) === 'Reliever' : s.permanentGroup === 'Reliever';
         if (isSReliever) return false;
         if (String(s.offDay || '').trim().toLowerCase() !== day.toLowerCase()) return false;
         return true;
      });

      relievers.forEach(r => {
          if (String(r.offDay || '').trim().toLowerCase() === day.toLowerCase()) return;
          
          const covered: Staff[] = [];
          for (let i = unassignedOffStaff.length - 1; i >= 0; i--) {
              const s = unassignedOffStaff[i];
              
              const supportedPosts = posts.filter(p => {
                const initialPost = initialPosts.find(ip => ip.id === p.id);
                const supports = p.supportPersons || (initialPost ? initialPost.supportPersons : []) || [];
                return supports.includes(r.id);
              });
              
              const sSub = (s.subSection || '').toLowerCase();
              const rSub = (r.subSection || '').toLowerCase();
              
              let matches = false;
              if (r.role === 'LadyGuard' && s.role === 'LadyGuard') matches = true;
              else if (r.role === 'Supervisor' && s.role === 'Supervisor') matches = true;
              
              const sTags = extractPostNumbers(sSub);
              const rTags = extractPostNumbers(rSub);
              
              if (!matches && sTags.length > 0 && rTags.length > 0) {
                  if (sTags.some(tag => rTags.includes(tag))) matches = true;
              }
              
              if (!matches && sTags.length === 0 && rTags.length === 0) {
                  if (rSub && sSub && (rSub.includes(sSub) || sSub.includes(rSub)) && sSub.length > 3) matches = true;
              }
              
              if (!matches) {
                matches = supportedPosts.some(p => {
                  const pTags = extractPostNumbers(p.name);
                  if (sTags.length > 0 && pTags.length > 0) {
                      if (sTags.some(tag => pTags.includes(tag))) return true;
                  }
                  const pName = p.name.toLowerCase();
                  if (sSub.includes(pName) || pName.includes(sSub)) return true;
                  return false;
                });
              }

              if (matches) {
                 covered.push(s);
                 unassignedOffStaff.splice(i, 1);
              }
          }
          dayAssignments.set(r.id, covered);
      });
      assignments.set(day, dayAssignments);
    });
    return assignments;
  }, [staff, relievers, days, changedShiftMap, posts]);

  const tue = assignmentsByDay.get('Tuesday')!;
  console.log("Tuesday - Amrite Paul:", tue.get('313107')?.map(s=>s.name));
  console.log("Tuesday - Mafiga Begum:", tue.get('314842')?.map(s=>s.name));
  return <div>Test</div>;
};

renderToString(<RelieverManager />);
