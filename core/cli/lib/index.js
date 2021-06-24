"use strict";

const path = require("path");

const semver = require("semver");
const colors = require("colors");
const userHome = require("user-home");
const pathExists = require("path-exists").sync;
const commander = require("commander");

const log = require("@sm-cli/log");
const init = require("@sm-cli/init")
const pkg = require("../package");
const constants = require("./const");

// let args;
const program = new commander.Command();

async function core() {
  try {
    checkPkgVersion();
    checkNodeVersion();
    checkRoot();
    checkUserHome();
    // checkInputArgs();
    checkEnv();
    await checkGlobalUpdate();
    registerCommand();
  } catch (e) {
    log.error(e.message);
  }
}

function registerCommand() {
  program
    .name(Object.keys(pkg.bin)[0])
    .usage("<command> [options]")
    .option("-d --debug", "是否开启调试模式", false)
    .version(pkg.version);

  program
    .command("init [projectName]")
    .option("-f --force", "是否强制初始化项目")
    .action(init)

  // 开启 debug 模式
  program.on("option:debug", function () {
    process.env.LOG_LEVEL = "verbose";
    log.level = process.env.LOG_LEVEL;

    log.verbose("tt");
  });

  // 对未注册命令进行 监听
  program.on("command:*", function (obj) {
    const availableCommands = program.commands.map((cmd) => cmd.name());
    console.log(colors.red("未知命令:", obj[0]));
    console.log(colors.red("可用命令:", availableCommands.join(",")));
  });

  // 用户未输入 command option
  if (process.argv.length < 3) {
    program.outputHelp();
    console.log();
  }

  program.parse(process.argv);
}

async function checkGlobalUpdate() {
  const currentVersion = pkg.version;
  const npmName = pkg.name;
  const { getNpmServerVersion } = require("@sm-cli/get-npm-info");
  const lastVersions = await getNpmServerVersion(currentVersion, npmName);

  if (lastVersions && semver.gt(lastVersions, currentVersion)) {
    log.warn(
      `
      更新提示: 请手动更新 ${npmName}, 当前版本: ${currentVersion}, 最新版本${lastVersions}
                            更新命令: npm install -g ${npmName}
      `
    );
  }
}

function checkEnv() {
  // const dotenv = require("dotenv");
  // 如果有 跟多的环境变量需要配置 可以直接配置到 ${userHome}/.env 下就可
  // const dotenvPath = path.resolve(userHome, ".env");
  // if (pathExists(dotenvPath)) {
  // dotenv.config 将路径中拿到的环境变量 存到 process.env 中
  // let config = dotenv.config({ path: dotenvPath });
  // }

  createDefaultConfig();
  // log.verbose("cli dir", process.env.CLI_HOME_PATH);
}

function createDefaultConfig() {
  const cliConfig = {
    home: userHome,
  };
  if (process.env.CLI_HOME) {
    cliConfig["cliHome"] = path.join(userHome, process.env.CLI_HOME);
  } else {
    cliConfig["cliHome"] = path.join(userHome, constants.DEFAULT_CLI_HOME);
  }

  process.env.CLI_HOME_PATH = cliConfig.cliHome;
}

// 根据入参 判断是否打印调试代码
// function checkInputArgs() {
//   const minimist = require("minimist");
//   args = minimist(process.argv.slice(2));
//   checkArgs();
// }

// function checkArgs() {
//   if (args.debug) {
//     process.env.LOG_LEVEL = "verbose";
//   } else {
//     process.env.LOG_LEVEL = "info";
//   }
//   //  上面修改没有生效  require("@sm-cli/log");
//   //  require 是同步执行的
//   log.level = process.env.LOG_LEVEL;
// }

function checkUserHome() {
  if (!userHome || !pathExists(userHome)) {
    throw new Error(colors.red("当前用户主目录不存在"));
  }
}

// 检查 Root 账户 并降级
// 防止 Root 账户 创建文件 普通用户没有操作权限
function checkRoot() {
  const rootCheck = require("root-check");
  rootCheck();
}

function checkNodeVersion() {
  const currentVersion = process.version;
  const lowestVersion = constants.LOWEST_NODE_VERSION;
  if (!semver.gte(currentVersion, lowestVersion)) {
    throw new Error(
      colors.red(`sm-cli 需要安装${lowestVersion} 以上版本的 Node.js`)
    );
  }
}

function checkPkgVersion() {
  log.info("cli version", pkg.version);
}

module.exports = core;
