const { parse } = require('acorn');
const MagicString = require('magic-string');
const analyze = require('./ast/analyze');

class Module {
  constructor({ code, path, bundle }) {
    this.code = new MagicString(code);
    this.path = path;
    this.bundle = bundle;
    // 获取语法树
    this.ast = parse(code, {
      ecmaVersion: 8,
      sourceType: 'module',
    });
    // 存放本模块内导入了哪些变量，main.js 中导入了 name 和 age 变量
    this.imports = {};
    // 存放本模块中导出了哪些变量，msg.js 导出了 name 和 age 变量
    this.exports = {};
    // 存放本模块的顶级变量的定义语义是哪条
    this.definitions = {};
    // 分析语法树
    analyze(this.ast, this.code, this);
    // 导入
    console.log('this.imports >>>', this.imports);
    // 定义顶级变量的语句
    console.log('this.definitions >>> ', this.definitions);
  }

  expandAllStatements() {
    const allStatements = [];
    this.ast.body.forEach((statement) => {
      let statements = this.expandStatement(statement);
      allStatements.push(...statements);
    });
    return allStatements;
  }

  expandStatement(statement) {
    statement._included = true;
    let result = [];
    result.push(statement);
    return result;
  }
}

module.exports = Module;
