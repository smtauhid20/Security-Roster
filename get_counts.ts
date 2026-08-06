import { allStaff, postRequirements } from './src/data';
import { DailyManpowerStatus } from './src/components/DailyManpowerStatus';
import React from 'react';
import { renderToString } from 'react-dom/server';

const startDate = '2026-08-01';
const roster = allStaff.map(s => ({
    staffId: s.id,
    assignedShift: s.permanentGroup,
    offDay: s.offDay,
    isShiftChange: false,
    isReplacement: false
}));

const result = DailyManpowerStatus({ roster, startDate, posts: postRequirements, staff: allStaff });
// Oh wait, DailyManpowerStatus is a React component. We need to render it to HTML and see the numbers.
const html = renderToString(React.createElement(DailyManpowerStatus, { roster, startDate, posts: postRequirements, staff: allStaff }));
console.log(html.substring(html.indexOf("2026-08-01"), html.indexOf("2026-08-02")));
