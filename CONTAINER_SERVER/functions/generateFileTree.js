const fs = require('fs/promises');
const path = require('path');

const generateFileTree = async (dir) => {
  const tree = {};

  const buildTree = async (currDir, currTree) => {
    const files = await fs.readdir(currDir);

    for (const file of files) {
      const filePath = path.join(currDir, file);
      const stat = await fs.stat(filePath);
      
      if (stat.isDirectory()) {
        currTree[file] = {};
        await buildTree(filePath, currTree[file]);
      } else {
        currTree[file] = null;
      }
    }
  };

  await buildTree(dir, tree);
  return tree;
};

module.exports = generateFileTree;