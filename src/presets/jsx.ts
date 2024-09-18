import { createKey, PresetConfig } from ".";
import { ReplacerConfig } from "../replacer/interface";
import md5 from "md5";

export const JSXPresets = (context: PresetConfig) => {
    const config: ReplacerConfig = {
        stringReplacer(str, lang, tools) {
            const hash = createKey(str, context);

            tools.wrapperChar = "";
            // console.log(lang, str)
            switch (lang) {
                case "html":
                    context.json[hash] = str.trim();
                    return `{${context.createTranslateCode(hash)}}`;
                case "js":
                    context.json[hash] = str;
                    return context.createTranslateCode(hash);
            }
        },
        templateReplacer(str, lang) {
            // console.log(str,lang)
            const hash = createKey(str, context);
            const slots: string[] = [];
            switch (lang) {
                case "html":
                    const replacedHTML = str.replace(
                        /\{\{(.*?)\}\}/g,
                        (_, formatter) => {
                            slots.push(formatter);
                            return context.createStringSlot(
                                (slots.length - 1).toString(),
                            );
                        },
                    );
                    context.json[hash] = replacedHTML;
                    return `{ ${context.createTranslateCode(hash, `[${slots.join(",")}]`)} }`;
                case "js":
                    const replaced = str.replace(
                        /\$\{(.*?)\}/g,
                        (_, formatter) => {
                            slots.push(formatter);
                            return context.createStringSlot(
                                (slots.length - 1).toString(),
                            );
                        },
                    );
                    context.json[hash] = replaced;
                    return context.createTranslateCode(
                        hash,
                        `[${slots.join(",")}]`,
                    );
            }
            throw new Error(`${lang} not support`);
        },
        attrReplacer(attrName, str, tools) {
            const hash = createKey(str, context);
            context.json[hash] = str;
            // 当 jsx 直接父级为属性时，那么需要括号，否则不需要
            tools.wrapperChar = tools.parentType === "JSXAttribute" ? "{}" : "";

            return context.createTranslateCode(hash);
        },
        ignore: context.ignore!,
    };
    return config;
};
