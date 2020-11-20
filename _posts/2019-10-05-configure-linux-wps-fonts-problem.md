---
title: "解决WPS for Linux的字体问题"
date:   2019-10-05 12:00:00 +0800
categories: 技术分享
---

原本在Ubuntu安装LibreOffice，但这软件和WPS不兼容，还险些误事，然后惊奇发现WPSoffice的Linux更新频繁，有人在维护，于是下载。但每次打开都会遇到“系统缺失字体”问题。

于是Google下，查找解决方案（这里要顺带说下，在部分时候中文搜索结果超过英文，之前执意搜英文结果，效果不佳，绕了很久才出来，这里又躺坑了~~）

<https://my.oschina.net/renwofei423/blog/635798>

看了该文章及其他文章，我得到的有效信息是：

1. 从Windows系统的 C:/Windows/Fonts 文件夹复制Windows字体文件到Linux的 /usr/share/fonts/wps-office 文件夹中
2. 执行以下命令生成字体索引信息

    ``` Command
    sudo mkfontscale
    sudo mkfontdir
    ```

3. 运行fc-cache命令更新字体缓存

    ``` Command
    sudo fc-cache
    ```

4. 重启wps即可，问题解决

----

按理说，问题挺好解决的，直接复制粘贴即可，但偏偏又卡在了U盘这道关上。

之前就发现无法直接在Terminal上找到U盘地址，为了偷懒，每次都是先把U盘文件Copy到Desktop上，然后再继续用Terminal复制粘贴，但这次想一探究竟。

于是开始Google，起初搜索结果很笨，搜"how to cp file in udisk to ubuntu"，Google自动帮我导引到 Linux mount disk 问题，然而我还以为Google误解我了，于是换了其他表达方式搜索。折腾了5、6分钟总算明白过来了。原来Google在提示我要挂载磁盘。

那怎么显示要挂在磁盘呢。先Google了一下，发现了疑似命令行。

``` Command
udisksctl status
```

运行command后，发现有个sda1文件很可疑，于是我又去Google sda1地址，好像是在/dev/sda1这里。于是我就cd去了……

好吧，后来才发现不对劲，那东西不是个地址。（我真的好菜啊，对不起鸟哥。码农码农）

于是开始尝试mount。

``` Command
mount /dev/sda1
```

嗯，这次命令好像对了，结果提示说，我的Udisk已经挂载了。

于是，我又 umount /dev/sda1 命令每次都成功，但我的U盘风雨不动，可以继续在文件管理器打开。额……

好吧，不想写那么多字了，一图胜千言。

super(windows)+a ，然后敲disks，打开Ubuntu那个app。

![P1](https://i.imgur.com/1Vkw6L9.png)

首先，你会发现一个奇怪的Mount地址。当然这是我修改后的，本来在当前用户下，一个非常奇贵啊的文件夹。

那么怎么修改呢，首先点Volumes下、Size上那个小齿轮，选择“Edit Mount Options”（不知道中文是什么，大概在“修复文件系统”下面……）

![P2](https://i.imgur.com/WzrOJnD.png)

然后，先取消"User Session Defaults"，然后修改"Mount Point"到指定文件夹即可。

接下来就可以按照那个CosChina教程走下去了。

最后效果图如下

![P3](https://i.imgur.com/hxXIkE4.png)
----

后记

以后只写笔记，不写教程了。累~~
