import express from "express";
import { Msg, User } from "../../db/schema.js";
import auth from "../../authentication/auth.js";

const router = express.Router();

// send a message
router.post("/send", auth, async (req, res) => {
  const { senderID, receiverID, content, sendTime } = req.body;
  try {
    const sender = await User.findById(senderID);
    const receiver = await User.findById(receiverID);
    if (!senderID || !receiverID || !content || !sendTime) {
      return res.status(502).json("invalid message");
    } else if (req.user == null) {
      return res.status(401).json("unauthorized");
    } else if (!sender) {
      return res.status(404).json("sender not found");
    } else if (!receiver) {
      return res.status(404).json("receiver not found");
    }
    try {
      await Msg.create({
        content,
        senderID,
        receiverID,
        sendTime,
      });
    } catch {
      (e) => {
        return res.status(502).json(e);
      };
    }

    return res.status(200).json(`message sent to ${receiver._id}`);
  } catch {
    (e) => {
      return res.status(502).json(e);
    };
  }
});

export default router;
