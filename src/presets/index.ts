import { ReplacerConfig } from "../replacer/interface";
import md5 from 'md5'
export const VuePresets = (context: {
    filename: string
    json: Record<string, string>
    createTranslateCode: (hash: string, params?: string) => string
    createStringSlot: (key: string) => string
}) => {
    const config: ReplacerConfig = {
        stringReplacer(str, lang) {
            const hash = md5(str)
            context.json[hash] = str

            switch (lang) {
                case 'html':
                    return `{{${context.createTranslateCode(hash)}}}`
                case "js":
                    return context.createTranslateCode(hash)
            }
        },
        templateReplacer(str, lang) {
            const hash = md5(str)
            const slots: string[] = []
            switch (lang) {
                case 'html':
                    const replacedHTML = str.replace(/\{\{(.*?)\}\}/g, (_, formatter) => {
                        slots.push(formatter)
                        return context.createStringSlot((slots.length - 1).toString())
                    })
                    context.json[hash] = replacedHTML
                    return `{{ ${context.createTranslateCode(hash, `[${slots.join(',')}]`)} }}`
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
        attrReplacer(attrName, str, replaceAttrName) {
            const hash = md5(str)
            context.json[hash] = str
            replaceAttrName(':' + attrName)
            return context.createTranslateCode(hash)
        }
    }
    return config
}