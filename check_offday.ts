import { allStaff } from './src/data';
['Md. Al Amin', 'Parboti Koiri', 'Md. Isuf Khan', 'Angura Khatun', 'Ruma Begum', 'Amena Begum', 'Md. Anamul Jommader'].forEach(name => {
  console.log(name, ":", allStaff.find(s => s.name === name)?.offDay);
});
