const fs = require('fs');
let code = fs.readFileSync('src/components/DailyManpowerStatus.tsx', 'utf8');

const searchImports = `import { RosterAssignment } from '../types';`;
const replaceImports = `import { RosterAssignment, PostRequirement } from '../types';`;
code = code.replace(searchImports, replaceImports);

const searchProps = `interface Props {
  roster: RosterAssignment[];
  startDate: string;
}`;
const replaceProps = `interface Props {
  roster: RosterAssignment[];
  startDate: string;
  posts: PostRequirement[];
}`;
code = code.replace(searchProps, replaceProps);

const searchSig = `export const DailyManpowerStatus: React.FC<Props> = ({ roster, startDate }) => {`;
const replaceSig = `export const DailyManpowerStatus: React.FC<Props> = ({ roster, startDate, posts }) => {`;
code = code.replace(searchSig, replaceSig);

const searchManpower = `  const dailyManpower = useMemo(() => {`;
const replaceManpower = `  const targets = useMemo(() => {
    let A = 0, B = 0, C = 0;
    posts.forEach(p => {
      A += p.shiftCounts.A || 0;
      B += p.shiftCounts.B || 0;
      C += p.shiftCounts.C || 0;
    });
    return { A, B, C };
  }, [posts]);

  const dailyManpower = useMemo(() => {`;
code = code.replace(searchManpower, replaceManpower);

// Update table headers
const searchHeaders = `<th className="px-6 py-3">A Shift (Target: 12)</th>
              <th className="px-6 py-3">B Shift (Target: 14)</th>
              <th className="px-6 py-3">C Shift (Target: 15)</th>`;
const replaceHeaders = `<th className="px-6 py-3">A Shift (Target: {targets.A})</th>
              <th className="px-6 py-3">B Shift (Target: {targets.B})</th>
              <th className="px-6 py-3">C Shift (Target: {targets.C})</th>`;
code = code.replace(searchHeaders, replaceHeaders);

// Update map loops
const searchRows = `<td className="px-6 py-3">{getStatusBadge(day.A, 12)}</td>
                <td className="px-6 py-3">{getStatusBadge(day.B, 14)}</td>
                <td className="px-6 py-3">{getStatusBadge(day.C, 15)}</td>`;
const replaceRows = `<td className="px-6 py-3">{getStatusBadge(day.A, targets.A)}</td>
                <td className="px-6 py-3">{getStatusBadge(day.B, targets.B)}</td>
                <td className="px-6 py-3">{getStatusBadge(day.C, targets.C)}</td>`;
code = code.replace(searchRows, replaceRows);

fs.writeFileSync('src/components/DailyManpowerStatus.tsx', code);
