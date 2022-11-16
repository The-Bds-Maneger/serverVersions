import mongoose from "mongoose";
export declare const app: import("express-serve-static-core").Router;
export declare type spigotSchema = {
    version: string;
    date: Date;
    latest: boolean;
    url: string;
};
export declare const spigot: mongoose.Model<spigotSchema, {}, {}, {}, any>;
