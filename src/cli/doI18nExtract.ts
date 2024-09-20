import { glob } from "glob";
import { createDefaultConfig } from "../index.js";
import { sourceCodeReplacer } from "../sourceCodeReplacer.js";
import { JSXPresets } from "../presets/jsx.js";
import { VuePresets } from "../presets/vue.js";
import fs from "fs-extra";
import { injectJSON } from "./injectJSON.js";
import { I18NationConfig } from "./I18NationConfig.js";
import { flatten } from "safe-flat";

/**
 * 抽取单个文件中的 i18n 内容
 */
export async function handleSingleFile(item: string, config: I18NationConfig) {
    const content = await fs.readFile(item, "utf-8");
    const presets = config.presets === "vue" ? VuePresets : JSXPresets;
    try {
        const result = await sourceCodeReplacer(
            item,
            content,
            createDefaultConfig({
                entry: [],
                ...presets({
                    filename: item,
                    ...config,
                }),
            }),
        );
        if (config.dryRun) return;
        await fs.outputFile(item, result);
        console.log("  ✅", item);
    } catch (e) {
        console.error("❌", item, e);
        throw e;
    }
}

export async function doI18nExtract(config: I18NationConfig) {
    /** 重置 JSON 数据 */
    try {
        const json = await fs.readJSON(config.outputJSON);
        config.json = flatten(json) as any;
    } catch (e) {
        config.json = {};
    }

    const items = glob.sync(config.src, {
        absolute: true,
        ignore: config.exclude
    });
    if (!items.length)
        return console.log("❌ no files to extract i18n strings");
    console.log("✅ get ", items.length, " files to extract i18n strings");
    let errorCount = 0;
    for (const item of items) {
        try {
            await handleSingleFile(item, config);
        } catch {
            errorCount++;
        }
    }
    console.log(
        `✅ success ${items.length - errorCount}\n❌ error ${errorCount} `,
    );
    if (config.dryRun) return;
    return injectJSON(
        config.outputJSON,
        config.json,
        Object.assign(
            {
                mode: "flat",
                indent: 2,
            },
            config.jsonConfig ?? {},
        ),
    );
}
