---
title: "Ubuntu 18.04LTS nginx证书部署"
date:   2020-02-07 22:00:00 +0800
---

今天起了个大早购买域名、申请证书后，就开始着手nginx ssl的搭建。本以为是个简单活，结果翻了诸如阿里云和腾讯云之类年久失修的文档，始终没能解决问题。折腾了大半小时，于是写个博客。

阿里云配置为Ubuntu 18.04LTS, x86_64, nginx1.16.1 

其实结合阿里云、腾讯云两文档也能略微猜懂，就是往nginx.conf里面添加东西。但由于第一次接触nginx配置，还是折腾了很久。主要有以下问题：

1. nginx地址。也许是CentOS和Ubuntu配置不同，nginx安装地址并非两文档中描述的`/usr/local/nginx/nginx.conf`，而是`/etc/nginx/nginx.conf`。

2. 未找到#HTTPS（#HTTP）之类的注释，不知道把server{...}插入到哪。其实就插入到http{...}中间。

3. 腾讯云设置HTTP请求自动跳转HTTPS出错，已向腾讯云反馈。server代码应为：

```
server {
    listen 80 default_server;

    server_name _;

    return 301 https://$host$request_uri;  ## 替换掉`rewrite ^(.*)$ https://$host$1 permanent; `
}
```

4. 证书和秘钥乱丢。一开始丢在了`/etc/nginx`里面。



配置完成后当然要重新加载，通过`whereis nginx`找到nginx所在文件夹，然后
```
cd /usr/sbin/
sudo nginx -t #检测配置是否正确
sudo nginx -s reload # nginx重新加载conf配置
```

当时我还出现了类似错误

● nginx.service - nginx - high performance web server
   Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: en
   Active: failed (Result: exit-code) since Thu 2020-02-06 15:58:11 CST; 38s ago
     Docs: http://nginx.org/en/docs/
  Process: 14231 ExecStart=/usr/sbin/nginx -c /etc/nginx/nginx.conf (code=exited
 Main PID: 472 (code=exited, status=0/SUCCESS)

解决方法：systemctl restart nginx | nginx -s reload 随缘，暂时不清楚。