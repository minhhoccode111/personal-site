# Database design

## User

- username
  - unique
  - lowercase
- email
  - unique
  - lowercase
  - index
- password
- bio
- image
- isAuthor
- { timestamp: true }
- generateAccessToken() return
  - accessToken
- toUserResponse() return
  - bio
  - email
  - image
  - username
  - isAuthor
  - generateAccessToken()
- toProfileJSON() return
  - bio
  - image
  - username
  - isAuthor
- isFavorite(articleid) return
  - !!favorited
- favorite(articleid)
- unfavorite(articleid)

## Article

- slug
  - unique
  - lowercase
  - index
- title
- description
- body
- tagList
- author
- { timestamp: true }
- toArticleResponse(user) return
  - slug
  - body
  - title
  - tagList
  - createdAt
  - updatedAt
  - description
  - !!favorited
  - favoritesCount
  - author.toProfileJSON()

## Comment

- body
- author
- article
- { timestamp: true }
- toCommentResponse() return
  - id
  - body
  - createdAt
  - updatedAt
  - author.toProfileJSON()

## Favorite

- userid
- articleid
