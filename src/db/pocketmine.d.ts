import mongoose from "mongoose";
export declare const app: import("express-serve-static-core").Router;
export declare type pocketminemmpSchema = {
    version: string;
    date: Date;
    latest: boolean;
    url: string;
};
export declare const pocketmine: mongoose.Model<pocketminemmpSchema, {}, {}, {}, any>;
