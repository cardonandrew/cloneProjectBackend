const express = require("express");
const router = express.Router();

const {
  getUserByUsername,
  createUser,
  getUserById,
  getUser,
  // updateUser,
} = require("../db/users");

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const { requireUser } = require("./utils");

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply a valid username and password",
    });
  }
  try {
    const user = await getUser({ username, password });

    if (user) {
      const token = jwt.sign(
        {
          id: user.id,
          username: username,
        },
        JWT_SECRET
      );

      delete user.password;
      user.token = token;
      req.user = user;
      const response = {
        user: user,
        message: "you're logged in!",
        token: token,
      };
      res.send(response);
    } else {
      res.status(401);
      res.send({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
  res.end();
});

router.post("/register", async (req, res, next) => {
  const { username, password, email, isVerified, profileImage } = req.body;

  if (password.length < 8) {
    res.status(403);
    res.send({
      error: "Error",
      name: "Password length error",
      message: "Password Too Short!",
    });
  }

  try {
    const _user = await getUserByUsername(username);

    if (_user && _user.username === username) {
      res.status(403);
      res.send({
        error: "Error",
        name: "Username error",
        message: `User ${username} is already taken.`,
        token: token,
      });
    }

    const fields = {
      username: username,
      password: password,
      email: email,
      isVerified: isVerified,
      profileImage: profileImage,
    };
    const user = await createUser(fields);
    console.log("user after fields", user);
    const token = jwt.sign(
      {
        id: user.id,
        username: username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2w",
      }
    );
    const response = {
      user: user,
      message: "you're signed up!",
      token: token,
    };

    res.send(response);
  } catch (error) {
    console.error;
    console.log("Error in router.post /registration");
    next();
  }
});

// router.patch("/:userId", async (req, res, next) => {
//   const {

//   } = req.body;
//   const updateData = {};

//   if (iscustomer === true) {
//     updateData.iscustomer = true;
//   } else {
//     updateData.iscustomer = false;
//   }
//   if (firstname) {
//     updateData.firstname = firstname;
//   }
//   if (lastname) {
//     updateData.lastname = lastname;
//   try {
//     const updatedUser = await updateUser(req.params.userId, updateData);

//     if (!updatedUser) {
//       res.send({
//         name: "Error",
//         error: "Could not update the user",
//         message: `User ${updateData.id} not found`,
//       });
//     } else if (updatedUser.error) {
//       res.send({
//         name: "Error",
//         error: updatedUser.error,
//         message: `An user with name ${req.body.first_name} already exists`,
//       });
//     } else {
//       res.send(updatedUser);
//     }
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = router;
