import { glob } from 'glob'
import { createDefaultConfig, PresetConfig } from '../index.js'
import { sourceCodeReplacer } from '../sourceCodeReplacer.js'
import { JSXPresets } from '../presets/jsx.js'
import fs from 'fs-extra'

export interface I18NationConfig extends Omit<PresetConfig, 'filename'> {
    /**
     * 匹配原始文件 glob 语法
     */
    src: string | string[]
    /** 
     * 将会把 json 合并到这个 json 文件中
     */
    outputJSON: string
    /** 将不会进行写入操作 */
    dryRun: boolean
}


/**
 * 抽取单个文件中的 i18n 内容
 */
export async function handleSingleFile(item: string, config: I18NationConfig) {
    const content = await fs.readFile(item, 'utf-8')
    try {
        const result = await sourceCodeReplacer(item, content, createDefaultConfig({
            entry: [],
            ...JSXPresets({
                filename: item,
                ...config
            })
        }))
        if (config.dryRun) return;
        await fs.outputFile(item, result)
        console.log("✅", item)
    } catch (e) {
        console.error('❌', item, e)
        throw e
    }
}

export async function doI18nExtract(config: I18NationConfig) {
    /** 重置 JSON 数据 */
    try {
        const json = await fs.readJSON(config.outputJSON)
        config.json = json
    } catch (e) {
        config.json = {}
    }
    const items = glob.sync(config.src, {
        absolute: true
    })
    if (!items.length) return console.log("❌ no files to extract i18n strings")
    console.log("✅ get ", items.length, ' files to extract i18n strings')
    let errorCount = 0
    for (const item of items) {
        try {

            await handleSingleFile(item, config)
        } catch {
            errorCount++
        }
    }
    console.log(`✅ success ${items.length - errorCount} ❌ error ${errorCount} `)
    if (config.dryRun) return;
    return fs.outputFile(config.outputJSON, JSON.stringify(config.json, null, 2))
}