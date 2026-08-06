import { allStaff } from './src/data';
const satOff = allStaff.filter(s => String(s.offDay).trim().toLowerCase() === 'saturday');
console.log("Off on Saturday:", satOff.map(s => `${s.name} (${s.permanentGroup}) [${s.role}] - ${s.subSection}`));
