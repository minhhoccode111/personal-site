# API Design

## Dummy routes

#### `GET /`, `GET /index`, `GET /index.html`

- A greet `index.html`

#### `GET /test`

- A test json message

```json
{
  "message": "successful"
}
```

## User routes

#### `POST /api/users`

- Sign up user
- `req.body`

```json
{
  "user": {
    "username": "123",
    "email": "123@gmail.com",
    "password": "asd"
  }
}
```

- `res.`

```js
// fail
res.status(400).json({ message: "All fields are required" });
res.status(422).json({ errors: { body: "Unable to register a user" } });

// success
res.status(201).json({ user: createdUser.toUserResponse() });
```

#### `POST /api/users/login`

- Sign in user
- `req.body`

```json
{
  "user": {
    "email": "123@gmail.com",
    "password": "asd"
  }
}
```

- `res.`

```js
// fail
res.status(400).json({ message: "All fields are required" });
res.status(404).json({ message: "User Not Found" });
res.status(401).json({ message: "Unauthorized: Wrong password" });

// success
res.status(200).json({ user: loginUser.toUserResponse() });
```

#### `PUT /api/user`

- Update user
- `req.body`, need auth

```json
{
  "user": {
    "email": "minhhoccode111@gmail.com",
    "username": "minhhoccode111",
    "password": "asd",
    "image": "https://avatars.githubusercontent.com/u/39550308",
    "bio": "I write code (sometimes)"
  }
}
```

- `res.`

```js
// fail
res.status(400).json({ message: "Required a User object" });
res.status(422).json({ errors: { body: "Unable to update user" } });

// success
res.status(200).json({ user: target.toUserResponse() });
```

#### `GET /user`

- Get current user
- Need auth
- `res.`

```js
// fail
res.status(404).json({ message: "User Not Found" });

// success
res.status(200).json({ user: user.toUserResponse() });
```

## Tags route

#### `GET /tags`

- Get all articles' tags
- `res.`

```js
// success
res.status(200).json({ tags });
```

## Profile route

#### `GET /profiles/:username`

- Get a user profile
- `res.`

```js
// fail
res.status(404).json({ message: "User Not Found" });

// success
res.status(200).json({ profile: user.toProfileJSON() });
```

## Article routes

#### `POST /articles`

- Create a new article
- `req.body`, need auth, need authz

```json
{
  "article": {
    "title": "this is a title",
    "description": "this is a description",
    "body": "this is a body",
    "tagList": ["some", "random", "tags"]
  }
}
```

- `res.`

```js
// fail
res.status(401).json({ message: "User Not Found" });
res.status(400).json({ message: "All fields are required" });
res.status(422).json({ errors: { message: "Unable to create that article" } });

// success
res.status(200).json({ article: await article.toArticleResponse(author) });
```

#### `DELETE /articles/:slug`

- Delete an article
- Need auth, need authz
- `res.`

```js
// fail
res.status(401).json({ message: "User Not Found" });
res.status(401).json({ message: "Article Not Found" });
res.status(403).json({ message: "Only the author can delete his article" });

// success
res.status(200).json({ message: "Article successfully deleted!!!" });
```

#### `POST /articles/:slug/favorite`

- Add an article to favorite
- Need auth
- `res.`

```js
// fail
res.status(401).json({ message: "User Not Found" });
res.status(401).json({ message: "Article Not Found" });

// success
res
  .status(200)
  .json({ article: await updatedArticle.toArticleResponse(loginUser) });
```

#### `DELETE /articles/:slug/favorite`

- Remove an article from favorite
- Need auth
- `res.`

```js
// fail
res.status(401).json({ message: "User Not Found" });
res.status(401).json({ message: "Article Not Found" });

// success
res
  .status(200)
  .json({ article: await updatedArticle.toArticleResponse(loginUser) });
```

#### `GET /articles/:slug`

- Get an article
- `res.`

```js
// fail
res.status(401).json({ message: "Article Not Found" });

// success
res.status(200).json({ article: await article.toArticleResponse(false) });
```

#### `PUT /articles/:slug`

- Update an article
- `req.body`, need auth, need authz

```json
{
  "article": {
    "title": "short",
    "description": "short updated",
    "body": "short updated",
    "tagList": ["bruh"]
  }
}
```

- `res.`

```js
// fail
res.status(401).json({ message: "Article Not Found" });
res.status(422).json({ errors: { message: "Unable to update that article" } });

// success
res.status(200).json({ article: await target.toArticleResponse(loginUser) });
```

#### `GET /articles`

- List articles
- Optional auth
- Accept params:
  - `limit` limit number of articles (default 20)
  - `offset` for pagination (default 0)
  - `tag` articles include that tag
  - `favorited` get all favorite articles of a user
- `res.`

```js
res.status(200).json({
  articles: await Promise.all(
    filteredArticles.map(async (article) => {
      // auth, to mark favorite ones
      return await article.toArticleResponse(loginUser);
      // no auth
      return await article.toArticleResponse(false);
    }),
  ),
  articlesCount,
});
```

## Comment routes

#### `POST /articles/:slug/comments`

- Create a comment on post
- `req.body`, need auth

```js
{
  "comment": {
    "body": "contact"
  }
}
```

- `res.`

```js
// fail
res.status(401).json({ message: "User Not Found" });
res.status(401).json({ message: "Article Not Found" });

// success
res.status(200).json({ comment: await newComment.toCommentResponse() });
```

#### `GET /articles/:slug/comments`

- Get all comments on a post
- `res.`

```js
// fail
res.status(401).json({ message: "Article Not Found" });

// success
res.status(200).json({
  comments: await Promise.all(
    article.comments.map(async (commentId) => {
      const commentObj = await Comment.findById(commentId).exec();
      return await commentObj.toCommentResponse();
    }),
  ),
});
```

#### `DELETE /articles/:slug/comments/:id`

- Delete a comment on a post
- Need auth
- `res.`

```js
// fail
res.status(401).json({ message: "Comment Not Found" });
res.status(401).json({ message: "User Not Found" });
res.status(401).json({ message: "Article Not Found" });
res
  .status(403)
  .json({ message: "Only the author of the comment can delete the comment" });

// success
res.status(200).json({ message: "comment has been successfully deleted!!!" });
```
