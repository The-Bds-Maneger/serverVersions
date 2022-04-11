import mongoose from "mongoose";
export const auth = {username: "public", password: "n0v8IBKEI920sfy8"};
if (!!process.env.MONGO_USER && !!process.env.MONGO_PASSWORD) {auth.username = process.env.MONGO_USER; auth.password = process.env.MONGO_PASSWORD;}
export const connection = mongoose.createConnection("mongodb+srv://versionstorage.qgh8v.mongodb.net/versions", {
  auth: {
    username: auth.username,
    password: auth.password
  }
});