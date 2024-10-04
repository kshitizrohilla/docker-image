const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send("<h1>Get started by modifying app.js 🔥</h1>");
});

app.listen(5001, () => {
  console.log(`Server running on port 5001`);
});
