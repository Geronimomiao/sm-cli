"use strict";

function isObject(o) {
    return Object.prototype.toString.call(o) === '[object Object]';
  }

class Package {
  constructor(options) {
    if (!options) {
      throw new Error("Package类的options参数不能为空！");
    }
    if (!isObject(options)) {
      throw new Error("Package类的options参数必须为对象！");
    }
    const { targetPath, storePath, name, version } = options
    // package 路径
    this.targetPath = targetPath;
    // package 存储路径
    this.storePath = storePath;
    // package name
    this.packageName = name;
    // package version
    this.packageVersion = version;
  }

  // 判断当前 Package 是否存在
  exists() {}

  // 安装 Package
  install() {}

  // 更新 Package
  update() {}

  // 获取入口文件路径
  getRootFilePath() {}
}

module.exports = Package;
