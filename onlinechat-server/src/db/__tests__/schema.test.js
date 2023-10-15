import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { User, Msg } from "../schema";

let mongod;

// dummy data
const user1 = {
  _id: new mongoose.Types.ObjectId("000000000000000000000001"),
  username: "user1",
  pwd: "pwd1",
};

const user2 = {
  _id: new mongoose.Types.ObjectId("000000000000000000000002"),
  username: "user2",
  pwd: "pwd2",
};

const user3 = {
  _id: new mongoose.Types.ObjectId("000000000000000000000003"),
  pwd: "pwd3",
};

const msg1 = {
  _id: new mongoose.Types.ObjectId("000000000000000000000001"),
  text: "hello",
  sender: "000000000000000000000001",
  receiver: "000000000000000000000002",
  room: 1,
  sendTime: "0000-00-00",
  receiveTime: "0000-00-01",
};

const msg2 = {
  _id: new mongoose.Types.ObjectId("000000000000000000000002"),
  text: "hi",
  sender: "000000000000000000000002",
  receiver: "000000000000000000000001",
  room: 1,
  sendTime: "0000-00-02",
  receiveTime: "0000-00-03",
};

const users = [user1, user2, user3];
const msgs = [msg1, msg2];

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();

  const connectionString = mongod.getUri();
  await mongoose.connect(connectionString, { useNewUrlParser: true });
});

beforeEach(async () => {
  await mongoose.connection.db.dropDatabase();

  const userColl = await User.createCollection();
  await userColl.insertMany(users);

  const msgColl = await Msg.createCollection();
  await msgColl.insertMany(msgs);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

// test user schema
it("get users", async () => {
  const usersFromDb = await User.find();
  expect(usersFromDb).toBeTruthy();
  expect(usersFromDb.length).toBe(3);

  expect(usersFromDb[0].username).toBe("user1");
  expect(usersFromDb[0].pwd).toBe("pwd1");

  expect(usersFromDb[1].username).toBe("user2");
  expect(usersFromDb[1].pwd).toBe("pwd2");

  expect(usersFromDb[2].username).toBeUndefined();
  expect(usersFromDb[2].pwd).toBe("pwd3");
});

it("get a single user", async () => {
  const user = await User.findById("000000000000000000000003");
  expect(user?.username).toBeUndefined();
  expect(user?.pwd).toBe("pwd3");
});

it("add a user correctly with username and pwd", async () => {
  const user = new User({
    username: "user4",
    pwd: "pwd4",
  });

  await user.save();

  const fromDb = await User.findOne({ _id: user._id });
  expect(fromDb).toBeTruthy();
  expect(fromDb.username).toBe("user4");
  expect(fromDb.pwd).toBe("pwd4");
});

it("cannot add a user without username and pwd", async () => {
  const user = new User({});

  return expect(user.save()).rejects.toThrow();
});

// test msg schema
// it("get messages", async () => {
//   const msgsFromDb = await Msg.find();
//   expect(msgsFromDb).toBeTruthy();
//   expect(msgsFromDb.length).toBe(2);
//   expect(msgsFromDb[0].text).toBe("hello");
//   expect(msgsFromDb[1].text).toBe("hi");
// });

// it("get a single messsage", async () => {
//   const msg = await Msg.findById("000000000000000000000001");
//   expect(msg?.text).toBe("hello");
// });

// it("add a message", async () => {
//   const msg = new Msg({
//     text: "nice to see you",
//     sender: "000000000000000000000001",
//     receiver: "000000000000000000000002",
//     room: 1,
//     sendTime: "0000-00-03",
//     receiveTime: "0000-00-04",
//   });

//   await msg.save();

//   const fromDb = await Msg.findOne({ _id: msg._id });
//   expect(fromDb).toBeTruthy();
//   expect(fromDb.text).toBe("nice to see you");
// });
