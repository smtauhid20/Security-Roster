import { Staff, ShiftType, PostRequirement, RosterAssignment, PermanentGroup, LeaveRecord, OTRecord } from '../types';

export const generateWeeklyRoster = (
  weekNumber: number,
  startDate: string,
  allStaff: Staff[],
  postRequirements: PostRequirement[],
  leaves: LeaveRecord[],
  ots: OTRecord[]
): RosterAssignment[] => {
  const roster: RosterAssignment[] = [];
  const weekLeaves = leaves.filter(l => l.weekNumber === weekNumber);
  const weekOts = ots.filter(o => o.weekNumber === weekNumber);
  
  const rotationCycle = (weekNumber - 1) % 3;
  
  const getAssignedShift = (permanentGroup: PermanentGroup): ShiftType => {
    if (permanentGroup === 'General') return 'General';
    if (permanentGroup === 'Reliever') return 'Reliever' as any;
    
    if (rotationCycle === 0) {
      if (permanentGroup === 'A') return 'C';
      if (permanentGroup === 'B') return 'A';
      if (permanentGroup === 'C') return 'B';
    } else if (rotationCycle === 1) {
      if (permanentGroup === 'A') return 'B';
      if (permanentGroup === 'B') return 'C';
      if (permanentGroup === 'C') return 'A';
    } else { // 2
      if (permanentGroup === 'A') return 'A';
      if (permanentGroup === 'B') return 'B';
      if (permanentGroup === 'C') return 'C';
    }
    return 'General';
  };

  const shiftPools: Record<ShiftType, Staff[]> = {
    A: [],
    B: [],
    C: [],
    General: [],
    Leave: [],
    OT: []
  };
  
  const relievers: Staff[] = [];
  const onLeaveIds = new Set(weekLeaves.map(l => l.staffId));

  allStaff.forEach(staff => {
    if (onLeaveIds.has(staff.id)) {
      shiftPools.Leave.push(staff);
      roster.push({
        staffId: staff.id,
        staffName: staff.name,
        role: staff.role,
        permanentGroup: staff.permanentGroup,
        assignedShift: 'Leave',
        assignedPost: 'সাপ্তাহিক ছুটি / অনুপস্থিত'
      });
    } else if (staff.permanentGroup === 'Reliever') {
      relievers.push(staff);
    } else if (staff.permanentGroup === 'General') {
      shiftPools.General.push(staff);
    } else {
      const assignedShift = getAssignedShift(staff.permanentGroup);
      shiftPools[assignedShift].push(staff);
    }
  });

  const guardRelievers = relievers.filter(r => r.role === 'Guard');
  const lgRelievers = relievers.filter(r => r.role === 'LadyGuard');
  const supRelievers = relievers.filter(r => r.role === 'Supervisor');

  // First, place relievers with explicit shifts in subSection
  const unassignedRelievers: Staff[] = [];
  
  [...guardRelievers, ...lgRelievers, ...supRelievers].forEach(r => {
    if (r.subSection?.includes('Shift- A') || r.subSection?.includes('Shift-A')) {
      shiftPools.A.push(r);
    } else if (r.subSection?.includes('Shift- B') || r.subSection?.includes('Shift-B')) {
      shiftPools.B.push(r);
    } else if (r.subSection?.includes('Shift- C') || r.subSection?.includes('Shift-C')) {
      shiftPools.C.push(r);
    } else {
      unassignedRelievers.push(r);
    }
  });

  // Distribute remaining relievers to hit exact targets: A (12), B (14), C (16)
  const TARGET_A = 12;
  const TARGET_B = 14;
  const TARGET_C = 16;

  unassignedRelievers.forEach(r => {
    if (shiftPools.A.length < TARGET_A) {
      shiftPools.A.push(r);
    } else if (shiftPools.B.length < TARGET_B) {
      shiftPools.B.push(r);
    } else if (shiftPools.C.length < TARGET_C) {
      shiftPools.C.push(r);
    } else {
      shiftPools.General.push(r); // Remaining go to General
    }
  });

  // Process explicit leave replacements
  weekLeaves.forEach(leave => {
    if (leave.replacementStaffId && leave.shiftType && leave.postName) {
      const replacementStaff = allStaff.find(s => s.id === leave.replacementStaffId);
      if (replacementStaff && !onLeaveIds.has(replacementStaff.id)) {
        // Remove from normal pool
        (['A', 'B', 'C', 'General'] as ShiftType[]).forEach(shift => {
          const idx = shiftPools[shift].findIndex(s => s.id === replacementStaff.id);
          if (idx !== -1) shiftPools[shift].splice(idx, 1);
        });
        
        roster.push({
          staffId: replacementStaff.id,
          staffName: replacementStaff.name,
          role: replacementStaff.role,
          permanentGroup: replacementStaff.permanentGroup,
          assignedShift: leave.shiftType,
          assignedPost: leave.postName,
          isReplacement: true
        });
        
        // Temporarily reduce the requirement count for this specific post/shift combination
        const req = postRequirements.find(p => p.name === leave.postName);
        if (req && req.shiftCounts[leave.shiftType] > 0) {
           // We mutate a copy if we want to be pure, but since we map inside assignPostsForShift, 
           // we can just let it assign one less. Let's handle it strictly in assignPostsForShift by tracking assigned counts.
        }
      }
    }
  });

  const assignPostsForShift = (shift: ShiftType, pool: Staff[]) => {
    const availableStaff = [...pool];
    
    postRequirements.forEach(req => {
      // Find how many are already assigned to this post in this shift (like replacements)
      const alreadyAssigned = roster.filter(r => r.assignedShift === shift && r.assignedPost === req.name).length;
      let needed = (req.shiftCounts[shift] || 0) - alreadyAssigned;
      
      while (needed > 0 && availableStaff.length > 0) {
        let staffIndex = -1;
        
        // Priority 1: Exact match by subSection for this staff
        staffIndex = availableStaff.findIndex(s => s.subSection === req.name || s.subSection?.includes(req.name) || req.name.includes(s.subSection || '----'));
        
        // Priority 2: Match by role if subSection match fails
        if (staffIndex === -1) {
          if (req.id.includes('lg') || req.name.includes('লেডি') || req.name.includes('Lady') || req.name.includes('Female')) {
            staffIndex = availableStaff.findIndex(s => s.role === 'LadyGuard');
          } else if (req.id.includes('16') || req.id.includes('sup') || req.name.includes('সুপারভাইজর') || req.name.includes('supervisor')) {
            staffIndex = availableStaff.findIndex(s => s.role === 'Supervisor');
          } else if (req.id.includes('officer') || req.name.includes('Officer')) {
            staffIndex = availableStaff.findIndex(s => s.role === 'Officer');
          } else {
            staffIndex = availableStaff.findIndex(s => s.role === 'Guard');
          }
        }
        
        if (staffIndex === -1) staffIndex = 0;
        
        const staff = availableStaff.splice(staffIndex, 1)[0];
        
        roster.push({
          staffId: staff.id,
          staffName: staff.name,
          role: staff.role,
          permanentGroup: staff.permanentGroup,
          assignedShift: shift,
          assignedPost: req.name,
          offDay: staff.offDay
        });
        needed--;
      }
    });
    
    availableStaff.forEach(staff => {
      // For remaining staff, if they have a subSection, let's try to assign them to it, otherwise 'অতিরিক্ত / রিজার্ভ'
      roster.push({
        staffId: staff.id,
        staffName: staff.name,
        role: staff.role,
        permanentGroup: staff.permanentGroup,
        assignedShift: shift,
        assignedPost: staff.subSection || 'অতিরিক্ত / রিজার্ভ',
        offDay: staff.offDay
      });
    });
  };

  assignPostsForShift('A', shiftPools.A);
  assignPostsForShift('B', shiftPools.B);
  assignPostsForShift('C', shiftPools.C);
  assignPostsForShift('General', shiftPools.General);

  // Process OTs
  weekOts.forEach(ot => {
    if (ot.staffId) {
      const otStaff = allStaff.find(s => s.id === ot.staffId);
      if (otStaff) {
        roster.push({
          staffId: otStaff.id,
          staffName: otStaff.name,
          role: otStaff.role,
          permanentGroup: otStaff.permanentGroup,
          assignedShift: ot.shift,
          assignedPost: ot.postName,
          isOT: true
        });
      }
    } else {
      // Unassigned OT
      roster.push({
        staffId: 'Unassigned',
        staffName: '--- নির্ধারিত হয়নি ---',
        role: 'Guard',
        permanentGroup: 'General',
        assignedShift: ot.shift,
        assignedPost: ot.postName,
        isOT: true
      });
    }
  });

  return roster;
};
