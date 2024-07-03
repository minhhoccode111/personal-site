# API Design

### Invalid Request Input Fields

```js
return res.status(400).json({ errors: errors.array() });
```

### Can't save document to database (conflict)

```js
res.status(422).json({ errors: [{ msg: "Unable to register a user" }] });
```

### Authenticate and Authorization

```js
return res.status(401).json({ errors: [{ msg: "Unauthorized" }] });
return res
  .status(401)
  .json({ errors: [{ msg: "Unauthorized: Wrong password" }] });
return res.status(403).json({ errors: [{ msg: "Forbidden" }] });
```

### Not Found

```js
return res.status(404).json({ errors: [{ msg: "[something] Not Found" }] });
```

### Conflict

```js
return res
  .status(409)
  .json({ errors: [{ msg: "[something] already exists" }] });
```

### Test routes

#### `GET /`, `GET /index`, `GET /index.html`

Response `index.html`

#### `GET /test`

Response

```js
res.status(200).json({ errors: [{ msg: "successful" }] });
```

### User routes

#### `POST /api/users`

Expect

```js
req.body = {
  user: {
    username: "123",
    email: "123@gmail.com",
    password: "Bruh0!0!",
  },
};
```

Response

```js
res.status(201).json({ user: createdUser.toUserResponse() });
```

#### `POST /api/users/login`

Expect

```js
req.body = {
  user: {
    email: "123@gmail.com",
    password: "Bruh0!0!",
  },
};
```

Response

```js
res.status(200).json({ user: loginUser.toUserResponse() });
```

#### `PUT /api/user` (auth)

Expect

```js
req.body = {
  user: {
    email: "minhhoccode111@gmail.com",
    username: "minhhoccode111",
    password: "asd",
    image: "https://avatars.githubusercontent.com/u/39550308",
    bio: "I write code (sometimes)",
  },
};
```

Response

```js
res.status(200).json({ user: target.toUserResponse() });
```

#### `GET /user` (auth)

Response

```js
res.status(200).json({ user: user.toUserResponse() });
```

### Tags route

#### `GET /tags`

Response

```js
res.status(200).json({ tags });
```

### Profile route

#### `GET /profiles/:userid` (auth optional)

Response

```js
res.status(200).json({ profile: user.toProfileJSON() });
```

### Article routes

#### `POST /articles` (auth, authz)

Expect

```js
req.body = {
  article: {
    title: "this is a title",
    description: "this is a description",
    body: "this is a body",
    tagList: ["some", "random", "tags"],
  },
};
```

Response

```js
res.status(201).json({ article: await article.toArticleResponse(author) });
```

#### `DELETE /articles/:slug` (auth, authz)

Response

```js
return res
  .status(200)
  .json({ messages: { msg: "Article successfully deleted" } });
```

#### `POST /articles/:slug/favorite` (auth)

Response

```js
res
  .status(200)
  .json({ article: await updatedArticle.toArticleResponse(loginUser) });
```

#### `DELETE /articles/:slug/favorite` (auth)

Response

```js
res
  .status(200)
  .json({ article: await updatedArticle.toArticleResponse(loginUser) });
```

#### `GET /articles/:slug`

Response

```js
return res.status(200).json({ article: await article.toArticleResponse() });
```

#### `PUT /articles/:slug` (auth, authz)

Expect

```js
req.body = {
  article: {
    title: "short",
    description: "short updated",
    body: "short updated",
    tagList: ["bruh"],
  },
};
```

Response

```js
return res
  .status(200)
  .json({ article: await target.toArticleResponse(author) });
```

#### `GET /articles` (auth optional)

Expect

```js
req.params = {
  limit: "5",
  offset: "5",
  tag: "programming",
  favorited: "username123",
};
```

- `limit` limit number of articles
- `offset` for pagination
- `tag` articles include that tag
- `favorited` a user's all favorited articles

Response

```js
res.status(200).json({
  articles: await Promise.all(
    filteredArticles.map(async (article) => {
      return await article.toArticleResponse(loginUser);
    }),
  ),
  articlesCount,
});
```

### Comment routes

#### `POST /articles/:slug/comments` (auth)

Expect

```js
req.body = {
  comment: {
    body: "something",
  },
};
```

Response

```js
res.status(200).json({ comment: await newComment.toCommentResponse(author) });
```

#### `GET /articles/:slug/comments`

Response

```js
res.status(200).json({
  comments: await Promise.all(
    comments.map(async (comment) => await comment.toCommentResponse()),
  ),
});
```

#### `DELETE /articles/:slug/comments/:id` (auth)

Response

```js
return res
  .status(200)
  .json({ messages: { msg: "Comment successfully deleted" } });
```
