const Scope = require('./scope');
const walk = require('./walk');

/**
 * 分析模块对应的 ast 语法树
 * @param {*} ast 语法树
 * @param {*} code 源代码
 * @param {*} module 模块实例
 */
function analyze(ast, code, module) {
  // 开启第一轮的循环，找出本模块导入导出了哪些模块
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
      _dependsOn: { value: {} }, // 依赖的变量
      _defines: { value: {} },
    });
    // 找出导入了哪些变量
    if (statement.type === 'ImportDeclaration') {
      // 获取导入的模块的相对路径
      const source = statement.source.value;
      statement.specifiers.forEach((specifier) => {
        // 导入的变量名
        let importName = specifier.imported.name;
        // 当前模块的变量名
        let localName = specifier.local.name;
        // 当前模块内导入的变量名 localName 来自于 source 模块导出的的 importName 变量
        module.imports[localName] = { source, importName };
      });
    } else if (statement.type === 'ExportNamedDeclaration') {
      const declaration = statement.declaration;
      if (declaration && declaration.type === 'VariableDeclarator') {
        const declarations = declaration.declarations;
        declarations.forEach((variableDeclarator) => {
          const localName = variableDeclarator.id.name;
          const exportName = localName;
          module.exports[exportName] = { localName };
        });
      }
    }
  });
  // 开始第 2 轮循环，创建作用域链
  // 需要知道本模块内用到了哪些变量，用到的变量留下，没用到的不管理
  // 我需要知道我使用到了哪些变量
  // 我还得知道这个变量是局部变量，还是全局变量
  // 一上来先创建顶级作用域
  let currentScope = new Scope({ name: '模块内的顶级作用域' });
  ast.body.forEach((statement) => {
    function addToScope(name) {
      // 把此变量名添加到当前作用域的变量数组中
      currentScope.add(name);
      // 如果说当前的作用域，没有副作用域了，说它就是顶级作用域了
      if (!currentScope.parent) {
        // 表示此语句定义了一个顶级变量
        statement._defines[name] = true;
        // 此顶级变量的定义语句就是这条语句
        module.definitions[name] = statement;
      }
    }

    walk(statement, {
      enter(node) {
        // 表示读取变量
        if (node.type === 'Identifier') {
          // 表示当前这个语句依赖了 node.name 这个变量
          statement._dependsOn[node.name] = true;
        }
        let newScope;
        switch (node.type) {
          case 'FunctionDeclaration':
            // 把函数名添加到当前的作用域变量中
            addToScope(node.id.name);
            const names = node.params.map((param) => param.name);
            newScope = new Scope({
              name: node.id.name,
              parent: currentScope, // 当创建新的作用域的时候，父作用域就是当前作用域
              names,
            });
            break;

          case 'VariableDeclaration':
            node.declarations.forEach((declaration) => {
              addToScope(declaration.id.name);
            });

            break;

          default:
            break;
        }

        if (newScope) {
          Object.defineProperty(node, '_scope', { value: newScope });
        }
      },
      leave(node) {
        // 如果当前节点有 _scope，说明它当前节点创建了一个新的作用域，离开此节点的时候，要退回父作用域
        if (Object.hasOwnProperty(node, '_scope')) {
          currentScope = currentScope.parent;
        }
      },
    });
  });

  ast.body.forEach((statement) => {
    console.log('_defines >>> ', statement._defines);
  });
}

module.exports = analyze;
