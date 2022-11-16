import mongoose from "mongoose";
export declare const app: import("express-serve-static-core").Router;
export declare type javaSchema = {
    version: string;
    date: Date;
    latest: boolean;
    url: string;
};
export declare const java: mongoose.Model<javaSchema, {}, {}, {}, any>;
export default java;
