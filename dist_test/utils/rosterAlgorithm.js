"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWeeklyRoster = void 0;
var generateWeeklyRoster = function (weekNumber, startDate, allStaff, postRequirements, leaves, ots, shiftChanges) {
    if (shiftChanges === void 0) { shiftChanges = []; }
    var roster = [];
    var weekLeaves = leaves.filter(function (l) { return l.weekNumber === weekNumber; });
    var weekOts = ots.filter(function (o) { return o.weekNumber === weekNumber; });
    var weekShiftChanges = shiftChanges.filter(function (sc) { return sc.weekNumber === weekNumber; });
    var rotationCycle = (weekNumber - 1) % 3;
    var getAssignedShift = function (permanentGroup) {
        if (permanentGroup === 'General')
            return 'General';
        if (permanentGroup === 'Reliever')
            return 'Reliever';
        if (rotationCycle === 0) {
            if (permanentGroup === 'A')
                return 'C';
            if (permanentGroup === 'B')
                return 'A';
            if (permanentGroup === 'C')
                return 'B';
        }
        else if (rotationCycle === 1) {
            if (permanentGroup === 'A')
                return 'B';
            if (permanentGroup === 'B')
                return 'C';
            if (permanentGroup === 'C')
                return 'A';
        }
        else { // 2
            if (permanentGroup === 'A')
                return 'A';
            if (permanentGroup === 'B')
                return 'B';
            if (permanentGroup === 'C')
                return 'C';
        }
        return 'General';
    };
    var shiftPools = {
        A: [],
        B: [],
        C: [],
        General: [],
        Reliever: [],
        Leave: [],
        OT: []
    };
    var relievers = [];
    var fullWeekLeaveIds = new Set(weekLeaves.filter(function (l) { return !l.endDate; }).map(function (l) { return l.staffId; }));
    var partialLeaves = weekLeaves.filter(function (l) { return !!l.endDate; });
    var onLeaveIds = new Set(weekLeaves.map(function (l) { return l.staffId; })); // keep for some fallback checks
    var changedShiftMap = new Map();
    var partialShiftChangeMap = new Map();
    weekShiftChanges.forEach(function (sc) {
        if (sc.endDate) {
            partialShiftChangeMap.set(sc.staffId, sc);
            if (sc.swappedWithStaffId && sc.swappedFromShift) {
                partialShiftChangeMap.set(sc.swappedWithStaffId, __assign(__assign({}, sc), { staffId: sc.swappedWithStaffId, targetShift: sc.swappedFromShift }));
            }
        }
        else {
            changedShiftMap.set(sc.staffId, sc.targetShift);
            if (sc.swappedWithStaffId && sc.swappedFromShift) {
                changedShiftMap.set(sc.swappedWithStaffId, sc.swappedFromShift);
            }
        }
    });
    allStaff.forEach(function (staff) {
        var _a, _b;
        if (fullWeekLeaveIds.has(staff.id)) {
            shiftPools.Leave.push(staff);
            roster.push({
                staffId: staff.id,
                staffName: staff.name,
                role: staff.role,
                permanentGroup: staff.permanentGroup,
                assignedShift: 'Leave',
                assignedPost: 'সাপ্তাহিক ছুটি / অনুপস্থিত',
                leaveStartDate: (_a = weekLeaves.find(function (l) { return l.staffId === staff.id; })) === null || _a === void 0 ? void 0 : _a.startDate,
                leaveEndDate: (_b = weekLeaves.find(function (l) { return l.staffId === staff.id; })) === null || _b === void 0 ? void 0 : _b.endDate,
                originalPost: staff.subSection
            });
        }
        else if (changedShiftMap.has(staff.id)) {
            var targetShift = changedShiftMap.get(staff.id);
            if (['A', 'B', 'C', 'General', 'Reliever'].includes(targetShift)) {
                if (targetShift === 'Reliever') {
                    relievers.push(staff);
                }
                else {
                    shiftPools[targetShift].push(staff);
                }
            }
            else {
                shiftPools.General.push(staff);
            }
        }
        else if (staff.permanentGroup === 'Reliever') {
            relievers.push(staff);
        }
        else if (staff.permanentGroup === 'General') {
            shiftPools.General.push(staff);
        }
        else {
            var assignedShift = getAssignedShift(staff.permanentGroup);
            shiftPools[assignedShift].push(staff);
        }
    });
    var guardRelievers = relievers.filter(function (r) { return r.role === 'Guard'; });
    var lgRelievers = relievers.filter(function (r) { return r.role === 'LadyGuard'; });
    var supRelievers = relievers.filter(function (r) { return r.role === 'Supervisor'; });
    // First, place relievers with explicit shifts in subSection
    var unassignedRelievers = [];
    __spreadArray(__spreadArray(__spreadArray([], guardRelievers, true), lgRelievers, true), supRelievers, true).forEach(function (r) {
        var _a, _b, _c, _d, _e, _f;
        if (((_a = r.subSection) === null || _a === void 0 ? void 0 : _a.includes('Shift- A')) || ((_b = r.subSection) === null || _b === void 0 ? void 0 : _b.includes('Shift-A'))) {
            shiftPools.A.push(r);
        }
        else if (((_c = r.subSection) === null || _c === void 0 ? void 0 : _c.includes('Shift- B')) || ((_d = r.subSection) === null || _d === void 0 ? void 0 : _d.includes('Shift-B'))) {
            shiftPools.B.push(r);
        }
        else if (((_e = r.subSection) === null || _e === void 0 ? void 0 : _e.includes('Shift- C')) || ((_f = r.subSection) === null || _f === void 0 ? void 0 : _f.includes('Shift-C'))) {
            shiftPools.C.push(r);
        }
        else {
            unassignedRelievers.push(r);
        }
    });
    // Distribute remaining relievers to hit exact targets based on post requirements
    var TARGET_A = 0, TARGET_B = 0, TARGET_C = 0;
    postRequirements.forEach(function (p) {
        TARGET_A += p.shiftCounts.A || 0;
        TARGET_B += p.shiftCounts.B || 0;
        TARGET_C += p.shiftCounts.C || 0;
    });
    unassignedRelievers.forEach(function (r) {
        if (shiftPools.A.length < TARGET_A) {
            shiftPools.A.push(r);
        }
        else if (shiftPools.B.length < TARGET_B) {
            shiftPools.B.push(r);
        }
        else if (shiftPools.C.length < TARGET_C) {
            shiftPools.C.push(r);
        }
        else {
            shiftPools.General.push(r); // Remaining go to General
        }
    });
    // Process explicit leave replacements or automatic fallback
    weekLeaves.forEach(function (leave) {
        var replacementId = leave.replacementStaffId;
        // Automatic fallback if no explicit replacement is provided
        if (!replacementId && leave.postName) {
            var postReq = postRequirements.find(function (p) { return p.name === leave.postName || p.id === leave.postName; });
            if (postReq && postReq.supportPersons && postReq.supportPersons.length > 0) {
                // Find an available support person
                var availableSupport = postReq.supportPersons.find(function (id) {
                    var staff = allStaff.find(function (s) { return s.id === id; });
                    return staff && !onLeaveIds.has(staff.id) && !roster.some(function (r) { return r.staffId === staff.id && r.isReplacement; });
                });
                if (availableSupport) {
                    replacementId = availableSupport;
                }
            }
        }
        if (replacementId && leave.shiftType && leave.postName) {
            var replacementStaff_1 = allStaff.find(function (s) { return s.id === replacementId; });
            if (replacementStaff_1 && !onLeaveIds.has(replacementStaff_1.id)) {
                // Find actual running shift for the leave
                var targetGroup = leave.shiftType;
                var actualRunningShift = targetGroup === 'General' ? 'General' : getAssignedShift(targetGroup);
                // Remove from normal pool ONLY if the leave is full week
                if (!leave.endDate) {
                    ['A', 'B', 'C', 'General'].forEach(function (shift) {
                        var idx = shiftPools[shift].findIndex(function (s) { return s.id === replacementStaff_1.id; });
                        if (idx !== -1)
                            shiftPools[shift].splice(idx, 1);
                    });
                }
                roster.push({
                    staffId: replacementStaff_1.id,
                    staffName: replacementStaff_1.name,
                    role: replacementStaff_1.role,
                    permanentGroup: replacementStaff_1.permanentGroup,
                    assignedShift: actualRunningShift,
                    assignedPost: leave.postName,
                    isReplacement: true
                });
            }
        }
    });
    // Add partial shift change extra assignments to roster before finalizing
    partialShiftChangeMap.forEach(function (sc, staffId) {
        var staff = allStaff.find(function (s) { return s.id === staffId; });
        if (staff && !fullWeekLeaveIds.has(staff.id)) {
            var targetGroup = sc.targetShift;
            var actualRunningShift = targetGroup === 'General' ? 'General' :
                (targetGroup === 'Reliever' ? 'Reliever' : getAssignedShift(targetGroup));
            if (['A', 'B', 'C', 'General'].includes(actualRunningShift)) {
                roster.push({
                    staffId: staff.id,
                    staffName: staff.name,
                    role: staff.role,
                    permanentGroup: staff.permanentGroup,
                    assignedShift: actualRunningShift,
                    assignedPost: sc.targetPost || 'অস্থায়ী ডিউটি',
                    isShiftChange: true,
                    shiftChangeDates: "".concat(sc.startDate, " \u09B9\u09A4\u09C7 ").concat(sc.endDate)
                });
            }
        }
    });
    var assignPostsForShift = function (shift, pool) {
        var availableStaff = __spreadArray([], pool, true);
        postRequirements.forEach(function (req) {
            // Find how many are already assigned to this post in this shift (like replacements)
            var alreadyAssigned = roster.filter(function (r) { return r.assignedShift === shift && r.assignedPost === req.name; }).length;
            var needed = (req.shiftCounts[shift] || 0) - alreadyAssigned;
            var _loop_1 = function () {
                var staffIndex = -1;
                // Priority 1: Exact match by subSection for this staff
                staffIndex = availableStaff.findIndex(function (s) { var _a; return s.subSection === req.name || ((_a = s.subSection) === null || _a === void 0 ? void 0 : _a.includes(req.name)) || req.name.includes(s.subSection || '----'); });
                // Priority 2: Match by role if subSection match fails
                if (staffIndex === -1) {
                    if (req.id.includes('lg') || req.name.includes('লেডি') || req.name.includes('Lady') || req.name.includes('Female')) {
                        staffIndex = availableStaff.findIndex(function (s) { return s.role === 'LadyGuard'; });
                    }
                    else if (req.id.includes('16') || req.id.includes('sup') || req.name.includes('সুপারভাইজর') || req.name.includes('supervisor')) {
                        staffIndex = availableStaff.findIndex(function (s) { return s.role === 'Supervisor'; });
                    }
                    else if (req.id.includes('officer') || req.name.includes('Officer')) {
                        staffIndex = availableStaff.findIndex(function (s) { return s.role === 'Officer'; });
                    }
                    else {
                        staffIndex = availableStaff.findIndex(function (s) { return s.role === 'Guard'; });
                    }
                }
                if (staffIndex === -1)
                    staffIndex = 0;
                var staff = availableStaff.splice(staffIndex, 1)[0];
                var pLeave = partialLeaves.find(function (l) { return l.staffId === staff.id; });
                var pShiftChange = partialShiftChangeMap.get(staff.id);
                roster.push({
                    staffId: staff.id,
                    staffName: staff.name,
                    role: staff.role,
                    permanentGroup: staff.permanentGroup,
                    assignedShift: shift,
                    assignedPost: req.name,
                    offDay: staff.offDay,
                    leaveStartDate: pLeave === null || pLeave === void 0 ? void 0 : pLeave.startDate,
                    leaveEndDate: pLeave === null || pLeave === void 0 ? void 0 : pLeave.endDate,
                    isShiftChange: !!pShiftChange,
                    shiftChangeDates: pShiftChange ? "".concat(pShiftChange.startDate, " \u09B9\u09A4\u09C7 ").concat(pShiftChange.endDate, " (").concat(pShiftChange.targetShift, " \u09B6\u09BF\u09AB\u099F)") : undefined
                });
                needed--;
            };
            while (needed > 0 && availableStaff.length > 0) {
                _loop_1();
            }
        });
        availableStaff.forEach(function (staff) {
            var pLeave = partialLeaves.find(function (l) { return l.staffId === staff.id; });
            var pShiftChange = partialShiftChangeMap.get(staff.id);
            // For remaining staff, if they have a subSection, let's try to assign them to it, otherwise 'অতিরিক্ত / রিজার্ভ'
            roster.push({
                staffId: staff.id,
                staffName: staff.name,
                role: staff.role,
                permanentGroup: staff.permanentGroup,
                assignedShift: shift,
                assignedPost: staff.subSection || 'অতিরিক্ত / রিজার্ভ',
                offDay: staff.offDay,
                leaveStartDate: pLeave === null || pLeave === void 0 ? void 0 : pLeave.startDate,
                leaveEndDate: pLeave === null || pLeave === void 0 ? void 0 : pLeave.endDate,
                isShiftChange: !!pShiftChange,
                shiftChangeDates: pShiftChange ? "".concat(pShiftChange.startDate, " \u09B9\u09A4\u09C7 ").concat(pShiftChange.endDate, " (").concat(pShiftChange.targetShift, " \u09B6\u09BF\u09AB\u099F)") : undefined
            });
        });
    };
    assignPostsForShift('A', shiftPools.A);
    assignPostsForShift('B', shiftPools.B);
    assignPostsForShift('C', shiftPools.C);
    assignPostsForShift('General', shiftPools.General);
    // Process OTs
    weekOts.forEach(function (ot) {
        if (ot.staffId) {
            var otStaff = allStaff.find(function (s) { return s.id === ot.staffId; });
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
        }
        else {
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
    // Enrich roster with shift change markers
    var enrichedRoster = roster.map(function (r) {
        var shiftChange = weekShiftChanges.find(function (sc) { return sc.staffId === r.staffId || sc.swappedWithStaffId === r.staffId; });
        if (shiftChange && r.assignedShift !== 'Leave' && !r.isOT && !r.isReplacement) {
            var dates = '';
            if (shiftChange.startDate) {
                dates += "\u09B6\u09C1\u09B0\u09C1: ".concat(shiftChange.startDate);
            }
            if (shiftChange.endDate) {
                dates += dates ? " | \u09B6\u09C7\u09B7: ".concat(shiftChange.endDate) : "\u09B6\u09C7\u09B7: ".concat(shiftChange.endDate);
            }
            return __assign(__assign({}, r), { isShiftChange: true, shiftChangeDates: dates || undefined });
        }
        return r;
    });
    return enrichedRoster;
};
exports.generateWeeklyRoster = generateWeeklyRoster;
