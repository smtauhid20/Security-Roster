const fs = require('fs');

function applyFix(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    const search = `              let matches = false;
              if (r.role === 'LadyGuard' && s.role === 'LadyGuard') matches = true;
              else if (r.role === 'Supervisor' && s.role === 'Supervisor') matches = true;
              
              const sTags = extractPostNumbers(sSub);
              const rTags = extractPostNumbers(rSub);
              
              if (!matches && sTags.length > 0 && rTags.length > 0) {
                  if (sTags.some(tag => rTags.includes(tag))) matches = true;
              }
              
              if (!matches && sTags.length === 0 && rTags.length === 0) {
                  if (rSub && sSub && (rSub.includes(sSub) || sSub.includes(rSub)) && sSub.length > 3) matches = true;
              }
              
              if (!matches) {
                matches = supportedPosts.some(p => {
                  const pTags = extractPostNumbers(p.name);
                  if (sTags.length > 0 && pTags.length > 0) {
                      if (sTags.some(tag => pTags.includes(tag))) return true;
                  }
                  const pName = p.name.toLowerCase();
                  if (sSub.includes(pName) || pName.includes(sSub)) return true;
                  return false;
                });
              }`;

    const replace = `              let matches = false;
              if (r.role !== s.role) {
                  matches = false;
              } else {
                  const sTags = extractPostNumbers(sSub);
                  const rTags = extractPostNumbers(rSub);
                  
                  if (sTags.length > 0 && rTags.length > 0) {
                      if (sTags.some(tag => rTags.includes(tag))) matches = true;
                  }
                  
                  if (!matches && sTags.length === 0 && rTags.length === 0) {
                      if (rSub && sSub && (rSub.includes(sSub) || sSub.includes(rSub)) && sSub.length > 3) matches = true;
                  }
                  
                  if (!matches) {
                    matches = supportedPosts.some(p => {
                      const pTags = extractPostNumbers(p.name);
                      if (sTags.length > 0 && pTags.length > 0) {
                          if (sTags.some(tag => pTags.includes(tag))) return true;
                      }
                      const pName = p.name.toLowerCase();
                      if (sSub.includes(pName) || pName.includes(sSub)) return true;
                      return false;
                    });
                  }
              }`;

    if (content.includes(search)) {
        content = content.replace(search, replace);
        fs.writeFileSync(filePath, content);
        console.log("Fixed " + filePath);
    } else {
        console.log("Could not find matching block in " + filePath);
    }
}

applyFix('src/components/RelieverManager.tsx');
applyFix('src/components/DailyManpowerStatus.tsx');
