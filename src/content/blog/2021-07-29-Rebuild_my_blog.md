---
title: "重建博客"
date: 2021-07-29 15:00:00 +0800
categories: 生活小事
---

## 重建缘由

我的第一个博客是在 2019-07-30 搭建的，至今已经用了 2 年时间（详见 [个人 blog 搭建完成](https://gricn.github.io/%E9%A1%B9%E7%9B%AE%E5%BF%83%E5%BE%97/githubpage_review/) 博文）。

满意的是总算有了一个自由不受审查的地方供写作，且 Google Analytics 显示隔三岔五会有一两位用户访问。

不足的是：

- UI 界面一般，桌面端观看时字体太大，中文字体一般。
- 页面布局。我希望桌面端我的博客左边都是 TimeLine 或者是 目录，而我目前用的模板左边是个人介绍，显得很鸡肋。
- 无法满足夜间模式。作为一个经常 12 点才睡的家伙，夜间模式对我而言挺重要的。
- 不支持多语言模式。想构建一个至少包含中英两种语言而且能自动翻译的博客。
- 我的 GitHub Page 在中国大陆内能正常访问，但由于没有设置 CDN，内置 Imgur 图片却不能。这有时会显得文章内容看起来莫名其妙，影响阅读体验。

那能否自建一个个人博客呢？

在做了一个 React 小项目 + 看了 **无辄的栈** 的 [初学前端，制作一个 Gatsby 静态博客](https://www.imwzk.com/posts/2020-09-28-play-with-frontend/)后，于是决定自建我的博客。

重构博客的框架有很多，让我用 Gatsby 重构我的博客原因有：

- 参考[Static Site Generator](https://www.wappalyzer.com/technologies/static-site-generator/)
- [Gatsby 官网的对比图](https://www.gatsbyjs.com/features/jamstack/gatsby-vs-nextjs/)
- 我有一点 React 基础，并且对 React 社区很感兴趣。React.JS 是我读过的最舒适的文档。

## 过程

### Figma 设计页面

由于我在绘画方面就是个小白，网站在设计时参考了部分网站。主要从个人对网页 UI 的喜爱程度。

- [无辄的栈](https://www.imwzk.com/)
- [面向信仰编程](https://draveness.me/)
- [Pingcap](https://pingcap.com/)
- [Material Design](https://material.io/)
- [Gatsby Blog](https://www.gatsbyjs.com/blog/flexible-fine-grained-code-splitting-with-gatsby-loadable-components)
- ...

最后瞎画画了一个 Demo

[图片：Demo](https://i.imgur.com/j4MKOGM.jpg)

### 设计文件结构

首先，跟着[Gatsby Tutorial](https://www.gatsbyjs.com/docs/tutorial/)走一遍，然后结合自己需要(多语言，CSS 组件)，设计框架。

## 资源来源

- 图片： [Unsplash](https://unsplash.com/)
- 背景音乐：[freepd](https://freepd.com/)
- 字体：[typekit](https://fonts.adobe.com/)

## 结语
