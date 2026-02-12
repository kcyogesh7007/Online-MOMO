const Product = require("../../model/productModel");

exports.createProduct = async (req, res) => {
  const {
    productName,
    productStatus,
    productDescription,
    productStockQty,
    productPrice,
  } = req.body;
  if (
    !productDescription ||
    !productName ||
    !productStatus ||
    !productStockQty ||
    !productPrice
  ) {
    return res.status(400).json({
      message:
        "Please provide productDescription, productName, productStatus, productStockQty and productPrice",
    });
  }
  const product = await Product.create({
    productName,
    productDescription,
    productStatus,
    productStockQty,
    productPrice,
  });
  res.status(201).json({
    message: "Product created successfully",
    data: product,
  });
};
