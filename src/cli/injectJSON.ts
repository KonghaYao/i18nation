import { I18NationConfig } from "./I18NationConfig";
import fs from "fs-extra";
import { unflatten } from "safe-flat";

/** 向 json 文件中注入 i18n 数据 */
export async function injectJSON(
    path: string,
    newJSON: Record<string, any>,
    config: Required<NonNullable<I18NationConfig["jsonConfig"]>>,
) {
    let resultJSON: any = newJSON;
    switch (config.mode) {
        case "nested":
            const nestedJSON = unflatten(newJSON);
            resultJSON = nestedJSON;
            break;
        case "flat":
        default:
            if (typeof config.mode === "function")
                resultJSON = config.mode(newJSON);
    }
    // console.log(config.mode, resultJSON);
    return fs.outputFile(path, JSON.stringify(resultJSON, null, config.indent));
}
