const nodemailer = require('nodemailer');
require('dotenv').config()

module.exports={
     mailTransporter:nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: 'shibilmp8565@gmail.com',
          pass: 'USind123#'
        },
      }),
     OTP : `${Math.floor(1000 + Math.random() * 9000)}`,
}
