export type base = {
  version: string,
  datePublish: string,
}

export type bedrock = base & {
  win32: {
    x64: string,
    arm64?: string,
  },
  linux: {
    x64: string,
    arm64?: string,
  },
  darwin?: {
    x64?: string,
    arm64?: string,
  }
};

export type java = base & {
  javaJar: string
};

export type pocketmine = base & {
  pocketminePhar: string
};

export type spigot = base & {
  spigotJar: string
};


export type Root = {
  latest: {
    bedrock: string,
    java: string,
    pocketmine: string,
    spigot: string
  },
  versions: {
    bedrock: bedrock[],
    java: java[],
    pocketmine: pocketmine[],
    spigot: spigot[]
  }
}