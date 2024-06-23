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
- isGoogleAuth
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
- authorid
- articleid
- toCommentResponse() return
  - id
  - body
  - articleid
  - createdAt
  - updatedAt
  - author.toProfileJSON()

## Favorite

- userid
- articleid

## Contact

-
-
-

## Skill

-
-
-

## Work

-
-
-
