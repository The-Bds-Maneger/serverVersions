import mongoose from "mongoose";
export declare const app: import("express-serve-static-core").Router;
export declare type paperSchema = {
    version: string;
    build: number;
    date: Date;
    latest: boolean;
    url: string;
};
export declare const paper: mongoose.Model<paperSchema, {}, {}, {}, any>;
