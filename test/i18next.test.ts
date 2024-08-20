import { createDefaultConfig, sourceCodeReplacer, VuePresets } from '../src'
import { expect, describe, it } from 'vitest'
import sourceCodeWithTemplate from './samples/i18next.vue?raw'

describe('vue template 测试', async () => {
    const json = {}
    const data = await sourceCodeReplacer('index.vue', sourceCodeWithTemplate, createDefaultConfig({
        entry: [],
        ...VuePresets({
            filename: "index.vue",
            json,
            createTranslateCode(hash, params) {
                return `i18next.t("${hash}"${params ? `, ${params}` : ''})`
            },
            createStringSlot(key) {
                return `{{${key}}}`
            }
        })
    }))
    console.log(data)
    console.log(json)
});