const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const jwtsecret = "THISISAJWTSECRETOfMAERNPROJECT$#";
router.post(
  "/createuser", // username must be an email
  [
    body("email").isEmail(),
    body("name").isLength({ min: 5 }),
    // body("name","Custom Error Message Here").isLength({ min: 5 }),
    // password must be at least 5 chars long
    body("password", "Incorrect Password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    // validation https://express-validator.github.io/docs/
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const salt = await bcrypt.genSalt(10);
    let secPassword = await bcrypt.hash(req.body.password, salt);

    try {
      await User.create({
        //   name: "Shyam Das",
        //   password: "123456",
        //   email: "shyamdas12@gmail.com",
        //   location: "Qwerty edrfef",

        // Header
        // Content-Type: application/json

        name: req.body.name,
        password: secPassword,
        email: req.body.email,
        location: req.body.location,
      });
      res.json({ success: true });
    } catch (error) {
      console.log("ERROR", error);
      res.json({ success: false });
    }
  }
);

// router.post(
//   "/loginuser",
//   [
//     body("email").isEmail(),
//     body("password", "Incooresct Password").isLength({ min: 5 }),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     let email = req.body.email;
//     try {
//       let userdata = await User.findOne({ email });
//       if (!userdata) {
//         return res
//           .status(400)
//           .json({ errors: "Try logging with correct credentials" });
//       }

//       const pwdCompare = await bcrypt.compare(
//         "req.body.password",
//         userdata.password,
//         function (err, result) {
//           if (err) {
//             throw err;
//           }
//           console.log(result);
//         }
//       );

//       if (!pwdCompare) {
//         return res.status(400).json({
//           errors: "Try logging with correct credentials",
//           pwdCompare: pwdCompare,
//         });
//       }

//       const data = {
//         user: {
//           user: {
//             id: userdata.id,
//           },
//         },
//       };
//       const authtoken = jwt.sign(data, jwtsecret); // (Payload, Secret) Header is already present in this
//       return res.json({ success: "true", authtoken: authtoken });
//     } catch (error) {
//       console.log("ERROR", error);
//       res.json({ success: false });
//     }
//   }
// );

router.post(
  "/loginuser",
  [
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email }); //{email:email} === {email}
      if (!user) {
        return res
          .status(400)
          .json({ success, error: "Try Logging in with correct credentials" });
      }

      const pwdCompare = await bcrypt.compare(password, user.password); // this return true false.
      if (!pwdCompare) {
        return res
          .status(400)
          .json({ success, error: "Try Logging in with correct credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      success = true;
      const authtoken = jwt.sign(data, jwtsecret);
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.send("Server Error");
    }
  }
);

module.exports = router;
