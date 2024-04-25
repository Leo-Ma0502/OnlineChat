import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { User } from "../schema";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("User Schema", () => {
  it("should create a new user successfully", async () => {
    const userData = { username: "testuser", pwd: "password123" };
    const user = new User(userData);
    await user.save();

    const foundUser = await User.findOne({ username: "testuser" });
    expect(foundUser).toBeDefined();
    expect(foundUser.username).toBe(userData.username);
  });

  it("should fail if username is missing", async () => {
    const userWithNoUsername = new User({ pwd: "password123" });
    await expect(userWithNoUsername.save()).rejects.toThrow(
      mongoose.Error.ValidationError
    );
  });
});
