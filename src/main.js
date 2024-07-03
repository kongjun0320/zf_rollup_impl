import { name, age } from './msg';

function say() {
  console.log('hello >>> ', name);
}

say();

// 我们需要判断哪些变量模块内的一级变量，或者说顶级变量，局部变量不需要处理
