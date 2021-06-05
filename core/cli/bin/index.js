#!/usr/bin/env node
const importLocal = require('import-local');
const util = require('@sm-cli/utils');


if(importLocal(__filename)) {
    require('npmlog').info('cli', '正在使用 sm-cli 线上版本')
} else {
    console.log(__filename);
    require('npmlog').info('cli', '正在使用 sm-cli 开发版本')
    require('../lib')(process.argv.slice(2));
    util()
}