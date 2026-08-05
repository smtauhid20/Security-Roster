const fs = require('fs');
const state = JSON.parse(fs.readFileSync('state.json', 'utf8'));
// It's in Firestore Document format.
const fields = state.fields;
if (fields && fields.staff && fields.staff.arrayValue && fields.staff.arrayValue.values) {
    const staffArray = fields.staff.arrayValue.values;
    staffArray.forEach(s => {
        const staffObj = s.mapValue.fields;
        const id = staffObj.id ? staffObj.id.stringValue : '';
        const name = staffObj.name ? staffObj.name.stringValue : '';
        if (id === '301098' || name.includes('Abdul Ahad')) {
            console.log(staffObj);
        }
    });
}
