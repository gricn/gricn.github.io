---
title: "Linux命令行大全"
date:   2020-11-20 09:00:00 +0800
categories: 读书笔记
---

我买的是2020年4月版。这本书中文版在编辑过程中有大量错误，虽然并不会非常影响理解，但是可以看出翻译和校对水平及用心程度。如果有能力建议看英文版。

令，这是我为了记忆做的笔记，所以一些我了解的东西就没写啦。

## 第6章 重定向

虽然一些已经掌握，但这些非常重要，故在这记录

`>` 输出并覆盖文件

`>>` 输出并在文件尾部添加内容

`cat` 读取文件内容，复制到输出中

`|` 管道，将前者的输出变为后者的输入。如：*ls -l | grep zip*

`uniq` 报告 或 `uniq -d` 忽略文件中重复的行

`tee` stdin读取数据，输出至stout和文件中

## 第7章 透过shell看世界

这节的 `算术运算符` 和 `花括号扩展` 很有意思 

### 算术运算符

取幂

``` bash
echo $((5**2))  // output:25
```

取余（像C）

``` bash
echo $((5/2)) // 2
echo $((5%2)) // 1
```

### 花括号扩展

``` bash
echo {Z..A}  // Z X Y ... A
mkdir {2009..2011}-0{1..9} {2009..2011}-1{0..2}
```

<img src="https://i.imgur.com/c9lNhIt.png" alt="bash下结果" style="zoom:80%; " />

效果真的棒，cmd与之相比就戳多了 

<img src="https://i.imgur.com/iA3qppu.jpg" alt="https://i.imgur.com/iA3qppu.jpg" style="zoom:80%; " />

cmd硬生生把命令理解成生成两个文件夹（这也是我在win10大多数情况下喜欢用bash原因，不过带空格的文件bash大多无法处理）

### 引用

文中讲到一个 `$` 导致出bug的例子

``` bash
echo The total is $100.00  // output: The total is 00.00
```

这里shell将$1理解为一个变量吞掉了，那么可以怎么做呢

``` bash
echo The total is \$100.00   // output: The total is $100.00 （转义字符）
echo The total is "$"100.00  // output: The total is $100.00 （双引号）
echo The total is '$'100.00  // output: The total is $100.00 （单引号）
```

书上还有一个有趣的例子

``` bash
william@Jacker  ~  echo $(cal)
November 2020 Su Mo Tu We Th Fr Sa 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30
 
william@Jacker  ~  echo "$(cal)"
   November 2020
Su Mo Tu We Th Fr Sa
 1  2  3  4  5  6  7
 8  9 10 11 12 13 14
15 16 17 18 19 20 21
22 23 24 25 26 27 28
29 30
```

没有加引号的命令，空格、制表符 `\t` 和换行符 `\n` 都被当做一个东西（即界定符）；加了引号，才发挥作用啦。

## 第8章 高级键盘技巧

我觉得这章有些玩意没啥用（对于使用ikbn之类无上下左右键的用户而言，文中内容都应该掌握），就写点我认为有用的吧（修改部分内容，并为方便打字，部分英文书写）

### 移动部分

`Ctrl-A` Cursor move to the start of the line

`Ctrl-F` Cursor move to the end of the line

`Ctrl-←` Cursor move forward a word

`Ctrl-→` Cursor move backward a word

### 剪贴和粘贴 (Killing and Yanking)

`Ctrl-K` Kill the text from the cursor to the end of the line 

`Ctrl-U` Kill the text from the start of the line to the cursor

`Alt-D` Kill the text from the cursor to the end of the word

`Alt-Backspace` Kill the text from the start of the word to the cursor

`Ctrl-Y` Paste the text to the cursor's place

### 历史记录

`history` 输出终端历史记录

`history | less` 用less查看终端历史记录（方便查看）

`↑` 重复上次指令

`!number` 重复历史记录第number行命令

## 第9章 权限

> 这部分所有玩Ubuntu的人基本都应该会吧~~

权限表示方法 分为 `八进制数字表示法` 和 `符号表示法`

符号表示法: u(user), g(group), o(other); 如： u+x; u-x; +x; o-rw; go=rw; u+x, go=rx; 这些表示方法

### umask（掩码）

 我觉得书里这部分讲的不够清楚，在这举例说明。

从书中可以得知， `umask` 是用来给创建文件制定默认权限的。在我的Ubuntu 18.04 LTS 系统中，输入 `umask` ，得到的值是022。所谓的掩码，就是在原本的基础上减去该值。

"777-022=755" 因此，新创建的文件/文件夹权限为 `-rwxr-xr-x` / `drwxr-xr-x`

`umask number` 即可将掩码值修改为number

### chown

chown [ower] [:[group]] file ...

ie. `chown bob:users 1.txt`

### chgrp

chown与chgrp几乎相同，一些较早版本系统只能用chgrp修改

## 第10章 进程

`ps` 显示进程信息（运行命令时得到的静态）

`ps x` 显示所有shell进程（显示该计算机bash、zsh等所有终端控制的进程）

`ps aux` 显示所有用户所有shell进程

| a = show processes for all users; 	u = display the process's user/owner; 	x = also show processes not attached to a terminal

`top` 动态显示进程信息 

### 控制进程

书本中 `xlogo` , `gedit` , `kwrite` 对于阿里云的Ubuntu 18.04 LTS无效（因为没用GUI），也没有任何 `jobs` ，因此 `fg` 命令也无效

`kill` 命令： `kill -1` 挂断信号； `kill -2` 中断信号； `kill -9` 杀死信号（以前很常用，但是这相当断电，不给应用保存机会）

## 第11章 环境

`printenv | less` 输出环境变量 

`set | less` 按字母排序输出环境变量

`alias` 输出别名

`.bak` , `.sav` , `.old` , `.orig` 都是常用的备份扩展名

`source .bashrc` 或 `source .zshrc` 切换并重新读取终端文件

## 第12章 VI简介

推荐跳过书本介绍

安装vim后，终端跟着 `vimtutor` 学习，多刷几遍就会了

<img src="https://i.imgur.com/UNefVRC.png" alt="vimtutor界面1"  />

<img src="https://i.imgur.com/YhkDLZU.png" alt="vimtutor界面2"  />

## 第13章 定制提示符

文中 `PS1="\$ "` 只对当前显示有效，如需长久，可修改 `.bashrc` ， `.zshrc` 等文件

## 第14章 软件包管理

在这只写个人常用的Debian系，Red Hat在需要时现学

列出安装的软件包列表： `dpkg --list`

显示软件包相关信息： `apt-cache show emacs`

## 第15章 存储介质

`mount` 不加参数时，显示已挂载的设备

`mount -t iso9960(can use other file types) /dev/hdc /mnt/cdrom` 将hdc设备以iso9960文件类型挂载在/mnt/cdrom中

`umount` 卸载设备

`mkfs` 创建新操作系统。

> 如将设备变成ext3文件系统类型： `sudo mkfs -t ext3 /dev/sdb1` ；格式化回原来系统FAT32： `sudo mkfs -t vfat /dev/sdb1` （实际上，该条指令用了mkfs.vfat 包，可格式化系统为FAT12、FAT16或FAT32；如要指定FAT具体参数，需指定 `sudo mkfs -t vfat -F 32 /dev/sdb1` 或精炼为 `sudo mkfs.vfat -F 32 /dev/sdb1` ）

`fsck` 可用改命令检查设备文件系统损坏情况。多数系统检测到文件损坏，则会自动进入 `fsck` 模式

### CD-ROM映像

建议：这节内容结合 `man` 一个个命令看

创建**数据类DVD映像**副本： `dd if=/dev/cdrom of=ubuntu.iso`

> dd: convert or copy a file
>
> if=FILE	read from FILE instead of stdin
>
> of=FILE	write to FILE instead of stdout

创建**音频类DVD**：选用 `cdrdao` 命令

挂载ISO映像文件： `mount -t iso9960 -o loop image.iso /mnt/iso_image`

擦除可读写CD-ROM： `wodim dev=/dev/cdrw blank=fast` （在这fast为快速擦除类型）

写入映像文件： `wodim dev=/dev/cdrw image.iso`

附加认证： `md5sum filename` , `sha256sum filename` 之类

## 第16章 网络
