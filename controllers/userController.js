const bcrypt = require("bcrypt");
const User = require("../models/user");
const mongoose = require("mongoose");
const Product = require("../models/product");
const Cart = require("../models/cart");
require('sweetalert')
// const randomstring = require("randomstring");
const Category = require("../models/category");
const mailer = require("../middlewares/otp");
const session = require("express-session");


module.exports = {
  getSignup: (req, res) => {
    res.render('user/signup')
  },
  // postSignup: async (req, res) => {
  //   const { username, email, mobile, password } = req.body;
  //   const hash = await bcrypt.hash(password, 12);
  //   const user = new User({
  //     username,
  //     email,
  //     mobile,
  //     password: hash
  //   })
  //   await user.save();
  //   req.session.user = user._id;
  //   console.log(req.body);
  //   res.redirect('/index');
  // },
  postSignup: async (req, res) => {
    userDetails = req.body;
    let categories = await Category.find({});
    let mailDetails = {
      from: "sofabuy8565@gmail.com",
      to: userDetails.email,
      subject: "SOFABUY ACCOUNT REGISTRATION",
      html: `<p>YOUR OTP FOR REGISTERING IN SOFABUY IS ${mailer.OTP}</p>`,
    };

    User.findOne({
      $or: [{ email: userDetails.email }, { mobile: userDetails.mobile }],
    }).then((result) => {
      console.log(result);
      if (result) {
        var count = 0;
        res.render("user/signup", {
          user: "",
          count,
          categories,
          err_message: "Email or Mobile already exists",
        });
      } else {
        mailer.mailTransporter.sendMail(mailDetails, function (err, data) {
          if (err) {
            console.log("error occurred", err);
          } else {
            console.log("Email Sent Successfully");
            res.render("user/otp", { userDetails });
            console.log(data);
          }
        });
      }
    });
  },

  getLogin: (req, res) => {
    if (!req.session.user) {
      const loginErr = req.session.loginErr;
      req.session.loginErr = "";
      res.render("user/login", { loginErr });
    } else {
      res.redirect("/index");
    }
  },
  postLogin: async (req, res) => {
    const { name, password } = req.body;
    if (!name || !password) {
      req.session.loginErr = "Please fill all the fields";
      res.redirect('/login')
      return;
    }
    const user = await User.findOne({ username: name });
    console.log(user)
    if (!user) {
      req.session.loginErr = "Invalid Credentials";
      res.redirect('/login')
      return;
    }
    const validPassword = await bcrypt.compare(password, user.password)
    if (validPassword) {
      req.session.user = user._id;
      res.redirect('/index')
    } else {
      req.session.loginErr = "Invalid Credentials";
      res.redirect('/login')
    }
    // res.redirect('/index') 
  },
  // postLogout:(req,res)=>{
  //   req.session.destroy();
  //   res.redirect('/login')
  // },

  postOtp: async (req, res) => {
    let categories = await Category.find({});
    let userDetails = req.body;
    let otp = userDetails.otp;
    console.log(otp);
    console.log(mailer.OTP);
    if (mailer.OTP == otp) {
      console.log("matched");
      const hash = await bcrypt.hash(userDetails.password, 10);
      const user = new User({
        username: userDetails.username,
        email: userDetails.email,
        mobile: userDetails.mobile,
        password: hash,
      });
      console.log(user);
      user.save().then(() => {
        req.session.user = user._id;
        res.redirect("/index");
      });
    } else {
      res.render("user/otp", {
        userDetails,
        categories,
        err_message:
          "The number that you've entered doesn't match your code. Please try again.",
      });
      console.log("error");
    }
  },






  getLanding: async (req, res) => {

    //   if (!req.session.user) {
    //     res.redirect('/login')
    //     return;
    //   }
    //   res.render('user/index')
    // },
    let user = req.session.user;
    console.log("user is")
    console.log(user)
    let userId = req.session.user;
    let categories = await Category.find({});
    // let coupon = await Coupon.find({});
    var count = 0;

    if (req.session.user) {
      var count = 0;
      var userr = await User.findOne({ _id: userId });
      const blocked = userr.isBlocked;
      if (blocked === true) {
        req.session.destroy();
        res.redirect("/login");
      } else {
        let cart = await Cart.findOne({ userId });
        if (cart) {
          var count = await Cart.aggregate([
            { $match: { userId: mongoose.Types.ObjectId(userId) } },
            { $project: { products: { $size: "$products" } } },
          ]);
          count = count[0].products;
        } else {
          count = 0;
        }
        const allProducts = await Product.find({})
          .limit(8)
          .populate("category");

        console.log(allProducts)
        res.render("user/index", {
          user,
          allProducts,
          count,
          categories
          // coupon,
        });
      }
    } else {
      const allProducts = await Product.find({}).limit(8).populate("category");
      console.log("here is your produlcts")
      console.log(allProducts)
      res.render("user/index", {
        user,
        allProducts,
        count,
        categories
        // coupon,
      });
    }
  },

//   detailPage: async (req, res) => {
//     res.render("user/detailPage")
//   }
// }
//     try {
//       let categories = await Category.find({});
//       let user = req.session.user;
//       const id = req.params.id;
//       const product = await Product.findById(id).populate("category");
//       let userId = req.session.user;
//       var count = 0;
//       if (req.session.user) {
//         var count = 0;
//         let cart = await Cart.findOne({ userId });
//         if (cart) {
//           var count = await Cart.aggregate([
//             { $match: { userId: mongoose.Types.ObjectId(userId) } },
//             { $project: { products: { $size: "$products" } } },
//           ]);
//           count = count[0].products;
//         } else {
//           count = 0;
//         }
//       }
//       res.render("user/detailPage", { user, product, count, categories });
//     } catch (err) {
//       console.error(err);
//       res.status(404).render("user/404Error");
//     }
//   }

// }
    // getLanding:(req, res)=>{
    //   res.render('user/index')

    // },
    // detailPage:(req, res)=>{
    //   res.render('user/detailPage')

    // }

    detailPage: async (req, res) => {
      try {
        let categories = await Category.find({});
        let user = req.session.user;
        const id = req.params.id;
        const product = await Product.findById(id).populate("category");
        let userId = req.session.user;
        var count = 0;
        if (req.session.user) {
          var count = 0;
          let cart = await Cart.findOne({ userId });
          if (cart) {
            var count = await Cart.aggregate([
              { $match: { userId: mongoose.Types.ObjectId(userId) } },
              { $project: { products: { $size: "$products" } } },
            ]);
            count = count[0].products;
          } else {
            count = 0;
          }
        }
        res.render("user/detailPage", { user, product, count, categories });
      } catch (err) {
        console.error(err);
        res.status(404).render("user/404Error");
      }
    },

    getCart: async (req, res) => {
      let user;
      const userId = req.session.user;
      // console.log(userId);
      const productId = req.params.id;
      // console.log(productId); 
  
      let proObj = {
        productId: productId,
        quantity: 1,
      };
      let userCart = await Cart.findOne({ userId });
      if (userCart) {
        let proExists = userCart.products.findIndex(
          (product) => product.productId == productId
        );
        console.log("cart" + proExists); 
        if (proExists != -1) {
          res.json({ existingProduct: true });
        } else {
          await Cart.updateOne(
            { userId: userId },
            { $push: { products: proObj } }
          )
            .then(() => {
              res.json({ status: true });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      } else {
        const cart = new Cart({
          userId: userId,
          products: [proObj],
        });
        await cart
          .save()
          .then(() => {
            console.log(cart);
            res.json({ status: true });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    getCartProducts: async (req, res) => {
      let user = req.session.user;
      var count = 0;
      let categories = await Category.find({});
      const userId = req.session.user;
      let cart = await Cart.findOne({ userId });
      if (cart) {
        var count = await Cart.aggregate([
          { $match: { userId: mongoose.Types.ObjectId(userId) } },
          { $project: { products: { $size: "$products" } } },
        ]);
        count = count[0].products;
        if (count == 0) {
          res.render("user/cartEmpty", { user, count, categories });
        } else {
          let cartItems = await Cart.aggregate([
            {
              $match: { userId: mongoose.Types.ObjectId(userId) },
            },
  
            {
              $unwind: "$products",
            },
  
            {
              $project: {
                userId: "$userId",
                productId: "$products.productId",
                quantity: "$products.quantity",
              },
            },
  
            {
              $lookup: {
                from: "products",
                localField: "productId",
                foreignField: "_id",
                as: "product",
              },
            },
  
            {
              $unwind: "$product",
            },
  
            // {
            //   $lookup: {
            //     from: "products",
            //     let: { prodList: "$products.productId" },
            //     pipeline: [
            //       {
            //         $match: {
            //           $expr: {
            //             $in: ["$_id", "$$prodList"],
            //           },
            //         },
            //       },
            //     ],
            //     as: "cartItems",
            //   },
            // },
          ]);
  
          total = await Cart.aggregate([
            {
              $match: { userId: mongoose.Types.ObjectId(userId) },
            },
  
            {
              $unwind: "$products",
            },
  
            {
              $project: {
                productId: "$products.productId",
                quantity: "$products.quantity",
              },
            },
  
            {
              $lookup: {
                from: "products",
                localField: "productId",
                foreignField: "_id",
                as: "product",
              },
            },
  
            {
              $unwind: "$product",
            },
  
            {
              $group: {
                _id: null,
                total: { $sum: { $multiply: ["$quantity", "$product.price"] } },
              },
            },
          ]);
  
          console.log(cartItems);
          const cartProducts = cartItems;
          console.log(total[0].total);
          const totalSum = total[0].total;
          res.render("user/cart", {
            user,
            cartProducts,
            totalSum,
            count,
            categories,
          });
        }
      } else {
        console.log(count);
        res.render("user/cartEmpty", { user, count, categories });
      }
    },

    changeProductQuantity: async (req, res) => {
      const details = req.body;
      details.count = parseInt(details.count);
      details.quantity = parseInt(details.quantity);
      if (details.count == -1 && details.quantity == 1) {
        const cart = await Cart.updateOne(
          { _id: details.cartId },
          {
            $pull: { products: { productId: details.productId } },
          }
        ).then(() => {
          res.json({ removeProduct: true });
        });
      } else {
        await Cart.updateOne(
          { _id: details.cartId, "products.productId": details.productId },
          {
            $inc: { "products.$.quantity": details.count },
          }
        ).then(async () => {
          var total = await Cart.aggregate([
            {
              $match: { userId: mongoose.Types.ObjectId(details.userId) },
            },
  
            {
              $unwind: "$products",
            },
  
            {
              $project: {
                productId: "$products.productId",
                quantity: "$products.quantity",
              },
            },
  
            {
              $lookup: {
                from: "products",
                localField: "productId",
                foreignField: "_id",
                as: "product",
              },
            },
  
            {
              $unwind: "$product",
            },
  
            {
              $group: {
                _id: null,
                total: { $sum: { $multiply: ["$quantity", "$product.price"] } },
              },
            },
          ]);
          res.json({ status: true, total });
        });
      }
    },

    productRemove: async (req, res) => {
      const details = req.body;
      details.count = parseInt(details.count);
      const cart = await Cart.updateOne(
        { _id: details.cartId },
        {
          $pull: { products: { productId: details.productId } },
        }
      ).then(() => {
        res.json({ removeProduct: true });
      });
    },


    addToCart:(req, res)=>{
      const productId = req.params.id;
      const userId = req.body;
      console.log(productId)
      console.log(userId)
      // if( !userId ){
            
      // }
    

    }

    
}

  