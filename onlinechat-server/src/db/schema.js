import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  pwd: {
    type: String,
    required: true,
  },
});

const msgSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  senderID: {
    type: String,
    required: true,
  },
  receiverID: {
    type: String,
    required: true,
  },
  sendTime: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);
const Msg = mongoose.model("Msg", msgSchema);
export { User, Msg };
