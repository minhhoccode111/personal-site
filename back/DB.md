## User

- username
  - unique
  - lowercase
- password
- email
  - unique
  - lowercase
  - index
- bio
  - default
- image
  - default
- isAuthor
  - default
- favoriteArticles (x)
- { timestamp: true }
- generateAccessToken()
- toUserResponse()
- toProfileJSON()
- isFavorite(id)
- favorite(id)
- unfavorite(id)

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
- favoritesCount
- comments (x)
- { timestamp: true }
- updateFavoriteCount()
- toArticleResponse(user)
- addComment(commentId)
- removeComment(commentId)

## Comment

- body
- author
- article
- { timestamp: true }
- toCommentResponse()

## Favorite

- userId
- articleId
