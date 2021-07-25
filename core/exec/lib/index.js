'use strict';
const Package = require('@sm-cli/package')

function exec() {
    console.log(process.env.CLI_TARGET_PATH);
    console.log(process.env.CLI_HOME_PATH);
    const pkg = new Package()
    
}


module.exports = exec;
