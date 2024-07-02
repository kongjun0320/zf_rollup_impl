/**
 * 分析模块对应的 ast 语法树
 * @param {*} ast 语法树
 * @param {*} code 源代码
 * @param {*} module 模块实例
 */
function analyze(ast, code, module) {
  ast.body.forEach((statement) => {
    Object.defineProperties(statement, {
      // 表示这条语句默认不包括在输出结果里
      _included: { value: false, writable: true },
      // 指向它自己的模块
      _module: { value: module },
      // 这个语句对应的源代码
      _source: {
        value: code.snip(statement.start, statement.end),
      },
    });
  });
}

module.exports = analyze;
