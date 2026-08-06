const fs = require('fs');
let code = fs.readFileSync('src/components/RelieverManager.tsx', 'utf8');

const search = `                        const sSub = (s.subSection || '').toLowerCase();
                        const rSub = (r.subSection || '').toLowerCase();
                        
                        if (r.role === 'LadyGuard' && s.role === 'LadyGuard') return true;
                        if (r.role === 'Supervisor' && s.role === 'Supervisor') return true;
                        
                        // Custom direct check for user's explicit report
                        if (r.id === '304151' && s.id === '301098') return true;
                        
                        // Broad number matching if both have digits (e.g. Post-10)
                        const sNums = sSub.match(/\\d+/g) || [];
                        const rNums = rSub.match(/\\d+/g) || [];
                        if (sNums.length > 0 && rNums.length > 0) {
                            if (sNums.some(num => rNums.includes(num))) return true;
                        }
                        
                        // Check string inclusion
                        if (rSub.includes(sSub) && sSub.length > 3) return true;
                        if (sSub.includes(rSub) && rSub.length > 3) return true;
                        
                        return supportedPosts.some(p => {
                          const pName = p.name.toLowerCase();
                          if (sSub.includes(pName) || pName.includes(sSub)) return true;
                          
                          const pNums = pName.match(/\\d+/g) || [];
                          if (sNums.length > 0 && pNums.length > 0) {
                              if (sNums.some(num => pNums.includes(num))) return true;
                          }
                          return false;
                        });`;

const replace = `                        const sSub = (s.subSection || '').toLowerCase();
                        const rSub = (r.subSection || '').toLowerCase();
                        
                        if (r.role === 'LadyGuard' && s.role === 'LadyGuard') return true;
                        if (r.role === 'Supervisor' && s.role === 'Supervisor') return true;
                        
                        const extractPostNumbers = (str) => {
                           const nums = [];
                           const regex = /(?:post|rg)[-\\s]*([\\d\\s,&and]+)/gi;
                           let match;
                           while ((match = regex.exec(str)) !== null) {
                               const extracted = match[1].match(/\\d+/g);
                               if (extracted) {
                                   const prefix = match[0].toLowerCase().includes('rg') ? 'rg' : 'post';
                                   nums.push(...extracted.map(n => prefix + '-' + parseInt(n).toString()));
                               }
                           }
                           if (nums.length === 0) {
                               const allNums = str.match(/\\d+/g);
                               if (allNums && str.toLowerCase().includes('post')) {
                                   nums.push(...allNums.map(n => 'post-' + parseInt(n).toString()));
                               }
                           }
                           return nums;
                        };

                        const sTags = extractPostNumbers(sSub);
                        const rTags = extractPostNumbers(rSub);
                        
                        if (sTags.length > 0 && rTags.length > 0) {
                            if (sTags.some(tag => rTags.includes(tag))) return true;
                        }
                        
                        if (sTags.length === 0 && rTags.length === 0) {
                            if (rSub && sSub && (rSub.includes(sSub) || sSub.includes(rSub)) && sSub.length > 3) return true;
                        }

                        // Also check supportedPosts based on initial data
                        return supportedPosts.some(p => {
                          const pTags = extractPostNumbers(p.name);
                          if (sTags.length > 0 && pTags.length > 0) {
                              if (sTags.some(tag => pTags.includes(tag))) return true;
                          }
                          const pName = p.name.toLowerCase();
                          if (sSub.includes(pName) || pName.includes(sSub)) return true;
                          return false;
                        });`;

code = code.replace(search, replace);

fs.writeFileSync('src/components/RelieverManager.tsx', code);
