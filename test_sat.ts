import { allStaff, postRequirements } from './src/data';
import { DailyManpowerStatus } from './src/components/DailyManpowerStatus';

const satOff = allStaff.filter(s => String(s.offDay).trim().toLowerCase() === 'saturday');
console.log("Off on Saturday:", satOff.map(s => s.name + " (" + s.permanentGroup + ") - " + s.subSection));
