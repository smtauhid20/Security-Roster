const staff1 = { permanentGroup: 'C' };
const targetShiftFor2 = staff1 ? (staff1.permanentGroup === 'Reliever' ? 'General' : (['A', 'B', 'C', 'General'].includes(staff1.permanentGroup) ? staff1.permanentGroup : 'General')) : 'General';
console.log(targetShiftFor2);
