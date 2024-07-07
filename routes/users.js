var express = require('express');
const userRouter = express.Router();
const userController = require("../controllers/users");
const {verifyAccessToken} = require("../middlewares/auth");
/* User signing up. */
userRouter.post("/sign-up", userController.signUp);
/* User login. */

userRouter.post("/login", userController.login);
/* All User Listing. */

userRouter.get("/list", verifyAccessToken, userController.list);
/* Specific User Listing. */

userRouter.get("/:id", verifyAccessToken, userController.specificUser);
/* Update User . */

userRouter.patch("/:id", verifyAccessToken, userController.updateUser);

/* Delete User . */

userRouter.delete("/:id", verifyAccessToken, userController.deleteUser);







module.exports = userRouter;
