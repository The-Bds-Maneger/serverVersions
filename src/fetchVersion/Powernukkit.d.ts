export declare const exportUrl = "https://raw.githubusercontent.com/PowerNukkit/powernukkit-version-aggregator/master/powernukkit-versions.json";
export declare type Release = {
    version: string;
    releaseTime: number;
    minecraftVersion: string;
    artefacts: string[];
    commitId: string;
    snapshotBuild?: number;
};
export declare type PowernukkitVersions = {
    releases: Release[];
    snapshots: Release[];
};
export default function find(): Promise<void>;
