import config from "./bun.config"

console.log("Building...")

const result = await Bun.build(config)

console.log(`Build is ${result.success}`);
console.log(result.outputs);