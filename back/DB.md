# Database design

## User

- username
- email
- password
- bio
- image
- isAuthor
- isGoogleAuth
- generateAccessToken()
- toUserResponse()
- toProfileJSON()
- isFavorite(articleid)
- favorite(articleid)
- unfavorite(articleid)

## Article

- slug
- title
- description
- body
- tagList
- author
- toArticleResponse(user)

## Comment

- body
- authorid
- articleid
- toCommentResponse()

## Favorite

- userid
- articleid

## Contact

- name
- email
- body
- markAsRead
- toContactResponse()

## Skill

- slug
- title
- image
- level
- toSkillResponse()

## Work

- slug
- title
- description
- image
- demo
- github
- difficulty
- toWorkResponse()
