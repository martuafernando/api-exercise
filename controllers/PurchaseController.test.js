const { Product, Purchase } = require("../models");
const PurchaseController = require("../controllers/PurchaseController");

jest.mock("../models", () => ({
  Product: {
    findByPk: jest.fn(),
  },
  Purchase: {
    create: jest.fn(),
  },
}));

describe("PurchaseController", () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {},
      user: { id: 123 }, // Simulate logged-in user
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe("purchaseProduct", () => {
    it("should throw 400 if productId is missing", async () => {
      req.body = {}; // No productId

      PurchaseController.purchaseProduct(req, res, next).catch((err) => {
        expect(err).toEqual({
          statusCode: 400,
          message: "productId required",
        });
      })
    });

    it("should throw 404 if product not found", async () => {
      req.body = { productId: 999 };
      Product.findByPk.mockResolvedValue(null);

      PurchaseController.purchaseProduct(req, res, next).catch((error) => {
        expect(Product.findByPk).toHaveBeenCalledWith(999);
        expect(error).toEqual({
          statusCode: 404,
          message: "productId not found",
        });
      })

    });

    it("should create purchase and return success", async () => {
      req.body = { productId: 1 };
      Product.findByPk.mockResolvedValue({ id: 1 });
      Purchase.create.mockResolvedValue({});

      await PurchaseController.purchaseProduct(req, res, next);

      expect(Product.findByPk).toHaveBeenCalledWith(1);
      expect(Purchase.create).toHaveBeenCalledWith({
        productId: 1,
        userId: 123,
      });
      expect(res.json).toHaveBeenCalledWith({
        message: "Purchasing successful",
      });
    });
  });
});
