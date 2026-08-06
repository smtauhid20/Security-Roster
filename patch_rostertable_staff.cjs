const fs = require('fs');
let code = fs.readFileSync('src/components/RosterTable.tsx', 'utf8');

const searchProps = `interface Props {
  roster: RosterAssignment[];
  weekNumber: number;
  startDate: string;
  posts: PostRequirement[];
}`;
const replaceProps = `interface Props {
  roster: RosterAssignment[];
  weekNumber: number;
  startDate: string;
  posts: PostRequirement[];
  staff: Staff[];
}`;
code = code.replace(searchProps, replaceProps);

const searchSig = `export const RosterTable: React.FC<Props> = ({ roster, weekNumber, startDate, posts }) => {`;
const replaceSig = `export const RosterTable: React.FC<Props> = ({ roster, weekNumber, startDate, posts, staff }) => {`;
code = code.replace(searchSig, replaceSig);

const searchStatus = `<DailyManpowerStatus roster={roster} startDate={startDate} posts={posts} />`;
const replaceStatus = `<DailyManpowerStatus roster={roster} startDate={startDate} posts={posts} staff={staff} />`;
code = code.replace(searchStatus, replaceStatus);

const searchImports = `import { RosterAssignment, ShiftType, PostRequirement } from '../types';`;
const replaceImports = `import { RosterAssignment, ShiftType, PostRequirement, Staff } from '../types';`;
code = code.replace(searchImports, replaceImports);

fs.writeFileSync('src/components/RosterTable.tsx', code);

let appCode = fs.readFileSync('src/App.tsx', 'utf8');
const searchApp = `<RosterTable roster={roster} weekNumber={weekNumber} startDate={startDate} posts={posts} />`;
const replaceApp = `<RosterTable roster={roster} weekNumber={weekNumber} startDate={startDate} posts={posts} staff={staff} />`;
appCode = appCode.replace(searchApp, replaceApp);
fs.writeFileSync('src/App.tsx', appCode);

