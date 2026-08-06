const fs = require('fs');
let code = fs.readFileSync('src/data.ts', 'utf8');
let tA = 0;
code.split('\n').forEach(line => {
    if (line.includes('shiftCounts: {')) {
        let aMatch = line.match(/A:\s*(\d+)/);
        if (aMatch) tA += parseInt(aMatch[1]);
    }
});
console.log('TARGET_A', tA);
