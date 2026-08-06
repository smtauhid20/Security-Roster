import { allStaff } from './src/data';

allStaff.filter(s => s.permanentGroup === 'Reliever').forEach(s => {
    const shiftMatch = (s.subSection || '').match(/Shift-\s*([ABC])/i);
    if (shiftMatch) {
        console.log(`${s.name} works default shift: ${shiftMatch[1].toUpperCase()}`);
    } else {
        console.log(`${s.name} has no default shift in subSection: ${s.subSection}`);
    }
});
