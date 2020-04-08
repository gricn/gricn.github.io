---
title: "GitHub Page搭建总结-正经文"
date:   2020-02-07 22:00:00 +0800
---

## 前言

在给这篇文章命名时，发现该文件夹已有两篇关于GitHub Page 的文章（2019年7月30号的[文章1](../githubpage_build) 以及 2019年8月7日的[文章2](../githubpage_review)），本想直接修改，结果打开一看

`嗯~ o(*￣▽￣*)o 我最近CS进步挺快的`

哈哈哈哈~~ 这就是我写一篇新文章的原因。

## 选择mmistake理由
早就有搭建个人博客想法，但又不想买服务器。于是，通过Google搜索相关方法，了解到GitHub Pages。于是看[官网](https://pages.github.com/)，照着教程操作，当设置主题时，想用视频推荐的minimal主题，但发现还是很丑。于是Google了一下，就发现了minimal mistakes。他的项目网站就是用搭建在GitHub Page上的，用笔记本、平板和手机三端都体验了一下，效果很不错，于是最终选择了它。

## 学习过程
刚开始学英语也不是很好，学习速度很慢，且理解经常不准确，为此犯了很多错误。但这就是一个过程，迟早会过去的啦。

> There are three ways to install: as a gem-based theme, as a remote theme (GitHub Pages compatible), or forking/directly copying all of the theme files into your project.

正如作者所说，一共有三种搭建方法：基于Gem、远程主题 以及 直接复制。这三种方法我都折腾过了，个人认为搭建难易程度为：直接复制 << 基于Gem < 远程主题；维护难易程度为：远程主题 < 直接复制 < 基于Gem。

### 基于Gem
这个方法就是在你的电脑安装ruby，以及安装ruby的DEVKIT，通过Gem（类似于Node.js的npm安装管理），然后一键bundle安装主题。

- 优点：能够在本地测试效果，方便修改。
- 缺点：①本地环境受限，如：如果GitHub Page是基于2.6版本的Ruby-dev，而本地下载的是最新版本2.7，则很容易出现库不兼容的情况（有些库会限制Ruby版本的上下限，一个库安装失败都会导致整体失败）。②bundle安装内容占存储空间。

### 远程主题
这个方法是通过修改`_config.yml`实现，如添加一句代码，这样就能指定安装4.19.1版本的mmistake啦。

```
remote_theme : "mmistakes/minimal-mistakes@4.19.1"
```

- 优点: ①利于更新，更改`_config.yml` remote_theme 后面的版本号，然后git push即可，不依赖本地环境。②占用空间小。
- 缺点：①不支持本地调试；②三种方法难度最大吧。

### 直接复制
git clone或者直接下载，本地修改后再上传到对应 xxx.github.io 的 repository 中。

- 优点：①最容易上手。
- 缺点：①不利于后期维护，更新琐碎耗时还容易误删自己文件。

## 必备技能
个人认为 GitHub Page 个人博客搭建必备技能及对应熟练程度包括：
- Git（熟悉）：除了一次能基本解决的GitHub账户设置外、还需掌握init/add/commit/commit amend/push/pull/clone/log/reset等技能。当然刚开始不需要完全掌握这么多，但是在使用过程中这些一定会用到这些。
- Markdown（熟悉）：H1~H5标题、超链接、列表、有序无序序列等
- Yaml（了解）：空格还是tab、如何修改mmistake作者的设置。
- 其他文件布局。如package.json、package-lock.json分别是干啥用的？README.md和LICENSE能否删除或直接修改？

## 趟过的坑
- 刚开始Git 提交时 VSCode 的 LF、CRLF问题不用理这么多，能用就行。
- 学习时搜索得到所需知识后，及时递归，互联网时代知识永远学不完，个人精力有限的情况下尽快渗透一个点，获取必要知识即可。 