---
title: "GraphQL学习笔记 - Part2 进阶部分"
date: 2021-07-29 19:00:00 +0800
categories: 学习笔记
---

## Clients

By the end of this section, you should be able to:

Describe the advantages of using GraphQL on the client-side of your application.

### 描述在应用客户端使用 GraphQL 的优点

声明式获取或更新数据。获取数据时只需要考虑高层次的问题，不需要考虑个人考虑网络层方面的问题。

GraphQL 会根据客户端所在平台和运用的框架选择不同的 UI 更新方案，如 React 开发 GraphQL 会运用[higherOrderComponent(HOC)](https://reactjs.org/docs/higher-order-components.html)；并且 GraphQL 很适合[函数式响应式编程（FRP）](https://en.wikipedia.org/wiki/Functional_reactive_programming).

GraphQL 可缓存查询内容。如果下此查询 hit 缓存中内容，直接从缓存获取结果。

GraphQL 可在生成环境中对 schema 进行认证和纠错。

GraphQL 可将 UI 代码和所需数据跨端分开。

GraphQL 客户端很流畅且强大，如提供强类型、类型定义单一事实来源(SSOT)、自动填充等

### 笔记

两大客户端：

- [Apollo](https://github.com/apollographql/apollo-client)：这是我一年前了解的第一款 GraphQL 客户端，但仅限知道有这玩意
- [Relay](https://relay.dev/) ：Facebook 亲儿子

Wikipedia 定义：

> HOC 简单的说就是一种将一个 Component 转换成另一种 Component 的方法。它在第三方数据库非常常见，如 Redux 的[connect](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md#connect) 和 Relay 的 [createFragmentContainer](https://relay.dev/docs/v10.1.3/fragment-container/#createfragmentcontainer).

函数式响应式编程花了 2h 还是搞不懂

可参考内容内容：

- https://stackoverflow.com/questions/1028250/what-is-functional-reactive-programming
- http://conal.net/papers/push-pull-frp/

上述不了解内容，日后补充。但这位 conal 的简历，看的我瑟瑟发抖。

## Server

By the end of this section, you should be able to:

- Explain how GraphQL resolvers execute and resolve queries.
- Explain how batched resolving improves the performance of your GraphQL API.
- Discuss how the compiler approach helps with reducing multiple database hits.

### 解释 GraphQL resolvers 如何执行和解析 queries

```GraphQL
query: Query {
  author(id: "abc"): Author {
    posts: [Post] {
      title: String
      content: String
    }
  }
```

```GraphQL
Query.author(root, { id: 'abc' }, context) -> author
Author.posts(author, null, context) -> posts
for each post in posts
  Post.title(post, null, context) -> title
  Post.content(post, null, context) -> content
```

### 解释批量解析如何提升 API 性能

批量处理可以连接时确认网络情况、申请数据库数据 IO 的开销，而 GraphQL Compiler Approach 则在批量处理的基础上可将任意深度的 GraphQL 映射到一个查询.

推荐一位巨佬的知乎文章[从 GraphQL n+1 问题到 DataLoader 源码解析](https://zhuanlan.zhihu.com/p/348280148)

## More GraphQL Concepts

By the end of this section, you should be able to:

- Use fragments in GraphQL.
- Use arguments on GraphQL fields.
- Explain why aliases are helpful.
- Discuss advanced Schema Definition Language (SDL) topics such as enums, union types, interfaces.

### 使用 GraphQL fragments

类似变量封装部分想要查询的结果

```GraphQL
type User {
  name: String!
  age: Int!
  email: String!
  street: String!
  zipcode: String!
  city: String!
}
```

```GraphQL
fragment addressDetails on User {
  name
  street
  zipcode
  city
}
```

```GraphQL
{
  allUsers {
    ... addressDetails
  }
}
```

### 在 GraphQL fields 使用实参

不增加实参

```GraphQL
type Query {
  allUsers: [User!]!
}

type User {
  name: String!
  age: Int!
}
```

增加实参后

```GraphQL
type Query {
  allUsers(olderThan: Int = -1): [User!]!
}
```

```GraphQL
{
  allUsers(olderThan: 30) {
    name
    age
  }
}
```

### 解释为什么 Aliases 很有用

错误例子：一个查询使用了两个相同的字段

```GraphQL
{
  User(id: "1") {
    name
  }
  User(id: "2") {
    name
  }
}
```

使用 Alias 后，才能使用两个相同字段

```GraphQL
{
  first: User(id: "1") {
    name
  }
  second: User(id: "2") {
    name
  }
}
```

查询正确，得到结果

```json
{
  "first": {
    "name": "Alice"
  },
  "second": {
    "name": "Sarah"
  }
}
```

### 讨论高级 SDL 内容

首先，GraphQL 有两种类型，分别是 Scalar 类型 和 Object 类型

Scalar 类型描述数据的具体单位，有 5 种预定义（可现用）的 Scalar 类型，分别是：String, Int, Float, Boolean, and ID

Object 类型描述类型特征并且它们可组合，如前面所述的

```GraphQL
type User {
  name: String!
  age: Int!
}
```

我们也可自定义一些类型

- 枚举类型 - Enumerations (Enums) Types

如

```GraphQL
enum Weekday {
  MONDAY
  TUESDAY
  WEDNESDAY
  THURSDAY
  FRIDAY
  SATURDAY
  SUNDAY
}
```

- 接口类型 - Interface Type

描述一个接口，让其他类型实现它。如下面的 Node 接口，每一个实现它的类型必备 ID 域。

```GraphQL
interface Node {
  id: ID!
}

type User implements Node {
  id: ID!
  name: String!
  age: Int!
}
```

- 联合类型 - Union Types

```GraphQL
type Adult {
  name: String!
  work: String!
}

type Child {
  name: String!
  school: String!
}

union Person = Adult | Child

# 接下来描述如何获取具体的信息

{
  allPersons {
    name      # works for 'Adult' and 'Child'
    ... on Child {
      school
    }
    ... on Adult {
       work
    }
  }
}
```

## 工具和生态

By the end of this section, you should be able to:

- Explain what introspection is and why it is useful.

### 解释什么是 introspection 以及为什么它很实用

Schema 的设计者知道自己创建的 schema 长啥样子，但使用者如何才能发现自己要找什么东西呢？

答案是：通过查询`__schema`字段

对下面例子而言

```GraphQL
type Query {
  author(id: ID!): Author
}

type Author {
  posts: [Post!]!
}

type Post {
  title: String!
}
```

通过\_\_schema 查询

```GraphQL
query {
  __schema {
    types {
      name
    }
  }
}
```

可得到如下结果

```json
{
  "data": {
    "__schema": {
      "types": [
        {
          "name": "Query"
        },
        {
          "name": "Author"
        },
        {
          "name": "Post"
        },
        {
          "name": "ID"
        },
        {
          "name": "String"
        },
        {
          "name": "__Schema"
        },
        {
          "name": "__Type"
        },
        {
          "name": "__TypeKind"
        },
        {
          "name": "__Field"
        },
        {
          "name": "__InputValue"
        },
        {
          "name": "__EnumValue"
        },
        {
          "name": "__Directive"
        },
        {
          "name": "__DirectiveLocation"
        }
      ]
    }
  }
}
```

而检测 instropect 类型可以得到

```GraphQL
{
  __type(name: "Author") {
    name
    description
  }
}
```

```json
{
  "data": {
    "__type": {
      "name": "Author",
      "description": "The author of a post."
    }
  }
}
```

可以用一些专业工具帮忙内部检测，如 [graphiql](https://github.com/graphql/graphiql)

另外，推荐一款很棒的 GraphQL IDE 工具：[GraphQL Playground](https://github.com/graphql/graphql-playground)

## Security

区分恶意攻击和大批量正常访问

By the end of this section, you should be able to:

- Discuss the strategies to protect your GraphQL server against malicious clients.
- Discuss about timeouts, maximum query depths, and throttling.

### 讨论保护 GraphQL 服务器抵抗恶意客户端攻击的策略

- 超时。设置允许操作的最大时间。
- 最大查询深度。由于部分 GraphQL 语法是循环，这意味着客户端可以弄一个无限循环请求。用 AST 限制最大查询深度。
- 查询复杂度。

  ```GraphQL
  query {
    author(id: "abc") { # complexity: 1
      posts(first: 5) { # complexity: 5
        title           # complexity: 1
      }
    }
  }
  ```

- 限流。
  - 基于服务时间的限流。可以采用漏桶算法。如单次访问耗时 200ms，设置最大访问时间和为 1s，一个客户端连续访问了 5 次就会被限流。直到服务器再次给该用户访问时间。
  - 基于查询复杂度的限流。

### 讨论 timeouts, maximum query depths, and throttling

讨论优缺点，具体略。
