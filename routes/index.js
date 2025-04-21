const ProductController = require("../controllers/ProductController");
const PurchaseController = require("../controllers/PurchaseController");
const UserController = require("../controllers/UserController");
const authentication = require("../middleware/authentication");
const authorization = require("../middleware/authorization");

const routes = require("express").Router();

routes.post("/register", UserController.register);
routes.post("/login", UserController.login);
routes.post("/purchase", authentication, PurchaseController.purchaseProduct);
routes.get("/products", ProductController.getAllProducts);

routes.get("/users", authentication, authorization, UserController.getAll);
routes.post("/products", authentication, authorization, ProductController.add);

module.exports = routes;
