import { blue, green, red, yellow, yellowBright, cyan, cyanBright } from "cli-color";

export default function Logging(colorTo: "java"|"bedrock"|"alter", message: string, ...args: any[]) {
  if (message.toLowerCase().includes("already exists")||args.filter(x => typeof x === "string").find(x => x.includes("already exists"))) {
    console.log(red(message), ...args);
    return;
  }
  if (colorTo === "java") {
    console.log(blue(message), ...args);
    return;
  } else if (colorTo === "bedrock") {
    console.log(green(message), ...args);
    return;
  } else {
    // Sort color random
    const colors = [yellow, yellowBright, cyan, cyanBright];
    const color = colors[Math.floor(Math.random() * colors.length)];
    console.log(color(message), ...args);
    return;
  }
}