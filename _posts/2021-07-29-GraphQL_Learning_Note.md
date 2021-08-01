---
title: "GraphQL学习笔记 - Part1 基础概念"
date: 2021-07-29 19:00:00 +0800
categories: 读书笔记
---

跟着 edX 的[Exploring GraphQL: A Query Language for APIs](https://www.edx.org/course/exploring-graphql-a-query-language-for-apis) 学习 GraphQL

## Chapter 1.GraphQL Fundamentals

### Introduction to GraphQL

By the end of this section, you should be able to:

- Define what GraphQL is.
- Explain what the advantages of GraphQL over REST API are.
- Present the history of GraphQL.

#### 什么是 GraphQL？

GraphQL 是 API 的查询语言，并且在服务器运行环境使用你为数据定义的类型系统。服务器运行环境中你用的类型系统。但它并不和数据库和存储系统挂钩，而与现成的代码和数据有关。

它的模样和 JSON 有点像，如：

```json
{
  "123": {
    "id": "123456",
    "name": "gricn"
  }
}
```

```GraphQL
node(123){
  id
  name
}
```

需要注意，上面这段代码中[2015 React.js 大会](https://www.youtube.com/watch?v=9sc8Pyc51uU&ab_channel=FacebookDevelopers) 展示版本 id 后面有","，目前版本不需要，所以我在这里也省略了。

#### 和 REST API 相比，GraphQL 有什么优点？

REST 全称为 Representational state transfer，中文翻译是拗口的“表示层状态转移”。它也是一种获取信息的架构格式，其中最常见的为 RESTful 服务。

在同是获取 json 格式的情况下，REST 的表现方式为：`FUNCTION /routes`

`FUNCTION` 是 http 常用方法，如 POST, GET, PUT, PATCH, DELETE 之类

`/routes` 则表示调用方法的路径

所以可以举一个数据库教学中最常见的例子。我们定义一个 REST API `GET /123/grade` 。它得到以下类型的数据

```json
{
  "123": {
    "grade": {
      "chinese": 99,
      "math": 99,
      "english": 99
    }
  }
}
```

那如果我只想获得学生 123 语文成绩呢？这个时候又得写一个 API 方法了。如`GET /123/grade/chinese`；如果只想要数学呢，又得编一个新的 API 方法。而这个时候 GraphQL 优点显示出来了。它可以自由调取所需内容，这很适合需求变化大，帮助终端设备节约流量资源的软件。我第一个用 REST API 写的程序就是后来实在用了太多 API，特别烦，所以就直接`grade.chinese`了。

此外，现在看到的很多公司`v1`, `v2`版本 API 就是 REST 的产物；GraphQL 可以避免这种麻烦。

总结而言：GraphQL 适合中大型且变化较快服务。

如果只是普通使用，二者是可以任意替换的。至于更细节部分，就要看专业书籍了。但我挺好奇的是嵌套深度够大时 GraphQL 性能问题（以后研究）。

#### 简述 GraphQL 的历史

自从 2012 年起，脸书公司就在 Facebook 上使用 GraphQL 获取数据。在 2015 年 React.js 大会上，GraphQL 首次正式亮相。

### A Comparison of GraphQL and REST

By the end of this section, you should be able to:

- Differentiate examples of REST queries versus GraphQL queries.
- Explain how GraphQL solves the over-fetching and under-fetching problem of REST APIs.
- Discuss why GraphQL allows frontend and backend teams to work independently.

（PS. 看到这我人都傻了，为了回答上文作业我查了不久资料）

#### REST 查询 和 GraphQL 查询 区别

上文已讲述

#### 描述 GraphQL 如何解决 REST API 获取过度或获取不足的问题？

获取过度：下载过多不需要的内容

获取不足：一次路径请求没得到全部信息，得发送多次请求

GraphQL 向服务器发起一个带有所有需要查询 query 内容的 POST 请求，服务器收到后进行数据库查询，将获得内容打包成一个 json 文件返回。

### GraphQL Core Concepts

By the end of this section, you should be able to:

- Explain what GraphQL queries and mutations are.
- Understand how to create a GraphQL schema.

#### 描述 GraphQL queries 和 mutations

`queries` 类似 GET 方法

```GraphQL
{
  allPersons {    // root field of the query
    name          // payload of the query
    age
  }
}
```

`mutations` 类似 CREATE, UPDATE, DELETE 这些改变数据内容的方法

```GraphQL
mutation {
  createPerson(name:"Bob", age:36) {    // root field of the mutation
    name                                // payload of the mutation
  }
}
```

GraphQL 会立刻返回这样的结果

```GraphQL
{
  createPerson {
    "name":"Bob"
    "age":36
  }
}
```

如果数据库用了自动生成 id ，可以用这个小 trick

```GraphQL
mutation {
  createPerson(name: "Alice", age: 36) {
    id
  }
}
```

而`subscrpition`，它并非像上两者采用 Request-Response，表示的是发送到客户端的数据流。它一般不常用，但适合获取大对象中的小变化或是需要低延时实时变化的内容。

```GraphQL
subscription {
  newPerson {
    name
    age
  }
}
```

这样一旦 Mutation 创建了一个新 Person，服务器会立即返回消息给客户端。

#### 掌握如何创建 GraphQL Schema

用 Schema Definition Language(SDL)

简单来说就是确立 Type，定义“方法”（Query, Mutation, Subscription），定义“内容”（如下文：Person, Post）

```GraphQL
type Query {
  allPersons(last: Int): [Person!]!   // "!"表示必填内容
}

type Mutation {
  createPerson(name: String!, age:Int): Person!
  ...
}

type Subscription {
  newPerson: Person!
}

type Person {
  id: ID!
  name: String!
  age: Int!
  posts: [Post!]!
}

type Post {
  title: String!
  author: Person!
}

```

### GraphQL Architecture

By the end of this section, you should be able to:

- Present the three different kinds of architectures that include a GraphQL server.
- Explain how GraphQL can integrate third party or legacy systems.
- Understand resolver functions.
- Describe how GraphQL can make front-end development easier.

#### 描述包含 GraphQL 服务器的三种不同架构

- GraphQL 直连服务器
- GraphQL 集成已有系统
- GraphQL 直连服务器与集成已有系统的结合（1 和 2 结合）

#### 解释 GraphQL 如何集成第三方或传统的系统

- GraphQL 服务器作为传统系统，微服务，第三方 API 服务的集成层（客户端 <=> GraphQL <=> Server)
- GrapQL 服务器自带数据库，但又能同时和微服务和第三方 API 等服务器会话

#### 掌握 resolver 方法

- GraphQL queries 和 mutations 运用了大量的 fields，而每个 field 都有一个对应的 resolver
- 每个 resolver 的目的是从对应的域中提取数据

#### 描述 GraphQL 如何方便前端开发

这又要和 REST 进行比较，前端用 REST 获取数据时需要：

1. 组件参数并用 HTTP 请求
2. 得到服务器的响应并对回复进行解析

GraphQL 获取数据只需要：

1. 描述想要的数据

这就好了
