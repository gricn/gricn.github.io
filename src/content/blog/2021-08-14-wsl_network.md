---
title: "WSL网络问题"
date: 2021-08-12 20:00:00 +0800
categories: 技术分享
---

## 烦人 bug

> ERROR: for kibana Cannot start service kibana: Ports are not available: listen tcp 0.0.0.0:5601: bind: An attempt was made to access a socket in a way forbidden by its access permissions.

在 host 机用带有 Admin 权限的 CMD 执行

```bat
net stop winnat
net start winnat
```
