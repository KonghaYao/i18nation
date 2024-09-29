import { loadConfig } from "c12";
import { doI18nExtract } from "./doI18nExtract";
import { I18NationConfig } from "./I18NationConfig";
/** @ts-ignore */
import { defineCommand } from "citty";
import { doI18nPrune } from "./doI18nPrune";

export const main = defineCommand({
    meta: {
        name: "i18nation",
        version: "1.0.0",
        description: "I18n extractor",
    },
    args: {
        prune: {
            type: "boolean",
            description: "prune json key in your json",
        },
    },
    async run({ args }) {
        const files = await Promise.all([
            loadConfig<I18NationConfig>({
                name: "i18nation",
            }),
            // 兼容 i18nrc 文件内的 i18nation 字段
            loadConfig<I18NationConfig>({
                name: "",
                configFile: "i18nrc",
            }).then(res=>{
                // @ts-ignore
                res.config = res.config?.i18nation || {}
                return res
            }),
        ]);
        const res = files.find((i) => i.config.src);
        if(!res?.configFile)   return console.log("❌ config file not found");
        console.log("✅ config file used: ", res.configFile);

        if (args.prune) {
            return doI18nPrune(res.config);
        }

        return doI18nExtract(res.config);
    },
});
