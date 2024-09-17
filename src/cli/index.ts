import { loadConfig } from "c12";
import { doI18nExtract, I18NationConfig } from "./doI18nExtract";

loadConfig<I18NationConfig>({
    name: "i18nation",
}).then((res) => {
    console.log('✅ config file used: ', res.configFile)
    return doI18nExtract(res.config)
})