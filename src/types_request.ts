export type Root = {
  latest: {
    bedrock: string,
    java: string,
    pocketmine: string,
    spigot: string
  },
  versions: {
    bedrock: Array<{
      version: string,
      datePublish: string,
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
      },
    }>,
    java: Array<{
      version: string,
      datePublish: string,
      javaJar: string
    }>,
    pocketmine: Array<{
      version: string,
      datePublish: string,
      pocketminePhar: string
    }>,
    spigot: Array<{
      version: string,
      datePublish: string,
      spigotJar: string
    }>
  }
}