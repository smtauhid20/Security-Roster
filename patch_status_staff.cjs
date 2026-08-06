const fs = require('fs');
let code = fs.readFileSync('src/components/DailyManpowerStatus.tsx', 'utf8');

const searchImports = `import { RosterAssignment, PostRequirement } from '../types';`;
const replaceImports = `import { RosterAssignment, PostRequirement, Staff } from '../types';
import { postRequirements as initialPosts } from '../data';`;
code = code.replace(searchImports, replaceImports);

const searchProps = `interface Props {
  roster: RosterAssignment[];
  startDate: string;
  posts: PostRequirement[];
}`;
const replaceProps = `interface Props {
  roster: RosterAssignment[];
  startDate: string;
  posts: PostRequirement[];
  staff: Staff[];
}`;
code = code.replace(searchProps, replaceProps);

const searchSig = `export const DailyManpowerStatus: React.FC<Props> = ({ roster, startDate, posts }) => {`;
const replaceSig = `export const DailyManpowerStatus: React.FC<Props> = ({ roster, startDate, posts, staff }) => {`;
code = code.replace(searchSig, replaceSig);

fs.writeFileSync('src/components/DailyManpowerStatus.tsx', code);
