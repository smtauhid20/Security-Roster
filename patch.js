const fs = require('fs');
let code = fs.readFileSync('src/components/RelieverManager.tsx', 'utf8');
const search = `                        const rSub = (r.subSection || '').toLowerCase();
                        const sSub = (s.subSection || '').toLowerCase();
                        
                        if (rSub === sSub) return true;
                        if (rSub.includes(sSub) || sSub.includes(rSub)) return true;
                        
                        const rPostMatches = rSub.match(/post-?\\s*\\d+/g) || [];
                        const sPostMatches = sSub.match(/post-?\\s*\\d+/g) || [];
                        
                        for (const rpm of rPostMatches) { 
                           if (sSub.includes(rpm)) return true;
                        }
                        for (const spm of sPostMatches) { 
                           if (rSub.includes(spm)) return true;
                        }
                        return false;`;
const replace = `                        const supportedPosts = posts.filter(p => (p.supportPersons || []).includes(r.id));
                        const sSub = (s.subSection || '').toLowerCase();
                        if (r.id === '314842' && s.role === 'LadyGuard') return true;
                        return supportedPosts.some(p => {
                          const pName = p.name.toLowerCase();
                          return sSub.includes(pName) || pName.includes(sSub) || 
                                 (sSub.includes('post-') && pName.includes('post-') && sSub.match(/\\d+/) && pName.match(/\\d+/) && sSub.match(/\\d+/)?.[0] === pName.match(/\\d+/)?.[0]);
                        });`;
code = code.replace(search, replace);
fs.writeFileSync('src/components/RelieverManager.tsx', code);
