const fs = require('fs');
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(
  "<Dashboard staff={staff} posts={posts} leaves={leaves} ots={ots} />",
  "<Dashboard staff={staff} posts={posts} leaves={leaves} ots={ots} roster={roster} />"
);
fs.writeFileSync('src/App.tsx', appCode);

let dashCode = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
dashCode = dashCode.replace(
  "import { Staff, PostRequirement, LeaveRecord, OTRecord } from '../types';",
  "import { Staff, PostRequirement, LeaveRecord, OTRecord, RosterAssignment } from '../types';"
);
dashCode = dashCode.replace(
  "  ots: OTRecord[];",
  "  ots: OTRecord[];\n  roster: RosterAssignment[];"
);
dashCode = dashCode.replace(
  "export const Dashboard: React.FC<Props> = ({ staff, posts, leaves, ots }) => {",
  "export const Dashboard: React.FC<Props> = ({ staff, posts, leaves, ots, roster }) => {"
);
fs.writeFileSync('src/components/Dashboard.tsx', dashCode);
