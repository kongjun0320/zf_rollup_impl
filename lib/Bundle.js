const path = require('path');
const fs = require('fs');
const MagicString = require('magic-string');
const Module = require('./module');

class Bundle {
  constructor(options) {
    // 入口文件的绝对路径
    this.entryPath = path.resolve(options.entry);
  }

  build(output) {
    const entryModule = this.fetchModule(this.entryPath);
    // console.log('entryModule >>> ', entryModule);
    this.statements = entryModule.expandAllStatements();
    // console.log(this.statements);
    const { code } = this.generate();
    fs.writeFileSync(output, code);
  }

  generate() {
    const bundle = new MagicString.Bundle();
    this.statements.forEach((statement) => {
      const source = statement._source.clone();
      // 把每个语句对应的源代码都添加 bundle 实例中
      bundle.addSource({
        content: source,
        separator: '\n',
      });
    });
    // 返回合并后的源代码
    return {
      code: bundle.toString(),
    };
  }

  fetchModule(importee) {
    let route = importee;
    if (route) {
      // 读取模块内容
      const code = fs.readFileSync(route, 'utf-8');
      // 创建一个模块的实例
      const module = new Module({
        code, // 模块的源代码
        path: route, // 模块的路径
        bundle: this, // Bundle 实例
      });
      return module;
    }
  }
}

module.exports = Bundle;
