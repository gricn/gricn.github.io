---
title: "Scrapy遇到的问题"
date: 2021-06-01 23:00:00 +0800
categories: 技术分享
---

## 只获得状态码而不返回 body 内容

HEAD. 之前对 http 请求类型只限于 GET, POST, UPDATE, DELETE 这四个 CRUD 中，一直没把其他方法当回事。这次吃到苦头了，花了一个小时时间折腾这么个小玩意。

具体参考 [MDN 相关文档](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)

### VS Code Python 3.8 依旧无法使用 f-string

报错如下：`invalid syntaxPython(parser-16)`。于是`ctrl+shift+p`将 linter 换成了`flake8`。然后重启 VS Code 就行。

另外，`black`formatter 挺好用的。
