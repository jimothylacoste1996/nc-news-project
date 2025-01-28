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
    return request(app)
      .get("/api/incorrectendpoint")
      .expect(404)
      .then((response) => {
        expect(response.body.error).toEqual("Not Found");
      });
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
  test("404 article not found", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then((response) => {
        expect(response.body.error).toBe("Not Found");
      });
  });
  test("400 id not a number", () => {
    return request(app)
      .get("/api/articles/notarticle")
      .expect(400)
      .then((response) => {
        expect(response.body.error).toBe("Bad Request");
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
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
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
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
        });
      });
  });
  test("should reject if no comments found", () => {
    return request(app)
      .get("/api/articles/12/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.error).toBe("Not Found");
      });
  });
  test("400: id not a number", () => {
    return request(app)
      .get("/api/articles/notanumber/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.error).toBe("Bad Request");
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
        expect(response.body.error).toBe("Bad Request");
      });
  });
  test("400 incorrect data types", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({ username: 123, body: 456 })
      .expect(400)
      .then((response) => {
        expect(response.body.error).toBe("Bad Request");
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
        expect(article).toHaveProperty("article_id");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("topic");
        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("body");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("article_img_url");
        expect(article.votes).toBe(5);
      });
  });
  test("works with negative votes", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: -5 })
      .expect(200)
      .then((response) => {
        const article = response.body.article;

        expect(article.votes).toBe(-5);
      });
  });
  test("400 incorrect data type", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: "hello" })
      .expect(400)
      .then((response) => {
        expect(response.body.error).toBe("Bad Request");
      });
  });
  test("400 missing keys, malformed input", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({})
      .expect(400)
      .then((response) => {
        expect(response.body.error).toBe("Bad Request");
      });
  });
});
