const acorn = require('acorn');

const sourceCode = `import $ from 'jquery'`;

// 生成语法树
const ast = acorn.parse(sourceCode, {
  locations: true,
  ranges: true,
  sourceType: 'module',
  ecmaVersion: 8,
});

// 遍历语法树
ast.body.forEach((statement) => {
  walk(statement, {
    enter(node) {
      console.log('enter >>>', node.type);
    },
    leave(node) {
      console.log('leave >>>', node.type);
    },
  });
});

function walk(astNode, { enter, leave }) {
  visit(astNode, null, enter, leave);
}

function visit(node, parent, enter, leave) {
  if (enter) {
    enter(node, parent);
  }

  const keys = Object.keys(node).filter((key) => typeof node[key] === 'object');
  keys.forEach((key) => {
    let value = node[key];
    if (Array.isArray(value)) {
      value.forEach((val) => {
        if (val.type) {
          visit(val, node, enter, leave);
        }
      });
    } else if (value && value.type) {
      visit(value, node, enter, leave);
    }
  });

  if (leave) {
    leave(node, parent);
  }
}
