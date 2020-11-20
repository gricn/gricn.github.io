---
title: "与Travis斗智斗勇"
date:   2019-10-3 23:00:00 +0800
categories: 技术分享
---

之前一直不了解jekyll的_config.yml里的plugin和gemfile配置有什么区别，一直以为在_config.yml添加了plugin后就可以将gemfile全删了……

直到看到jekyll关于plugin的介绍：

<https://jekyllrb.com/docs/plugins/installation/>

在这之后就简单了，了解原理后，按照travis提示不断修改Gemfile即可。

![配合travis修改gemfile](https://i.imgur.com/KqztGEP.png)

可以查看我仓库最新Gemfile设置

被这个小东西拖了几天，还很菜……但每次解决错误后很开心。
