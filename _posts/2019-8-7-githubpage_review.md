---
title: "个人Blog搭建完成"
date:   2019-08-07 01:00:00 +0800
---

搭建blog过程一路撞坑。首先在Github偶然发现还有GitHub Page这样的不需自己购买服务器就可搭建网站的神器，然后知道它是基于Jekyll，但当时我觉得Jekyll默认的皮肤太丑了，于是我又投向了它的extension：[minimal-mistakes](https://github.com/mmistakes/minimal-mistakes). 当时看案例图觉得挺好看的，不过实际做出来后，才知道它们是“RMB玩家”~~

起初照着minimal-mistakes在Github上的readme.md来做的，发现怎么都不对劲，什么是gem，什么是remote……关键是遇到每个超链接都想点开看看，走马观花，什么都记不住，且都是英语，效率低下。说到这就忍不住吐槽一下，前段时间刚开始训练英语阅读，每天看2h的英文版《经济学原理》，1h也就10页左右，痛不欲生。看完《经济学原理》还得看这些英文开发者文档，脑壳疼，且晚上总失眠~~好在现在也慢慢习惯了，就是现在看Probability and Statistical还是很伤。（诶，我当时怎么没想过用Google Translate，真是个诚实Boy）

好了，不扯了，上干货。

撞了无数的坑，也算是收获了一些东西。

1. 接触一个新项目，第一件事不是看开发者文档，而是官方的quick start，这样效率最高；然后看configure guide；最后若要实现具体的功能再看开发者文档。边看边做笔记，构建简单的知识框架，然后repeat，repeat应该能记住（心疼自己的猪脑子）。同时要注意：
    
    1. 刚接触基于其他项目搭建的repository，首先要看source repository。一方面是因为分支往往是基于源项目的扩展，从源项目入手往往更简单；另一方面是因为若源项目有bug，分支往往也跑不了，但大家基本是去源项目反馈的，屡次编译/运行失败很容易引起自我怀疑。
    2. 遇到具体功能，比如本blog中的搜索引擎，就要反过来，从分支看起。源代码往往很少提供这样的扩展，即使有，也容易因时间陈旧或因分支代码迁移、业务包装而变得不可用。分支往往通过api来服务，此时有需要看api提供方的说明，这又回到了如何快速入门：quick start, configure guide, 开发者文档。这样的顺序对于小白来说大抵没错。
    
2. 若已经完全按照作者开发者文档说的做了（都Level 3 了，Level 1 和 2肯定都看完了），还是出错。Google bug、看看GitHub的issue是否有bug，看看是否是其他地方遗漏了（比如当时我用了Algolia后系统总是默认用Google Search，后来再仔细看GitHub Page介绍才发现原来它只给用master分支）实在不行，StackOverflow或者是骚扰作者~~

3. 做的过程中时刻想why可以避免浪费很多时间。比如当时在Algolia Community看到介绍两种在Github Page搭建Search的方法，一个是Netlify，另一个是Travis。文档是这么介绍的

    > “We recommend using [Netlify](https://community.algolia.com/jekyll-algolia/netlify.html), but if you want to stay hosted on GitHub pages, this page will explain how to keep your search records in sync with your deployed website.”

    英语受限，我起初理解是Netlify安装效果是enter搜索后会在新页面显示搜索结果（类似谷歌的site:xxxx），等万事俱备后才发现原来这是个网址迁移网站，我的内心啊:cry:

    我这脑容量这么有限，这些东西又强行塞进了我的大脑┭┮﹏┭┮ 

    ![smile-but-tired.jpg](/images/smile-but-tired.jpg)


困死了，最后再说说搜索引擎的事吧。前天晚上刚弄完disqus，30分钟不到就弄完了。本以为搜索引擎也是这么简单，没想到提供的三个搜索引擎都很难搞。

* lunr不支持中文搜索，虽然GitHub有大佬近一个月创建的中文中文包，但我完全看不懂minimal mistake作者的lunr设置，白忙活了3、4个小时。
* Google Search。这个东西最气人，因为我对它期望值最高。设置完CSE后，就是没有反应，不过还是可以在" site:gricn.github.io " 看到我的文章内容，也算没完全白忙活。
* 最后用了algolia。作为一个美国公司，总担心它中文搜索不行，结果，它的英文搜索最糟糕，连文章内容 “yaml” 都搜索不到……

以及，不能使用Windows的反斜杠"/"，必须正斜杠"\"。有空研究下stackexchange介绍的AutoHotKey Script.

就写这么多吧，马上1点半了（第三次修改时间了，晕），晚安~~