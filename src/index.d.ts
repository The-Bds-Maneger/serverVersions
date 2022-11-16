import type { bedrockSchema } from "./db/bedrock";
import type { javaSchema } from "./db/java";
import type { paperSchema } from "./db/paper";
import type { powernukkitSchema } from "./db/powernukkit";
import type { pocketminemmpSchema } from "./db/pocketmine";
import type { spigotSchema } from "./db/spigot";
export declare type BdsCorePlatforms = "bedrock" | "java" | "paper" | "powernukkit" | "pocketmine" | "spigot";
export declare type all = bedrockSchema | javaSchema | powernukkitSchema | paperSchema | pocketminemmpSchema | spigotSchema;
export type { bedrockSchema as bedrock, javaSchema as java, paperSchema as paper, pocketminemmpSchema as pocketmine, spigotSchema as spigot, powernukkitSchema as powernukkit };
export declare function findVersion<PlatformSchema = all[]>(bdsPlaform: BdsCorePlatforms): Promise<PlatformSchema>;
export declare function findVersion<PlatformSchema = all>(bdsPlaform: BdsCorePlatforms, version: string | boolean): Promise<PlatformSchema>;
export declare function findVersion<PlatformSchema = all>(bdsPlaform: BdsCorePlatforms, version: string | boolean, ignoreStatic: boolean): Promise<PlatformSchema>;
export declare const platformManeger: {
    bedrock: {
        all(): Promise<bedrockSchema[]>;
        find(version: string | boolean): Promise<bedrockSchema>;
    };
    pocketmine: {
        all(): Promise<pocketminemmpSchema[]>;
        find(version: string | boolean): Promise<pocketminemmpSchema>;
    };
    powernukkit: {
        all(): Promise<powernukkitSchema[]>;
        find(version: string | boolean): Promise<powernukkitSchema>;
    };
    java: {
        all(): Promise<javaSchema[]>;
        find(version: string | boolean): Promise<javaSchema>;
    };
    spigot: {
        all(): Promise<spigotSchema[]>;
        find(version: string | boolean): Promise<spigotSchema>;
    };
    paper: {
        all(): Promise<paperSchema[]>;
        find(version: string | boolean, build?: number | string): Promise<paperSchema>;
    };
};
