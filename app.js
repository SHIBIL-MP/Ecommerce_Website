const express = require("express");
const app = express();
const userRouter = require("./routes/userRoutes");
const bcrypt = require('bcrypt');
const session = require("express-session");
const adminRouter = require("./routes/adminRoutes");
require("dotenv").config();


const User = require('./models/user');
const Admin = require('./models/admin')



// const path = require("path");
const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const cookieParser = require("cookie-parser");


mongoose.connect('mongodb://127.0.0.1:27017/shopingCart', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log('Mongo connection started')
})
.catch(err=>{
    console.log('Mongo connection error')
    console.log(err)
})
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("views");
app.set("view engine", "ejs");



 app.use(express.static("public"));
// app.use(cookieParser());
app.use(
      session({
            secret: "key",
            saveUninitialized: false,
            cookie: { maxAge: 1000 * 60 * 60 * 24 },
            resave: false,
          })
        );
        // app.use((req, res, next) => {
//   res.set(
    //     "Cache-Control",
//     "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
//   );
//   next();
// });

app.use("/", userRouter);
app.use("/admin", adminRouter);

const port = 6500; // use a different port number

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
   



