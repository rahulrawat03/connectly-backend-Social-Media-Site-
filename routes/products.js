const router = require("express").Router();
const Product = require("../models/Product");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.get("/usual", async (req, res) => {
  try {
    const product = await Product.find({ isBook: false }).sort({
      createdAt: -1,
    });
    return res.send(product);
  } catch (ex) {
    return res.status(500).send("Server error");
  }
});

router.get("/books", async (req, res) => {
  try {
    const product = await Product.find({ isBook: true }).sort({
      createdAt: -1,
    });
    return res.send(product);
  } catch (ex) {
    return res.status(500).send("Server error");
  }
});

router.post("/", upload.single("img"), async (req, res) => {
  try {
    const product = {
      userId: req.body.userId,
      name: req.body.name,
      units: req.body.units,
      price: req.body.price,
      img: req.file.filename,
      desc: req.body.desc,
      isBook: req.body.isBook,
    };

    const newProduct = new Product(product);
    await newProduct.save();

    return res.send(newProduct);
  } catch (ex) {
    console.log(ex);
    return res.status(500).send("Server error");
  }
});

router.get("/search/:type/:query", async (req, res) => {
  try {
    const expression = new RegExp(req.params.query, "i");
    let products;

    if (req.params.type === "book")
      products = await Product.find({ name: expression, isBook: true });
    else products = await Product.find({ name: expression, isBook: false });

    return res.send(products);
  } catch (ex) {
    console.log(ex);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
