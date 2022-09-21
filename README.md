# Auto Fetch New Server Versions

This is a repository in which to look for new versions automatically.

## Platforms

- [Minecraft Bedrock Edition Server](https://www.minecraft.net/en-us/download/server/bedrock)
- [Minecraft Java Edition Server](https://www.minecraft.net/en-us/download/server)
- [Pocketmine-MP](https://pmmp.io/)
- [Spigot](https://www.spigotmc.org/)
- [Powernukkit](https://powernukkit.org/)
- [Paper](https://papermc.io/)

## API

Use the following API to fetch versions:

Example to latest bedrock: `curl -s https://mcpeversions.sirherobrine23.org/bedrock/latest` or search version: `curl -s https://mcpeversions.sirherobrine23.org/bedrock/search?version=1.18.1.02`

> Avaible to `/bedrock`, `/java`, `/pocketmine`,  `/spigot`, `/paper` and `/powernukkit`.

### Static files

I'm releasing a static version of the versions to solve some problems.

> example:
> `https://mcpeversion-static.sirherobrine23.org/{platform}/{version}.json`.
>
> `curl -s https://mcpeversion-static.sirherobrine23.org/bedrock/latest.json`.
