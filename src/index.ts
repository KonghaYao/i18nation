import { ReplacerConfig } from './replacer/interface';
import { glob } from 'glob'
import fs from 'fs'
import { sourceCodeReplacer } from './sourceCodeReplacer';
interface ConfigFileType extends ReplacerConfig {
    entry: string | string[]
}


export default async (config: ConfigFileType) => {
    const files = await glob(config.entry, { absolute: true })
    for (const file of files) {
        const resultContent = await sourceCodeReplacer(file, await fs.promises.readFile(file, 'utf-8'), config)
        await fs.promises.writeFile(file, resultContent)
    }
}
export * from './sourceCodeReplacer'
export * from './utils'