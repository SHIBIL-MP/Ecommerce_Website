const nodemailer = require('nodemailer');
require('dotenv').config({ path: __dirname+ '/.env' })

module.exports = {
  mailTransporter: nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sofabuy8565@gmail.com",
      pass: "rqolaxqppwtguwkb"

    },
  }),
  OTP: `${Math.floor(1000 + Math.random() * 9000)}`,
}
