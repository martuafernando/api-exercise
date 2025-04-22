const { Product } = require("../models");
const ProductController = require("../controllers/ProductController");

jest.mock("../models", () => ({
  Product: {
    findAll: jest.fn(),
    create: jest.fn(),
  },
}));

describe("ProductController", () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe("getAllProducts", () => {
    it("should return all products", async () => {
      const mockProducts = [
        { id: 1, name: "A", price: 10 },
        { id: 2, name: "B", price: 20 },
      ];
      Product.findAll.mockResolvedValue(mockProducts);

      await ProductController.getAllProducts(req, res, next);

      expect(Product.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        message: "success",
        data: mockProducts,
      });
    });
  });

  describe("add", () => {
    it("should return 400 if name or price is missing", async () => {
      req.body = { name: "", price: undefined };

      await ProductController.add(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "name and price required",
      });
    });

    it("should create product and return 201", async () => {
      req.body = { name: "New Product", price: 99 };
      Product.create.mockResolvedValue({});

      await ProductController.add(req, res, next);

      expect(Product.create).toHaveBeenCalledWith({
        name: "New Product",
        price: 99,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "product added successfully",
      });
    });
  });
});
