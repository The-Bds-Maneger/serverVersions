import mongoose from "mongoose";
export let authUsername = (!!process.env.MONGO_USER)?process.env.MONGO_USER:"public";
export let authPassword = (!!process.env.MONGO_PASSWORD)?process.env.MONGO_PASSWORD:"n0v8IBKEI920sfy8";

// Connect to MongoDB
export default mongoose.createConnection(`mongodb+srv://${authUsername}:${authPassword}@versionstorage.qgh8v.mongodb.net/versions`, {
  auth: {
    username: authUsername,
    password: authPassword
  }
});