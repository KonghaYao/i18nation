import { ReplacerConfig } from './replacer/interface';
import { glob } from 'glob'
import fs from 'fs'
import { sourceCodeReplacer } from './sourceCodeReplacer';
import { isOneWord } from './utils';
export interface ConfigFileType extends ReplacerConfig {
    entry: string | string[]
    replaceAttr?: Record<string, boolean>
}

const createDefaultConfig = (config: ConfigFileType) => {
    const replaceAttr: Record<string, boolean> = Object.assign({
        alt: true,
        title: true,
        placeholder: true
    }, config.replaceAttr ?? {})
    const defaultConfig: ReplacerConfig = {
        stringReplacer(str) {
            if (isOneWord(str)) return str
            return config.stringReplacer(str)
        },
        templateReplacer(str) {
            return config.templateReplacer(str)
        },
        attrReplacer(attrName, str) {
            if (replaceAttr[attrName.toLocaleLowerCase()]) {
                return config.attrReplacer(attrName, str)
            }
            return str
        }
    }
    return defaultConfig
}

export default async (config: ConfigFileType) => {

    const files = await glob(config.entry, { absolute: true })
    for (const file of files) {
        const resultContent = await sourceCodeReplacer(file, await fs.promises.readFile(file, 'utf-8'), createDefaultConfig(config))
        await fs.promises.writeFile(file, resultContent)
    }
}
export * from './sourceCodeReplacer'
export * from './utils'