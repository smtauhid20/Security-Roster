const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const search = `<RosterTable roster={roster} weekNumber={weekNumber} startDate={startDate} />`;
const replace = `<RosterTable roster={roster} weekNumber={weekNumber} startDate={startDate} posts={posts} />`;
code = code.replace(search, replace);

fs.writeFileSync('src/App.tsx', code);
