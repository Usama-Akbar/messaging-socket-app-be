var express = require('express');
const messageRouter = express.Router();
const messageController = require("../controllers/message");
/* User signing up. */
messageRouter.post("/sendMessage", messageController.sendMessage);
/* User login. */

messageRouter.get("/getMessages", messageController.getMessage);
/* All User Listing. */





module.exports = messageRouter;
