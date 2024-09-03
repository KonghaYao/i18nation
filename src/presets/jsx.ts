import { PresetConfig } from ".";
import { ReplacerConfig } from "../replacer/interface";
import md5 from 'md5'

export const JSXPresets = (context: PresetConfig) => {
    const config: ReplacerConfig = {
        stringReplacer(str, lang, tools) {
            console.log(1,lang,str)
            const hash = md5(str)
            context.json[hash] = str

            tools.wrapperChar = ''
            switch (lang) {
                case 'html':
                    return `{${context.createTranslateCode(hash)}}`
                case "js":
                    return context.createTranslateCode(hash)
            }
        },
        templateReplacer(str, lang) {
            console.log(str)
            const hash = md5(str)
            const slots: string[] = []
            switch (lang) {
                case 'html':
                    const replacedHTML = str.replace(/\{\{(.*?)\}\}/g, (_, formatter) => {
                        slots.push(formatter)
                        return context.createStringSlot((slots.length - 1).toString())
                    })
                    context.json[hash] = replacedHTML
                    return `{ ${context.createTranslateCode(hash, `[${slots.join(',')}]`)} }`
                case "js":
                    const replaced = str.replace(/\$\{(.*?)\}/g, (_, formatter) => {
                        slots.push(formatter)
                        return context.createStringSlot((slots.length - 1).toString())
                    })
                    context.json[hash] = replaced
                    return context.createTranslateCode(hash, `[${slots.join(',')}]`)

            }
            throw new Error(`${lang} not support`)
        },
        attrReplacer(attrName, str, tools) {
            const hash = md5(str)
            context.json[hash] = str
            tools.wrapperChar = '{}'
            return context.createTranslateCode(hash)
        }
    }
    return config
}