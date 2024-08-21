import { ConfigFileType } from "."
import { ReplacerConfig } from "./replacer/interface"

export const createI18nReplacer = (config: ConfigFileType) => {
    let cache = []
    const defaultConfig: ReplacerConfig = {
        stringReplacer(...args) {
            return config.stringReplacer(...args)
        },
        templateReplacer(...args) {
            return config.templateReplacer(...args)
        },
        attrReplacer(attrName, str) {
            return str
        }
    }
    return defaultConfig
}