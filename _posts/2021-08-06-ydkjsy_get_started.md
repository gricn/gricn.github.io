---
title: "YDKJSY Get Started笔记"
date: 2021-08-06 17:00:00 +0800
categories: 读书笔记
---

耗时 1 天刷完了 YDKJSY(You Don't Know JS Yet)第一本 Get Started。作为 YDKJS 的第二版，这本 141 页的小书在难度上更适合初学者，在看第一版的时候，光中文版就已让我看的吐血。不过，这本书依然不适合完全不了解 JS 的小白，小白还是得先过一遍 JavaScript 对应 W3School 和 Nuboob 对应介绍。总的来说，今天的阅读体验很愉快。

## 介绍

这本小书总体框架可自行参考书的目录页。这本书最令我兴奋的是，这本书在最后的几页附上了对前面全书重要内容复盘难度适中的练习及对应的参考答案。

## 知识点

### 向前兼容 vs 向后兼容

#### 定义

向前兼容：拥有最新特性的代码跑 n 年前的引擎程序不会崩溃

向后兼容：标准一经采纳日后不会变化

JS 向后兼容，但不向前兼容

#### 向前兼容导致的问题

新代码如何跑在旧引擎中？

- 对语法，可以用 transpile（转移） —— 即 Babel
- 对 API 方法，可以用 polyfill（填补）—— 用旧版本代码重写新版本功能。

### 脚本/解释型语言 vs 编译语言

由于 js 可不先预编译直接一行行运行，所以是脚本/解释型语言。那是否是编译语言呢？

JS 可先经 Babel 转移，Webpack 打包后，再经 JS 引擎解析为 AST（Abstract Structure Tree），然后又由 AST 转换为某种字节码，甚至可由 JIT（Just In Time）编译器再次优化。最后，JS 引擎执行程序。

### Web Assembly

将非 JS 语言转换为能够跑在 JS 引擎。创建了 4 年至今（2021/08/07）才 1.0 版本。也许和 JS 为非静态类型有关。

### use strict 模式

可在文件头出默认开启全局的 use strict，作为替代，也可开启函数范围内的 use strict 模式（只能二选一）

```js
function AAA() {
  "use strict";
  // all codes below weill run in strict mode
}
```

但个人不用"use strict"模式，而是习惯开启 ESLint，自定义自己想要的规则。

PS. ESLint 对新人的语法习惯真的有非常大帮助。

### const

const 并非不可改变，而是不允许重新分配。

```js
const abc = ["a", "b"];
abc[2] = "c"; // it works
```

### ==和===

这是新手小白最容易犯下的错误。这部分可配合 JavaScript The Definitive Guide 7th Edition 中的 `3.9 Type Conversions`部分共同食用。

简单地说，`===`为引用相等，如左右两边是否为同一个对象；`==`为结构相等，如左右两边结构是否相等。

有一个令我印象深刻的例子

```js
var x = "10";
var y = "9";

x < y; // true
```

10 年很多国产程序都会出这样的 bug，如汉王电纸书。

### ...操作符

```js
var a = [...it];
```

不仅可用在 Array，还可用于函数参数以及将字符串分解开。

```js
var a = "abc";
var b = [...a]; // b = ["a", "b", "c"]
```

### hoisting

在范围内定义的任何变量被视为在范围顶部定义，即自动将这些变量“提升”。

### var

var 定义的函数作用域为整个函数，与"{}"定义的范围无关。

### 匿名函数

函数`name`属性要么是它定义时的名字，要么是作为匿名函数表达式得到的名字

```js
var awesomeFunction = function (coolThings) {
  // ...
  return amazingStuff;
};

awesomeFunction.name; // "awesomeFunction" - 作为匿名函数表达式得到的名字
```

但如果匿名函数作为参数传递，而没有如上进行值传递，debug 时会提醒 `(anonymous function)` 字样。

这里作者建议尽量不要使用匿名表达式。原因是，函数若没有意义，就不应该存在；而如果有意义，就要给它取一个不用去查看内部代码也能秒懂的名字。
