const { createProduct } = require("../controller/admin/productController");
const isAuthenticated = require("../middleware/isAuthenticated");
const isRestrictTo = require("../middleware/isRestrictTo");

const router = require("express").Router();

router
  .route("/products")
  .post(isAuthenticated, isRestrictTo("admin"), createProduct);

module.exports = router;
