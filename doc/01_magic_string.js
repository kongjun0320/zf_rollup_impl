const MagicString = require('magic-string');
const sourceCode = `export var name = 'aic'`;
const ms = new MagicString(sourceCode);
console.log(ms);
console.log(ms.snip(0, 6).toString()); // export
console.log(ms.remove(0, 7).toString()); // var name = 'aic'

// 还可以用来拼接字符串
const bundle = new MagicString.Bundle();
bundle.addSource({
  content: `var a = 1`,
  separator: '\n',
});
bundle.addSource({
  content: `var a = 2`,
  separator: '\n',
});
// var a = 1
// var a = 2
console.log(bundle.toString());
