import { loadConfig } from "c12";
import { doI18nExtract } from "./doI18nExtract";
import { I18NationConfig } from "./I18NationConfig";
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
        return loadConfig<I18NationConfig>({
            name: "i18nation",
        }).then((res) => {
            console.log("✅ config file used: ", res.configFile);

            if (args.prune) {
                return doI18nPrune(res.config);
            }

            return doI18nExtract(res.config);
        });
    },
});
