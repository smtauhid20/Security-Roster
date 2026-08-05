const fs = require('fs');
let code = fs.readFileSync('src/components/RosterTable.tsx', 'utf8');

// Update imports
code = code.replace("import { RosterAssignment, ShiftType } from '../types';", "import { RosterAssignment, ShiftType, PostRequirement } from '../types';");

// Update Props interface
const searchProps = `interface Props {
  roster: RosterAssignment[];
  weekNumber: number;
  startDate: string;
}`;
const replaceProps = `interface Props {
  roster: RosterAssignment[];
  weekNumber: number;
  startDate: string;
  posts: PostRequirement[];
}`;
code = code.replace(searchProps, replaceProps);

// Update component signature
const searchSig = `export const RosterTable: React.FC<Props> = ({ roster, weekNumber, startDate }) => {`;
const replaceSig = `export const RosterTable: React.FC<Props> = ({ roster, weekNumber, startDate, posts }) => {`;
code = code.replace(searchSig, replaceSig);

// Update DailyManpowerStatus call
const searchStatus = `<DailyManpowerStatus roster={roster} startDate={startDate} />`;
const replaceStatus = `<DailyManpowerStatus roster={roster} startDate={startDate} posts={posts} />`;
code = code.replace(searchStatus, replaceStatus);

fs.writeFileSync('src/components/RosterTable.tsx', code);
