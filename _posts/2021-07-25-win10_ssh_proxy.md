---
title: "Win10 SSH Proxy"
date: 2021-07-25 14:00:00 +0800
categories: 技术分享
---

## 7 月 28 日更新

7 月 27 日晚上服务器怎么都无法通过代理连接，然后想起韦易笑文章下有人评论“ssh 代理后的机场都爆了”。

现在先用[Mosh](https://mosh.org/#about)，目前很满意，下午开了三个小窗口连接了分别 3 小时都没有断过。等晚高峰再看看。

---

**以下内容写于 7 月 25 日**

因为我有一个用来订阅 RSS 的境外服务器没在国内备案，开始还几乎能正常连接，半个月时候发现晚上上网高峰期 SSH 总是容易断线。用了将近一个月后，发现连接半分钟就会被掐断，彻底连不上了。

于是想到用 SSH 代理。在这做个笔记。

## 第三方软件

第三方软件配置相对简单，如 Putty，只需在连接设置配置好自己的 ip 和端口就行，一般没有问题。

## OpenSSH 设置 SSH 代理

OpenSSH 是 Win10 自带的 SSH 软件，也被 VSCode Remote - SSH 也默认使用。

根据[ServerFault 一回答](https://serverfault.com/questions/956613/windows-10-ssh-proxycommand-posix-spawn-no-such-file-or-directory)介绍在 `C:\Users\YOUR_USER_NAME\.ssh\config`中添加或修改以下内容。

```
Host jumphost
  HostName 127.0.0.1
  Port 7890 # Your Proxy socks5 port

Host example.com
  HostName example
  Port 22
  ProxyCommand ssh jumphost netcat -w 120 %h %p
```

或使用命令

```
ssh example.com -o ProxyCommand="ssh jumphost netcat -w 120 %h %p"
```

使用代理连接 SSH，这时速度便快的飞起了。

## WSL2 设置 SSH 代理

```bash
ssh -D SOCKS5_PORT example.com
```

配置看起来很简单,似乎这样就结束了？别急，后面还有大坑。

## 遇见错误

### 问题描述

用 VSCode Remote - SSH 和 Windows Terminal 连接分别出现下面两个错误:

- Could not establish connection to "Your Domain": The process tried to write to a nonexistent pipe.
- kex_exchange_identification: Connection closed by remote host

这个错误发生在我用 wsl2 也连接了服务器之后。这个问题折腾了我非常久，甚至用了重启 wsl 和主机这样的笨方法。

### 解决方法

#### Step 1

先根据报错信息搜索，在阅读 Stack Overflow [这个方法](https://stackoverflow.com/a/61185626/10878775)评论描述中意识到也许是`known_hosts`的问题。

Windows 下的`known_hosts`是明文显示，很容易阅读；而 Ubuntu 中的`known_hosts`是哈希过的，需要使用一些小技巧:

- 获取`~/.ssh/known_hosts`中对应的域名/IP 地址内容:

  `# ssh-keygen -H -F <hostname or IP address>`

- 删除已知域名/IP 的内容：

  `# ssh-keygen -R <hostname or IP address>`

然后开始对三个地方的`known_hosts`域名对应内容进行解读

- wsl2 中 SSH 我的服务器，再用`ssh-keygen -H -F <hostname or IP address>`得到结果

  > \# Host example.com found: line 1
  > |1|dA1xxxxxxuHo=|yIU5xxxxxxUHc= ecdsa-sha2-nistp256 AAAAE2xxxxxx......xxxxxxBI9rSIXsQ/w=

- wsl2 中用`ssh-keygen -H -F <hostname or IP address>`得到结果

  > \# Host example.com found: line 1
  > |1|dA1xxxxxxuHo=|yIU5xxxxxxUHc= ecdsa-sha2-nistp256 AAAAE2xxxxxx......xxxxxxBI9rSIXsQ/w=

- windows 中查看`C:\Users\USERNAME\.ssh\known_hosts`文件

  > example.com ecdsa-sha2-nistp256 AAAAE2xxxxxx......xxxxxxBI9rSIXsQ/w=

三者都一模一样，看来不是这里的问题。

#### Step 2

尽可能搜集信息，用 `ssh -vvv example.com` 得到最详细的信息

```
OpenSSH_for_Windows_8.1p1, LibreSSL 3.0.2
debug1: Reading configuration data C:\\Users\\user/.ssh/config
debug1: C:\\Users\\user/.ssh/config line 9: Applying options for example.com
debug3: Failed to open file:C:/ProgramData/ssh/ssh_config error:2
debug2: resolve_canonicalize: hostname xx.xx.xx.xx is address
debug1: Executing proxy command: exec ssh jumphost netcat -w 120 xx.xx.xx.xx 22
debug3: spawning "ssh jumphost netcat -w 120 xx.xx.xx.xx 22"
debug3: spawning ssh jumphost netcat -w 120 xx.xx.xx.xx 22
debug3: w32_getpeername ERROR: not sock :2
debug3: Failed to open file:C:/Users/user/.ssh/id_rsa error:2
debug3: Failed to open file:C:/Users/user/.ssh/id_rsa.pub error:2
debug1: identity file C:\\Users\\user/.ssh/id_rsa type -1
debug3: Failed to open file:C:/Users/user/.ssh/id_rsa-cert error:2
debug3: Failed to open file:C:/Users/user/.ssh/id_rsa-cert.pub error:2
debug1: identity file C:\\Users\\user/.ssh/id_rsa-cert type -1
debug3: Failed to open file:C:/Users/user/.ssh/id_dsa error:2
debug3: Failed to open file:C:/Users/user/.ssh/id_dsa.pub error:2
debug1: identity file C:\\Users\\user/.ssh/id_dsa type -1
debug3: Failed to open file:C:/Users/user/.ssh/id_dsa-cert error:2
debug3: Failed to open file:C:/Users/user/.ssh/id_dsa-cert.pub error:2
debug1: identity file C:\\Users\\user/.ssh/id_dsa-cert type -1
debug3: Failed to open file:C:/Users/user/.ssh/id_ecdsa error:2
debug3: Failed to open file:C:/Users/user/.ssh/id_ecdsa.pub error:2
debug1: identity file C:\\Users\\user/.ssh/id_ecdsa type -1
debug3: Failed to open file:C:/Users/user/.ssh/id_ecdsa-cert error:2
debug3: Failed to open file:C:/Users/user/.ssh/id_ecdsa-cert.pub error:2
debug1: identity file C:\\Users\\user/.ssh/id_ecdsa-cert type -1
debug1: identity file C:\\Users\\user/.ssh/id_ed25519 type 3
debug3: Failed to open file:C:/Users/user/.ssh/id_ed25519-cert error:2
debug3: Failed to open file:C:/Users/user/.ssh/id_ed25519-cert.pub error:2
debug1: identity file C:\\Users\\user/.ssh/id_ed25519-cert type -1
debug3: Failed to open file:C:/Users/user/.ssh/id_xmss error:2
debug3: Failed to open file:C:/Users/user/.ssh/id_xmss.pub error:2
debug1: identity file C:\\Users\\user/.ssh/id_xmss type -1
debug3: Failed to open file:C:/Users/user/.ssh/id_xmss-cert error:2
debug3: Failed to open file:C:/Users/user/.ssh/id_xmss-cert.pub error:2
debug1: identity file C:\\Users\\user/.ssh/id_xmss-cert type -1
debug1: Local version string SSH-2.0-OpenSSH_for_Windows_8.1
kex_exchange_identification: Connection closed by remote host
kex_exchange_identification: Connection closed by remote host
```

忽视`id_rsa-cert`这类信息，因为我没有设置密钥，使用的是密码登录。排除这些后，最核心的信息看起来就是 `debug3: spawning ssh jumphost netcat -w 120 xx.xx.xx.xx 22` 和 `debug3: w32_getpeername ERROR: not sock :2`这两。于是继续搜索。

在这个[ProxyJump #1172](https://github.com/PowerShell/Win32-OpenSSH/issues/1172)中 tats-u 的日志中发现了和我一样出错的问题，不用 jump 没事，一用 jump 就不行。其他人都在说：“快升级，升级了最新的版本就变好了呢~~” 既然我的配置没有问题，那就升级看看。

接着又看到了著名的 [Win32-OpenSSH update in Windows #1693](https://github.com/PowerShell/Win32-OpenSSH/issues/1693)问题，由于内部重组，Win32 OpenSSH 8.1 不知道啥时候才能正式发布呢，欢迎大家体验仓库 Releases 或 Chocolatey 中的 release 版本。

既然是 Beta 版需要频繁更新，那当然是用 Chocolatey 体验一波啦。体验后，果然没有用。无奈下，曲线救国用了 Git For Windows 自带的`connect.exe`, 这下彻底稳定了。

```
Host jumphost
  HostName 127.0.0.1
  Port 7890 # Your Proxy socks5 port

Host example.com
  HostName example
  Port 22
  ProxyCommand C:\Program Files\Git\mingw64\bin\connect.exe -S 127.0.0.1:7890 %h %p
```

早就听闻 OpenSSH 的 Windows 版本不稳定，今日终于有所闻。不过具体原因目前还无法诊断，使用自带的 OpenSSH 问题依旧存在，这次算是侥幸用第三方工具替代成功。这个问题依旧存在，以后能力提升后解决。

## 推荐文章

- [SSH 命令的三种代理功能（-L/-R/-D）](https://zhuanlan.zhihu.com/p/57630633)
