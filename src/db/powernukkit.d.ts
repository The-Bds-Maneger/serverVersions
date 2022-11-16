import mongoose from "mongoose";
export declare const app: import("express-serve-static-core").Router;
export declare type powernukkitSchema = {
    version: string;
    mcpeVersion: string;
    date: Date;
    latest: boolean;
    url: string;
    variantType: "stable" | "snapshot";
};
export declare const powernukkit: mongoose.Model<powernukkitSchema, {}, {}, {}, any>;
