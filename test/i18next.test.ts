import { createDefaultConfig, JSXPresets, sourceCodeReplacer, VuePresets } from '../src'
import { expect, describe, it, test } from 'vitest'
import sourceCodeWithTemplate from './samples/i18next.vue?raw'
import JSXSource from './samples/i18next.jsx?raw'
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
    // console.log(data)
    // console.log(json)
    test('所有 key 在代码中存在', () => {
        Object.keys(json).forEach(key => {
            expect(data).include(key)
        })
    })
    test("alt 属性被替换", () => {
        expect(data).include(`:alt='i18next.t("`)
    })
});

describe('jsx template 测试', async () => {
    const json = {}
    const data = await sourceCodeReplacer('index.jsx', JSXSource, createDefaultConfig({
        entry: [],
        ...JSXPresets({
            filename: "index.jsx",
            json,
            createTranslateCode(hash, params) {
                return `i18next.t("${hash}"${params ? `, ${params}` : ''})`
            },
            createStringSlot(key) {
                return `{${key}}`
            }
        })
    }))
    // console.log(data)
    // console.log(json)
    test('所有 key 在代码中存在', () => {
        Object.keys(json).forEach(key => {
            expect(data).include(key)
        })
    })
    test("jsx slot 正确", () => {
        expect(data).include(`>{i18next.t`)
    })
    test("alt 属性被替换", () => {
        expect(data).include(`alt={i18next.t("`)
    })
});