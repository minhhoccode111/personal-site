# Personal Site Back

The **Personal Site Back** project is an expansion from the **Blog API** project, originally assigned in **The Odin Project** [course](https://www.theodinproject.com/lessons/nodejs-blog-api).
<br>
<br>

This codebase was created to demonstrate a fully fledged fullstack application built with **Express.js + MongoDB + JavaScript** including CRUD operations, authentication, routing, pagination, and more.

Adhere to the **Express.js + MongoDB + JavaScript** community styleguides & best practices.

## Getting started

Clone the repo

```bash

git clone git@github.com:minhhoccode111/personal-site.git
cd personal-site

```

Use the required Node engine

```bash

nvm install 16
nvm use 16

```

Install packages

```bash

cd back
npm install
```

Populate developemnt database

(You can use the default `DATABASE_URI` in `.env` file or override with your own)

```bash
node script/cleardb.js
node script/populatedb.js
node script/infodb.js
```

And start

```bash

npm run dev
npm run start

```

## How it works

> All the route are defined in the `route` folder, and their corresponding controllers are implemented in the `controllers` folder.

## Design Choices and Tradeoffs

- Only one `access_token_secret` is used for all the accounts registration and login. Drawback: data can be forged if this secret is leaked
- Choose a denormalized data model for the tags array within the Article model because the likelihood of an article having an infinite number of tags is low
- Separate model Favorite with many-to-many relationship between User and Article (instead of an array of articles' id inside of user) for better scalability
- Separate model Comment with many-to-many relationship between Comment and Article (instead of an array of comments' id inside of comment) for better scalability
- Trust the client's JWT and not retrieve database for better performance
- Use `:articleid` instead of `:slug` in comment routes to immediately delete a comment using `:articleid` without retrieve the article with `:slug` to get the article'id for better performance but harder to test

## To-do

- Add `projects` and `skills` route
- Add testing
