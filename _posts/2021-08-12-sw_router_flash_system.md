---
title: "软路由刷系统"
date: 2021-08-12 20:00:00 +0800
categories: 技术分享
---

我的软路由在一个月前因刷了自编译的 lede 固件无法正常开机，但由于当时实在太忙，便一直搁置。直到昨天升级 Win11 系统提示未激活，才想起了软路由的 KMS 自动激活功能，于是今天花了半天时间整这玩意。

## PE 制作

我的电脑开启了"Beta: Use UTF-8 for worldwide language support"。由于微 PE（WePE） 不支持 UTF-8，在打开 官网下载的 exe 安装程序时会乱码。WePE 是我从 18 年捣鼓系统开始一直默认使用 PE 工具，我被 PE 官网作者的文字描述感动，所以尽管它并未开源，但我相信它"won't be evil"。从时间成本考虑的情况下，当时就该取消这选项。但由于我的日程管理程序滴答清单也是使用英文，而这项功能是由于当时英文语言下无法正常进行中文的 NLP，和工程师反馈的时候，工程师让我打开此选项。所以，我一直在找替代品。

### 用微软官方 PE 软件

（不推荐，不实用）

从[微软官方](https://docs.microsoft.com/en-us/windows-hardware/manufacture/desktop/winpe-create-usb-bootable-drive)下载`Windows Assessment and Deployment Kit (ADK) deployment tools`和 `ADK WinPE Add ons`这两款的安装包 - `adksetup.exe` 和 `adkwinpesetup.exe`。其中，前者只需要装 Development Tools；后者按着安装包走就行。

![adksetup安装界面](https://i.imgur.com/3Y5tfcT.jpg)

按照教程成功安装完后开启的系统是只有一个 cmd 界面的伪 win10 系统，不实用，取消。

### 用 DiskGenius 生成 PE 盘

DiskGenius 是我一直在用的分区管理工具。和傲梅分区工具不同的是，这款软件较为保守，我用它的期间就没出过事；而傲梅曾把我的黑苹果所在分区直接搞崩（在此不推荐大家使用傲梅）。另外，今天头一次发现 DiskGenius 就是一家中国出品的软件，国内官网`disgenius.cn`没有看到公司地址，只能从冀字号推断是河北公司，而国际官网`DisGenius.com`则大方显示了[公司所在地址](https://www.diskgenius.com/aboutus.php)。

扯远了，DiskGenius 生成的 PE 工具只是在前者的基础上多加一个 DisGenius 软件而已，也不实用。

### GitHub 开源-Edgeless

在看[Edgeless](https://github.com/EdgelessPE/Edgeless)代码仓库的 README 和官方文档时便被作者吸引，后来发现作者是南京理工大学的学生。在文档介绍时，作者已经明确说明，这款软件制作的 PE 是一个`内存系统`，但我当时抱着玩玩看地心态使用了。结果是我装完系统后，我那标称 2G 内存可怜的 J1900 顿时内存使用率就用了 90%。所以，这款软件也不适合我。但插句题外话，这个系统挺适合那些想用 U 盘 portable 办公的小众 Geek 使用。有兴趣的朋友可以去官网体验这款软件。

看到 DiskGenius, GHOST, WinNT 这些熟悉的软件，我又想起了微 PE，于是我决定宁可更换系统的语言设置也要使用 WePE。此时才发现滴答清单哪怕语言设置为英文，在这种模式也能进行中文 NPL 了 :sob::sob:

### WePE

取消全局 UTF-8 后，WePE 好使了。按照惯例将 PE 安装到 U 盘，一步到位。接着依次将 `physdiskwrite`([官网地址](https://m0n0.ch/wall/physdiskwrite.php)) 和 LEDE 编译得到的 img 都复制进 U 盘中 。这里不得不提的是，微软官方 PE 和 DiskGenius 制作的 PE 都无法支持 physdiskwrite

## BIOS

我当时编译得到的是 UEFI 版本，今天整机子的时候才发现系统竟然设置为了"Legacy Only"，难怪之前通过 Luci 界面直接升级时把系统刷崩了。

## Img 版本

用 physdiskwrite 刷了多次自编译的 img，软路由还是无法正常启动。当时我自闭到怀疑人生了。可能原因有 2 个：

- 第一次编译时没有仔细阅读 GitHub 仓库的 README，WSL2 的环境变量出现了问题。
- 第一次编译为了加速，`-j`参数用了 2（同步进行了双作业）。即使加速还是编译了一晚。

后来又想起了，esir 每月发布的[版本](https://openwrt.club/)。我为了省事，加上软路由存储空间足够，用的是 300MB 的高大全版本。意外的是，此次一次就成功了。

## 其他琐碎

安装好后，首先在 CMD 更新 kms 地址（esir 编译 ip 默认为`192.168.5.1`），端口号两端都是默认的 1688，不用理会。

```cmd
slmgr.vbs /skms 192.168.5.1
```

然后为了让自己在室内不用开启设备代理软件以拯救一下我那旧 iPhone 可怜的续航，进行以下操作。

- 配置并开启 OpenClash
- 取消各端该 WIFI 设置下的随机 MAC 选项
- 硬路由开启有线 AP 模式（硬路由 NAT 模式下，软路由无法获取连接硬路由设备 IP, MAC 等信息）
- OpenClash 白名单模式
  - 如果基于 MAC 绑定
    - OpenClash 直接添加 MAC 白名单
  - 如果基于 IP 绑定
    - Openwrt 页面 "网络 -> DHCP/DNS ->静态地址分配" 中，进行 MAC 地址和静态 IP 的捆绑。注意，为了正常工作，此处最少只需填写`MAC 地址` 、`IPv4 地址` 和 `租期` 3 部分内容。
    - OpenClash 添加 IP 白名单
- （可选）在 Shadowrocket 或其他代理软件 开启“按需连接”功能，即可根据网络环境和 SSID 自动连接或断开代理。
