import { I18NationConfig } from "./I18NationConfig";
import fs from "fs-extra";
import { unflatten } from "safe-flat";
export async function injectJSON(
    path: string,
    newJSON: Record<string, any>,
    config: Required<NonNullable<I18NationConfig["jsonConfig"]>>
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
function deepMerge(target: any, source: any) {
    // 遍历 source 中的所有属性
    Object.keys(source).forEach((key) => {
        // 检查 source[key] 是否是一个对象
        if (
            source[key] &&
            typeof source[key] === "object" &&
            !Array.isArray(source[key])
        ) {
            // 如果 target[key] 不存在或者不是一个对象，则创建一个空对象
            if (!target[key] || typeof target[key] !== "object") {
                target[key] = {};
            }
            // 递归调用 deepMerge
            deepMerge(target[key], source[key]);
        } else {
            // 如果不是对象，则直接赋值
            target[key] = source[key];
        }
    });
    return target;
}
