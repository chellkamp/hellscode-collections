const fs = require('fs');
const { argv } = require('process');

fs.rmSync(argv[2], {recursive: true, force: true});
