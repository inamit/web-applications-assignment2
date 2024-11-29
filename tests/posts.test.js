const request = require("supertest");
const app = require("../server.js");
const mongoose = require("mongoose");

afterAll(async () => {
    mongoose.connection.close();
});

describe("POST /posts", () => {
  it("should create new post", async () => {
    const content = "This is my first post!";
    const sender = "amitinbar";
    const response = await request(app).post("/posts").send({
      content,
      sender,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.content).toBe(content);
    expect(response.body.sender).toBe(sender);
  });
  
  it("should return 500 when content is missing", async () => {
    const sender = "amitinbar";
    const response = await request(app).post("/posts").send({
      sender,
    });

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty("error");
  });

});
