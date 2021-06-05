#!/usr/bin/env node
const importLocal = require('import-local');
const util = require('@sm-cli/utils');

console.log(importLocal(__filename));
if(importLocal(__filename)) {
    require('npmlog').info('cli', '使用全局版本')
} else {
    require('../lib')(process.argv.slice(2));
    util()
}