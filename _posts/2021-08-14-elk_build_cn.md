---
title: "ELK部署踩坑分享"
date: 2021-08-14 19:00:00 +0800
categories: 技术分享
---

我在 4 月份的时候部署了 ELK6.8 版本，也写了一篇英文博文。但现在新博客还未搭建完毕，手头上又有紧急任务。再写一篇中午版记录遇到的问题，以后再合并。

现在要升级为 7.14.由于 Docker 采取的是将镜像安装到容器并挂载 `volumes`，未在 `volumes` 中保存的系统配置全部失效（如各用户和密码），所以我得从头部署。而由于有 3 个多月没有碰 ES，重新配置时还是有些生疏。在此做笔记帮助自己和大家屡屡思路。

## 基于 Docker 的 Elasticsearch 安装 IK 分词器

安装分词器有两种方法，分别为在线和离线安装。不管哪种方法，基于 Docker 特性，都应该用`Dockerfile`、`docker-compose`实现自动安装或是`volumes`实现再次挂载。我在安装时出现小问题，找了一整页 Google 回答，看到的答案几乎都是 `docker cp` 或者下次重启镜像后 `docker exec` 进去再次安装。这从效率上来说是非常低效的。

## query

### bool

高级搜索首选，可以把普通搜索嵌套在 should 当中

- must：必须包含字段，计分
- filter：必须包含字段，不计分
- must_not：必须排除字段，不计分
- should：应该（可加条件限定“应该”的程度），计分

### term 和 match

term 可以理解为确切搜索，也就是搜索内容要正好要等于搜索的范式。但由于 ES 会将数据按照默认分词器分割，所以放进去的数据会按照分词分开。如“北京”在 ES 默认的分词器 `Standard` 的“分词”下，会变成“北”、“京”。这样，哪怕正好有一个 title 叫“北京”，在搜索时如果用 term 搜索“北京”也得不到想要的结果。这时，若 match 未设置 analyzer，也使用`Standard`的情况下，则能匹配到“北”和“京”。

但是这样体验并不好，如果就是要精确搜索一个 title，从而获得 title 对应的文章内容呢？

这时可以使用`keyword`关键字。这点 ES7 自带的[Dynamic mapping](https://www.elastic.co/guide/en/elasticsearch/reference/7.14/mapping.html)做的很好，它在创建 mapping 时自动会为 String 创建`text`和`keyword`两种字段。如：

```DSL(Kibana)
"title" : {
  "type" : "text",
  "fields" : {
    "keyword" : {
      "type" : "keyword",
      "ignore_above" : 256
    }
  }
}
```

这样如果要对 title 精确搜索，可以这样：

```DSL
query: {
  term: {
    "title.keyword":{
      value: "北京"
    }
  }
}
```

这样就可以精准匹配标题为“北京”的内容了。

其他可参考官方文档 [term](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-term-query.html) 的介绍。

### multi_match

主要有 6 种类型，分别为 `best fields` (默认值), `most fields`, `cross fields`, `phrase`, `phrase_prefix`, `bool_prefix`

由于每一个内容信息量都挺大的，这里只讲个概括。详情还是参考文档。

#### best fields

在不同字段分别算搜索得分，并用获得其中最佳搜索字段对搜索结果排序。

```DSL
GET /_search
{
  "query": {
    "multi_match" : {
      "query":      "brown fox",
      "type":       "best_fields",
      "fields":     [ "subject", "message" ]
    }
  }
}
```

得到结果是：

```DSL
GET /_search
{
  "query": {
    "dis_max": {
      "queries": [
        { "match": { "subject": "brown fox" }},
        { "match": { "message": "brown fox" }}
      ]
    }
  }
}
```

可以用`tie_breaker`参数限定其他非最佳匹配分数的权重。在未配置的情况下，`tie_breaker`默认值为 0，即其他字段不记权。也就是`best_fields`最常见的用法。

#### most fields

用搜索所有字段的得分和对内容排序。也可理解为在上文`best fields`例子上，加入`tie_breaker`并赋值 1。即其他字段得分和最佳字段得分有相同的权重。

若对`tie_breaker`有歧义，可以看官方在 [Disjunction max query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-dis-max-query.html)处的描述。

#### cross fields

一例胜千言，以官方文档搜索 Will Smith 为例。

`cross_fields`

```
GET /_search
{
  "query": {
    "multi_match" : {
      "query":      "Will Smith",
      "type":       "cross_fields",
      "fields":     [ "first_name", "last_name" ],
      "operator":   "and"
    }
  }
}
```

> +(first_name:will last_name:will)
> +(first_name:smith last_name:smith)

所有词语要同时出现在至少一处字段中 (all terms must be present in at least one field for a document to match)

而 `best fields`

```DSL
GET /_search
{
  "query": {
    "multi_match" : {
      "query":      "Will Smith",
      "type":       "best_fields",
      "fields":     [ "first_name", "last_name" ],
      "operator":   "and"
    }
  }
}
```

> (+first_name:will +first_name:smith)
> | (+last_name:will +last_name:smith)

所有词语要同时出现在单一字段中 (all terms must be present in a single field for a document to match)

这样就搜不到名为`will smith`的人

#### phrase & phrase_prefix

先讲 phrase_prefix

```DSL
GET /_search
{
  "query": {
    "multi_match" : {
      "query":      "quick brown f",
      "type":       "phrase_prefix",
      "fields":     [ "subject", "message" ]
    }
  }
}
```

它等价于

```DSL
GET /_search
{
  "query": {
    "dis_max": {
      "queries": [
        { "match_phrase_prefix": { "subject": "quick brown f" }},
        { "match_phrase_prefix": { "message": "quick brown f" }}
      ]
    }
  }
}
```

那什么是`match_phrase_prefix`呢？

`match_phrase_prefix`得到包含**相同顺序搜索字段**的全文，其中最后一个搜索内容被视为前缀，可以匹配到任何以它为开头的字段。

```DSL
GET /_search
{
  "query": {
    "match_phrase_prefix": {
      "message": {
        "query": "quick brown f"
      }
    }
  }
}
```

可匹配到 quick brown fox 或 two quick brown ferrets
不可匹配到 the fox is quick and brown.

`match_phrase`则是得到包含**相同顺序搜索字段**的全文，最有一个词必须完全匹配。

`match_bool_prefix`和`match_phrase_prefix`不同之处在于它并不要求这些字段的相对顺序

### range

```DSL
"range" : {
  "age" : { "gte" : 10, "lte" : 20 }
}
```

## 如果 mapping 设置错误怎么办？

我最常犯的错误是新建 index 后忘记设置 IK 分词器了。而 ES 在导入后数据后不能重新修改 mapping 对应字段设置。

这里提供两种思路：

### 新建 带 settings 的 index 后再次导入数据

```DSL
PUT new_index
{
  "settings": {
    "analysis":{
      "analyzer": {
        "default":{
         "type": "ik_max_word"
        },
        "default_search":{
          "type":"ik_smart"
        }
      }
    }
  }
}
```

然后重新爬取或用 bulk 之类工具导入数据

### 新建带 mapping 的 index 后 reindex

```DSL
PUT new_index
{
  "mappings": {
    "properties" : {
      "@timestamp" : {
        "type" : "date"
      },
      ...
      "title" : {
        "type" : "text",
        "analyzer": "ik_max_word",
        "search_analyzer": "ik_smart",
        "fields" : {
          "keyword" : {
            "type" : "keyword",
            "ignore_above" : 256
          }
        }
      },
      ...
    }
  }
}

POST _reindex
{
  "source": {
    "index": "old_index"
  },
  "dest": {
    "index": "new_index"
  }
}

# Optional
# DELETE old_index
```

然后就可以对`new_index`搜索了

## 结语

以上版本仅在`7.14.0`测试过，具体内容还是要以官方文档为主。
