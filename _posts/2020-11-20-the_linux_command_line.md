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
echo $((5**2))  # output:25
```

取余（像C）

``` bash
echo $((5/2)) # 2
echo $((5%2)) # 1
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
echo The total is $100.00  # output: The total is 00.00
```

这里shell将$1理解为一个变量吞掉了，那么可以怎么做呢

``` bash
echo The total is \$100.00   # output: The total is $100.00 （转义字符）
echo The total is "$"100.00  # output: The total is $100.00 （双引号）
echo The total is '$'100.00  # output: The total is $100.00 （单引号）
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

Linux: `traceroute`/`tracepath`; Windows:`tracert` 跟踪网络数据包传输途径

`netstat`：检查网络设置及相关数据统计

```shell
# ssh那有个有意思的例子
# 比较两者区别
ssh remote-server 'ls *' > a.txt
ssh remote-server 'ls * > a.txt'
```



## 第17章 文件搜索

### locate 简单搜索

`locate xxx` （这玩意是定期由updatedb创建索引的，如果需要，就切换到root运行updatedb）

### find 复杂搜索

`find ~` ：列出 `~` 下 所有文件清单及`~`所有子文件夹内的文件

### test选项

详情可`man find`在对应的TESTS中查看

![TESTS界面](https://i.imgur.com/hSDyXUo.png)

`find ~ -type f -name "*.jpg" -size +1M` ：搜索`~`中符合.jpg通配符格式 大于1M的普通文件(-type f)

#### 操作符

`-and`，`-or`，`-not`，`()`

`find ~ \( -type f -not -perm 0600 \) -or \( -type d -not -perm 0700 \)`: 这里一是`()`在shell有其他含义，需要转义；二是`-and`是默认操作，`-type f -not -perm 0600`等同于`-type f -and -not -perm 0600`

`find`操作符也存在**逻辑短路问题**：`-and`和`-or`

### action选项

`-delete`删除匹配文件

`-print`打印匹配结果（默认执行）

#### 用户自定义操作

`-exec rm '{}' ';'`：`{}`表示当前路径，`;`表示命令结束

`find ~ -name '.jpg' -exec ls -l '{}' ';'` 和`find ~ -name '.jpg' -exec ls -l '{}' +` （也可写成`find ~ -name '.jpg' -print | xargs ls -l` ）

推荐使用后者，执行完搜索后一次性执行后面指令，效率高很多。也可参考此文章： [xargs vs. exec {}](https://danielmiessler.com/blog/linux-xargs-vs-exec/#:~:text=When%20you%20use%20%2Dexec%20to,which%20is%20often%20just%20once.)；令据man find描述，出于安全性问题，推荐使用`-execdir`替换`-exec`，[这篇文章](https://learnfromnoobs.com/difference-between-find-exec-and-find-execdir-by-example/) 详细描述了两者区别

那么用户自定义操作还有什么更有用的操作呢？

如**批量改权限**：`find . \( -type f -not -perm 0600 -exec chmod 0600 '{}' ';' \)`



## 第18章 归档和备份

> 首先说一下，Windows用户小伙伴在压缩文件时尽量压缩成`.zip`格式，不选`.rar`、`.7z`等其他格式

### 文件压缩

全章描述的都是**无损压缩**

####  gzip

````shell
ls -l /etc > foo.txt
gzip foo.txt
# 上两行可以用以下一句直接代替
# ls -l /etc | gzip > foo.txt.gz

zless foo.txt.gz # 效果和 less foo.txt一样

gunzip foo.txt # 注意这里gunzip "foo.txt" 和 "foo.txt.gz" 两者都行
gunzip -c foo.txt.zip | less  # 涉及std流时，加-c参数（或--stdout / --to-stdout），并不会解压缩出 foo.txt文件

gzip -d foo.txt.gz # -d参数等同 gunzip
gzip -c foo.txt | zless

gzip foo.txt
zcat foo.txt.gz > foo.txt # 保留压缩文件同时生成新的txt文件
````

等等，总之很好玩。网上很多开源项目都将源代码用`gz`压缩成包。GitHub的代码打包都存在`zip`和`.tar.gz`（或又称`.tgz`）版本。当然，如有疏漏，欢迎留言交流。

![git在GitHub上的release](https://i.imgur.com/vGJJEnS.png)

#### bzip2（速度慢，质量高）
`bzip2`：和`gz`相似，`bzip2`和`bunzip2`分别对应压缩和解压缩。后缀为`.bz2`



### 文件归档

#### 简单归档

> 想说的是，虽然`tar cf`和`tar -cf`都行，但个人习惯用后者，所以就没有参照书中的书写方式。
>
> 另，书中并未说明为啥要加参数`-f`。在查阅Stack Overflow[一回答](https://stackoverflow.com/questions/35283301/used-tar-xz-without-f-and-now-program-stuck/35283380#35283380)后，方才明白原因。简单的说，如果未加参数`-f`，则`tar`常识从`stdin`读取内容，`-f`在这代表文件的意思。
>
> 另，文中的参数，不知是翻译问题还是原本就出了错，表18-2参数还是忽视吧

下面是代码示例

```shell
tar -cf temp.tar temp # 为整个 temp文件夹创建一个 temp.tar归档文件
# 查看归档文件里的情况；下两者类似 ls 和 ls -l的区别（见下图）
tar -tf temp.tar
tar -tvf temp.tar
# 提取归档文件
mkdir temp1
cd temp1
tar -xf ../temp.tar
```



![tf与tvf区别](https://i.imgur.com/8foI2K2.png)

文中还介绍了一个有趣的实例，如何备份系统某重要文件夹。如用设备名为BigDisk的硬盘备份`/home`文件夹

```shell
sudo tar -cf /media/BigDisk/home.tar /home
```

切换到另一台设备

```shell
cd /
sudo tar -xf /media/BigDisk/home.tar
```

#### 复杂归档

##### 只提取归档文件中的部分文件

```shell
cd foo
tar -xf ../playground2.tar --wildcards 'home/me/playground/dir-*/file-A' # 通过 `--wildcards` 支持通配符*
```

也可结合find命令实现

```shell
find playground -name 'file-A' -exec tar -rf playground.tar '{}' '+' 
find playground -name 'file-A' | tar -czf playground.tgz -T - # -T（--files-from）指定tar命令从文件中而非从命令行读取文件路径名列表
```



#### zip

`zip -r playground.zip playground` （和删除文件相似，加参数`-r`实现递归）

`find playground -name "file-A" | zip -@ file-A.zip` 	zip可用`-@`将多个文件送至zip进行压缩

`ls -l /etc/ | zip ls-etc.zip -`



### 同步文件和目录

本地文件或目录 + 远程rsync服务器`rsync://[user@]host[:port]/path`

`rsync -av playground foo` ：`-a`递归归档并保留文件属性。在这`foo`目录生成了playground的目录镜像备份。每当发生变化时，重新用该命令。也可加`--delete`（如`--delete /etc`来删除不需要的文件夹

#### rsync连接方式

1. ssh加密隧道连接：`sudo rsync -av --rsh=ssh host/path`
2. rsync服务器连接：`rsync -av rsync://host/path`



## 第19章 正则表达式

`grep`( global regular expression print )： `grep [options] regex [file...]`

grep常用options：

- `-i`：忽略大小写
- `-v`：反选
- `-c`：输出匹配数量
- `-l`：输出匹配项文件名而非匹配行自身
- `-L`：输出不包含匹配项文件名而非匹配行自身

- `-n`：匹配行前加入该行在文件内行号
- `-h`：多文件搜索时，抑制文件名输出（即用了该参数后，只输出符合内容，并不会在内容前写该内容所在的文件名）

```shell
# 搜索例子
ls /usr/bin | grep zip
grep zip dirlist*.txt 
```

注意，shell用regex时要用`''`包裹

#### POSIX字符类（并非正则内容，但和搜索相关）

最初ASCII是为美式英语设置的，随着Unix普及，POSIX为各个国家适配，按照字典排序法`aAbBcC...yYzZ`。Ubuntu等系统POSIX兼容的应用程序使用字典字母排序顺序，而非ASCII码字符排序顺序（`[A-C]*`表达的实际等同于`[AbBcC]*`，而非我们想要的`[ABC]*`）



> `[:alnum:]`：等同`[A-Za-z0-9]`
>
> `[:word:]`：等同`[_A-Za-z0-9]`
>
> `[:alpha:]`：字母字符
>
> `[:blank:]`：空格和制表符
>
> `[:space:]`：空白字符（空格、制表符、回车符、换行符、换页符、垂直制表符）
>
> `[:punct:]`：标点符号字符（各种乱七八糟的符号全都给它），记得“标点”英文**punctuation**的前5字母就行
>
> `[:xdigit:]`：表示十六进制的字符，等同[0-9A-Fa-f]

#### BRE / ERE

分别代表基本正则表达式和扩展正则表达式。常用ERE，`grep -E` / `egrep`方可实现ERE搜搜

接下来的部分，可以在看书时同时参考[regexr](https://regexr.com/)这个网站玩



## 第20章 文本处理

这个看一遍书

### stdin/stdout 部分函数

#### sort

举个好玩的，根据日历排序（以下图片来自CSDN “[Code speaking](https://blog.csdn.net/greywolf5)” 用户）

``sort -k=3.7 -nbr -k=3.1 -nbr --k=3.4 -nbr a.txt **注意下面shell命令--k应为-k**

![排序结果](https://img-blog.csdnimg.cn/20191204145425412.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2dyZXl3b2xmNQ==,size_16,color_FFFFFF,t_70)

`sort -t ‘:’ -k 7 /etc/passwd | head`

![-t作为字段分隔符](https://img-blog.csdnimg.cn/20191204150402570.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2dyZXl3b2xmNQ==,size_16,color_FFFFFF,t_70)

#### uniq

uniq只对排好序的文本有用，所以要先用sort排序（因为uniq只能移除相邻重复行）

### 切片和切块

#### cut

和sort用法差不多

#### paste

`paste a.txt b.txt`

#### join

类比数据库join，在有一个公共字段的基础上，连接两个数据表

`join a.txt b.txt`

### 文件比较

#### comm

比较两文档差异

`comm a.txt b.txt`：会输出三列内容，第一列为`a.txt`特有的内容；第二列为`b.txt`特有的行，第三列为共同拥有的行

`comm -12 a.txt b.txt`：省略第1、2列内容，只输出相同之处

#### diff

联想git diff看一遍就行。需要注意的是，这东东不能用来比较word变化哦，用git比较也不行。

#### patch

看看就行，觉得现在很少用这种方式



剩下的`sed`, `aspell`看看就好



## 第21章 格式化输出

这章学的和上章一样很迷，因为我没有太多相关需求。

`nl` 对行进行标号：`nl a.txt`

`fold`指定行宽，超过则wrap：`echo "xxxxx" | fold -w 10`；如果加`-s`参数，则考虑单词边界。总之就当是个

`fmt`：也可以进行不同行缩进

`pr`：格式化打印文本

`printf`：C语言样式输出

`groff`：已被T~E~X代替，为啥要看。但最新的Fifth Edition还保留着



## 第22章 打印（跳过，个人觉得要用GUI代替）



## 第23章 编译程序

本章只是稍微谈及make知识，如果想玩玩，可以去GitHub找个C开发的项目，如[coolsnowwolf/lede](https://github.com/coolsnowwolf/lede)



## 第24章 编写第一个shell脚本

这里shell相关知识本身很简单，倒是vim配置有点意思

直接在vim设置（单次生效）/ 修改`.vimrc`文件，不需要前面的冒号（永久生效）

**感觉很有用部分**

`:set tabstop=4`：默认Tab空格为8。感觉这个还是挺有用的，8空格太占空间了

**下面的vim几乎都默认开启了**

`:syntax on`：代码高亮

`:set health`：搜索高亮

`:set autoindent`：自动缩进



## 第25章 启动一个项目

命名规范：大写字母代表常量，小写字母代表变量

花括号有啥作用呢，例如：

```shell
filename="myfile"
mv $filename $filename1 # wrong
mv $filename ${filename}1 # success
```

### echo输出方式

```shell
echo "
	...
"
```

### here 文档（个人推荐）

最大好处是不用为引号纠结

```shell
cat <<- token #也可写成<< （<<-能忽视缩进，但不能忽视空格），token可替换成任意内容，不过越复杂越好，如_EOF_
	...
token
```

### 扩展一下

shell多行注释

```shell
<< token
...
token
```

和上面几乎一模一样呢



## 第26章 自顶向下设计

shell局部变量定义：`local xxx`



## 第27章 流控制：IF分支语句

```shell
if commands; then
	commands;
[elif commands; then
	commands;]
[else
	commands;]
fi
```

### test命令

特点是，单中括号对[ ]，**注意空格问题**，**注意空格问题**！`[`是`test`的符号链接，详情可参考[这篇文章](https://www.shellscript.sh/test.html)，或可慢慢往下阅读，书中**30.1.2 符号缺失冗余**会介绍（个人觉得文章讲的比后面更棒）

#### 文件表达式

可用表达式评估文件的状态`-x file`

如：`-e file`用来判断文件是否存在

详情可`man test`

### 符号命令

####  [[ ]] 命令

[[ expression ]]，是不是和上面的test命令的[ ]有点相像但又有些不同呢？

**特点**

1. 支持正则：`[[ string =~ regex ]]`
2. `==`操作符（双等）支持模式匹配 `[[ $file == foo.* ]]`

`[ ]`为POSIX一部分，`[[ ]]`为bash特定（zsh也支持，其他shell可自行Google一下）

#### (( )) 命令

用于执行算数真值测试，返回true或false

### 组合表达式

| operation | test | [[ ]]and(( )) |
| --------- | ---- | ------------- |
| AND       | -a   | &&            |
| OR        | -o   | \|\|          |
| NOT       | !    | !             |



## 第28章 读取键盘输入

`read`命令，非常实用，看一遍

这里有一个细节但是书上没说：[echo >&2](https://stackoverflow.com/questions/23489934/echo-2-some-text-what-does-it-mean-in-shell-scripting)这个问题。如果**想知根知底**，在看完上述Stack Overflow链接后，可以顺藤摸瓜看看[file descriptor](https://stackoverflow.com/questions/22367920/is-it-possible-that-linux-file-descriptor-0-1-2-not-for-stdin-stdout-and-stderr#:~:text=3%20Answers&text=At%20the%20file%20descriptor%20level,to%20be%20file%20descriptor%202.)的介绍；如果**只想知道它是干啥的**，后面“30.4.2 追踪”部分会讲解



## 第29章 流控制：While和Until循环

#### while结构

```shell
while commands; do
	commands;
done
```

和C一样，while支持`break` 和 `continue`

#### until

结构和while相同。但条件和while相反，就是如果while条件写 `-le 5`，那until写`-gt 5`，个人不习惯



## 第30章 故障诊断

这里讲了很多小技巧：

1. 补充一个前面不知哪儿描述的小技巧：`if [ "$number" = 1 ]`，这里如果number值为空，则会变成`if [ "" = 1 ]`；而如果不加双引号，当number值为空时，则会变成`if [ =1 ]`，直接报错
2. 当涉及换目录`rm *`时，得写成`cd $dir_name && rm *`。这样当cd失败时就不会执行后半句。当然最好再详细些，如果跳转失败结束脚本运行。
3. `echo "xxxxx" >&2`上文提及的东东，类似js的`console.log(xxx)`
4. bash也可用`#! /bin/bash -x`实现对脚本整体追踪 或用`set -x`和`set +x`部分追踪



## 第31章 流控制：case分支

case结构

```shell
case xxx in
	x)	commands
		exit
		;;
	x)	commands
		exit
		;;
	....
	# 下面的shell注释貌似出了点问题（typora解析异常，不知上传至博客如何）
	# 下面的 *) 就类似 C语言 switch case中的default，处理所有其他情况
	<< notice 
	*) commands
		exit
		;;
	notice
esac
```

最后那个`esac`真的很皮，和escape无关，是case的逆序拼写

case模式范例

| 模式         | 描述                                                         |
| ------------ | ------------------------------------------------------------ |
| a)           | 若关键字为a，则吻合                                          |
| [[:alpha:]]) | 若关键字为单个字母，则吻合                                   |
| ???)         | 若关键字为三个字符，则吻合                                   |
| *.txt)       | 若关键字以 .txt 结尾，则吻合                                 |
| *)           | **常放在case最后一个模式中**，用来处理所有和前模式不吻合的关键字 |



## 第32章 位置参数

