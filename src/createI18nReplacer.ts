import { ReplacerConfig } from "./replacer/interface"

export const createI18nReplacer = (config: ConfigFileType) => {
    let cache = []
    const defaultConfig: ReplacerConfig = {
        stringReplacer(str) {
            return config.stringReplacer(str)
        },
        templateReplacer(str) {
            return config.templateReplacer(str)
        },
        attrReplacer(attrName, str) {
            return str
        }
    }
    return defaultConfig
}