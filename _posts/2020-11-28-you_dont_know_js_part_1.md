# 你不知道的JavaScript（上卷）

## 第一部分 作用域和闭包

### 第1章 作用域是什么

#### 编译三步骤

* 分词/词法分析：词法单元识别是否有状态，分词无，词法分析有）
* 解析/语法分析：将解析好的元素整合成AST
* 代码生成

#### 执行三步骤：

* 引擎：编译和执行
* 编译器：语法分析和代码生成
* 作用域：收集和维护标识符（变量），并确定当前代码对这些标识符的访问权限

#### LHS和RHS

LHS：赋值操作的目标是谁；RHS：谁是赋值操作的源头
如：var a = 2 (LHS); console. log(a) (RHS); 

Test:

``` javascript
function foo(a) {
    var b = a;
    return a + b;
}
var c = foo(2);
// 这里一共有3处LHS，4处RHS
```

异常：ReferenceError：作用域判别失败；TypeError：作用域判别成功，但是对结果的操作非法或不合理

### 第2章 词法作用域

作用域主要两种工作模型：词法作用域和动态作用域。JavaScript属于词法作用域范畴

不要使用eval(), with()之类变更作用域的函数，会大幅降低代码运行效率，且易出bug

### 第3章 函数作用域和块作用域

函数作用域的例子

``` JavaScript
var a = 2;

function foo() {
    var a = 3;
    console.log(a); //3
}
foo();
console.log(a); //2
```

换一种写法

``` javascript
var a = 2(function foo() {
    var a = 3;
    console.log(a); //3
})()
console.log(a) //2
// 这种函数称为立刻执行函数表达式：IIFE(Immediately Invoked Function Expression)
```

这种写法的好处是foo变量名隐藏在自身不会污染外部作用域

匿名和具名

``` javascript
settimeout(function() {
    console.log("xxx");
}, 1000)
```

这就是匿名函数表达式，function()没有名称标识符。函数表达式可匿名，函数声明则不能忽略函数名

function后有函数名的就是具名函数

上文的 `(function xxx())()` 第一个()将函数变成函数表达式，第二个()执行了这个函数

## 第4章 提升

提升是讲作用域和声明变量出现位置的关系，所有声明（变量和函数）在代码执行前”移动“到各自作用域的最顶端，这个过程被称为提升

这章讲述的知识大量涉及第1章LHS/RHS的知识，另外忘了referrenceError的小伙伴可以回到第1章找找

但注意，函数声明会提升，但函数表达式不会

``` javascript
foo() // TypeError
var foo = function bar() {}
```

原理大致是执行 `foo()` 时，由于函数表达式不会提升，所以这首先会先 `var foo` ，此时 `foo` 是undefined状态，因此undefined()报错

## 第5章 作用域闭包

当函数可以记住并访问所在的词法作用域，即使函数是在当前词法作用域外执行，这时就产生闭包。闭包在实现上是一个结构体，它存储了一个函数（通常是其入口地址）和一个关联的环境（相当于一个符号查找表）。环境里是若干对符号和值的对应关系，它既要包括约束变量（该函数内部绑定的符号），也要包括自由变量（在函数外部定义但在函数内被引用），有些函数也可能没有自由变量。闭包跟函数最大的不同在于，当捕捉闭包的时候，它的自由变量会在捕捉时被确定，这样即便脱离了捕捉时的上下文，它也能照常运行。捕捉时对于值的处理可以是值拷贝，也可以是名称引用，这通常由语言设计者决定，也可能由用户自行指定（如C++）。

书中有一个例子很好阐释了作用域有什么用：

``` javascript
// code 1
for (var i = 1; i <= 5; i++) {
    (function() {
        setTimeout(function timer() {
            console.log(i);
        }, i * 1000);
    })()
}
// output:
6
6
6
6
6
```

然而稍稍变一变，就能正常使用了

``` javascript
// code 2
for (var i = 1; i <= 5; i++) {
    (function() {
        var j = i;
        setTimeout(function timer() {
            console.log(j);
        }, j * 1000);
    })()
}
// output:
1
2
3
4
5
```

为什么两者会有不同呢，书中对code1的解释是“作用域是空的，需要包含一点实质内容才可以为我们所用”，我个人理解是这样的：

![Pic1](https://i.imgur.com/8NP68es.png)

![Pic2](https://i.imgur.com/vb4rmLx.png)

作用域加了j变量则能及时存储生成作用域时i的值；而没加变量只是保留了对外部i的引用方式，只能得到for循环后i的结果

