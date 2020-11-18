---
title: "Ubuntu 18.04LTS nginx证书部署"
date:   2020-02-07 22:00:00 +0800
---

今天起了个大早购买域名、申请证书后，就开始着手nginx ssl的搭建。本以为是个简单活，结果翻了诸如阿里云和腾讯云之类年久失修的文档，始终没能解决问题。折腾了大半小时，于是写个博客。

阿里云配置为Ubuntu 18.04 LTS, x86_64, Nginx 1.16.1 

其实结合阿里云、腾讯云两文档也能略微猜懂，就是往nginx.conf里面添加东西。但由于第一次接触nginx配置，还是折腾了很久。主要有以下问题：

1. nginx地址。也许是CentOS和Ubuntu设置不同，nginx配置地址并非两文档中描述的`/usr/local/nginx/nginx.conf`，而是`/etc/nginx/nginx.conf`。

2. 未在`nginx.config`中找到 #HTTPS（#HTTP） 之类的注释，不知道把server{...}插入到哪。其实就插入到http{...}中间即可。故有两种方法：①可直接添加到`nginx.config`的http{...}中，或者是在`/etc/nginx/conf.d/`文件夹中默认存在的`default.conf`（或自创xxx.conf）中将server{...}替换到原来的代码。

同时还有一个小技巧，如果对vim不太熟悉，可以用vscode的remote-ssh。

3. （最近查看时发现腾讯云已于2020-03-10更改代码，未收到腾讯感谢信，傲娇脸😕）
   [deprecated]腾讯云设置HTTP请求自动跳转HTTPS出错，已向腾讯云反馈。server代码应为：

```
server {
    listen 80 default_server;

    server_name _;

    return 301 https://$host$request_uri;  ## 替换掉`rewrite ^(.*)$ https://$host$1 permanent; `
}
```


4. 证书和秘钥乱丢。一开始丢在了`/etc/nginx`里面。

配置完成后当然要重新加载，通过`whereis nginx`找到nginx所在文件夹，有`cert`文件夹。习惯问题，nginx文件夹本身就有很多文件，容易弄混。

5. `nginx.conf`配置更改后让nginx及时更新

```
sudo nginx -s reload # nginx重新加载conf配置
```

当时我还出现了类似错误

```
$ sudo nginx -s reload
nginx: [error] invalid PID number "" in "/var/run/nginx.pid"
```

nginx -s reload 只是重新加载配置，如果nginx根本就没启动，那当然报错。

6. pid问题
```
 $ sudo nginx -s reload
nginx: [error] open() "/var/run/nginx.pid" failed (2: No such file or directory)
```

类似问题： 
```
nginx.service: Can't open PID file /var/run/nginx.pid (yet?) after start: No such file or directory
```

** Solution 1 : **

```
sudo vim /etc/nginx/nginx.conf
```
将pid `/var/run/nginx.pid` 一行改为 `/run/nginx.pid`

但偶尔还是会跳出

```
sudo nginx -s reload          
nginx: [error] open() "/run/nginx.pid" failed (2: No such file or directory)
```

所以不知是否治标。

**Solution 2 : **

https://serverfault.com/questions/565339/nginx-fails-to-stop-and-nginx-pid-is-missing

```
ps -ef | grep nginx
sudo kill -9 xxxx (nginx's master pid)
```

7. 端口占用问题
```
[emerg]: bind() to 0.0.0.0:80 failed (98: Address already in use)
```

解决方法：强制关闭然后nginx重启。

```
sudo fuser -k 80/tcp
service nginx start
```
