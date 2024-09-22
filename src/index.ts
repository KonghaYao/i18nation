import { I18NationConfig } from "./cli/I18NationConfig";
import { ReplacerConfig } from "./replacer/interface";
import { isOneWord } from "./utils";
export const defineConfig = (config: I18NationConfig) => config;

export interface ConfigFileType extends ReplacerConfig {
    entry: string | string[];
    /**
     * 配置替换的属性
     * @default {
     *   alt: true,
     *   title: true,
     *   placeholder: true
     * }
     */
    replaceAttr?: Record<string, boolean>;
}

export const createDefaultConfig = (config: ConfigFileType) => {
    const replaceAttr: Record<string, boolean> = Object.assign(
        {
            alt: true,
            title: true,
            placeholder: true,
            description: true,
            keywords: true,
            content: true,
        },
        config.replaceAttr ?? {},
    );
    const ignore = {
        HTMLTag: [
            "pre",
            "code",
            "script",
            "style",
            ...(config?.ignore?.HTMLTag ?? []),
        ],
        regexp: [
            // http:// 等协议开头的文本
            /^.+?:\/\/[\S]*?$/,
            // 相对路径文本
            /^\.*\/\S*?$/,
            ...(config?.ignore?.regexp ?? []),
        ],
    };
    const matchOneIgnoreRegExp = (str: string) =>
        ignore.regexp.some((reg) => reg.test(str));
    const checkReplaced =
        config.checkReplaced ??
        ((str: string) => {
            return /\b[0-9a-fA-F]{32}\b/.test(str);
        });
    const defaultConfig: ReplacerConfig = {
        stringReplacer(str, lang, tools) {
            if (isOneWord(str)) return null;
            if (matchOneIgnoreRegExp(str)) return null;
            return config.stringReplacer(str, lang, tools);
        },
        templateReplacer(str, lang) {
            if (str.trim().length === 0) return null;
            if (str.startsWith("`")) {
                if (matchOneIgnoreRegExp(str.slice(1, -1))) return null;
            } else {
                if (matchOneIgnoreRegExp(str)) return null;
            }
            return config.templateReplacer(str, lang);
        },
        attrReplacer(attrName, str, replaceAttrName) {
            if (str.trim().length === 0) return null;
            if (checkReplaced(str)) {
                return null;
            }
            if (matchOneIgnoreRegExp(str)) return null;
            if (replaceAttr[attrName.toLocaleLowerCase()]) {
                return config.attrReplacer(attrName, str, replaceAttrName);
            }
            return null;
        },
        ignore,
    };
    return defaultConfig;
};

export * from "./sourceCodeReplacer";
export * from "./utils";
export * from "./presets/index";
