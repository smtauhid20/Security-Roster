export type ShiftType = 'A' | 'B' | 'C' | 'General' | 'Leave' | 'OT';
export type StaffRole = 'Guard' | 'LadyGuard' | 'Supervisor' | 'Officer';
export type PermanentGroup = 'A' | 'B' | 'C' | 'Reliever' | 'General';

export interface Staff {
  id: string;
  name: string;
  role: StaffRole;
  permanentGroup: PermanentGroup;
  offDay?: string;
  subSection?: string;
}

export interface PostRequirement {
  id: string;
  name: string;
  shiftCounts: Record<ShiftType, number>;
}

export interface RosterAssignment {
  staffId: string;
  staffName: string;
  role: StaffRole;
  permanentGroup: PermanentGroup;
  assignedShift: ShiftType;
  assignedPost: string;
  offDay?: string;
  isReplacement?: boolean;
  isOT?: boolean;
}

export interface LeaveRecord {
  id: string;
  weekNumber: number;
  staffId: string;
  replacementStaffId?: string;
  postName?: string;
  shiftType?: ShiftType;
}

export interface OTRecord {
  id: string;
  weekNumber: number;
  shift: ShiftType;
  postName: string;
  staffId?: string;
}

