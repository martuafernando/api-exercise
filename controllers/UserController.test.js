const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const UserController = require("../controllers/UserController");

jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../models", () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
  },
}));

describe("UserController (unit)", () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe("register", () => {
    it("should throw 400 if required fields are missing", async () => {
      req.body = { email: "test@test.com", password: "pass123" }; // name and role missing

      await UserController.register(req, res, next).catch((error) => {
        expect(error).toEqual({
          statusCode: 400,
          message: "Name, email, password, and role required",
        });
      })

    });

    it("should throw 400 if email already registered", async () => {
      req.body = { name: "User", email: "test@test.com", password: "pass", role: "user" };
      User.findOne.mockResolvedValue({ id: 1 });

      await UserController.register(req, res, next).catch((error) => {
        expect(User.findOne).toHaveBeenCalledWith({ where: { email: "test@test.com" } });
        expect(error).toEqual({
          statusCode: 400,
          message: "email has been registered",
        });
      })

    });

    it("should register new user successfully", async () => {
      req.body = { name: "New", email: "new@test.com", password: "123", role: "admin" };
      User.findOne.mockResolvedValue(null);
      bcrypt.genSalt.mockResolvedValue("salt");
      bcrypt.hash.mockResolvedValue("hashed123");
      User.create.mockResolvedValue({});

      await UserController.register(req, res, next);

      expect(User.create).toHaveBeenCalledWith({
        name: "New",
        email: "new@test.com",
        password: "hashed123",
        role: "admin",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "account created successfully",
      });
    });
  });

  describe("login", () => {
    it("should throw 400 if email or password is missing", async () => {
      req.body = { email: "" };

      await UserController.login(req, res, next).catch((error) => {
        expect(error).toEqual({
          statusCode: 400,
          message: "email and password required",
        });
      })

    });

    it("should throw 400 if user not found", async () => {
      req.body = { email: "none@test.com", password: "pass" };
      User.findOne.mockResolvedValue(null);

      await UserController.login(req, res, next).catch((error) => {
        expect(error).toEqual({
          statusCode: 400,
          message: "incorrect email or password",
        });
      })

    });

    it("should throw 400 if password is incorrect", async () => {
      req.body = { email: "test@test.com", password: "wrongpass" };
      User.findOne.mockResolvedValue({ id: 1, password: "hashed" });
      bcrypt.compare.mockResolvedValue(false);

      await UserController.login(req, res, next).catch((error) => {
        expect(error).toEqual({
          statusCode: 400,
          message: "incorrect email or password",
        });
      })

    });

    it("should return token if login is successful", async () => {
      req.body = { email: "user@test.com", password: "123" };
      const fakeUser = { id: 2, password: "hashedpw", role: "user" };
      User.findOne.mockResolvedValue(fakeUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("fake.jwt.token");

      await UserController.login(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        message: "success",
        data: {
          token: "fake.jwt.token",
        },
      });
    });
  });

  describe("getAll", () => {
    it("should return all users", async () => {
      const users = [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }];
      User.findAll.mockResolvedValue(users);

      await UserController.getAll(req, res, next);

      expect(User.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        message: "Success",
        data: users,
      });
    });
  });
});
