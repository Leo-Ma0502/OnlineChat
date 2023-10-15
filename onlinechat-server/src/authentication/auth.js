import { User } from "../db/schema.js";

export default async function verifyUser(req, res, next) {
  let token = req.headers["token"];
  if (!token) {
    return res.send(401);
  }
  try {
    const user = await User.findById(token);
    if (!user) return res.status(401).json("user not exist");
    req.user = user;
    return next();
  } catch (err) {
    return res.send(401).json(err);
  }
}
