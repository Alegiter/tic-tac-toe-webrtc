import { watch } from "fs/promises"
import config from "./bun.config"

const watcher = watch(`${import.meta.dir}/src/`)
for await (const event of watcher) {
    console.log(`Detected ${event.eventType} in ${event.filename}`)
    console.log("Rebuilding...")
    await Bun.build(config)
    console.log("Rebuiled")
}

