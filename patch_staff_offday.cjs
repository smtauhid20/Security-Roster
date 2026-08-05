const fs = require('fs');
let code = fs.readFileSync('src/components/StaffManager.tsx', 'utf8');

code = code.replace(
  /<option value="শুক্রবার \(Friday\)">শুক্রবার \(Friday\)<\/option>/g,
  '<option value="Friday">শুক্রবার (Friday)</option>'
);
code = code.replace(
  /<option value="শনিবার \(Saturday\)">শনিবার \(Saturday\)<\/option>/g,
  '<option value="Saturday">শনিবার (Saturday)</option>'
);
code = code.replace(
  /<option value="রবিবার \(Sunday\)">রবিবার \(Sunday\)<\/option>/g,
  '<option value="Sunday">রবিবার (Sunday)</option>'
);
code = code.replace(
  /<option value="সোমবার \(Monday\)">সোমবার \(Monday\)<\/option>/g,
  '<option value="Monday">সোমবার (Monday)</option>'
);
code = code.replace(
  /<option value="মঙ্গলবার \(Tuesday\)">মঙ্গলবার \(Tuesday\)<\/option>/g,
  '<option value="Tuesday">মঙ্গলবার (Tuesday)</option>'
);
code = code.replace(
  /<option value="বুধবার \(Wednesday\)">বুধবার \(Wednesday\)<\/option>/g,
  '<option value="Wednesday">বুধবার (Wednesday)</option>'
);
code = code.replace(
  /<option value="বৃহস্পতিবার \(Thursday\)">বৃহস্পতিবার \(Thursday\)<\/option>/g,
  '<option value="Thursday">বৃহস্পতিবার (Thursday)</option>'
);

// also for the edit form which has slightly different text
code = code.replace(
  /<option value="শুক্রবার \(Friday\)">শুক্রবার<\/option>/g,
  '<option value="Friday">শুক্রবার</option>'
);
code = code.replace(
  /<option value="শনিবার \(Saturday\)">শনিবার<\/option>/g,
  '<option value="Saturday">শনিবার</option>'
);
code = code.replace(
  /<option value="রবিবার \(Sunday\)">রবিবার<\/option>/g,
  '<option value="Sunday">রবিবার</option>'
);
code = code.replace(
  /<option value="সোমবার \(Monday\)">সোমবার<\/option>/g,
  '<option value="Monday">সোমবার</option>'
);
code = code.replace(
  /<option value="মঙ্গলবার \(Tuesday\)">মঙ্গলবার<\/option>/g,
  '<option value="Tuesday">মঙ্গলবার</option>'
);
code = code.replace(
  /<option value="বুধবার \(Wednesday\)">বুধবার<\/option>/g,
  '<option value="Wednesday">বুধবার</option>'
);
code = code.replace(
  /<option value="বৃহস্পতিবার \(Thursday\)">বৃহস্পতিবার<\/option>/g,
  '<option value="Thursday">বৃহস্পতিবার</option>'
);

fs.writeFileSync('src/components/StaffManager.tsx', code);
