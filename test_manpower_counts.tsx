import React from 'react';
import { renderToString } from 'react-dom/server';
import { DailyManpowerStatus } from './src/components/DailyManpowerStatus';
import { allStaff, postRequirements } from './src/data';

const startDate = '2026-08-01';
const roster = allStaff.map(s => ({
    staffId: s.id,
    assignedShift: s.permanentGroup,
    offDay: s.offDay,
    isShiftChange: false,
    isReplacement: false
}));

const App = () => {
    return <DailyManpowerStatus roster={roster} startDate={startDate} posts={postRequirements} staff={allStaff} />;
}
console.log(renderToString(<App />));
