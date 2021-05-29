---
title: "信号通路图软件"
date: 2021-05-29 23:00:00 +0800
categories: 技术分享
---

前几日有一位医学朋友向我询问有没有好的方法绘制信号通路图和细胞模式图，我想了想，觉得 PS 不是最合适的软件，肯定有其他专业 App，故第二天一早花了一个半小时调查了一下。最后回复了他，在此也总结一下吧。

![聊天记录](https://i.imgur.com/fD0Cu2g.png)

在我体验过的 App 中，有付费的，有免费的。这类软件主要是以绘图、UI 为主的软件和图、模块数据库两方面组成。付费的主要是数据库这方面，见到了好几个软件说软件免费但是数据库收费的情况。我个人对知识产权比较注重，个人不看好用完后截图这种方式，所以在这也考虑了价格的因素。

数据库有很多，但大多是配合 App 使用的。故下面先分享 App

## Bioreader（付费但最推荐）

[Bioreader](https://app.biorender.com/)是我用过体验感觉最棒的，也最推荐的 app。它的 UI 非常精美，价格也不算太贵，而且是我用过的最简单易用的 App

![界面图片](https://i.imgur.com/5PrfR4c.png)

![价格](https://i.imgur.com/EikthqO.png)

学生用户包年每月 15$，如果是单买一个月20$，如果能搞到发票的话，课题经费多半能报销，在这种情况下使用还是很划算的。

## App部分

### reactome（开源免费）

这是一款开源软件，它的代码可在[GitHub 仓库](https://github.com/reactome-pwp)找到。它的[Lincense 情况](https://reactome.org/license)也非常友好，CC0 和 CC BY 4.0，标注下文件来源即可。

软件左侧将细胞继承关系说的很清楚。部分是图片类文件，也有一部分文件可以进入它的界面（如下图）。个人觉得它也是一款非常棒的 app

![某细胞结构图](https://i.imgur.com/DFGlj52.png)

### pathvisio（Google 第一，但不好看）

谷歌搜这款 pathway，[pathvisio](https://pathvisio.github.io/)这货排第一。正如其首页所说，这是一款针对[WikiPathways](https://www.wikipathways.org/)涉及的通路编辑器。

WikiPathways 数据库也能下载一些细胞通路图，没有找到版权提醒内容，可以自由使用。由于我并非弄生物相关，内容专业度这方面我不懂。虽然开源精神好评，但是个人觉得图有些丑

![WikiPathways某图](https://i.imgur.com/OjQjvGn.png)

以及，pathvisio 由于部署在 GitHub Page 中，需要梯子才能访问。

### pathway builder tool （价格感人）

虽然猪靥看起来还可以，软件也可以免费下载。但这家伙是靠账号月付收费的啊！！！它下载软件后需要登录，我一注册傻眼了，最便宜 100$每月，手动再见。

### IBS

[IBS](http://ibs.biocuckoo.org/download.php)是华中科技大学薛宇教授的团队 CUCKOO 做的，非常适合绘制基因结构、序列互作结合的示意图，UI 一般。做基因+支持国产可以试试看。

## 数据库部分

数据库方面有很多。日本[Kegg](https://www.kegg.jp/kegg/pathway.html)，加拿大[SMPDB](https://smpdb.ca/)。在这只说一下其中一款吧，[Biocyc](KEGG PATHWAY Database)，这款数据库学术上免费使用，只需填写对应学校名称+给个负责老师后，本校学生就可以通过校 edu 邮箱免费注册使用该数据库了。有很多兄弟院校（北理、北化工、北交通）都注册使用了，然而我学校~~由于实在太穷~~没有注册过，所以没有尝试过 /(ㄒ o ㄒ)/~~
