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
- Choose a denormalized data model for the tags array within the Article model because the likelihood of an article having an infinite number of tags is low
- Separate model Favorite with many-to-many relationship between User and Article (instead of an array of articles' id inside of user) for better scalability
- Separate model Comment with many-to-many relationship between Comment and Article (instead of an array of comments' id inside of comment) for better scalability
