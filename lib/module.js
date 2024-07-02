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
    // 分析语法树
    analyze(this.ast, this.code, this);
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
