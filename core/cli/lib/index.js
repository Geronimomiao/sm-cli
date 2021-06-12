"use strict";

const semver = require("semver");
const colors = require("colors");
const log = require("@sm-cli/log");
const pkg = require("../package");
const constants = require("./const");

function core() {
  checkPkgVersion();
  checkNodeVersion();
}

function checkNodeVersion() {
  const currentVersion = process.version;
  const lowestVersion = constants.LOWEST_NODE_VERSION;
  if (!semver.gte(currentVersion, lowestVersion)) {
    throw new Error(colors.red(`sm-cli 需要安装${lowestVersion} 以上版本的 Node.js`));
  }
}

function checkPkgVersion() {
  log.success("Checking");
  console.log(pkg.version);
}

module.exports = core;
