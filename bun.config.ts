import type { BunPlugin, BuildConfig } from "bun"
import { readdir } from 'fs/promises';

const addScriptsToHtml: BunPlugin = {
    async setup(build) {
        const fileDististPath = `${build.config.outdir}/index.html`
        const file = Bun.file("./src/index.html")

        const html = await (new HTMLRewriter())
            .on("head", {
                element(el) {
                    build.config.entrypoints.forEach((entry) => {
                        const extension = entry.substring(entry.lastIndexOf("."))
                        if (!extension) {
                            return
                        }

                        const distEntry = entry
                            .substring(entry.lastIndexOf("/") + 1)
                            .replace(extension, ".js")
                        el.append(`<script src="${build.config.publicPath}${distEntry}" defer></script>\n`, { html: true })
                    })
                },
            })
            .transform(new Response(await file.arrayBuffer()))
            .blob()

        console.log(`Copying index.html to ${fileDististPath}`)
        await Bun.write(fileDististPath, html)
    },
}

const copyPublicToOutdir: BunPlugin = {
    async setup(build) {
        const outdir = build.config.outdir
        if (!outdir) {
            return
        }

        const publicPath = "./public"
        const fileNames = await readdir(publicPath)
        fileNames.forEach((name) => {
            const filePath = `${publicPath}/${name}`
            const file = Bun.file(filePath)
            Bun.write(`${outdir}/${name}`, file)
        })
    },
}


const config: BuildConfig = {
    entrypoints: ['./src/index.ts'],
    outdir: './dist',
    publicPath: "/",
    plugins: [addScriptsToHtml, copyPublicToOutdir]
}

export default config