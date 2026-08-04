const fs = require('fs');
let code = fs.readFileSync('src/components/RelieverManager.tsx', 'utf8');

const search = "const supportPersonsList = posts.flatMap(p => p.supportPersons || []);";
const replace = `const supportPersonsList = posts.flatMap(p => {
    const initialPost = initialPosts.find(ip => ip.id === p.id);
    return p.supportPersons || (initialPost ? initialPost.supportPersons : []) || [];
  });`;
code = code.replace(search, replace);

const search2 = "const assignedPostsForSupport = posts.filter(p => (p.supportPersons || []).includes(sp.id));";
const replace2 = `const assignedPostsForSupport = posts.filter(p => {
                    const initialPost = initialPosts.find(ip => ip.id === p.id);
                    const supports = p.supportPersons || (initialPost ? initialPost.supportPersons : []) || [];
                    return supports.includes(sp.id);
                  });`;
code = code.replace(search2, replace2);

fs.writeFileSync('src/components/RelieverManager.tsx', code);
