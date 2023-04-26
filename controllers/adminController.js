const bcrypt = require("bcrypt");
const User = require("../models/user");
const Admin = require("../models/admin")
const Category = require("../models/category")
const Order = require("../models/order");
const mongoose = require("mongoose");
const Product = require("../models/product");

module.exports = {
  getAdminLanding: (req, res) => {
    res.render("admin/adminDashboard");
  },

  getAdminLogin: (req, res) => {
    if (!req.session.admin) {
      const loginErr = req.session.loginErr;
      req.session.loginErr = "";
      res.render("admin/adminLogin", { loginErr });
    } else {
      res.redirect("/admin/adminDashboard");
    }
  },

  postAdminLogin: async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    // const admin = await Admin.findOne({ email });
    const myadminEmail = 'admin@gmail.com'
    const myadminPassword = 'admin@123'
    if (email == myadminEmail && password == myadminPassword) {
      req.session.admin = myadminEmail;
      res.redirect("/admin/adminDashboard");
    } else {
      req.session.loginErr = "Invalid Credentials";
      res.redirect("/admin/adminLogin");
    }

  },
  // if (admin) { 
  //   if (email ==  myadminEmail  && password == myadminPassword) {
  //     req.session.admin = admin._id;
  //     res.redirect("/admin/adminDashboard");
  //   } else {
  //     req.session.loginErr = "Invalid Credentials";
  //     res.redirect("/admin/login");
  //   }
  // } else {
  //   req.session.loginErr = "Invalid Credentials";
  //   res.redirect("/admin/login");
  // }

  userDetails: async (req, res) => {
    const allUsers = await User.find({});
    res.render("admin/userDetails", { allUsers });
  },

  blockUser: async (req, res) => {
    const id = req.params.id;
    await User.findByIdAndUpdate(id, { isBlocked: true });
    res.redirect("/admin/userDetails");
  },


  unblockUser: async (req, res) => {
    const id = req.params.id;
    await User.findByIdAndUpdate(id, { isBlocked: false });
    res.redirect("/admin/userDetails");
  },

  productDetails: async (req, res) => {
    const allProducts = await Product.find({}).populate("category");
    // console.log(allProducts);
    res.render("admin/productDetails", { allProducts });
  },

  getAddProduct: async (req, res) => {

    // res.render("admin/addProducts")
    const productError = req.session.productErr;
    req.session.productErr = "";
    const categories = await Category.find({});
    res.render("admin/addProducts", { categories, productError });
  },
  // postAddProduct: (req, res) => {

  //   // gets form data
  //   const { name,price,description,image } = req.body;

  //   // pushes form data to database as a document
  //   Product.create(
  //     {
  //       name: name , image: image ,price: price, description: description
  //     })
  //     res.redirect('/admin/productDetails')
  // },

  postAddProduct: async (req, res) => {
    console.log("adding product")
    console.log(req.body)
    console.log(req.files)
    // console.log(req.body);
    // res.send("It worked")
    // res.redirect("/admin/productDetails")
    const name = req.body.name;
    // console.log(req.body.name);


    const existingProduct = await Product.findOne({ name: name });
    console.log(existingProduct);
    if (existingProduct) {
      req.session.productErr = "Product already exists";
      res.redirect("/admin/addProducts");
    } else {
      const category = await Category.findById(req.body.category);
      console.log(req.body.category);
      // console.log(category);
      console.log("here is form data")

      console.log(req.body);
      console.log("here is files")
      console.log(req.files)
      // res.send("multer worked");
      const newProduct = new Product({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        stock: req.body.stock,
        category
      });
      newProduct.images = req.files.map((obj) => ({
        url: obj.path,
        filename: obj.filename,
      }));
      await newProduct.save();
      console.log(newProduct);
      res.redirect("/admin/products");
    }
  },

  getEditProduct: async (req, res) => {
    try {
      const id = req.params.id;
      const product = await Product.findById(
        mongoose.Types.ObjectId(id)
      ).populate("category");
      console.log(product)
      const categories = await Category.find({});
      console.log(categories)
      res.render("admin/editProducts", { product, categories });
    } catch (err) {
      console.error(err);
      res.status(404).render("admin/404Error");
    }
  },

  updateProduct: async (req, res) => {
    console.log("the recieved data is ")
    const id = req.body.id

    // const category = await Category.findById(req.body.category);

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        // stock: req.body.stock,
        // category: category,
      },
      { new: true }
    );
    // const images = req.files.map((f) => ({
    //   url: f.path,
    //   filename: f.filename,
    // }));
    // updatedProduct.images.push(...images);
    // const deleteFilenames = req.body.deleteImages;
    // if (deleteFilenames) {
    //   updatedProduct.images = updatedProduct.images.filter(
    //     (image) => !deleteFilenames.includes(image.filename)
    //   );
    // }


    // await updatedProduct.save();

    // console.log(updatedProduct);
    res.redirect("/admin/products");
  },

  isActive: async (req, res) => {
    const id = req.params.id;
    await Product.findByIdAndUpdate(id, { isActive: false });
    res.redirect("/admin/products");
  },

  isInactive: async (req, res) => {
    const id = req.params.id;
    await Product.findByIdAndUpdate(id, { isActive: true });
    res.redirect("/admin/products");
  },

  getCategories: async (req, res) => {
    const categories = await Category.find({});
    res.render("admin/categories", { categories });
  },

  getAddCategory: (req, res) => {
    const categoryError = req.session.categoryErr;
    req.session.categoryErr = "";
    res.render("admin/addCategory", { categoryError });
  },
  postAddCategory: async (req, res) => {
    const name = req.body;
    const existingCategory = await Category.findOne(name);
    if (existingCategory) {
      req.session.categoryErr = "Category already exists";
      res.redirect("/admin/addCategory");
    } else {

      const newCategory = new Category(req.body);
      await newCategory.save();

      res.redirect("/admin/categories");
    }
  },

  getEditCategory: async (req, res) => {
    try {
      const id = req.params.id;
      const category = await Category.findById(id);
      res.render("admin/editCategory", { category });
    } catch (err) {
      console.error(err);
      res.status(404).render("admin/404Error");
    }
  },

  updateCategory: async (req, res) => {
    const id = req.params.id;
    await Category.findByIdAndUpdate(id, req.body, {
      new: true,


    });
    res.redirect("/admin/categories");
  },


  isActiveCategory: async (req, res) => {
    const id = req.params.id;
    await Category.findByIdAndUpdate(id, { isActive: false });
    res.redirect("/admin/categories");
  },

  isInactiveCategory: async (req, res) => {
    const id = req.params.id;
    await Category.findByIdAndUpdate(id, { isActive: true });
    res.redirect("/admin/categories");
  },

  getOrders: async (req, res) => {
    const orders = await Order.find({});
    res.render("admin/orders", { orders });
  },

  getEditOrder: async (req, res) => {
    try {
      var orderId = req.params.id;
      const order = await Order.findOne({
        _id: mongoose.Types.ObjectId(orderId),
      });
      console.log(order);
      res.render("admin/editOrder", { order });
    } catch (err) {
      console.error(err);
      res.status(404).render("admin/404Error");
    }
  },

  updateOrder: async (req, res) => {
    var orderId = req.params.id;
    await Order.findByIdAndUpdate(
      orderId,
      {
        payment_status: req.body.payment_status,
        order_status: req.body.order_status,
      },
      { new: true, runValidators: true }
    );
    res.redirect("/admin/orders");
  },

  getAdminLogout: (req, res) => {
    req.session.destroy();
    res.redirect("/admin/adminLogin");
  }





}