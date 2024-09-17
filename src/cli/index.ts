import { loadConfig } from "c12";
import { doI18nExtract } from "./doI18nExtract";
import { I18NationConfig } from "./I18NationConfig";

export function main() {
    loadConfig<I18NationConfig>({
        name: "i18nation",
    }).then((res) => {
        console.log("✅ config file used: ", res.configFile);
        return doI18nExtract(res.config);
    });
}
