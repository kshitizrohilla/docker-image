const express = require('express');
const router = express.Router();

const generateFileTree = require('../functions/generateFileTree');

router.post('/get-files', async (req, res) => {
  const appDir = '/app';
  const fileTree = await generateFileTree(appDir);
  res.json({ tree: fileTree });
});

module.exports = router;