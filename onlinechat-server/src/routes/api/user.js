import express from "express";
import bcrypt from "bcrypt";
import { User } from "../../db/schema.js";
import auth from "../../authentication/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  res.status(200).send("Hello");
});

// register
/**
 * Acknowledgement:
 * the logic is presented by Doctor Andrew Meeds in COMPSCI 732 test
 * in Sememter1 2023
 * at the University of Auckland
 */
router.post("/register", async (req, res) => {
  // Must send username and password
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(422).send("username and password required");
  // Cannot have duplicate usernames
  let user = await User.findOne({ username });
  if (user) return res.status(409).send("username already exists");

  // Create new user
  user = await User.create({
    username,
    pwd: await bcrypt.hash(password, 10),
  });

  // Return success
  return res.status(201).json("registeration success");
});

// login
/**
 * Acknowledgement:
 * the logic is presented by Doctor Andrew Meeds in COMPSCI 732 test
 * in Sememter1 2023
 * at the University of Auckland
 */
router.post("/login", async (req, res) => {
  // Must send username and password
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(422).send("username and password required");

  // User must exist
  let user = await User.findOne({ username });
  if (!user) return res.status(401).json("invalid username");

  // Password must be correct
  const isPasswordOk = await bcrypt.compare(password, user.pwd);
  if (!isPasswordOk) return res.status(401).json("wrong password");

  // Return success
  return res.status(200).json(user._id);
});

// get all users
router.post("/userlist", auth, async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(201).json(users);
  } catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
