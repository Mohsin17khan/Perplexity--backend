import express from 'express'
const chatRouter = express.Router();
import { getChats, getMessages, sendMessage, deleteChats } from '../controllers/chat.controller.js'
import { authMiddle } from '../middlewares/auth.middle.js';



chatRouter.post("/message", authMiddle, sendMessage);
chatRouter.get("/getchat", authMiddle, getChats);
chatRouter.get("/getmsg/:chatId", authMiddle, getMessages);
chatRouter.delete("/delete/:chatId",authMiddle, deleteChats)

export default chatRouter