import $, { GoGoAST } from 'gogocode';
import { ReplacerConfig } from './replacer/interface';
import { glob } from 'glob'
import path from 'path'
import fs from 'fs'
import { createReplacer as createJsxReplacer } from './replacer/tsx';
import { createReplacer as createVueReplacer } from './replacer/vue';
interface ConfigFileType extends ReplacerConfig {
    entry: string | string[]
}

const tsxExtensions = ['.tsx', '.ts', 'jsx', 'js', 'cjs', 'mjs', 'cts', 'mts']

export const sourceCodeReplacer = async (filePath: string, code: string, config: ReplacerConfig) => {
    const ext = path.extname(filePath)
    let replacer: (ast: GoGoAST) => GoGoAST
    let ast: GoGoAST
    if (tsxExtensions.includes(ext)) {
        replacer = createJsxReplacer(config)
        ast = $(code)
    } else if (ext === '.vue') {
        replacer = createVueReplacer(config)
        ast = $(code, {
            parseOptions: {
                language: 'vue'
            }
        })
    }
    const result = replacer!(ast!)
    return result.root().generate()
}

export default async (config: ConfigFileType) => {
    const files = await glob(config.entry, { absolute: true })
    for (const file of files) {
        const resultContent =  await sourceCodeReplacer(file, await fs.promises.readFile(file, 'utf-8'), config)
        await fs.promises.writeFile(file, resultContent)
    }
}