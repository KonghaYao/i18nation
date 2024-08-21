import { sourceCodeReplacer } from '../src'
import { expect, describe, it } from 'vitest'
import sourceCodeWithTemplate from './samples/sample.vue?raw'

describe('vue template 测试', async () => {
    const data = await sourceCodeReplacer('index.vue', sourceCodeWithTemplate, {
        stringReplacer(str, lang, tools) {
            return str.toUpperCase()
        },
        templateReplacer(str) {
            return `测${str}试`
        },
        attrReplacer(attrName, str) {
            if (attrName.toLocaleLowerCase() === 'alt') {
                return `测试${str}`
            }
            // console.log(attrName)
            return str
        }
    })
    console.log(data)
    it('纯文本测试', () => {
        expect(data).include(
            '404 RIGHTTHISWAY'
        ).include(
            'SOURY,&NBSP;&NBSP;&NBSP; INVISIBLE~'
        )
    })
    it('模板字符测试', () => {
        expect(data).include(
            `测 {{ 'info' }} 试`
        )
    })
    it('标签属性替换', () => {
        expect(data).include(
            `alt='测试important message'`
        )
    })
    it('动态属性不进行替换', () => {
        expect(data).include(
            `:alt='"important message"'`
        )
    })

});