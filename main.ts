// SPDX-License-Identifier: MIT
// Plain JavaScript syntax is intentional: no transpiler or dependencies required.
const fs = require('node:fs');
const path = require('node:path');

const outputDirectory = process.env.MAKEFUN_OUTPUT_DIR || '/output';
fs.mkdirSync(outputDirectory, { recursive: true });
fs.copyFileSync(path.join(__dirname, 'entry.png'), path.join(outputDirectory, 'entry.png'));
