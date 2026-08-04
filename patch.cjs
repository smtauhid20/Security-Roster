const fs = require('fs');
let code = fs.readFileSync('src/components/RelieverManager.tsx', 'utf8');

const importStr = "import { Staff, PostRequirement, ShiftChangeRecord } from '../types';";
const newImportStr = "import { Staff, PostRequirement, ShiftChangeRecord } from '../types';\nimport { postRequirements as initialPosts } from '../data';";
code = code.replace(importStr, newImportStr);

const searchStr = "const supportedPosts = posts.filter(p => (p.supportPersons || []).includes(r.id));";
const newSearchStr = `const supportedPosts = posts.filter(p => {
                          const initialPost = initialPosts.find(ip => ip.id === p.id);
                          const supports = p.supportPersons || (initialPost ? initialPost.supportPersons : []) || [];
                          return supports.includes(r.id);
                        });`;
code = code.replace(searchStr, newSearchStr);

fs.writeFileSync('src/components/RelieverManager.tsx', code);
