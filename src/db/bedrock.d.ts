/// <reference types="node" />
export declare const app: import("express-serve-static-core").Router;
export declare type bedrockSchema = {
    version: string;
    date: Date;
    url: {
        [platform in NodeJS.Platform]?: {
            [arch in NodeJS.Architecture]?: string;
        };
    };
};
export declare function getAll(): Promise<bedrockSchema[]>;
