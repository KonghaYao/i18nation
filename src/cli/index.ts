import { loadConfig } from "c12";
import { doI18nExtract, I18NationConfig } from "./doI18nExtract";

loadConfig<I18NationConfig>({
    name: "i18n",
}).then(({ config }) => {
    console.log(config)
    return doI18nExtract(config)
})