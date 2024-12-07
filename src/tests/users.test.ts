import bcrypt from "bcrypt";
import request from 'supertest';
import initApp from '../server';
import mongoose from 'mongoose';
import { Express } from 'express';
import usersModel, { IUser } from '../models/users_model';

let app: Express; 

beforeAll(async () => {
  app = await initApp();
});
beforeEach(async () => {
  await usersModel.deleteMany();
});

afterAll(async () => {
  mongoose.connection.close();
});

const testUsers = [
    { username: "Benli", email: "first@gmail.com", password: "password" },
    { username: "Amit", email: "second@gmail.com", password: "password" },
];

describe("GET /users", () => {
    describe("when there are no users", () => {
        it("should return an empty array", async () => {
        const response = await request(app).get("/users");

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body).toHaveLength(0);
        });
    });

    describe("when there are users", () => {
        beforeEach(async () => {
            await usersModel.create(testUsers);
        });

        it("should return all users", async () => {
            const response = await request(app).get("/users");

            expect(response.statusCode).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body).toHaveLength(testUsers.length);
        });
    });

    describe("mongo failure", () => {
        it("should return 500 when there is a server error", async () => {
            jest
                .spyOn(usersModel, "find")
                .mockRejectedValue(new Error("Server error"));

            const response = await request(app).get("/users");

            expect(response.statusCode).toBe(500);
            expect(response.body).toHaveProperty("error");
        });
    });
});

describe("POST /users", () => {
    it("should register new user", async () => {
        const username = "Benli";
        const email = "amitinbar@gmail.com";
        const password = "myPassword"
        const response = await request(app).post("/users").send({
            username,
            email,
            password
        });
    
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("_id");
        expect(response.body.username).toBe(username);
        expect(response.body.email).toBe(email);
    });

    it.each([{ username: "No username" }, { email: "No email" }, { password: "No password" }, {}])(
        "should return 400 when parameter is missing (%o)",
        async ({ username, email, password}) => {
            const response = await request(app).post("/posts").send({
                username,
                email,
                password
            });

            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty("error");
        }
    );

    it("should return 400 when username already exists", async () => {
        const username = "Benli";
        const email = "uniqueemail@gmail.com";
        const password = "anotherPassword";

        await request(app).post("/users").send({
            username,
            email: "amitinbar@gmail.com",
            password: "myPassword",
        });
        const response = await request(app).post("/users").send({
            username,
            email,
            password,
        });

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("error", "username already exsits.");
    });

    it("should return 400 for invalid email", async () => {
        const username = "ValidUsername";
        const email = "invalid-email";
        const password = "validPassword";

        const response = await request(app).post("/users").send({
            username,
            email,
            password,
        });

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("error", "email is not valid. Please enter valid email address");
    });
});


describe("GET /users/:user_id", () => {
    let savedUsers: IUser[] = [];
    beforeEach(async () => {
        savedUsers = await usersModel.create(testUsers);
    });

    it("should return 404 when user is not found", async () => {
        const response = await request(app).get("/users/6749f45d349ed9de3a163158");

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty("error");
    });

    it("should return 400 when user_id is invalid", async () => {
        const response = await request(app).get("/users/invalid_id");

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("error");
    });

    it("should return user by id", async () => {
        const user = savedUsers[0];
        const response = await request(app).get(`/users/${user._id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject(JSON.parse(JSON.stringify(user)));
    });
});

describe("PUT /users/:user_id", () => {
    let savedUsers: IUser[] = [];
    beforeEach(async () => {
        savedUsers = await usersModel.create(testUsers);
    });

    it("should return 404 when user is not found", async () => {
        const response = await request(app)
        .put("/users/6749f45d349ed9de3a163155")
        .send({
            username: "Updated user",
            email: "updated@gmail.com",
            password: "updated"
        });

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty("error");
    });

    it("should return 400 when user_id is invalid", async () => {
        const response = await request(app).put("/users/invalid_id")
        .send({
            username: "Updated user",
            email: "updated@gmail.com",
            password: "updated"
        });

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("error");
    });

    it("should update user by id", async () => {
        const post = savedUsers[0];
        const updatedUsername = "Updated username";
        const updatedEmail = "updated@gmail.com";
        const updatedPassword = "password"
        const response: any = await request(app)
        .put(`/posts/${post._id}`)
        .send({ username: updatedUsername, email: updatedEmail, password: updatedPassword });

        const isMatchedpassword = await bcrypt.compare(updatedPassword, response?.password);
        expect(response.statusCode).toBe(200);
        expect(response.body.username).toBe(updatedUsername);
        expect(response.body.email).toBe(updatedEmail);
        expect(isMatchedpassword).toBe(true);
    });
});

describe('POST /users/login', () => {
    let savedUsers = [];
    beforeEach(async () => {
        savedUsers = await usersModel.create(testUsers);
    });
    it('should return a response with a non-empty cookie after user is logged in', async () => {
        const username = "Benli";
        const email = "first@gmail.com";
        const password = "password"
        const response = await request(app).post("/users/login").send({
            username,
            email,
            password
        });
        const cookies: any= response.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(cookies.length).toBeGreaterThan(0);
        const accessTokenCookie = cookies.find((cookie: any) => cookie.startsWith('accessToken='));
        expect(accessTokenCookie).toBeDefined();
        const cookieValue = accessTokenCookie.split('=')[1].split(';')[0];
        expect(cookieValue).toBeTruthy();
    });
    it("should return 400 when wrong credentials", async () => {
        const username = "Benli";
        const email = "first@gmail.com";
        const password = "ppaassword"
        const response = await request(app).post("/users/login").send({
            username,
            email,
            password
        });

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("error");
    });
});

describe('POST /users/logout', () => {
    it('should return a response with a empty cookie after user is logged out', async () => {
        const response = await request(app).post("/users/logout").send({});
        const cookies: any = response.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(cookies.length).toBeGreaterThan(0);
        const accessTokenCookie = cookies.find((cookie: any) => cookie.startsWith('accessToken='));
        expect(accessTokenCookie).toBeDefined();
        const cookieValue = accessTokenCookie.split('=')[1].split(';')[0];
        expect(cookieValue).toBe('')
    });
});