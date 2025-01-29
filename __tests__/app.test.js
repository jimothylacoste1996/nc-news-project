const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../app");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");

/* Set up your test imports here */

/* Set up your beforeEach & afterAll functions here */

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("General Error Handling", () => {
  test("not found", () => {
    return request(app).get("/api/incorrectendpoint").expect(404);
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const topics = response.body.topics;

        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
});
describe("GET /api/articles/:article_id", () => {
  test("200: Responds with the correct article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        expect((article.article_id = 1));
        expect((article.title = "Living in the shadow of a great man"));
        expect((article.topic = "mitch"));
        expect((article.author = "butter_bridge"));
        expect((article.votes = 100));
        expect((article.body = "I find this existence challenging"));
        expect((article.created_at = "2020-07-09T20:11:00.000Z"));
      });
  });
  test("200: Responds with the correct article with the correct comment count", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        expect((article.comment_count = "2"));
        expect((article.article_id = 3));
        expect((article.title = "Eight pug gifs that remind me of mitch"));
        expect((article.topic = "mitch"));
        expect((article.author = "icellusedkars"));
        expect((article.votes = 0));
        expect((article.body = "some gifs"));
        expect((article.created_at = "2020-11-03T09:12:00.000Z"));
      });
  });

  test("404 article not found", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article not found");
      });
  });
  test("400 id not a number", () => {
    return request(app)
      .get("/api/articles/notarticle")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});
describe("GET /api/articles", () => {
  test("200: Responds with an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;

        expect(articles.length).toBe(13);

        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("correctly orders the array by date", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;

        expect(articles).toBeSorted({ key: "created_at", descending: true });
      });
  });
  test("returns the correct comment count for articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles[0].comment_count).toBe("2");
        expect(articles[1].comment_count).toBe("1");
        expect(articles[6].comment_count).toBe("11");
        expect(articles[12].comment_count).toBe("0");
      });
  });
  test("correctly sorts the articles by chosen query in ascending order", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then((response) => {
        const body = response.body;
        expect(body.articles).toBeSorted({ key: "title", descending: true });
      });
  });
  test("correctly sorts the articles by chosen query defaulting to descending order", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=asc")
      .expect(200)
      .then((response) => {
        const body = response.body;
        expect(body.articles).toBeSorted({ key: "title", ascending: true });
      });
  });
  test("400: invalid sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=invalid_id")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("400: invalid order query", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=invalidorder")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("correctly filters the articles by the topic value specified in the query", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;

        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("404: no articles of that topic", () => {
    return request(app)
      .get("/api/articles?topic=unpopulartopic")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("topic not found");
      });
  });
  test("Returns all articles if query omitted", () => {
    return request(app)
      .get("/api/articles?topic=")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;

        expect(articles.length).toBe(13);

        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments for the given article", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;

        expect(comments.length).toBe(2);

        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            article_id: expect.any(Number),
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          });
        });
      });
  });
  test("404: if no comments found", () => {
    return request(app)
      .get("/api/articles/12/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("no comments found");
      });
  });
  test("400: id not a number", () => {
    return request(app)
      .get("/api/articles/notanumber/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("array should be sorted by most recent first", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;

        expect(comments).toBeSorted({ key: "created_at", descending: true });
      });
  });
});
describe("POST /api/articles/:article_id/comments", () => {
  test("should respond with the posted comment", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({ username: "Jimothy", body: "Hello please work" })
      .expect(201)
      .then((response) => {
        const comment = response.body.comment;

        expect(comment.username).toBe("Jimothy");
        expect(comment.body).toBe("Hello please work");
      });
  });
  test("400 missing keys/malformed input", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({
        username: "testman",
      })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("400 incorrect data types", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({ username: 123, body: 456 })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("should respond with the updated article", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: 5 })
      .expect(200)
      .then((response) => {
        const article = response.body.article;

        expect(article.votes).toBe(5);
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          article_img_url: expect.any(String),
        });
      });
  });
  test("works with a negative votes integer", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: -5 })
      .expect(200)
      .then((response) => {
        const article = response.body.article;

        expect(article.votes).toBe(-5);
      });
  });
  test("400 incorrect data type for votes(a string rather than number)", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: "hello" })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("400 missing keys, malformed input", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({})
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});
describe("DELETE /api/comments/:comment_id", () => {
  test("should respond with a 204 and no content", () => {
    return request(app)
      .delete("/api/comments/2")
      .expect(204)
      .then(() => {
        return db.query(`SELECT * FROM comments;`).then((results) => {
          const afterDeleteRows = results.rows;

          afterDeleteRows.forEach((comment) => {
            expect(comment.comment_id).not.toBe("2");
          });
        });
      });
  });
  test("404 no comment with that id", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("comment not found");
      });
  });
  test("400 missing keys, malformed input", () => {
    return request(app)
      .delete("/api/comments/notanumber")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/users", () => {
  test("should respond with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        const users = response.body.users;
        expect(users.length).toBe(4);

        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
