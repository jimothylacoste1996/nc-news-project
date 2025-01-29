<h1 align="center" style="font-weight: bold;">James' NC News Project 💻</h1>

<p align="center">
<a href="https://james-nc-news.onrender.com">https://james-nc-news.onrender.com</a>
</p>

<p align="center">
    <b>This is a backend project building an API to access application data programmatically. It uses a PostgreSQL database and is interacted with using node-postgres.</b>
</p>

<h3>Minimum requirements</h3>

- [NodeJS (minimum v23.3.0)](https://nodejs.org/en/download)
- [psql/PostgreSQL (minimum v16.6)](https://www.postgresql.org/download/)

<h3>🤖 Cloning</h3>

run the following in the terminal to clone the repo

```bash
git clone https://github.com/jimothylacoste1996/nc-news-project
```

<h3>Configuring .env variables</h2>

If you wish to clone this repo and run it locally, you will need to create two .env files in the root of the project directory.

One of these files will be the test environment and set PGDATABASE=nc_news_test, the other will be the development environment and set PGDATABASE=nc_news

<h3>🚀 Starting</h3>

Ensure that the .env files are correctly configured. Run the following commands

Install dependencies

```bash
npm install
```

Create databases

```bash
npm run setup-dbs
```

Seed databases

```bash
npm run seed
```

<h3> Testing</h3>

The project uses the jest framework for testing

```bash
npm test app.test.js
```

<h2 id="routes">📍 API Endpoints</h2>

Here you can list the main routes of your API, and what are their expected request bodies.
​
| route | description  
|----------------------|-----------------------------------------------------
| <kbd>GET /api</kbd> | serves up a json representation of all the available endpoints of the API
<kbd>GET /api/topics</kbd> | serves an array of all articles, can optionally add queries to sort and filter
<kbd>GET /api/users</kbd> | serves an array of all users
<kbd>GET /api/articles</kbd> | serves an array of all articles
<kbd>GET /api/articles:article_id</kbd> | serves a specific article by article_id property, also includes amount of comments
| <kbd>GET /api/articles:article_id/comments</kbd> | serves an array of all comments for an article
| <kbd>PATCH /api/articles/:article_id</kbd> | updates the votes for an article
<kbd>POST /api/articles/:article_id/comments</kbd> | adds a comment for an article
| <kbd>DELETE /api/comments/:comment_id</kbd> | deletes a specific comment by comment_id
|

<h3 id="get-auth-detail">GET /api/articles</h3>

**RESPONSE**

```json
{
  "article_id": 34,
  "author": "grumpy19",
  "title": "The Notorious MSG’s Unlikely Formula For Success",
  "topic": "cooking",
  "created_at": "2020-11-22T11:13:00.000Z",
  "votes": 0,
  "article_img_url": "https://images.pexels.com/photos/2403392/pexels-photo-2403392.jpeg?w=700&h=700",
  "comment_count": "11"
}
```

<h3 id="post-auth-detail">POST /api/articles/:article_id/comments</h3>

**REQUEST**

```json
{
  "username": "JackSmith",
  "body": "This is great!"
}
```

**RESPONSE**

```json
{
  "username": "JackSmith",
  "body": "This is great!",
  "article_id": "3"
}
```
