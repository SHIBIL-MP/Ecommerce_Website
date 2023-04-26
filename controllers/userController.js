const bcrypt = require("bcrypt");
const User = require("../models/user");
const mongoose = require("mongoose");
const Product = require("../models/product");
const Cart = require("../models/cart");

// const randomstring = require("randomstring");
const Category = require("../models/category");
const mailer = require("../middlewares/otp")


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
    const user = await User.findOne({ username:name });
    console.log(user)
    if(!user){
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
  
  
  
 


  getLanding: async(req, res) => {
  //   if (!req.session.user) {
  //     res.redirect('/login')
  //     return;
  //   }
  //   res.render('user/index')
  // },
  let user = req.session.user;
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
    res.render("user/index", {
      user,
      allProducts,
      count,
      categories
      // coupon,
    });
  }
},

  detailPage: async (req, res) => {
    res.render("user/detailPage")
  }
}
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
    // getdetailPage:(req, res)=>{
    //   res.render('user/detailPage')

    // }

    // getLogin:(req,res)=>{
    //   res.send('sdfghjkl')
    // }
