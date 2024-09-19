import { isOneWord, sourceCodeReplacer } from '../src'
import { describe, expect, it } from 'vitest'
import sourceCode from './samples/sample.jsx?raw'

describe('jsx 测试', async () => {
    const data = await sourceCodeReplacer('index.jsx', sourceCode, {
        stringReplacer(str, lang) {
            // console.log(str)
            if (isOneWord(str)) return str
            return `${str.toUpperCase() + "_REPLACED"}`

        },
        templateReplacer(str) {

            return `\$t(${str})`
        },
        attrReplacer(attrName, str) {
            if (attrName.toLocaleLowerCase() === 'alt') {
                return `测试${str}`
            }
            return str
        }
    })
    // console.log(data)
    it("dom 纯文本测试", () => {
        expect(data).include('404 RIGHTTHISWAY_REPLACED')
    })
    it("dom 中间挖空测试", () => {

        expect(data).include('prefix{info}suffix')
    })
    it("dom 属性测试", () => {
        expect(data).include('alt="测试important message"')
        expect(data).include('alt={id + 2}')
    })
});