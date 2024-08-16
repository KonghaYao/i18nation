import $, { GoGoAST } from 'gogocode';
import { ReplacerConfig } from './replacer/interface';
import { glob } from 'glob'
import path from 'path'
import { createReplacer as createJsxReplacer } from './replacer/tsx';
import { createReplacer as createVueReplacer } from './replacer/vue';
import fs from 'fs'
interface ConfigFileType extends ReplacerConfig {
    entry: string | string[]
}

const tsxExtensions = ['.tsx', '.ts', 'jsx', 'js', 'cjs', 'mjs', 'cts', 'mts']
export default async (config: ConfigFileType) => {
    const files = await glob(config.entry, { absolute: true })
    for (const file of files) {
        const ext = path.extname(file)
        const content = await fs.promises.readFile(file, 'utf-8')
        let replacer: (ast: GoGoAST) => GoGoAST
        let ast: GoGoAST
        if (tsxExtensions.includes(ext)) {
            replacer = createJsxReplacer(config)
            ast = $(content)
        } else if (ext === '.vue') {
            replacer = createVueReplacer(config)
            ast = $(content, {
                parseOptions: {
                    language: 'vue'
                }
            })
        }
        const result = replacer!(ast!)
        const resultContent = result.root().generate()
        await fs.promises.writeFile(file, resultContent)
    }
}