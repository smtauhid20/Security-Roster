const fs = require('fs');
fetch('https://firestore.googleapis.com/v1/projects/ai-studio-7cce385c-681e-4c57-b482-2a9fe53cfb73/databases/(default)/documents/shared_roster/state')
  .then(res => res.json())
  .then(data => console.log(data.error ? "Error: " + data.error.message : "Success!"))
  .catch(console.error);
