# Personal Site Back

The **Personal Site Back** project is an expansion from the **Blog API** project, originally assigned in **The Odin Project** [course](https://www.theodinproject.com/lessons/nodejs-blog-api).
<br>
<br>

## [Demo](https://demo.realworld.io/)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)

This codebase was created to demonstrate a fully fledged fullstack application built with **Express.js + MongoDB + JavaScript** including CRUD operations, authentication, routing, pagination, and more.

Adhere to the **Express.js + MongoDB + JavaScript** community styleguides & best practices.

## Getting started

1. install npm
1. Run `npm install` in the project folder
1. Run `npm run dev` for dev mode and `npm run start` for regualr mode

## How it works

> All the route are defined in the `route` folder, and their corresponding controllers are implemented in the `controllers` folder.

## Design Choices and Tradeoffs

- Only one `access_token_secret` is used for all the accounts registration and login. Drawback: data can be forged if this secret is leaked
- Included array structures, e.g. list of comments in the article model, favorited articles in the user model, following users in the user model, tags in article model. Drawback: not good for scalability
- Count favorite times of an article by going through every user and count each time that article appear in `favoriteArticles` array of each user instead of maintaining a `favoritesCount` variable in each article document. Drawback: not good for scalability
- Usernames are case-sensitive
