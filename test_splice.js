const staff = [
  { id: 1, name: 'A' },
  { id: 2, name: 'B' }
];

const unassigned = staff.filter(s => true);
const covered1 = [];
const covered2 = [];

for (let i = unassigned.length - 1; i >= 0; i--) {
  if (unassigned[i].name === 'A') {
    covered1.push(unassigned[i]);
    unassigned.splice(i, 1);
  }
}

for (let i = unassigned.length - 1; i >= 0; i--) {
  if (unassigned[i].name === 'A') {
    covered2.push(unassigned[i]);
    unassigned.splice(i, 1);
  }
}
console.log(covered1.map(s=>s.name), covered2.map(s=>s.name), unassigned.map(s=>s.name));
