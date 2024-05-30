# Requests and Responses

## Dummy routes

### `GET /`, `GET /index`, `GET /index.html`

A greet `index.html`

### `GET /test`

A test json message

```json
{
  "message": "successful"
}
```

## User routes

### `POST /api/users`

Sign up user
Request

```json
{
  "user": {
    "username": "123",
    "email": "123@gmail.com",
    "password": "asd"
  }
}
```

Response

```js
// fail
res.status(400).json({ message: "All fields are required" });
res.status(422).json({ errors: { body: "Unable to register a user" } });

// success
res.status(201).json({ user: createdUser.toUserResponse() });
```

### `POST /api/users/login`

Sign in user
Request

```json
{
  "user": {
    "email": "123@gmail.com",
    "password": "asd"
  }
}
```

Response

```js
// fail
res.status(400).json({ message: "All fields are required" });
res.status(404).json({ message: "User Not Found" });
res.status(401).json({ message: "Unauthorized: Wrong password" });

// success
res.status(200).json({ user: loginUser.toUserResponse() });
```

### `PUT /api/user`

Update user
Request, need auth

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

Response

```js
// fail
res.status(400).json({ message: "Required a User object" });
res.status(422).json({ errors: { body: "Unable to update user" } });

// success
res.status(200).json({ user: target.toUserResponse() });
```

### `GET /user`

Get current user
Request, need auth
Response

```js
// fail
res.status(404).json({ message: "User Not Found" });

// success
res.status(200).json({ user: user.toUserResponse() });
```

## Tags route

### `GET /tags`

Get all articles' tags
Request
Response

```js
// success
res.status(200).json({ tags });
```

## Profile route

### `GET /profiles/:username`

Get a user profile
Request
Response

```js
// fail
res.status(404).json({ message: "User Not Found" });

// success
res.status(200).json({ profile: user.toProfileJSON() });
```

## Article routes

### `POST /articles`

Create a new article
Request, need auth, need authz

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

Response

```js
// fail
res.status(401).json({ message: "User Not Found" });
res.status(400).json({ message: "All fields are required" });
res.status(422).json({ errors: { message: "Unable to create that article" } });

// success
res.status(200).json({ article: await article.toArticleResponse(author) });
```

### `DELETE /articles/:slug`

Delete an article
Request, need auth, need authz
Response

```js
// fail
res.status(401).json({ message: "User Not Found" });
res.status(401).json({ message: "Article Not Found" });
res.status(403).json({ message: "Only the author can delete his article" });

// success
res.status(200).json({ message: "Article successfully deleted!!!" });
```

### `POST /articles/:slug/favorite`

Add an article to favorite
Request, need auth
Response

```js
// fail
res.status(401).json({ message: "User Not Found" });
res.status(401).json({ message: "Article Not Found" });

// success
res
  .status(200)
  .json({ article: await updatedArticle.toArticleResponse(loginUser) });
```

### `DELETE /articles/:slug/favorite`

Remove an article from favorite
Request, need auth
Response

```js
// fail
res.status(401).json({ message: "User Not Found" });
res.status(401).json({ message: "Article Not Found" });

// success
res
  .status(200)
  .json({ article: await updatedArticle.toArticleResponse(loginUser) });
```

### `GET /articles/:slug`

Get an article
Request
Response

```js
// fail
res.status(401).json({ message: "Article Not Found" });

// success
res.status(200).json({ article: await article.toArticleResponse(false) });
```

### `PUT /articles/:slug`

Update an article
Request, need auth, need authz

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

Response

```js
// fail
res.status(401).json({ message: "Article Not Found" });
res.status(422).json({ errors: { message: "Unable to update that article" } });

// success
res.status(200).json({ article: await target.toArticleResponse(loginUser) });
```

### `GET /articles`

Accept params:

- `limit` to limit number of articles each time
- `offset` for pagination
- `tag` to get all articles include that tag
- `favorited` is a username, to get all favorite articles of that user

List articles
Request, optional auth
Response

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

<!----> TODO: continue to work on this

## Comment routes

### `GET /user`

Get current user
Request
Response

```json

```
